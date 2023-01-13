import {Reactivity} from "types/reactivity";
import {handler} from "reactivity/reactive";

/**
  * 为所有代理对象绑定新的toString()
  */
Object.prototype.toString = function () {
    return JSON.stringify(this) // 输出对象值而非[Object object]
}
/**
 * 构建响应式对象时用其作为装饰器
 * 实现嵌套的响应式对象
 */
class DecoratedValue<T> {
    // 原始对象
    value

    constructor(value) {
        this.value = value
    }
}

/**
 * 响应式数据代理类
 */
class Ref<T = any> implements Reactivity<T>{
    // 代理对象
    private readonly _value: DecoratedValue<T>

    constructor(value: T) {
        let _proxy: T
        if (typeof value === 'object') {
            _proxy = new Proxy(toRefs(value), handler()) // 原始值为对象则建立一个深层代理
        } else {
            _proxy = value
        }
        this._value = new Proxy(new DecoratedValue(_proxy), handler()) // 实现赋值新的原始值对象时可以得到响应
    }

    get value(): T {
        return this._value.value
    }

    set value(newValue: T) {
        if (this._value instanceof DecoratedValue) {
            this._value.value = newValue
        }
    }
}

/**
 * 深层绑定对象内所有值为响应式
 * @param value 原始值对象
 */
function toRefs<T>(value: T): T {
    for (const valueKey in value) {
        if (typeof value[valueKey] === 'object') {
            value[valueKey] = new Proxy(value[valueKey], handler())
            toRefs(value[valueKey])
        }
    }
    return value
}

/**
 * 创建一个响应式对象
 * @param value 响应式对象值
 */
export function ref<T>(value: T): Ref<T> {
    return new Ref<T>(value)
}

