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
            utils: resolve("src/utils"),
            DdBind: resolve("src/module")
        }
    },
    define: {
        __DEV__: false,
        __TEST__: true
    },
    test: {
        globals: true,
        environment: 'jsdom',
        isolate: true,
        exclude: [...configDefaults.exclude],
        coverage: {
            provider: "c8",
            reporter: ["text", "json"]
        }
    }
})