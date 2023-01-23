import {
    GeneratorContext,
    FunctionDeclNode,
    JavascriptNode,
    ReturnStatementNode,
    CallExpressionNode,
    ArgumentNode,
    PairNode
} from "types/compiler";

/**
 * 对任意JsAST节点进行生成代码操作
 * @param node
 * @param context
 */
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
        case "ExpressionLiteral":
            genExpressionLiteral(node as ArgumentNode, context)
            break
        case "KeyValuePair":
            genKeyValuePair(node as PairNode, context)
            break
        case "ObjectExpression":
            genObjectExpression(node as ArgumentNode, context)
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
 * 生成返回值代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genReturnStatement(node: ReturnStatementNode, context: GeneratorContext) {
    const {push} = context
    push(`return `)
    genNode(node.return, context)
}

/**
 * 生成函数调用表达式代码
 * @param node 目标节点
 * @param context 上下文对象
 */
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
    // 去除换行符以免影响代码运行
    node.value = (node.value as string).replaceAll(/\n/g, ' ')
    // 对于字符串字面量，只需要追加与 node.value 对应的字符串即可
    push(`'${node.value}'`)
}

/**
 * 生成数组表达式代码
 * @param node 目标数组节点
 * @param context 上下文对象
 */
function genArrayExpression(node: ArgumentNode, context: GeneratorContext) {
    const {push, indent, deIndent} = context
    push('[')
    indent()

    genNodeList(node.elements, context)

    deIndent()
    push(']')
}

/**
 * 生成js表达式代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genExpressionLiteral(node: ArgumentNode, context: GeneratorContext) {
    const {push} = context

    push(`(${node.value})`)
}

/**
 * 生成键值对表达式代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genKeyValuePair(node: PairNode, context: GeneratorContext) {
    const {push} = context

    genNode(node.first, context)
    push(': ')
    genNode(node.last, context)

}

/**
 * 生成对象表达式代码
 * @param node 目标节点
 * @param context 上下文对象
 */
function genObjectExpression(node: ArgumentNode, context: GeneratorContext) {
    const {push, indent, deIndent} = context
    push('{')
    indent()

    genNodeList(node.elements, context)

    deIndent()
    push('}')
}