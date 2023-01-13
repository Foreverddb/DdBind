import {ref} from "reactivity/ref";
import {effect} from "core/index";
import {watch} from "reactivity/watch";
import {reactive} from "reactivity/reactive";

export function test() {
    const b = reactive([])

    // watch(b, (newValue, oldValue) => {
    //     console.log(newValue)
    // })

    effect(() => {
        console.log(b.toString())
    })

    b.push('ss')
    b[0] = 'sio'

}
