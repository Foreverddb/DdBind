import {ref} from "reactivity/ref";
import {effect} from "core/index";
import {watch} from "reactivity/watch";
import {reactive} from "reactivity/reactive";
import {createRenderer} from "../renderer/renderer";
import {VNode} from "types/renderer";

export function test() {
    const a = ref(false)
    const renderer = createRenderer()

    effect(() => {
        const vnode: VNode = {
            type: 'div',
            props: a.value ? {
                onClick: () => {
                    console.log('parent')
                }
            } : {},
            children: [
                {
                    type: 'button',
                    children: 'test',
                    props: {
                        style: {
                            color: 'red'
                        },
                        onClick: () => {
                            console.log('child')
                            a.value = true
                        }
                    }
                }
            ]
        }
        renderer.render(vnode, document.querySelector('#app'))
    })
}
