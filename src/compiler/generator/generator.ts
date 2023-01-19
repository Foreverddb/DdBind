import {
    GeneratorContext,
    FunctionDeclNode,
    JavascriptNode,
    ReturnStatementNode,
    CallExpressionNode,
    ArgumentNode, ElementDescriptor
} from "types/compiler";

export function genNode(node: JavascriptNode, context: GeneratorContext) {
    switch (node.type) {
        case "FunctionDeclaration":
            genFunctionDeclaration(node as FunctionDeclNode, context)
            break
        case "ReturnStatement":
            genReturnStatement(node as ReturnStatementNode, context)
            break
        case "CallExpression":
            genCallExpression(node as CallExpressionNode, context)
            break
        case "StringLiteral":
            genStringLiteral(node as ArgumentNode, context)
            break
        case "ArrayExpression":
            genArrayExpression(node as ArgumentNode, context)
            break
        case "ElementDescriptor":
            genElementDescriptor(node as ElementDescriptor, context)
            break
        case "ExpressionLiteral":
            break
    }
}

/**
 * 生成函数型代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genFunctionDeclaration(node: FunctionDeclNode, context: GeneratorContext) {
    // 从 context 对象中取出工具函数
    const {push, indent, deIndent} = context

    push(`with(this) `)
    push(`{`)
    indent()
    // 函数体
    node.body.forEach(n => genNode(n, context))

    deIndent()
    push(`}`)
}

/**
 * 生成返回型代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genReturnStatement(node: ReturnStatementNode, context: GeneratorContext) {
    const {push} = context
    push(`return `)
    genNode(node.return, context)
}

function genCallExpression(node: CallExpressionNode, context: GeneratorContext) {
    const {push} = context
    const {callee, arguments: args} = node

    push(`${callee.name}(`)
    genNodeList(args, context)
    push(`)`)
}

/**
 * 生成参数列表
 * @param nodes 节点数组
 * @param context 上下文对象
 */
function genNodeList(nodes: Array<JavascriptNode>, context: GeneratorContext) {
    const {push} = context
    for (let i = 0; i < nodes.length; i++) {
        const node: JavascriptNode = nodes[i]
        genNode(node, context)
        if (i < nodes.length - 1) {
            push(', ')
        }
    }
}

/**
 * 生成字符串代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genStringLiteral(node: ArgumentNode, context: GeneratorContext) {
    const {push} = context
    // 对于字符串字面量，只需要追加与 node.value 对应的字符串即可
    push(`'${node.value}'`)
}

/**
 * 生成数组表达式代码
 * @param node 目标数组节点
 * @param context 上下文对象
 */
function genArrayExpression(node: ArgumentNode, context: GeneratorContext) {
    const {push} = context
    push('[')
    genNodeList(node.elements, context)
    push(']')
}

function genElementDescriptor(node: ElementDescriptor, context: GeneratorContext) {
    const {push, indent, deIndent} = context
    push('{')
    indent()
    if (node.attrs && Object.keys(node.attrs).length > 0) {
        push(`'attrs': {`)
        indent()
        Object.keys(node.attrs).forEach(attrKey => {
            push(`'${attrKey}': '${node.attrs[attrKey]}'`)
        })
        deIndent()
        push('},')
    }
    if (node.on && Object.keys(node.on).length > 0) {
        push(`'on': {`)
        indent()
        Object.keys(node.on).forEach(attrKey => {
            push(`'${attrKey}': ${node.on[attrKey]}`)
        })
        deIndent()
        push('},')
    }
    if (node.directives && Object.keys(node.directives).length > 0) {
        push(`'directives': [`)
        indent()
        for (let i = 0; i < node.directives.length; i++) {
            push(`${JSON.stringify(node.directives[i])}`)
            if (i < node.directives.length - 1) {
                push(', ')
            }
        }
        deIndent()
        push(']')
    }
    deIndent()
    push('}')
}