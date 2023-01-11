import {activeEffect, EffectFunction} from "core/effect/effect";

/**
 * 仅用于标识响应式对象的副作用函数依赖map类型
 */
interface DepsMap extends Map<string | symbol, Set<EffectFunction>> {
}

/**
 * 适用于非对象类型，构建响应式对象时用其作为装饰器
 */
class DecoratedObject<T> {
    _value

    constructor(value) {
        this._value = value
    }
}

const effectBucket: WeakMap<any, DepsMap> = new WeakMap() // 副作用函数桶

class ReactVal<T = any> {
    _value: T
    private handler: ProxyHandler<any> = {
        set(target: any, p: string | symbol, newValue: any): boolean {
            target[p] = newValue
            trigger(target, p)
            return true
        },
        get(target: any, p: string | symbol): any {
            track(target, p)
            return target[p]
        }
    }

    constructor(value: T) {
        this._value = new Proxy(value, this.handler)
    }

    get value(): T {
        if (this._value instanceof DecoratedObject) {
            return this._value._value
        } else return this._value
    }

    set value(newValue: T) {
        if (this._value instanceof DecoratedObject) this._value._value = newValue
        else this._value = newValue
    }
}

/**
 * 创建一个响应式对象
 * @param value 响应式对象值
 */
export function ref<T extends object>(value: T): ReactVal<T>; // 帮助判断响应式值的类型
export function ref<T extends any>(value: T): ReactVal;
export function ref<T>(value: T): ReactVal<T> | ReactVal {
    if (typeof value === 'object') return new ReactVal<T>(value)
    else return new ReactVal(new DecoratedObject<T>(value))
}

/**
 * 追踪并绑定副作用函数
 * @param target 绑定对象
 * @param key 绑定key
 */
function track(target: any, key: string | symbol) {
    if (!activeEffect) return

    let depsMap = effectBucket.get(target)
    if (!depsMap) {
        effectBucket.set(target, (depsMap = new Map()))
    }

    let effects = depsMap.get(key)
    if (!effects) {
        depsMap.set(key, (effects = new Set<EffectFunction>()))
    }
    effects.add(activeEffect)
    activeEffect.deps.push(effects)
}

/**
 * 触发执行副作用函数
 * @param target 绑定对象
 * @param key 绑定key
 */
function trigger(target: any, key: string | symbol) {
    let depsMap = effectBucket.get(target)
    const effects = depsMap.get(key)
    const effectsToRuns: Set<EffectFunction> = new Set()
    effects.forEach((fn) => {
        if (fn !== activeEffect) {
            effectsToRuns.add(fn)
        }
    })
    effectsToRuns.forEach((fn) => {
        fn()
    })
}