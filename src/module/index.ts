import {DdBindOptions} from "types/ddbind";
import {DdBind} from "./ddbind";

export function createApp(options: DdBindOptions) {
    return new DdBind(options)
}