import { defineNuxtModule } from '@nuxt/kit'
import type { ImportPluginOptions } from '@vuetify/loader-shared'
import vuetify from 'vite-plugin-vuetify'
import path from 'upath'
import { resolveVuetifyBase, normalizePath, isObject } from '@vuetify/loader-shared'
import { pathToFileURL } from 'node:url'

export interface ModuleOptions {
    styles?: true | 'none' | 'sass' | {
        configFile: string
        useViteFileImport?: boolean
    }
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'vuetify-nuxt-module',
        configKey: 'customVuetify',
        compatibility: {
            nuxt: '>=3.9.0',
            bridge: false,
        },
    },
    defaults: () => ({ styles: true }),
    setup(options, nuxt) {
        let configFile: string | undefined
        // let cacheDir: string | undefined
        const vuetifyBase = resolveVuetifyBase()
        const noneFiles = new Set<string>()
        let isNone = false
        let sassVariables = false
        let fileImport = false
        const PREFIX = 'vuetify-styles/'
        const SSR_PREFIX = `/@vuetify-styles/`

        nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
            viteInlineConfig.plugins = viteInlineConfig.plugins || []
            viteInlineConfig.plugins.push(vuetify({
                ...options,
                styles: true,
            }))
            if (options.styles === true)
                return

            viteInlineConfig.plugins.push({
                name: 'vuetify:nuxt:styles',
                enforce: 'pre',
                async configResolved (config) {
                    isNone = options.styles === 'none'
                    if (isObject(options.styles)) {
                        sassVariables = true
                        fileImport = options.styles.useViteFileImport === true
                        if (path.isAbsolute(options.styles.configFile)) {
                            configFile = path.resolve(options.styles.configFile)
                        } else {
                            configFile = path.resolve(path.join(config.root || process.cwd(), options.styles.configFile))
                        }
                        configFile = fileImport
                            ? pathToFileURL(configFile).href
                            : normalizePath(configFile)
                    }
                },
                async resolveId (source, importer, { custom, ssr }) {
                    if (source.startsWith(PREFIX) || source.startsWith(SSR_PREFIX)) {
                        return source
                    }
                    if (
                        source === 'vuetify/styles' || (
                            importer &&
                            source.endsWith('.css') &&
                            isSubdir(vuetifyBase, path.isAbsolute(source) ? source : importer)
                        )
                    ) {
                        if (options.styles === 'sass') {
                            const target = source.replace(/\.css$/, '.sass')
                            return this.resolve(target, importer, { skipSelf: true, custom })
                        }

                        const resolution = await this.resolve(source, importer, { skipSelf: true, custom })
                        if (!resolution)
                            return undefined

                        const target = resolution.id.replace(/\.css$/, '.sass')
                        if (isNone) {
                            noneFiles.add(target)
                            return target
                        }

                        return `${ssr ? SSR_PREFIX: PREFIX}${path.relative(vuetifyBase, target)}`
                    }

                    return undefined
                },
                load(id){
                    if (sassVariables) {
                        const target = id.startsWith(PREFIX)
                         ? path.resolve(vuetifyBase, id.slice(PREFIX.length))
                         : id.startsWith(SSR_PREFIX)
                            ? path.resolve(vuetifyBase, id.slice(SSR_PREFIX.length))
                            : undefined

                        if (target) {
                            return {
                                code: `@use "${configFile}"\n@use "${fileImport ? pathToFileURL(target).href : normalizePath(target)}"`,
                                map: {
                                    mappings: ''
                                }
                            }
                        }
                    }
                    return isNone && noneFiles.has(id) ? '' : undefined
                },
            })
        })
    }
})

function isSubdir (root: string, test: string) {
    const relative = path.relative(root, test)
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}
