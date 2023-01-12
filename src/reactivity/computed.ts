import {effect, EffectFunction, track, trigger} from "core/index";

interface Computed<T = any> {
    readonly value: T
}

/**
 * 创建一个计算属性
 * @param getter 计算属性方法
 */
export function computed<T>(getter: EffectFunction<T>): Computed<T> {
    let buffer: T // 缓存上一次计算值
    let dirty: boolean = true // 脏值flag，脏值检测依赖的是响应式数据Proxy

    const effectFn = effect(getter, {
        isLazy: true,
        // 当依赖的响应式数据发生变化时刷新缓存
        scheduler: () => {
            dirty = true
            trigger(obj, 'value')
        }
    })

    const obj = {
        get value() {
            if (dirty) {
                buffer = effectFn()
                dirty = false
            }
            track(obj, 'value')
            return buffer
        }
    }

    return obj
}