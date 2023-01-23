import {Container, Invoker} from "types/renderer";

/**
 * 判断某个属性是否需要通过setAttribute方式设置
 * @param el 目标dom
 * @param key 目标属性名
 * @param value 属性值
 */
export function shouldSetAsDomProps(el: Container, key: string, value: any): boolean {
    if (key === 'form' && el.tagName === 'INPUT') return false
    return key in el
}

/**
 * 通过vnode为真实dom设置props
 * @param el 需要设置的dom
 * @param key 要设置的属性名
 * @param oldValue 旧属性值
 * @param newValue 新属性值
 */
export function patchProps(el: Container, key: string, oldValue: any, newValue: any) {
    // 以on开头的属性视为事件
    if (/^on/.test(key)) {
        const eventName = key.slice(2).toLowerCase()
        const invokers = el._invokers || (el._invokers = {})
        let invoker: Invoker = invokers[eventName] // 事件处理函数装饰器

        if (newValue) {
            if (!invoker) {
                // 原来无事件处理函数则注册新的
                invoker = el._invokers[eventName] = (event: Event) => {
                    // 若事件触发事件早于绑定时间则不处理此事件
                    if (event.timeStamp < invoker.attachTime) return
                    // 处理存在多个事件处理函数的情况
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(event))
                    } else {
                        invoker.value(event)
                    }
                }
                invoker.value = newValue
                // 记录此事件的绑定时间
                invoker.attachTime = performance.now()
                el.addEventListener(eventName, invoker)
            } else {
                // 若有事件处理函数则可直接更新
                invoker.value = newValue
            }
        } else if (invoker) {
            // 若新值无事件处理函数则清除原事件
            el.removeEventListener(eventName, invoker)
        }
    } else if (key === 'class') {
        // 针对class属性进行处理
        el.className = newValue || ''
    } else if (key === '_style_') {
        // 针对style动态属性进行处理
        if (Array.isArray(newValue)) {
            for (const style in newValue) {
                Object.assign(el.style, newValue[style])
            }
        } else if (typeof newValue === 'object'){
            Object.assign(el.style, newValue)
        }
    } else if (key === '_class_') {
        // 针对class动态属性进行处理
        if (Array.isArray(newValue)) {
            for (const classKey in newValue) {
                el.classList.add(newValue[classKey])
            }
        } else {
            el.classList.add(newValue)
        }
    } else if (shouldSetAsDomProps(el, key, newValue)) {
        const type = typeof el[key]
        // 针对HTML attr中boolean型的属性进行处理
        if (type === 'boolean' && newValue === '') {
            el[key] = true
        } else {
            el[key] = newValue
        }
    } else {
        // 不存在于DOM properties的属于用此方法设置
        el.setAttribute(key, newValue)
    }
}