import {
    DirectiveTransformerContext,
    PropNode
} from "types/compiler";
import {codeGuards} from "compiler/generator";

export function transformEventDirectiveExpression(directives: Array<PropNode>,
                                                  context: DirectiveTransformerContext) {

    directives.filter(x => x.type === 'Directive').forEach((directive: PropNode) => {
        genEventExpression(directive, context)
    })
}

function genEventExpression(directive: PropNode, context: DirectiveTransformerContext) {
    const {createStringLiteral, createExpressionLiteral, createPairNode} = context

    switch (directive.name) {
        case 'd-model':
            context.events.push(
                createPairNode(
                    createStringLiteral('click'),
                    createExpressionLiteral(`($event) => { ${codeGuards[directive.name]} ${directive.exp.content} = $event.target.value }`)
                )
            )
            context.attrs.push(
                createPairNode(
                    createStringLiteral('value'),
                    createExpressionLiteral(`${directive.exp.content}`)
                )
            )
            break
    }
}