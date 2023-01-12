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
    var effectBucket = new WeakMap(); // 副作用函数桶
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
        effectFn.options = options;
        if (!options.isLazy) {
            effectFn();
        }
        return effectFn;
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
        if (!depsMap)
            return;
        var effects = depsMap.get(key);
        if (!effects)
            return;
        var effectsToRuns = new Set();
        effects.forEach(function (fn) {
            if (fn !== activeEffect) {
                effectsToRuns.add(fn);
            }
        });
        effectsToRuns.forEach(function (fn) {
            if (fn.options && fn.options.scheduler) {
                fn.options.scheduler(fn);
            }
            else {
                fn();
            }
        });
    }

    /**
     * 构建响应式对象时用其作为装饰器
     * 实现嵌套的响应式对象
     */
    var DecoratedValue = /** @class */ (function () {
        function DecoratedValue(value) {
            this.value = value;
        }
        return DecoratedValue;
    }());
    var handler = {
        set: function (target, p, newValue) {
            target[p] = newValue;
            trigger(target, p);
            return true;
        },
        get: function (target, p) {
            track(target, p);
            bindValueToString(target);
            return target[p];
        }
    };
    /**
     * 响应式数据代理类
     */
    var ReactVal = /** @class */ (function () {
        function ReactVal(value) {
            this.isTraversing = false;
            var _proxy;
            if (typeof value === 'object') {
                _proxy = new Proxy(toRefs(value), handler); // 原始值为对象则建立一个深层代理
            }
            else {
                _proxy = value;
            }
            this._value = new Proxy(new DecoratedValue(_proxy), handler); // 实现赋值新的原始值对象时可以得到响应
        }
        Object.defineProperty(ReactVal.prototype, "value", {
            get: function () {
                return this._value.value;
            },
            set: function (newValue) {
                if (this._value instanceof DecoratedValue) {
                    this._value.value = newValue;
                }
            },
            enumerable: false,
            configurable: true
        });
        return ReactVal;
    }());
    /**
     * 绑定新的toString()
     * @param target 需要绑定的对象
     */
    function bindValueToString(target) {
        target.toString = function () {
            return JSON.stringify(target); // 输出对象值而非[Object object]
        };
    }
    /**
     * 深层绑定对象内所有值为响应式
     * @param value 原始值对象
     */
    function toRefs(value) {
        for (var valueKey in value) {
            if (typeof value[valueKey] === 'object') {
                value[valueKey] = new Proxy(value[valueKey], handler);
                toRefs(value[valueKey]);
            }
        }
        return value;
    }
    /**
     * 创建一个响应式对象
     * @param value 响应式对象值
     */
    function ref(value) {
        return new ReactVal(value);
    }

    /**
     * 遍历对象属性使其绑定响应
     */
    function traverseRef(value, traversed) {
        if (traversed === void 0) { traversed = new Set(); }
        if (!value || typeof value !== 'object' || traversed.has(value))
            return;
        traversed.add(value);
        for (var valueKey in value) {
            traverseRef(value[valueKey], traversed);
        }
        return value;
    }
    /**
     * 注册一个侦听器
     * @param target 侦听对象
     * @param callback 对象值发生变化时执行的回调
     */
    function watch(target, callback) {
        effect(function () { return traverseRef(target.value); }, {
            scheduler: function (fn) {
                callback(target.value);
            }
        });
    }

    function test() {
        var b = ref({
            ary: [],
            text: 'aa'
        });
        watch(b, function (newValue) {
            console.log(b.value);
        });
        b.value.ary.push('fuck');
    }

    exports.test = test;

}));
