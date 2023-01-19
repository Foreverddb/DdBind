import {GeneratorContext, JavascriptAST} from "types/compiler";

/**
 * 根据jsAST生成渲染函数代码
 * @param jsAST 目标jsAST
 */
export function generate(jsAST: JavascriptAST): string {
    const context = {
        code: '',
        push(code) {
            context.code += code
        }
    } as GeneratorContext



    return context.code
}