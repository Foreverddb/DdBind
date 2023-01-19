import {JavascriptAST, TemplateAST, TransformerContext} from "types/compiler";
import {traverseNode} from "compiler/transformer/traverse";
import {
    transformComment,
    transformElement,
    transformInterpolation,
    transformRoot,
    transformText
} from "compiler/transformer/node-transformer";

/**
 * 将模版AST转换为JS AST
 * @param templateAST 目标模版AST
 */
export function transform(templateAST: TemplateAST): JavascriptAST {
    const context = {
        currentNode: null,
        childIndex: 0,
        parent: null,
        nodeTransforms: [
            transformText,
            transformComment,
            transformInterpolation,
            transformElement,
            transformRoot
        ]
    } as TransformerContext
    traverseNode(templateAST, context)
    return templateAST.jsNode as JavascriptAST
}