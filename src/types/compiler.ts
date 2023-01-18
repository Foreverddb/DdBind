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
    trimSpaces: () => void,
    trimEndSpaces: () => void
}

export interface TemplateAst {
    // 节点类型：Root, Element, Text
    type: string,
    // 标签名
    tag?: string,
    // 是否为自闭合标签
    isSelfClosing?: boolean,
    // 子节点
    children: Array<TemplateAst>,
    // 节点参数
    props?: Array<DirectiveNode | PropertyNode>
}

export interface DirectiveNode {
    type: string,
    name: string,
    exp: ExpressionNode
}

export interface ExpressionNode {

}

export interface PropertyNode {
    type: string,
    name: string
}