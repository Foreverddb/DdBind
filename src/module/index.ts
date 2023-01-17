import {ref} from "reactivity/ref";
import {effect} from "core/index";
import {watch} from "reactivity/watch";
import {reactive} from "reactivity/reactive";
import {createRenderer} from "renderer/renderer";
import {VNode} from "types/renderer";
import {VnodeUtil} from "renderer/vnode";

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
            children: [{
                type: 'button',
                children: 'btn'
            }]
        }
        const vnode2: VNode = {
            type: 'span',
            props: {
                onClick: () => {
                    console.log('parent')
                }
            } ,
            children: [
                {
                    type: 'h1',
                    children: 'fuck'
                },
                {
                    type: 'p',
                    children: 'shit'
                }
            ]
        }
        const vnode3 = VnodeUtil.builder().setType('h1').setChildren('fuckme').build()
        renderer.render(vnode3, document.querySelector('#app'))
        setTimeout(() => {
            renderer.render(vnode2, document.querySelector('#app'))
        }, 1000)
    })
}
