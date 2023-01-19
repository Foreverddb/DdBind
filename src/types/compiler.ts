export const enum ParserModes {
    // 解析标签与HTML实体
    DATA,

    // 只解析HTML实体
    RCDATA,

    // 作为纯文本处理
    RAWTEXT,

    // 作为纯文本处理
    CDATA
}

export interface ParserContext {
    source: string
    mode: ParserModes,
    advanceBy: (num: number) => void,
    advanceSpaces: () => void,
    trimEndSpaces: () => void
}

// 模版抽象语法树
export interface TemplateAst {
    // 节点类型：Root, Element, Text
    type: 'Text' | 'Expression' | 'Element' | 'Root' | 'Interpolation' | 'Comment',

    // 标签名
    tag?: string,

    // 是否为自闭合标签
    isSelfClosing?: boolean,

    // 插值表达式或文本内容
    content?: string | ExpressionNode,

    // 子节点
    children?: Array<TemplateAst>,

    // 节点参数
    props?: Array<DirectiveNode | AttributeNode>
}

// 指令节点
export interface DirectiveNode {
    type: 'Directive',

    // 指令名
    name: string,
    exp: ExpressionNode
}

// HTML attr节点
export interface AttributeNode {
    type: 'Attribute',

    // attr名
    name: string,

    // attr值
    value: string
}

// 表达式节点
export interface ExpressionNode {
    type: 'Expression',

    // 表达式字符串
    content: string
}

