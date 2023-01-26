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
export interface DepsMap extends Map<string | symbol, Set<EffectFunction>> {}

export function watchEffect(func: () => any, options: EffectOption): EffectFunction
