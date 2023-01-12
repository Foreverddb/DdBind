import {track, trigger} from "core/index";



/**
 * 适用于非对象类型，构建响应式对象时用其作为装饰器
 */
class DecoratedValue<T> {
    value

    constructor(value) {
        this.value = value
    }
}

/**
 * 响应式数据代理类
 */
class ReactVal<T = any> {
    private readonly _value: DecoratedValue<T>
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
        let _proxy: T
        if (typeof value === 'object') {
            _proxy = new Proxy(value, this.handler)
        }
        this._value = new Proxy(new DecoratedValue(_proxy), this.handler)
    }

    get value(): T {
        if (typeof this._value.value === 'object') {
            this._value.value.toString = () => {
                return JSON.stringify(this._value.value)
            }
        }
        return this._value.value
    }

    set value(newValue: T) {
        if (this._value instanceof DecoratedValue) {
            this._value.value = newValue
        }
    }
}

/**
 * 创建一个响应式对象
 * @param value 响应式对象值
 */
export function ref<T>(value: T): ReactVal<T> {
    return new ReactVal<T>(value)
}

