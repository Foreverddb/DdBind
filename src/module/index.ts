import {DdBindOptions} from "types/ddbind";
import {DdBind} from "./ddbind";

export {DdBind}

export function createApp(options: DdBindOptions) {
    return new DdBind(options)
}