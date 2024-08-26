import { defineNuxtModule } from '@nuxt/kit'
import type { ImportPluginOptions } from '@vuetify/loader-shared'
import vuetify from 'vite-plugin-vuetify'
import path from 'upath'
import { resolveVuetifyBase, normalizePath, isObject } from '@vuetify/loader-shared'
import { pathToFileURL } from 'node:url'
// import { mkdir, writeFile } from 'node:fs/promises'

export interface VuetifyModuleOptions {
    autoImport?: ImportPluginOptions
    styles?: true | 'none' | 'sass' | {
        configFile: string
        useViteFileImport?: boolean
    }
}

export default defineNuxtModule<VuetifyModuleOptions>({
    meta: {
        name: 'vuetify-nuxt-module',
        configKey: 'vuetify',
        compatibility: {
            nuxt: '>=3.9.0',
            bridge: false,
        },
    },
    setup(options, nuxt) {
        let configFile: string | undefined
        // let cacheDir: string | undefined
        const vuetifyBase = resolveVuetifyBase()
        const noneFiles = new Set<string>()
        let isNone = false
        let sassVariables = false
        let fileImport = false
        const PREFIX = 'vuetify-styles/'

        if (nuxt.options.dev && sassVariables) {
            /*nuxt.options.ignore ??= []
            nuxt.options.ignore.push(`${nuxt.options.app.buildAssetsDir}${PREFIX}!**!/!*.sass`)*/
            // const route = `${nuxt.options.app.buildAssetsDir}${PREFIX}`
            // nuxt.hook('vite:serverCreated', (viteServer, { isServer }) => {
            //     // if (isServer)
            //     //     return
            //
            //     // viteServer.middlewares.stack.unshift({
            //     viteServer.middlewares.stack.push({
            //         route,
            //         // @ts-expect-error just ignore
            //         handle: (_req, _res, next) => {
            //             console.log({ isServer, url: _req.url })
            //             next()
            //         }
            //     })
            // })
        }

        nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
            viteInlineConfig.plugins = viteInlineConfig.plugins || []
            viteInlineConfig.plugins.push(vuetify({
                ...options,
                styles: true,
            }))
            viteInlineConfig.plugins.push({
                name: 'vuetify:nuxt:styles',
                enforce: 'pre',
                async configResolved (config) {
                    isNone = options.styles === 'none'
                    if (isObject(options.styles)) {
                        sassVariables = true
                        const root = config.root || process.cwd()
                        // cacheDir = path.resolve(config.cacheDir ?? path.join(root, 'node_modules/.vite'), 'vuetify-styles')
                        fileImport = options.styles.useViteFileImport === true
                        if (path.isAbsolute(options.styles.configFile)) {
                            configFile = path.resolve(options.styles.configFile)
                        } else {
                            configFile = path.resolve(path.join(root, options.styles.configFile))
                        }
                        configFile = fileImport
                            ? pathToFileURL(configFile).href
                            : normalizePath(configFile)
                    }
                },
                async resolveId (source, importer, { custom, ssr }) {
                    if (source.startsWith(PREFIX)) {
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

                        return `${PREFIX}${path.relative(vuetifyBase, target)}`

                        /*const tempFile = path.resolve(
                            cacheDir,
                            path.relative(path.join(vuetifyBase, 'lib'), target)
                        )
                        await mkdir(path.dirname(tempFile), { recursive: true })
                        await writeFile(
                            tempFile,
                            `@use "${configFile}"\n@use "${fileImport ? pathToFileURL(target).href : normalizePath(target)}"`,
                            'utf-8',
                        )
                        return tempFile*/
                    }

                    return undefined
                },
                load(id) {
                    /*if (sassVariables && id.startsWith('vuetify-styles/')) {
                        const target = path.resolve(vuetifyBase, id.slice('vuetify-styles/'.length))
                        return `@use "${configFile}"\n@use "${fileImport ? pathToFileURL(target).href : normalizePath(target)}"`
                    }*/
                    if (sassVariables && id.startsWith(PREFIX)) {
                        const target = path.resolve(vuetifyBase, id.slice(PREFIX.length))
                        return {
                            code: `@use "${configFile}"\n@use "${fileImport ? pathToFileURL(target).href : normalizePath(target)}"`,
                            map: {
                                mappings: '',
                            },
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
