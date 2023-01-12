import {effect, EffectFunction, track, trigger} from "core/index";
import {Reactivity} from "types/reactivity";

/**
 * 计算属性对象的value应为只读，其只能通过getter的返回值获取
 */
interface Computed<T = any> extends Reactivity<T>{
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
            trigger(obj, 'value') // 因为执行副作用函数模式为懒加载，当依赖的响应式数据发送变化时需手动触发其副作用函数
        }
    })

    const obj = {
        get value() {
            if (dirty) {
                buffer = effectFn()
                dirty = false
            }
            track(obj, 'value') // 添加依赖的响应式对象到计算属性的依赖
            return buffer
        }
    }

    return obj
}