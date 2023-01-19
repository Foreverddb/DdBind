import {TemplateAST, TransformerContext} from "types/compiler";

/**
 * 深度优先遍历节点
 * @param templateAST 需要遍历的ast
 * @param context 上下文对象
 */
export function traverseNode(templateAST: TemplateAST, context: TransformerContext) {
    // debugger
    context.currentNode = templateAST
    const exitFns: Array<Function> = []

    // 对当前节点进行转换操作
    const transforms: Array<(templateAST: TemplateAST, context: TransformerContext) => any> = context.nodeTransforms
    for (let i = 0; i < transforms.length; i++) {
        const onExit = transforms[i](context.currentNode, context) // 转换函数的返回函数作为退出阶段的回调函数
        if (onExit) {
            exitFns.push(onExit)
        }
        if (!context.currentNode) return // 若转换后当前node不存在则停止操作
    }

    // 遍历子节点进行转换操作
    const children = context.currentNode.children
    if (children) {
        for (let i = 0; i < children.length; i++) {
            context.parent = context.currentNode
            context.childIndex = i

            // 递归透传context
            traverseNode(children[i], context)
        }
    }

    // 退出阶段
    let i = exitFns.length
    while (i --) {
        exitFns[i]()
    }
}