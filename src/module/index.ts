import {DdBindOptions} from "types/ddbind";
import {DdBind} from "./ddbind";
import {proxyRefs, ref} from "reactivity/ref";

export {DdBind}

export {reactive} from 'reactivity/reactive'
export {ref} from 'reactivity/ref'
export {watch} from 'reactivity/watch'
export {computed} from 'reactivity/computed'

export function createApp(options: DdBindOptions) {
    return proxyRefs(new DdBind(options))
}