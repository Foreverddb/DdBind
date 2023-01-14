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
    var iterateBucket = new WeakMap(); // 代理的迭代对象的key值桶
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
        if (typeof key === 'symbol') {
            iterateBucket.set(target, key);
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
     * @param type 对代理对象的操作类型(SET/GET/DELETE等)
     */
    function trigger(target, key, type) {
        var depsMap = effectBucket.get(target);
        if (!depsMap)
            return;
        var effects = depsMap.get(key);
        var effectsToRuns = new Set();
        effects && effects.forEach(function (fn) {
            if (fn !== activeEffect) {
                effectsToRuns.add(fn);
            }
        });
        if (type === 'ADD' && Array.isArray(target)) {
            var lengthEffects = depsMap.get('length');
            lengthEffects && lengthEffects.forEach(function (fn) {
                if (fn != activeEffect) {
                    effectsToRuns.add(fn);
                }
            });
        }
        // 当增加或删除属性时触发迭代时注册的副作用函数
        if (type === 'ADD' || type === 'DELETE') {
            var iterateKey = iterateBucket.get(target);
            iterateKey && depsMap.get(iterateKey).forEach(function (fn) {
                if (fn !== activeEffect) {
                    effectsToRuns.add(fn);
                }
            });
        }
        effectsToRuns.forEach(function (fn) {
            if (fn.options && fn.options.scheduler) {
                fn.options.scheduler(fn);
            }
            else {
                fn();
            }
        });
    }

    var error;
    {
        error = function (msg, source) {
            console.error("[DdBind-error]: at ".concat(source, " \n ").concat(msg));
        };
    }

    /**
     * 为所有代理对象与数组绑定新的toString()
     */
    Object.prototype.toString = function () {
        return JSON.stringify(this); // 输出对象值而非[Object object]
    };
    Array.prototype.toString = function () {
        return JSON.stringify(this);
    };
    /**
     * 获取一个唯一的代理handler
     */
    function handler() {
        return {
            set: function (target, p, newValue, receiver) {
                var oldValue = target[p];
                // 对set对类型进行针对常规对象和数组的优化
                var type = Array.isArray(target)
                    ? (Number(p) < target.length ? 'SET' : 'ADD')
                    : (Object.prototype.hasOwnProperty.call(target, p) ? 'SET' : 'ADD');
                var res = Reflect.set(target, p, newValue, receiver);
                // 只有当值发生变化时才更新
                if (oldValue !== newValue && (oldValue === oldValue || newValue === newValue)) {
                    trigger(target, p, type);
                }
                return res;
            },
            get: function (target, p, receiver) {
                var res = Reflect.get(target, p, receiver);
                if (typeof res === 'object' && res !== null) {
                    // 将对象的所有值进行响应式追踪
                    for (var resKey in res) {
                        track(res, resKey);
                    }
                    return reactive(res);
                }
                track(target, p);
                return res;
            },
            has: function (target, p) {
                track(target, p);
                return Reflect.has(target, p);
            },
            ownKeys: function (target) {
                track(target, Array.isArray(target) ? 'length' // 若遍历对象为数组则可直接代理length属性
                    : Symbol('iterateKey')); // 设置一个与target关联的key
                return Reflect.ownKeys(target);
            },
            deleteProperty: function (target, p) {
                var hasKey = Object.prototype.hasOwnProperty.call(target, p);
                var res = Reflect.deleteProperty(target, p);
                if (res && hasKey) {
                    trigger(target, p, 'DELETE');
                }
                return res;
            }
        };
    }
    /**
     * 创建一个响应式对象
     * @param value 响应式对象值
     */
    function reactive(value) {
        if ((typeof value !== "object" || value === null)) {
            error('reactive() requires an object parameter', value);
        }
        return new Proxy(value, handler());
    }

    function test() {
        var b = reactive(null);
        // watch(b, (newValue, oldValue) => {
        //     console.log(newValue)
        // })
        effect(function () {
            console.log(b.toString());
        });
        b.push('ss');
        b[0] = 'sio';
        b.length = 100;
        b.length = 10;
    }

    exports.test = test;

}));
