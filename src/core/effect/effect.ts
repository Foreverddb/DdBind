export let activeEffect: EffectFunction // 当前激活的副作用函数
const effectStack: Array<EffectFunction> = [] // 副作用函数运行栈，避免嵌套副作用函数占用activeEffect的问题
/**
 * 副作用函数的执行选项结构
 */
export interface EffectOption {
    isLazy?: boolean,
    scheduler?: (func: () => any) => any
}

/**
 * 副作用函数结构
 */
export interface EffectFunction<T = any> extends Function {
    (): T

    deps?: Array<Set<EffectFunction>>
}

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
    if (!options.isLazy) {
        effectFn()
    }
    return effectFn
}