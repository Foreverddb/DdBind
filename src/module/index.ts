import {ref} from "reactivity/reactVal";
import {effect} from "core/index";
import {computed} from "reactivity/computed";

export function test() {
    const b = ref({
        text: 'a'
    })
    const a = computed(() => {
        return b.value + 'b'
    })
    console.log(a.value)
    console.log(a.value)
    effect(() => {
        document.getElementById('app').innerText = a.value
    })
}
