import {DepsMap, EffectFunction, EffectOption} from "types/effect";

let activeEffect: EffectFunction // 当前激活的副作用函数
const effectBucket: WeakMap<any, DepsMap> = new WeakMap() // 副作用函数桶
const effectStack: Array<EffectFunction> = [] // 副作用函数运行栈，避免嵌套副作用函数占用activeEffect的问题
const iterateBucket: WeakMap<any, symbol> = new WeakMap() // 代理的迭代对象的key值桶

/**
 * 清除原有依赖关系
 * @param effectFn 副作用函数
 */
function cleanup(effectFn: EffectFunction) {
    effectFn.deps.forEach((value) => {
        value.delete(effectFn)
    })
    effectFn.deps.length = 0
}

/**
 * 注册副作用函数
 * @param func 副作用函数
 * @param options 副作用函数的执行选项
 */
export function effect(func: () => any, options: EffectOption = {}): EffectFunction {
    const effectFn: EffectFunction = () => {
        cleanup(effectFn)

        activeEffect = effectFn
        effectStack.push(effectFn)
        const res = func()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]

        return res
    }
    effectFn.deps = []
    effectFn.options = options
    if (!options.isLazy) {
        effectFn()
    }
    return effectFn
}

/**
 * 追踪并绑定副作用函数
 * @param target 绑定对象
 * @param key 绑定key
 */
export function track(target: any, key: string | symbol) {
    if (!activeEffect) return

    let depsMap = effectBucket.get(target)
    if (!depsMap) {
        effectBucket.set(target, (depsMap = new Map()))
    }

    if (typeof key === 'symbol') {
        iterateBucket.set(target, key)
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
 * @param type 对代理对象的操作类型(SET/GET/DELETE等)
 */
export function trigger(target: any, key: string | symbol, type?: string) {
    let depsMap = effectBucket.get(target)
    if (!depsMap) return

    // if (type === 'ADD') {
    //     track(target, key)
    // }
    // depsMap = effectBucket.get(target)

    const effects = depsMap.get(key)

    const effectsToRuns: Set<EffectFunction> = new Set()
    effects && effects.forEach((fn) => {
        if (fn !== activeEffect) {
            effectsToRuns.add(fn)
        }
    })

    if (type === 'ADD' && Array.isArray(target)) {
        const lengthEffects = depsMap.get('length')
        lengthEffects && lengthEffects.forEach(fn => {
            if (fn != activeEffect) {
                effectsToRuns.add(fn)
            }
        })
    }

    // 当增加或删除属性时触发迭代时注册的副作用函数
    if (type === 'ADD' || type === 'DELETE') {
        const iterateKey: symbol = iterateBucket.get(target)
        iterateKey && depsMap.get(iterateKey).forEach((fn) => {
            if (fn !== activeEffect) {
                effectsToRuns.add(fn)
            }
        })
    }

    effectsToRuns.forEach((fn) => {
        if (fn.options && fn.options.scheduler) {
            fn.options.scheduler(fn)
        } else {
            fn()
        }
    })
}