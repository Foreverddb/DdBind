import {transform} from "compiler/transformer";
import {parse} from "compiler/parser";

describe('transformer', () => {
    // 测试简单的转换
    it('dose simple transform', () => {
        const template = parse('<h1>hello world</h1>')
        const ast: any = transform(template)
        expect(ast.body[0].type).toBe('ReturnStatement')
        expect(ast.body[0].return.type).toBe('CallExpression')
        expect(ast.body[0].return.callee.name).toBe('_h')
        expect(ast.body[0].return.arguments[0]).toEqual({
            type: 'StringLiteral',
            value: 'h1'
        })
    })
    // 测试指令的转换
    it('dose directive transform', () => {
        const template = parse('<input d-model="foo" />')
        const ast: any = transform(template)
        expect(ast.body[0].return.arguments[1].elements[0].first.value).toBe('directives')
        expect(ast.body[0].return.arguments[1].elements[0].last.elements).toContainEqual({
            first: {
                type: "StringLiteral",
                value: "d-model",
            },
            last: {
                type: "ExpressionLiteral",
                value: "foo",
            },
            type: "KeyValuePair",
        })
    })
    // 测试插值转换
    it('dose interpolation transform', () => {
        const template = parse('<div>{{foo}}</div>')
        const ast: any = transform(template)

        expect(ast.body[0].return.arguments[2].elements[0].arguments[0].type).toBe('CallExpression')
        expect(ast.body[0].return.arguments[2].elements[0].arguments[0].callee.name).toBe('_s')
        expect(ast.body[0].return.arguments[2].elements[0].arguments[0].arguments[0].value).toBe('foo')
    })
    // 测试嵌套转换
    it('dose nested transform', () => {
        const template = parse('<div><h1>hello world</h1></div>')
        const ast: any = transform(template)
        const res = {
            type: "FunctionDeclaration",
            id: {type: "Identifier", name: "render"},
            body: [{
                type: "ReturnStatement",
                return: {
                    type: "CallExpression",
                    callee: {type: "Identifier", name: "_h"},
                    arguments: [{type: "StringLiteral", value: "div"}, {
                        type: "ObjectExpression",
                        elements: []
                    }, {
                        type: "ArrayExpression",
                        elements: [{
                            type: "CallExpression",
                            callee: {type: "Identifier", name: "_h"},
                            arguments: [{type: "StringLiteral", value: "h1"}, {
                                type: "ObjectExpression",
                                elements: []
                            }, {
                                type: "ArrayExpression",
                                elements: [{
                                    type: "CallExpression",
                                    callee: {type: "Identifier", name: "_v"},
                                    arguments: [{type: "StringLiteral", value: "hello world"}]
                                }]
                            }]
                        }]
                    }]
                }
            }]
        }
        expect(ast).toEqual(res)
    })
})