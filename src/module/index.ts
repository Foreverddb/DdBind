import {ref} from "reactivity/reactVal";
import {effect} from "core/index";
import {watch} from "reactivity/watch";

export function test() {
    const b = ref({
        ary: [],
        text: 'aa'
    })

    watch(b, (newValue) => {
        console.log(b.value)
    })

    b.value.ary.push('fuck')
}
