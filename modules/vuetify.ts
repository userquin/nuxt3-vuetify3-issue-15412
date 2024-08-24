import {defineNuxtModule} from "@nuxt/kit";
import type { Plugin } from 'vite'
import type {Options } from '@vuetify/loader-shared'
import vuetify from "vite-plugin-vuetify";
import path from 'upath'
import { resolveVuetifyBase, normalizePath, isObject } from '@vuetify/loader-shared'
import {pathToFileURL} from "node:url";

export interface VuetifyModuleOptions extends Options {
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
        const vuetifyBase = resolveVuetifyBase()
        const tempFiles = new Map<string, string>()
        const isNone = options.styles === 'none'
        const usingSassVariables = isNone ? false : isObject(options.styles)

        nuxt.hook('vite:extendConfig', (viteInlineConfig) => {
            viteInlineConfig.plugins = viteInlineConfig.plugins || []
            viteInlineConfig.plugins.push(vuetify({
                ...options,
                styles: undefined,
            }))
            viteInlineConfig.plugins.push({
                name: 'vuetify:nuxt:styles',
                enforce: 'pre',
                configResolved (config) {
                    if (isObject(options.styles)) {
                        if (path.isAbsolute(options.styles.configFile)) {
                            configFile = path.resolve(options.styles.configFile)
                        } else {
                            configFile = path.resolve(path.join(config.root || process.cwd(), options.styles.configFile))
                        }
                    }
                },
                async resolveId (source, importer, { custom }) {
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
                            return

                        const target = resolution.id.replace(/\.css$/, '.sass')
                        tempFiles.set(target, isNone
                            ? ''
                            : `@use "${pathToFileURL(configFile!).href}"\n@use "${pathToFileURL(resolution.id).href}"`
                        )
                        return target
                    }
                },
                load(id) {
                    return isNone || usingSassVariables ? tempFiles.get(id) : undefined
                },
            })
        })
    }
})

function isSubdir (root: string, test: string) {
    const relative = path.relative(root, test)
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
}
