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