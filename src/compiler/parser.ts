import {DirectiveNode, ParserContext, ParserModes, PropertyNode, TemplateAst} from "types/compiler";
import {error} from "utils/debug";

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
        trimSpaces() {
            // 匹配空白字符
            const match = /^[\t\r\n\f ]+/.exec(context.source)
            if (match) {
                // 清除空白字符
                context.advanceBy(match[0].length)
            }
        },
        trimEndSpaces() {
            context.source = context.source.trimEnd()
        }
    }

    // 先清除行首空白
    context.trimSpaces()
    context.trimEndSpaces()
    const nodes: Array<TemplateAst> = parseChildren(context, [])

    return {
        type: 'Root',
        children: nodes
    }
}

/**
 * 解析某节点的子节点
 * @param context 上下文对象
 * @param parenStack 父节点栈
 */
function parseChildren(context: ParserContext, parenStack: Array<TemplateAst>): Array<TemplateAst> {
    let nodes: Array<TemplateAst> = []
    const { mode, source } = context

    while (!isEnd(context, parenStack)) {
        let node: TemplateAst
        // 仅*DATA模式支持解析标签节点
        if (mode === ParserModes.DATA || mode === ParserModes.RCDATA) {
            if (mode === ParserModes.DATA && source[0] === '<') {
                if (source[1] === '!') {
                    if (source.startsWith('<!--')) { // 注释标签开头
                        node = parseComment(context)
                    } else if (source.startsWith('<![CDATA[')) { // CDATA标签
                        node = parseCDATA(context, parenStack)
                    }
                } else if (source[1] === '/') { // 结束标签
                    error('invalid end tag in HTML.', source)
                    continue
                } else if (/[a-z]/i.test(source[1])) {
                    node = parseElement(context, parenStack)
                }
            } else if (source.startsWith('{{')) {
                // 插值解析
                node = parseInterpolation(context)
            }
        }
        // 若node不存在则说明处于非DATA模式，一律当作text处理
        if (!node) {
            node = parseText(context)
            context.advanceBy(1)
        }

        nodes.push(node)
    }

    return nodes
}

/**
 * 校验是否解析到了文本末尾
 * @param context 上下文对象
 * @param parenStack 父节点栈
 */
function isEnd(context: ParserContext, parenStack: Array<TemplateAst>): boolean {
    if (!context.source || context.source === '') return true
    // 当存在最靠近栈顶的父节点与当前处理的结束标签一致时说明应停止当前状态机
    for (let i = parenStack.length -1 ; i >= 0; i--) {
        let parent = parenStack[i]
        if (parent && context.source.startsWith(`</${parent.tag}`)) {
            return true
        }
    }
    return false
}

/**
 * 解析HTML标签的属性
 * @param context 上下文对象
 */
function parseAttributes(context: ParserContext): Array<DirectiveNode | PropertyNode> {
    // TODO 完成标签属性解析
    return null
}

/**
 * 解析HTML标签
 * @param context 上下文对象
 * @param type 标签类型
 */
function parseTag(context: ParserContext, type: string = 'start'): TemplateAst {
    const { advanceBy, trimSpaces } = context
    // 根据标签类型使用不同的正则
    const match: RegExpExecArray = type === 'start'
        ? /^<([a-z][^\t\r\n\f />]*)/i.exec(context.source)
        : /^<\/([a-z][^\t\r\n\f />]*)/i.exec(context.source)

    const tag = match[1] // 匹配到的标签名称
    advanceBy(match[0].length) // 消费该标签内容
    trimSpaces()

    const props: Array<DirectiveNode | PropertyNode> = parseAttributes(context)

    const isSelfClosing = context.source.startsWith('/>')
    advanceBy(isSelfClosing ? 2 : 1) // 自闭合标签则消费'/>'否则消费'>'

    return {
        type: 'Element',
        tag,
        props,
        children: [],
        isSelfClosing
    };
}

/**
 * 解析HTML完整标签元素
 * @param context 上下文对象
 * @param parenStack 父节点栈
 */
function parseElement(context: ParserContext, parenStack: Array<TemplateAst>): TemplateAst {
    const element: TemplateAst = parseTag(context)
    if (element.isSelfClosing) return element // 自闭合标签无子节点，直接返回

    // 根据标签类型切换解析模式
    if (element.tag === 'textarea' || element.tag === 'title') {
        context.mode = ParserModes.RCDATA
    } else if(/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
        context.mode = ParserModes.RAWTEXT
    } else {
        context.mode = ParserModes.DATA
    }

    parenStack.push(element) // 作为父节点入栈
    element.children = parseChildren(context, parenStack)
    parenStack.pop() // 解析完所有子元素即出栈

    if (context.source.startsWith(`</${element.tag}`)) {
        parseTag(context, 'end')
    } else {
        error(`${element.tag} lacks the end tag.`, context.source)
    }

    return element;
}

function parseComment(context: ParserContext) {
    return undefined;
}

function parseCDATA(context: ParserContext, parenStack: Array<TemplateAst>) {
    return undefined;
}



function parseInterpolation(context: ParserContext) {
    return undefined;
}

function parseText(context: ParserContext) {
    return undefined;
}