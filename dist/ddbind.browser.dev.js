/*!
 * ddb's mvvm-learning-framework 
 * ddbind framework as a temporary name 
 * for Baidu's courses
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DdBind = {}));
})(this, (function (exports) { 'use strict';

    var activeEffect; // 当前激活的副作用函数
    var effectStack = []; // 副作用函数运行栈，避免嵌套副作用函数占用activeEffect的问题
    /**
     * 清除原有依赖关系
     * @param effectFn 副作用函数
     */
    function cleanup(effectFn) {
        effectFn.deps.forEach(function (value) {
            value.delete(effectFn);
        });
        effectFn.deps.length = 0;
    }
    /**
     * 注册副作用函数
     * @param func 副作用函数
     * @param options 副作用函数的执行选项
     */
    function effect(func, options) {
        if (options === void 0) { options = {}; }
        var effectFn = function () {
            cleanup(effectFn);
            activeEffect = effectFn;
            effectStack.push(effectFn);
            var res = func();
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
            return res;
        };
        effectFn.deps = [];
        if (!options.isLazy) {
            effectFn();
        }
        return effectFn;
    }

    /**
     * 适用于非对象类型，构建响应式对象时用其作为装饰器
     */
    var DecoratedObject = /** @class */ (function () {
        function DecoratedObject(value) {
            this._value = value;
        }
        return DecoratedObject;
    }());
    var effectBucket = new WeakMap(); // 副作用函数桶
    var ReactVal = /** @class */ (function () {
        function ReactVal(value) {
            this.handler = {
                set: function (target, p, newValue) {
                    target[p] = newValue;
                    trigger(target, p);
                    return true;
                },
                get: function (target, p) {
                    track(target, p);
                    return target[p];
                }
            };
            this._value = new Proxy(value, this.handler);
        }
        Object.defineProperty(ReactVal.prototype, "value", {
            get: function () {
                if (this._value instanceof DecoratedObject) {
                    return this._value._value;
                }
                else
                    return this._value;
            },
            set: function (newValue) {
                if (this._value instanceof DecoratedObject)
                    this._value._value = newValue;
                else
                    this._value = newValue;
            },
            enumerable: false,
            configurable: true
        });
        return ReactVal;
    }());
    function ref(value) {
        if (typeof value === 'object')
            return new ReactVal(value);
        else
            return new ReactVal(new DecoratedObject(value));
    }
    /**
     * 追踪并绑定副作用函数
     * @param target 绑定对象
     * @param key 绑定key
     */
    function track(target, key) {
        if (!activeEffect)
            return;
        var depsMap = effectBucket.get(target);
        if (!depsMap) {
            effectBucket.set(target, (depsMap = new Map()));
        }
        var effects = depsMap.get(key);
        if (!effects) {
            depsMap.set(key, (effects = new Set()));
        }
        effects.add(activeEffect);
        activeEffect.deps.push(effects);
    }
    /**
     * 触发执行副作用函数
     * @param target 绑定对象
     * @param key 绑定key
     */
    function trigger(target, key) {
        var depsMap = effectBucket.get(target);
        var effects = depsMap.get(key);
        var effectsToRuns = new Set();
        effects.forEach(function (fn) {
            if (fn !== activeEffect) {
                effectsToRuns.add(fn);
            }
        });
        effectsToRuns.forEach(function (fn) {
            fn();
        });
    }

    /**
     * 创建一个计算属性
     * @param getter 计算属性方法
     */
    function computed(getter) {
        var effectFn = effect(getter, {
            isLazy: true
        });
        var obj = {
            get value() {
                return effectFn();
            }
        };
        return obj;
    }

    function test() {
        var b = ref({
            text: 'a'
        });
        var a = computed(function () {
            return b.value + 'b';
        });
        console.log(a.value);
        console.log(a.value);
        effect(function () {
            document.getElementById('app').innerText = a.value;
        });
    }

    exports.test = test;

}));
