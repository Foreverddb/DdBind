import {Reactivity} from "types/reactivity";
import {effect} from "core/effect";

interface WatchCallback<T> {
    (newValue: T): any
}

/**
 * 遍历对象属性使其绑定响应
 */
function traverseRef(value: any, traversed = new Set()) {

    if (!value || typeof value !== 'object' || traversed.has(value)) return

    traversed.add(value)
    for (const valueKey in value) {
        traverseRef(value[valueKey], traversed)
    }

    return value
}

/**
 * 注册一个侦听器
 * @param target 侦听对象
 * @param callback 对象值发生变化时执行的回调
 */
export function watch<T>(target: Reactivity<T>, callback: WatchCallback<T>) {
    effect(() => traverseRef(target.value), {
        scheduler: (fn) => {
            callback(target.value)
        }
    })
}