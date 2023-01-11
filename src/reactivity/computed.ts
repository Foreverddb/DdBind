import {effect, EffectFunction} from "core/index";

interface Computed<T = any> {
    readonly value: T
}

/**
 * 创建一个计算属性
 * @param getter 计算属性方法
 */
export function computed<T>(getter: EffectFunction<T>): Computed<T> {
    const effectFn = effect(getter, {
        isLazy: true
    })

    const obj = {
        get value() {
            return effectFn()
        }
    }

    return obj
}