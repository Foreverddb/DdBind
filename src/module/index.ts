import {DdBindOptions} from "types/ddbind";
import {DdBind} from "./ddbind";

export {DdBind}

export {reactive} from 'reactivity/reactive'
export {ref} from 'reactivity/ref'
export {watch} from 'reactivity/watch'
export {computed} from 'reactivity/computed'

export function createApp(options: DdBindOptions) {
    return new DdBind(options)
}