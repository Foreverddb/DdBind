import {DdBindOptions, DdBindVm} from "types/ddbind";
import {DdBind} from "./ddbind";
import {proxyRefs, ref, toRefs} from "reactivity/ref";
import {watchEffect} from "core/effect";

export {DdBind}

export {reactive} from 'reactivity/reactive'
export {ref} from 'reactivity/ref'
export {watch} from 'reactivity/watch'
export {computed} from 'reactivity/computed'
export {
    proxyRefs,
    toRefs,
    watchEffect
}

export function createApp(options: DdBindOptions): DdBindVm {
    return proxyRefs(new DdBind(options))
}