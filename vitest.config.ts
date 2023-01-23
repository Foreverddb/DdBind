import {resolve} from 'path'
import {configDefaults, defineConfig} from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            compiler: resolve("src/compiler"),
            types: resolve("src/types"),
            reactivity: resolve("src/reactivity"),
            renderer: resolve("src/renderer"),
            core: resolve("src/core"),
            utils: resolve("src/utils")
        }
    },
    define: {
      __DEV__: false
    },
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: [...configDefaults.exclude]
    }
})