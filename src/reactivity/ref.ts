import {RefObj} from "types/reactivity";
import {reactive} from "reactivity/reactive";

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
class Ref<T = any> implements RefObj<T>{
    // 代理对象
    private readonly _value: DecoratedValue<T>

    constructor(value: T) {
        this._value = reactive(new DecoratedValue(value))
    }

    get value(): T {
        return this._value.value
    }

    set value(newValue: T) {
        this._value.value = newValue
    }

}

/**
 * 创建一个可代理原始值的响应式对象
 * @param value 响应式值,
 */
export function ref<T>(value: T): Ref<T> {
    return new Ref<T>(value)
}

