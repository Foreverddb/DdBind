import {
    ArgumentNode,
    CallExpressionNode, DirectiveDescriptor, DirectiveNode, ElementDescriptor, ExpressionNode,
    IdentifierNode,
    FunctionDeclNode,
    JavascriptNode,
    TemplateAST, ReturnStatementNode
} from "types/compiler";

/**
 * 创建StringLiteral型的JsAST
 * @param value string值
 */
function createStringLiteral(value: string): ArgumentNode {
    return {
        type: 'StringLiteral',
        value
    } as ArgumentNode
}

/**
 * 创建Identifier型的JsAST
 * @param name identifier值
 */
function createIdentifier(name: string): IdentifierNode {
    return {
        type: 'Identifier',
        name
    } as IdentifierNode
}

/**
 * 创建ArrayExpression型的JsAST
 * @param elements JsAST数组
 */
function createArrayExpression(elements: Array<JavascriptNode>): ArgumentNode {
    return {
        type: 'ArrayExpression',
        elements
    } as ArgumentNode
}

/**
 * 创建CallExpression型的JsAST
 * @param callee 要call的函数名
 * @param args 传入的参数
 */
function createCallExpression(callee: string, args: Array<JavascriptNode>): CallExpressionNode {
    return {
        type: 'CallExpression',
        callee: createIdentifier(callee),
        arguments: args
    } as CallExpressionNode
}

/**
 * 创建表达式型的JsAST
 * @param value 表达式字符串
 */
function createExpressionLiteral(value: string): ArgumentNode {
    return {
        type: 'ExpressionLiteral',
        value
    } as ArgumentNode
}


/**
 * 转换文本节点
 * @param node 目标节点
 */
export function transformText(node: TemplateAST) {
    if (node.type !== 'Text') {
        return
    }

    const callExp = createCallExpression('_v', [
        createStringLiteral(node.content as string)
    ])

    node.jsNode = callExp
}

/**
 * 转换注释节点
 * @param node 目标节点
 */
export function transformComment(node: TemplateAST) {
    if (node.type !== 'Comment') {
        return
    }

    const callExp = createCallExpression('_h', [
        createStringLiteral('comment'),
        {type: 'ElementDescriptor'},
        createStringLiteral(node.content as string)
    ])

    node.jsNode = callExp
}

/**
 * 转换插值节点
 * @param node 目标节点
 */
export function transformInterpolation(node: TemplateAST) {
    if (node.type !== 'Interpolation') {
        return
    }

    const callExp = createCallExpression('_s', [
        createExpressionLiteral(node.content as string)
    ])


    node.jsNode = callExp
}

/**
 * 转换标签节点
 * @param node 目标节点
 */
export function transformElement(node: TemplateAST): () => void {
    // 置于退出阶段的回调函数，保证子节点全部处理完毕
    return () => {
        if (node.type !== 'Element') {
            return
        }

        // 创建_h函数的调用
        const callExp: CallExpressionNode = createCallExpression('_h', [
            createStringLiteral(node.tag)
        ])

        // _h第二个参数为解析node的属性值
        if (node.props && node.props.length > 0) {
            const elementDescriptor = {
                type: 'ElementDescriptor',
                directives: [],
                on: {},
                attrs: {}
            } as ElementDescriptor

            // 依次解析不同的prop并分类
            node.props.forEach(prop => {
                if (prop.type === 'Directive') {
                    elementDescriptor.directives.push({
                        name: prop.name.slice(2, prop.name.length),
                        rawName: prop.name,
                        expression: prop.exp.content
                    } as DirectiveDescriptor)
                } else if (prop.type === 'Event') {
                    elementDescriptor.on[prop.name] = prop.exp.content
                } else if (prop.type === 'Attribute') {
                    elementDescriptor.attrs[prop.name] = prop.value
                }
            })

            callExp.arguments.push(elementDescriptor)
        } else {
            callExp.arguments.push({type: 'ElementDescriptor'})
        }

        // _h第三个参数为全部子节点
        node.children.length === 1
            ? callExp.arguments.push(node.children[0].jsNode)
            : callExp.arguments.push(createArrayExpression(node.children.map(c => c.jsNode)))

        node.jsNode = callExp
    }
}

export function transformRoot(node: TemplateAST): () => void {
    // 置于退出阶段的回调函数，保证子节点全部处理完毕
    return () => {
        if (node.type !== 'Root') {
            return
        }

        const vnodeJSAST: JavascriptNode = node.children[0].jsNode
        node.jsNode = {
            type: 'FunctionDeclaration',
            id: {type: 'Identifier', name: 'render'},
            body: [{
                type: 'ReturnStatement',
                return: vnodeJSAST
            } as ReturnStatementNode]
        } as FunctionDeclNode
    }
}