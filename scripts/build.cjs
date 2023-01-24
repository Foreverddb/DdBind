const fs = require('fs')
const rollup = require('rollup')
const path = require('path')
const configs = require('./config.cjs')
const terser = require('terser')

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
}

buildMain()

// 构建entry函数
function buildMain() {
    let currentFile = 0
    const total = configs.length
    const next = () => {
        build(configs[currentFile]).then(() => {
            currentFile++
            if (currentFile < total) {
                next()
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    next()
}

function build(config) {
    const output = config.output
    const {file} = output
    const toBeMinified = /(prod)\.js$/.test(file)
    return rollup.rollup(config)
        .then(bundle => bundle.generate(output))
        .then(async ({output: [{code}]}) => {
            if (toBeMinified) {
                const {code: minifiedCode} = await terser.minify(code, {
                    toplevel: true,
                    compress: {
                        pure_funcs: ['makeMap'],
                    },
                    format: {
                        ascii_only: true,
                    }
                });
                return buildFileAndLog(file, minifiedCode)
            } else {
                return buildFileAndLog(file, code)
            }
        })
}

// 生成文件并输出结果
function buildFileAndLog(file, code) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path.dirname(file))) {
            fs.mkdirSync(path.dirname(file), {recursive: true})
        }
        fs.writeFile(file, code, err => {
            if (err) return reject(err)
            console.log(`\x1b[47;92m${file}\x1b[49;39m\x1b[22m  \x1b[34m${(code.length / 1024).toFixed(2)}\x1b[49;39m\x1b[22mkB`)
            resolve()
        })
    })
}