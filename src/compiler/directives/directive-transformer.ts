import {
    AttributeNode,
    DirectiveNode,
    DirectiveTransformerContext,
    EventNode,
    PairNode
} from "types/compiler";
import {codeGuards} from "compiler/generator";

export function transformEventDirectiveExpression(directives: Array<DirectiveNode | AttributeNode | EventNode>,
                                                  context: DirectiveTransformerContext) {

    directives.filter(x => x.type === 'Directive').forEach((directive: DirectiveNode) => {
        genEventExpression(directive, context)
    })
}

function genEventExpression(directive: DirectiveNode, context: DirectiveTransformerContext) {
    const {createStringLiteral, createExpressionLiteral, createPairNode} = context

    switch (directive.name) {
        case 'd-model':
            context.target.push(
                createPairNode(
                    createStringLiteral('click'),
                    createExpressionLiteral(`($event) => { ${codeGuards[directive.name]} ${directive.exp.content} = $event.target.value }`)
                )
            )
            break
    }
}