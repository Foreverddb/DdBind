import {
    ArgumentNode,
    CallExpressionNode,
    ExpressionNode,
    FunctionDeclNode,
    IdentifierNode,
    JavascriptNode,
    PairNode,
    ReturnStatementNode,
    TemplateAST
} from "types/compiler";
import {warn} from "utils/debug";
import {transformEventDirectiveExpression} from "compiler/directives";
import {JS_VARIABLE_NAME_VALIDATOR} from "compiler/transformer/regexp";

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
 * 创建键值对型JsAST
 * @param first 键node
 * @param last 值node
 */
function createPairNode(first: JavascriptNode, last: JavascriptNode): PairNode {
    return {
        type: 'KeyValuePair',
        first,
        last
    } as PairNode
}

/**
 * 创建一个预构建的[key: string]: any型键值对JsAST
 * @param key 键
 * @param value 值
 * @param type 值类型
 */
function createKeyValueObjectNode(key: string, value: string | ArgumentNode, type?: 'Expression' | 'StringLiteral'): PairNode {
    const first: ArgumentNode = createStringLiteral(key)
    let last: ArgumentNode
    // 若存在type，按type创建值ast对象
    if (type && typeof value === 'string') {
        last = type === 'StringLiteral' ? createStringLiteral(value) : createExpressionLiteral(value)
    } else if (typeof value !== 'string'){
        // 若value为已构建好的ast则直接传入
        last = value
    }

    return createPairNode(
        first,
        last
    )
}


/**
 * 转换文本节点
 * @param node 目标节点
 */
export function transformText(node: TemplateAST) {
    if (node.type !== 'Text') {
        return
    }

    node.jsNode = createCallExpression('_v', [
        createStringLiteral(node.content as string)
    ])
}

/**
 * 转换注释节点
 * @param node 目标节点
 */
export function transformComment(node: TemplateAST) {
    if (node.type !== 'Comment') {
        return
    }

    node.jsNode = createCallExpression('_h', [
        createStringLiteral('comment'),
        {type: 'ObjectExpression', elements: []} as ArgumentNode, // 注释标签的prop应为空
        createStringLiteral(node.content as string)
    ])
}

/**
 * 转换插值节点
 * @param node 目标节点
 */
export function transformInterpolation(node: TemplateAST) {
    if (node.type !== 'Interpolation') {
        return
    }
    // 插值表达式需转换为字符串以显示
    const callExp = createCallExpression('_s', [
        createExpressionLiteral((node.content as ExpressionNode).content)
    ])
    // 字符串内容再转换成为文本节点
    node.jsNode = createCallExpression('_v', [
        callExp
    ])
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
            // 将props分类依次转换
            const attrs: Array<PairNode> = []
            const directives: Array<PairNode> = []
            const events: Array<PairNode> = []

            // 创建一个props描述对象
            const elementDescriptor = {
                type: 'ObjectExpression',
                elements: [
                    {
                        type: 'KeyValuePair',
                        first: createStringLiteral('directives'),
                        last: {
                            type: 'ObjectExpression',
                            elements: directives
                        } as ArgumentNode
                    } as PairNode,
                    {
                        type: 'KeyValuePair',
                        first: createStringLiteral('on'),
                        last: {
                            type: 'ObjectExpression',
                            elements: events
                        } as ArgumentNode
                    } as PairNode,
                    {
                        type: 'KeyValuePair',
                        first: createStringLiteral('attrs'),
                        last: {
                            type: 'ObjectExpression',
                            elements: attrs
                        } as ArgumentNode
                    }
                ]
            } as ArgumentNode


            // 依次解析不同的prop并分类
            node.props.forEach(prop => {
                if (prop.type === 'Directive') { // 指令节点
                    directives.push(
                        createKeyValueObjectNode(
                            prop.name,
                            prop.exp.content,
                            'Expression'
                        )
                    )
                } else if (prop.type === 'Event') { // 事件处理函数节点
                    events.push(
                        createKeyValueObjectNode(
                            prop.name,
                            // 若函数名合法则校验是否为函数并判断是否需要包装函数体
                            `(typeof (${ JS_VARIABLE_NAME_VALIDATOR.test(prop.exp.content) ? prop.exp.content : 'null' }) === 'function') ? (${prop.exp.content}) : () => { (${prop.exp.content}) }`,
                            'Expression'
                        )
                    )
                } else if (prop.type === 'ReactiveProp') { // 绑定响应式数据的prop节点
                    attrs.push(
                        createKeyValueObjectNode(
                            prop.name,
                            prop.exp.content,
                            'Expression'
                        )
                    )
                } else {
                    // 字符串型attrs
                    attrs.push(
                        createKeyValueObjectNode(
                            prop.name,
                            prop.value,
                            'StringLiteral'
                        )
                    )
                }
            })

            // 解析并转换内置指令，优先级最高，因此在解析完常规props后才进行此操作
            transformEventDirectiveExpression(
                node.props,
                {
                    events: events,
                    attrs: attrs,
                    createKeyValueObjectNode
                }
            )

            callExp.arguments.push(elementDescriptor)
        } else {
            callExp.arguments.push({type: 'ObjectExpression', elements: []} as ArgumentNode)
        }

        // _h第三个参数为全部子节点
        callExp.arguments.push(createArrayExpression(node.children.map(c => c.jsNode)))

        node.jsNode = callExp
    }
}

export function transformRoot(node: TemplateAST): () => void {
    // 置于退出阶段的回调函数，保证子节点全部处理完毕
    return () => {
        if (node.type !== 'Root') {
            return
        }

        const vnodeJSAST: JavascriptNode = node.children[0].jsNode // 根节点只能有一个子元素

        if (__DEV__ && node.children.length > 1) {
            warn(`the template requires only one child node, detected ${node.children.length}. 
            The DdBind parser will only parse the first one`, null)
        }

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