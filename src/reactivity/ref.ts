import {reactive} from "reactivity/reactive";
import {RefObj} from "types/reactivity";

/**
 * 创建一个基于响应式对象的保留其响应式能力的属性
 * @param target 目标响应式对象
 * @param key 目标键
 */
function toRef(target: object, key): RefObj<any> {
    const wrapper: RefObj<any> = {
        get value() {
            return target[key]
        },
        set value(val) {
            target[key] = val
        }
    }

    // 标识是否为ref对象
    Object.defineProperty(wrapper, '_is_Ref_', {
        value: true
    })

    return wrapper
}

/**
 * 响应式对象转换，使所有键都具有响应式能力
 * @param target 目标响应式对象
 */
export function toRefs(target: object) {
    const ret = {}
    for (const key in target) {
        ret[key] = toRef(target, key)
    }
    return ret
}

/**
 * 创建一个代理对象，在其中可以自动脱ref
 * @param target 目标对象
 */
export function proxyRefs<T extends object>(target: T): T {
    return new Proxy(target, {
        get(target: any, p: string | symbol, receiver: any): any {
            const value = Reflect.get(target, p, receiver)
            // console.log(target, p, value)
            return (value && value._is_Ref_) ? value.value : value // 若为ref型对象则返回其value
        },
        set(target: T, p: string | symbol, newValue: any, receiver: any): boolean {
            const value = target[p]
            if (value && value._is_Ref_) { // 若为ref型对象则设置其value
                value.value = newValue
                return true
            }
            return Reflect.set(target, p, newValue, receiver)
        }
    })
}

/**
 * 创建一个可以代理原始值的响应式数据对象
 * @param value 目标值
 */
export function ref<T>(value: T): RefObj<T> {
    const wrapper: RefObj<T> = {
        value: value
    }

    Object.defineProperty(wrapper, '_is_Ref_', {
        value: true
    })

    return reactive(wrapper)
}