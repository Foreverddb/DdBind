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
export interface TemplateAST {
    // 节点类型：Root, Element, Text
    type: 'Text' | 'Expression' | 'Element' | 'Root' | 'Interpolation' | 'Comment',

    // 标签名
    tag?: string,

    // 是否为自闭合标签
    isSelfClosing?: boolean,

    // 插值表达式或文本内容
    content?: string | ExpressionNode,

    // 子节点
    children?: Array<TemplateAST>,

    // 节点参数
    props?: Array<DirectiveNode | AttributeNode | EventNode>

    jsNode?: JavascriptNode
}

// 指令节点
export interface DirectiveNode {
    type: 'Directive',

    // 指令名
    name: string,

    // 指令表达式
    exp: ExpressionNode
}

export interface EventNode {
    type: 'Event',

    // 事件名
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


// js抽象语法树
export interface JavascriptAST extends JavascriptNode{
    type: 'FunctionDeclaration',
    id: IdentifierNode,
    body: Array<{
        type: 'ReturnStatement',
        return: CallExpressionNode
    }>
}
export interface IdentifierNode extends JavascriptNode{
    type: 'Identifier',
    name: string
}

export interface ArgumentNode extends JavascriptNode{
    type: 'StringLiteral' | 'ArrayExpression' | 'CommentLiteral' | 'ExpressionLiteral',
    value?: string,
    elements?: Array<JavascriptNode>
}

export interface CallExpressionNode extends JavascriptNode{
    type: 'CallExpression',
    callee: IdentifierNode,
    arguments: Array<JavascriptNode>
}

export interface JavascriptNode {
    type: string
}

export interface TransformerContext {
    // 当前正在转换的节点
    currentNode: TemplateAST,

    // 储存当前子节点在父节点中的位置索引
    childIndex: number,

    // currentNode的父节点
    parent: TemplateAST,

    nodeTransforms: Array<(templateAST: TemplateAST, context?: TransformerContext) => Function>
}

export interface ElementDescriptor extends JavascriptNode{
    type: 'ElementDescriptor',
    directives: Array<DirectiveDescriptor>,
    on: {
        [propName: string]: any
    },
    attrs: {
        [propName: string]: string
    }
}

export interface DirectiveDescriptor {
    name: string,
    rawName: string,
    expression: string
}


// code生成器上下文
export interface GeneratorContext {
    code: string,
    push: (code: string) => void
}

