import {ref} from "reactivity/reactVal";
import {effect} from "core/index";

export function test() {
    const b = ref({
        text: 'a'
    })

    effect(() => {
        document.getElementById('app').innerText = b.value.text
    })
    b.value.text = 'b'

}
