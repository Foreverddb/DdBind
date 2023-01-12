/**
 * 副作用函数的执行选项结构
 */
export interface EffectOption {
    isLazy?: boolean,
    scheduler?: (func: EffectFunction) => any
}

/**
 * 副作用函数结构
 */
export interface EffectFunction<T = any> extends Function {
    (): T

    deps?: Array<Set<EffectFunction>>

    options?: EffectOption
}

/**
 * 仅用于标识响应式对象的副作用函数依赖map类型
 */
interface DepsMap extends Map<string | symbol, Set<EffectFunction>> {}

let activeEffect: EffectFunction // 当前激活的副作用函数
const effectBucket: WeakMap<any, DepsMap> = new WeakMap() // 副作用函数桶
const effectStack: Array<EffectFunction> = [] // 副作用函数运行栈，避免嵌套副作用函数占用activeEffect的问题

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
export function trigger(target: any, key: string | symbol) {
    let depsMap = effectBucket.get(target)
    if (!depsMap) return

    const effects = depsMap.get(key)
    if (!effects) return

    const effectsToRuns: Set<EffectFunction> = new Set()
    effects.forEach((fn) => {
        if (fn !== activeEffect) {
            effectsToRuns.add(fn)
        }
    })
    effectsToRuns.forEach((fn) => {
        if (fn.options && fn.options.scheduler) {
            fn.options.scheduler(fn)
        } else {
            fn()
        }
    })
}