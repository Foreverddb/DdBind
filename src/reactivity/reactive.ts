import {track, trigger} from "core/effect";
import {error} from "../utils/debug";

const reactiveMap: Map<object, object> = new Map()

/**
 * 为所有代理对象与数组绑定新的toString()
 */
Object.prototype.toString = function () {
    return JSON.stringify(this) // 输出对象值而非[Object object]
}
Array.prototype.toString = function () {
    return JSON.stringify(this)
}

/**
 * 获取一个唯一的代理handler
 */
export function handler(): ProxyHandler<any> {
    return {
        set(target: any, p: string | symbol, newValue: any, receiver: any): boolean {
            const oldValue = target[p]

            // 对set对类型进行针对常规对象和数组的优化
            const type: string = Array.isArray(target)
                ? (Number(p) < target.length ? 'SET' : 'ADD')
                : (Object.prototype.hasOwnProperty.call(target, p) ? 'SET' : 'ADD')
            const res = Reflect.set(target, p, newValue, receiver)

            // 只有当值发生变化时才更新
            if (oldValue !== newValue && (oldValue === oldValue || newValue === newValue)) {
                trigger(target, p, type)
            }

            return res
        },
        get(target: any, p: string | symbol, receiver: any): any {
            const res = Reflect.get(target, p, receiver)
            track(target, p)
            if (typeof res === 'object' && res !== null) {
                // 为每个对象绑定追踪
                for (const resKey in res) {
                    track(res, resKey)
                }
                return reactive(res)
            }
            return res
        },
        has(target: any, p: string | symbol): boolean {
            track(target, p)
            return Reflect.has(target, p)
        },
        ownKeys(target: any): ArrayLike<string | symbol> {
            track(target, Array.isArray(target) ? 'length' // 若遍历对象为数组则可直接代理length属性
                : Symbol('iterateKey')) // 设置一个与target关联的key
            return Reflect.ownKeys(target)
        },
        deleteProperty(target: any, p: string | symbol): boolean {
            const hasKey = Object.prototype.hasOwnProperty.call(target, p)
            const res = Reflect.deleteProperty(target, p)
            if (res && hasKey) {
                trigger(target, p, 'DELETE')
            }
            return res
        },

    }
}

/**
 * 创建一个代理非原始值的响应式对象
 * @param value 响应式对象值
 */
export function reactive<T extends object>(value: T): T {
    if (__DEV__ && (typeof value !== "object" || value === null)) {
        error('reactive() requires an object parameter', value)
    }
    // 检查是否已创建了对应的代理对象，有则直接返回
    const existProxy = reactiveMap.get(value)
    if (existProxy) return existProxy as T

    const proxy = new Proxy(value, handler())
    reactiveMap.set(value, proxy)

    return proxy
}