import {ParserContext, ParserModes, TemplateAst} from "types/compiler";
import {parseChildren} from "compiler/parser/html-parser";
import {BLANK_CHAR_REG} from "compiler/parser/regexp";

/**
 * 解析HTML文本模版并转化为模版AST
 * @param template HTML文本
 */
export function parse(template: string): TemplateAst {
    // 解析器上下文对象
    const context: ParserContext = {
        source: template,
        mode: ParserModes.DATA, // 默认为DATA模式
        advanceBy(num: number) {
            // 消费指定数量字符
            context.source = context.source.slice(num)
        },
        advanceSpaces() {
            // 匹配空白字符
            const match = BLANK_CHAR_REG.exec(context.source)
            if (match) {
                // 清除空白字符
                context.advanceBy(match[0].length)
            }
        },
        trimEndSpaces() {
            context.source = context.source.trimEnd()
        }
    }

    // 先清除两端空白
    context.advanceSpaces()
    context.trimEndSpaces()
    const nodes: Array<TemplateAst> = parseChildren(context, [])

    return {
        type: 'Root',
        children: nodes
    }
}