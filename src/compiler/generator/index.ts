import {GeneratorContext, JavascriptNode} from "types/compiler";
import {genNode} from "compiler/generator/generator";

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
            context.code += '\n' + '  '.repeat(context.currentIndent)
        },
        indent() {
            context.currentIndent ++
            context.newLine()
        },
        deIndent() {
            context.currentIndent --
            context.newLine()
        }
    } as GeneratorContext

    genNode(jsAST, context)

    return context.code
}