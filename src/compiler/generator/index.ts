import {GeneratorContext, JavascriptNode} from "types/compiler";
import {genNode} from "compiler/generator/generator";

export {
    codeGuards
} from './events'

/**
 * 根据jsAST生成渲染函数代码
 * @param jsAST 目标jsAST
 */
export function generate(jsAST: JavascriptNode): string {
    const context = {
        code: '',
        currentIndent: 0,
        push(code) {
            context.code += code
        },
        newLine() {
            // 生产环境下无需进行格式化与美化代码操作
            if (__DEV__) {
                context.code += '\n' + '  '.repeat(context.currentIndent)
            }
        },
        indent() {
            if (__DEV__) {
                context.currentIndent ++
                context.newLine()
            }
        },
        deIndent() {
            if (__DEV__) {
                context.currentIndent --
                context.newLine()
            }
        }
    } as GeneratorContext

    genNode(jsAST, context)

    return context.code
}