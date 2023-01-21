import {
    ParserContext,
    ParserModes,
    TemplateAST,
    ExpressionNode, PropNode,
} from "types/compiler";
import {error} from "utils/debug";

import {
    ALPHABET_OR_NUMBER_REG,
    HTML_END_TAG_REG,
    HTML_RAWTEXT_TAG_REG,
    HTML_REFERENCE_HEAD_REG,
    HTML_REFERENCE_HEX_REG,
    HTML_REFERENCE_NUMBER_REG,
    HTML_START_TAG_REG,
    HTML_TAG_PROP_REG,
    HTML_TAG_PROP_VALUE_WITHOUT_QUOTE
} from "compiler/parser/regexp";

import {CCR_REPLACEMENTS, decodeMap, decodeMapKeyMaxLen, selfClosingTags} from "compiler/parser/references";
import {parseDirectives} from "compiler/directives";


/**
 * 解析某节点的子节点
 * @param context 上下文对象
 * @param parenStack 父节点栈
 */
export function parseChildren(context: ParserContext, parenStack: Array<TemplateAST>): Array<TemplateAST> {
    let nodes: Array<TemplateAST> = []

    while (!isEnd(context, parenStack)) {
        let node: TemplateAST

        if (context.mode === ParserModes.DATA || context.mode === ParserModes.RCDATA) {
            // 仅DATA模式支持解析标签节点
            if (context.mode === ParserModes.DATA && context.source[0] === '<') {
                if (context.source[1] === '!') {
                    if (context.source.startsWith('<!--')) { // 注释标签开头
                        node = parseComment(context)
                    } else if (context.source.startsWith('<![CDATA[')) { // CDATA标签
                        error(`the parser is not supporting CDATA mode.`, null)
                        // node = parseCDATA(context, parenStack)
                    }
                } else if (context.source[1] === '/') { // 结束标签
                    error('invalid end tag in HTML.', context.source)
                    continue
                } else if (/[a-z]/i.test(context.source[1])) {
                    node = parseElement(context, parenStack)
                }
            } else if (context.source.startsWith('{{')) { // 解析文本插值
                // 插值解析
                node = parseInterpolation(context)
            }
        }
        // 若node不存在则说明处于非DATA模式，一律当作text处理
        if (!node) {
            node = parseText(context)
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
function isEnd(context: ParserContext, parenStack: Array<TemplateAST>): boolean {
    if (!context.source || context.source === '') return true
    // 当存在最靠近栈顶的父节点与当前处理的结束标签一致时说明应停止当前状态机
    for (let i = parenStack.length - 1; i >= 0; i--) {
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
function parseAttributes(context: ParserContext): Array<PropNode> {
    const {advanceBy, advanceSpaces} = context
    const props: Array<PropNode> = []

    while (
        !context.source.startsWith('>') && !context.source.startsWith('/')
        ) {
        const match: RegExpExecArray = HTML_TAG_PROP_REG.exec(context.source)

        const propName: string = match[0]

        // 消费属性名
        advanceBy(propName.length)
        advanceSpaces()
        // 消费等号
        advanceBy(1)
        advanceSpaces()

        let propValue: string = ''
        const quote = context.source[0]
        const isQuote = quote === '"' || quote === "'"
        // 根据属性值是否被引号引用来进行不同处理
        if (isQuote) {
            advanceBy(1) // 消费引号
            const lastQuoteIndex = context.source.indexOf(quote)
            if (lastQuoteIndex > -1) {
                propValue = context.source.slice(0, lastQuoteIndex) // 获取属性值
                advanceBy(propValue.length + 1)
            } else {
                error(`prop value of ${propName} lacks a quote.`, context.source)
            }
        } else {
            // 属性值未带引号的情况
            const match = HTML_TAG_PROP_VALUE_WITHOUT_QUOTE.exec(context.source)
            propValue = match[0]
            advanceBy(propValue.length)
        }

        if (propValue.replace(/(^s*)|(s*$)/g, "").length == 0) {
            error(`the value of prop '${propName}' cannot be blank`, {
                propName,
                propValue
            })
        }

        advanceSpaces()

        // 处理prop类型与指令
        let prop: PropNode = parseDirectives(propName, propValue)

        props.push(prop)
    }

    return props
}

/**
 * 解析HTML标签
 * @param context 上下文对象
 * @param type 标签类型
 */
function parseTag(context: ParserContext, type: string = 'start'): TemplateAST {
    const {advanceBy, advanceSpaces} = context
    // 根据标签类型使用不同的正则
    const match: RegExpExecArray = type === 'start'
        ? HTML_START_TAG_REG.exec(context.source)
        : HTML_END_TAG_REG.exec(context.source)

    const tag = match[1] // 匹配到的标签名称

    advanceBy(match[0].length) // 消费该标签内容
    advanceSpaces()

    const props: Array<PropNode> = parseAttributes(context) // 解析标签属性

    const isSelfClosing = selfClosingTags.includes(tag)
    advanceBy(
        isSelfClosing
            ? (context.source.startsWith('/>') ? 2 : 1)
            : 1
    ) // 自闭合标签则根据情况消费'>'或'/>'

    return {
        type: 'Element',
        tag,
        props,
        children: [],
        isSelfClosing
    } as TemplateAST;
}

/**
 * 解析HTML完整标签元素
 * @param context 上下文对象
 * @param parenStack 父节点栈
 */
function parseElement(context: ParserContext, parenStack: Array<TemplateAST>): TemplateAST {
    const element: TemplateAST = parseTag(context)
    if (element.isSelfClosing) return element // 自闭合标签无子节点，直接返回

    // 根据标签类型切换解析模式
    if (element.tag === 'textarea' || element.tag === 'title') {
        context.mode = ParserModes.RCDATA
    } else if (HTML_RAWTEXT_TAG_REG.test(element.tag)) {
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

/**
 * 解析注释标签
 * @param context 上下文对象
 */
function parseComment(context: ParserContext): TemplateAST {
    context.advanceBy('<!--'.length)
    const closeIndex = context.source.indexOf('-->')

    if (closeIndex < 0) {
        error(`the comment block lacks the end tag "-->"`, context.source)
    }

    // 获取注释内容
    const content = context.source.slice(0, closeIndex)
    context.advanceBy(content.length)
    context.advanceBy('-->'.length)

    return {
        type: 'Comment',
        content
    } as TemplateAST;
}

/**
 * 解析文本插值
 * @param context 上下文对象
 */
function parseInterpolation(context: ParserContext): TemplateAST {
    context.advanceBy('{{'.length)
    const closeIndex = context.source.indexOf('}}')

    if (closeIndex < 0) {
        error(`the interpolation block lacks the end tag "}}"`, context.source)
    }

    // 获取插值表达式
    const content = context.source.slice(0, closeIndex)
    context.advanceBy(content.length)
    context.advanceBy('}}'.length)

    return {
        type: 'Interpolation',
        content: {
            type: 'Expression',
            content: decodeHTMLText(content)
        } as ExpressionNode
    } as TemplateAST;
}

/**
 * 解析纯文本内容
 * @param context 上下文对象
 */
function parseText(context: ParserContext): TemplateAST {
    let lastIndex: number = context.source.length
    const lessThanSignIndex: number = context.source.indexOf('<') // 寻找标签<符
    const delimiterIndex: number = context.source.indexOf('{{') // 寻找文本插值符{{

    // 取两种符号索引较小的作为结束索引
    if (lessThanSignIndex > -1 && lessThanSignIndex < lastIndex) {
        lastIndex = lessThanSignIndex
    }
    if (delimiterIndex > -1 && delimiterIndex < lastIndex) {
        lastIndex = delimiterIndex
    }

    const content: string = context.source.slice(0, lastIndex)
    context.advanceBy(content.length)

    return {
        type: 'Text',
        content: decodeHTMLText(content)
    } as TemplateAST;
}

/**
 * 解析HTML中的引用字符
 * @param rawText 需要解码的文本
 * @param asAttr 是否用于解码属性值
 */
function decodeHTMLText(rawText: string, asAttr: boolean = false): string {
    let offset: number = 0
    // 存放解码后的文本结果
    let decodedText: string = ''
    const endIndex: number = rawText.length

    // advance 消费指定长度的文本
    function advance(length) {
        offset += length
        rawText = rawText.slice(length)
    }

    while (offset < endIndex) {
        // 校验字符引用方式
        // &为命名字符引用
        // &#为十进制数字字符引用
        // &#x为十六进制数字字符引用
        const head = HTML_REFERENCE_HEAD_REG.exec(rawText)
        // 无匹配则说明无需解码
        if (!head) {
            const remaining = endIndex - offset
            decodedText += rawText.slice(0, remaining)
            advance(remaining)
            break
        }

        decodedText += rawText.slice(0, head.index)
        advance(head.index) // 消费&前的内容

        if (head[0] === '&') {
            let name: string = ''
            let value: string = undefined

            if (ALPHABET_OR_NUMBER_REG.test(rawText[1])) {
                // 依次从最长到最短查表寻找匹配的引用字符名称
                for (let length = decodeMapKeyMaxLen; !value && length > 0; --length) {
                    name = rawText.slice(1, 1 + length)
                    value = decodeMap[name]
                }

                if (value) {
                    const semi = (rawText[1 + name.length] || '') === ';'
                    // 如果解码的文本作为属性值，最后一个匹配的字符不是分号，
                    // 并且最后一个匹配字符的下一个字符是等于号(=)、ASCII 字母或数字，
                    // 将字符 & 和实体名称 name 作为普通文本
                    if (
                        asAttr &&
                        !semi &&
                        /[=a-z0-9]/i.test(rawText[1 + name.length] || '')
                    ) {
                        decodedText += '&' + name
                        advance(1 + name.length)
                    } else {
                        decodedText += value
                        advance(semi ? 2 + name.length : 1 + name.length) // 由于查找键时未包含分号，若末尾有分号需同时消费掉
                    }
                } else { // 解码失败，无对应值
                    decodedText += '&' + name
                    advance(1 + name.length)
                }
            } else {
                decodedText += '&'
                advance(1)
            }
        } else {
            // 根据引用头判断数字的引用进制
            const isHex: boolean = head[0] === '&#x'
            const pattern: RegExp = isHex ? HTML_REFERENCE_HEX_REG : HTML_REFERENCE_NUMBER_REG
            const body: RegExpExecArray = pattern.exec(rawText) // 匹配得到unicode码值

            if (body) {
                // 根据进制将转为改为数字
                let codePoint: number = parseInt(body[1], isHex ? 16 : 10)
                // 检查unicode值合法性并进行替换
                if (codePoint === 0) {
                    codePoint = 0xfffd
                } else if (codePoint > 0x10ffff) {
                    codePoint = 0xfffd
                } else if (codePoint > 0xd800 && codePoint < 0xdfff) {
                    codePoint = 0xfffd
                } else if ((codePoint > 0xfdd0 && codePoint <= 0xfdef) || (codePoint & 0xfffe) === 0xfffe) {/*do nothing*/
                } else if (
                    (codePoint >= 0x01 && codePoint <= 0x08) ||
                    codePoint === 0x0b ||
                    (codePoint >= 0x0d && codePoint <= 0x1f) ||
                    (codePoint >= 0x7f && codePoint <= 0x9f)) {
                    codePoint = CCR_REPLACEMENTS[codePoint] || codePoint
                }

                // 解码
                const char = String.fromCodePoint(codePoint)
                decodedText += char
                advance(body[0].length)
            } else { // 无匹配则直接当作文本处理
                decodedText += head[0]
                advance(head[0].length)
            }
        }
    }

    return decodedText
}