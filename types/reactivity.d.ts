import {EffectFunction} from "./watchEffect";

declare module 'types/reactivity'

export type RefObj<T> =  {
    value: T

    _is_Ref_?: boolean
}

/**
 * 侦听属性的回调函数类型
 */
export interface WatchCallback<T> {
    (newValue: T, oldValue: T, onExpired: (fn: () => {}) => any): any
}

/**
 * 计算属性对象的value应为只读，其只能通过getter的返回值获取
 */
export class Computed<T = any> implements RefObj<T>{
    readonly value: T
}

export function reactive<T extends object>(value: T): T
export function ref<T>(value: T): RefObj<T>
export function proxyRefs<T extends object>(target: T): any
export function toRefs(target: object): object
export function toRef(target: object, key): RefObj<any>


export function watch<T>(target: T | (() => T) | RefObj<T>, callback: WatchCallback<T>)

export function computed<T>(getter: EffectFunction<T>): Computed<T>
