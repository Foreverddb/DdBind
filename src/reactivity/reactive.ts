import {track, trigger} from "core/effect";

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
            if (typeof res === 'object' && res !== null) {
                // 将对象的所有值进行响应式追踪
                for (const resKey in res) {
                    track(res, resKey)
                }
                return reactive(res)
            }
            track(target, p)
            return res
        },
        has(target: any, p: string | symbol): boolean {
            track(target, p)
            return Reflect.has(target, p)
        },
        ownKeys(target: any): ArrayLike<string | symbol> {
            track(target, Symbol('iterateKey')) // 设置一个与target关联的key
            return Reflect.ownKeys(target)
        },
        deleteProperty(target: any, p: string | symbol): boolean {
            const hasKey = Object.prototype.hasOwnProperty.call(target, p)
            const res = Reflect.deleteProperty(target, p)
            if (res && hasKey) {
                trigger(target, p, 'DELETE')
            }
            return res
        }
    }
}

/**
 * 创建一个响应式对象
 * @param value 响应式对象值
 */
export function reactive<T extends object>(value: T): T {
    return new Proxy(value, handler())
}