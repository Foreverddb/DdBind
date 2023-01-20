import {effect} from "core/effect";
import {warn} from "utils/debug";

/**
 * 侦听属性的回调函数类型
 */
interface WatchCallback<T> {
    (newValue: T, oldValue: T, onExpired: (fn: () => {}) => any): any
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
export function watch<T>(target: object | (() => any), callback: WatchCallback<T>) {
    if (__DEV__ && typeof target !== "object") {
        warn(`watch() requires a object as watching target, received type is ${typeof target}`, target)
    }
    let getter // 需要注册的getter函数
    // 若为用户定义的getter则直接使用
    if (typeof target === 'function') {
        getter = target
    } else {
        getter = () => traverseRef(target)
    }

    let newValue: T, oldValue: T
    let onExpiredHandler: () => any
    const onExpired = (fn: () => any) => {
        onExpiredHandler = fn
    }

    const effectFn = effect(getter, {
        isLazy: true,
        scheduler: () => {
            let data = effectFn()
            newValue = (data._is_Ref_) ? data.value : {...data} // 防止与oldValue引用同一对象

            if (onExpiredHandler) onExpiredHandler() // 若注册了过期函数则在回调前执行

            callback(newValue, oldValue, onExpired)
            oldValue = newValue
        }
    })

    oldValue = {...effectFn()} // 防止与newValue引用同一对象
}