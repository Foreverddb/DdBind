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
                type: 'button',
                children: 'test',
                props: {
                    style: {
                        color: 'red'
                    },
                    onClick: () => {
                        console.log('aaaa')
                    }
                }
            }
        ]
    }
    renderer.render(vnode, document.querySelector('#app'))
    // renderer.render(null, document.querySelector('#app'))
}
