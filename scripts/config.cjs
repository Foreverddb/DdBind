const path = require('path')
const ts = require('rollup-plugin-typescript2')
const replace = require("@rollup/plugin-replace");

const buildTypes = ['dev', 'prod']

function getConfig(isTargetingBrowser, buildType = 'dev') {
    const config = {
        input: path.resolve(__dirname, '../src/module/index.ts'),
        plugins: [
            ts({
                tsconfig: path.resolve(__dirname, '../', 'tsconfig.json'),
                cacheRoot: path.resolve(__dirname, '../', 'node_modules/.rts2_cache'),
                tsconfigOverride: {
                    compilerOptions: {
                        // if targeting browser, target es5
                        // if targeting node, es2017 means Node 8
                        target: isTargetingBrowser ? 'es5' : 'es2017',
                    }
                }
            })
        ],
        output: {
            name: 'DdBind',
            file: path.resolve(__dirname, `../dist/ddbind${isTargetingBrowser ? '.browser' : '.node'}.${buildType}.js`),
            format: isTargetingBrowser ? 'umd' : 'es',
            banner: '/*!\n' +
                ' * ddb\'s mvvm-learning-framework \n' +
                ' * ddbind framework as a temporary name \n' +
                ' * for Baidu\'s courses\n' +
                ' */',
            exports: 'auto',
            globals: {
                'effect': 'types/effect',
                'reactivity': 'types/reactivity',
                'renderer': 'types/renderer',
                'compiler': 'types/compiler',
                "ddbind": "types/ddbind"
            }
        }
    }
    const vars = {
        __DEV__: buildType === 'dev',
        preventAssignment: true
    }
    config.plugins.push(replace(vars))
    return config
}

// 根据命令参数决定
if (process.env.BROWSER) {
    module.exports = getConfig(process.env.BROWSER === 'true')
} else {
    const configs = []
    buildTypes.forEach((buildType) => {
            configs.push(...[true, false].map(isTargetingBrowser => getConfig(isTargetingBrowser, buildType)))
        }
    )
    module.exports = configs
}