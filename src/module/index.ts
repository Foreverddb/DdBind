import {ref} from "reactivity/ref";
import {effect} from "core/index";
import {watch} from "reactivity/watch";
import {reactive} from "reactivity/reactive";
import {createRenderer} from "../renderer/renderer";
import {VNode} from "types/renderer";

export function test() {
    const renderer = createRenderer()
    const vnode: VNode = {
        type: 'div',
        children: [
            {
                type: 'p',
                children: 'fuck',
                props: {
                    id: 'dd'
                }
            },
            {
                type: 'h1',
                children: 'shit'
            }
        ]
    }
    renderer.render(vnode, document.querySelector('#app'))
}
