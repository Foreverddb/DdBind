import {transform} from "compiler/transformer";
import {
    ArgumentNode, PairNode,
    TemplateAST
} from "types/compiler";
import {parse} from "compiler/parser";
import {expect} from "vitest";

describe('transformer', () => {
    // 测试简单的转换
    it('simple transform', () => {
        const template: TemplateAST = parse('<h1>hello world</h1>')
        const ast: any = transform(template)
        expect(ast.body[0].type).toBe('ReturnStatement')
        expect(ast.body[0].return.type).toBe('CallExpression')
        expect(ast.body[0].return.callee.name).toBe('_h')
        expect(ast.body[0].return.arguments[0]).toEqual({
            type: 'StringLiteral',
            value: 'h1'
        } as ArgumentNode)
    })
    // 测试指令的转换
    it('directive transform', () => {
        const template: TemplateAST = parse('<input d-model="foo" />')
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
        } as PairNode)
    })
})