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
        // if (type === 'ADD') {
        //     track(target, key)
        // }
        // depsMap = effectBucket.get(target)
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

    var reactiveMap = new Map();
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
                track(target, p);
                if (typeof res === 'object' && res !== null) {
                    // 为每个对象绑定追踪
                    for (var resKey in res) {
                        track(res, resKey);
                    }
                    return reactive(res);
                }
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
            },
        };
    }
    /**
     * 创建一个代理非原始值的响应式对象
     * @param value 响应式对象值
     */
    function reactive(value) {
        if ((typeof value !== "object" || value === null)) {
            error('reactive() requires an object parameter', value);
        }
        // 检查是否已创建了对应的代理对象，有则直接返回
        var existProxy = reactiveMap.get(value);
        if (existProxy)
            return existProxy;
        var proxy = new Proxy(value, handler());
        reactiveMap.set(value, proxy);
        return proxy;
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
    /**
     * 响应式数据代理类
     */
    var Ref = /** @class */ (function () {
        function Ref(value) {
            this._value = reactive(new DecoratedValue(value));
        }
        Object.defineProperty(Ref.prototype, "value", {
            get: function () {
                return this._value.value;
            },
            set: function (newValue) {
                this._value.value = newValue;
            },
            enumerable: false,
            configurable: true
        });
        return Ref;
    }());
    /**
     * 创建一个可代理原始值的响应式对象
     * @param value 响应式值,
     */
    function ref(value) {
        return new Ref(value);
    }

    var TextVnodeSymbol = Symbol('TextVnodeSymbol');
    var CommentVnodeSymbol = Symbol('CommentVnodeSymbol');

    var VnodeUtil = /** @class */ (function () {
        function VnodeUtil() {
        }
        VnodeUtil.builder = function () {
            return new VnodeBuilder();
        };
        return VnodeUtil;
    }());
    var VnodeImpl = /** @class */ (function () {
        function VnodeImpl() {
        }
        return VnodeImpl;
    }());
    var VnodeBuilder = /** @class */ (function () {
        function VnodeBuilder() {
        }
        VnodeBuilder.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        VnodeBuilder.prototype.setChildren = function (children) {
            this.children = children;
            return this;
        };
        VnodeBuilder.prototype.setProps = function (props) {
            this.props = props;
            return this;
        };
        VnodeBuilder.prototype.setEl = function (el) {
            this.el = el;
            return this;
        };
        VnodeBuilder.prototype.build = function () {
            var _this = this;
            var vnode = new VnodeImpl();
            Object.keys(this).forEach(function (key) {
                vnode[key] = _this[key];
            });
            return vnode;
        };
        return VnodeBuilder;
    }());

    /**
     * 创建一个渲染器
     */
    function createRenderer() {
        /**
         * 判断某个属性是否需要通过setAttribute方式设置
         * @param el 目标dom
         * @param key 目标属性名
         * @param value 属性值
         */
        function shouldSetAsDomProps(el, key, value) {
            if (key === 'form' && el.tagName === 'INPUT')
                return false;
            return key in el;
        }
        /**
         * 通过vnode为真实dom设置props
         * @param el 需要设置的dom
         * @param key 要设置的属性名
         * @param oldValue 旧属性值
         * @param newValue 新属性值
         */
        function patchProps(el, key, oldValue, newValue) {
            // 以on开头的属性视为事件
            if (/^on/.test(key)) {
                var eventName = key.slice(2).toLowerCase();
                var invokers = el._invokers || (el._invokers = {});
                var invoker_1 = invokers[eventName]; // 事件处理函数装饰器
                if (newValue) {
                    if (!invoker_1) {
                        // 原来无事件处理函数则注册新的
                        invoker_1 = el._invokers[eventName] = function (event) {
                            // 若事件触发事件早于绑定时间则不处理此事件
                            if (event.timeStamp < invoker_1.attachTime)
                                return;
                            // 处理存在多个事件处理函数的情况
                            if (Array.isArray(invoker_1.value)) {
                                invoker_1.value.forEach(function (fn) { return fn(event); });
                            }
                            else {
                                invoker_1.value(event);
                            }
                        };
                        invoker_1.value = newValue;
                        invoker_1.attachTime = performance.now(); // 记录此事件的绑定时间
                        el.addEventListener(eventName, invoker_1);
                    }
                    else {
                        // 若有事件处理函数则可直接更新
                        invoker_1.value = newValue;
                    }
                }
                else if (invoker_1) {
                    // 若新值无事件处理函数则清除原事件
                    el.removeEventListener(eventName, invoker_1);
                }
            }
            else if (key === 'class') {
                // 针对class属性进行处理
                el.className = newValue || '';
            }
            else if (key === 'style') {
                // 针对style属性进行处理
                if (Array.isArray(newValue)) {
                    for (var style in newValue) {
                        Object.assign(el.style, newValue[style]);
                    }
                }
                else {
                    Object.assign(el.style, newValue);
                }
            }
            else if (shouldSetAsDomProps(el, key)) {
                var type = typeof el[key];
                if (type === 'boolean' && newValue === '') { // 针对HTML attr中boolean型的属性进行处理
                    el[key] = true;
                }
                else {
                    el[key] = newValue;
                }
            }
            else {
                // 不存在于DOM properties的属于用此方法设置
                el.setAttribute(key, newValue);
            }
        }
        /**
         * 将vnode挂载到真实dom
         * @param vnode 需要挂载的vnode
         * @param container 挂载容器
         */
        function mountElement(vnode, container) {
            var el = vnode.el = document.createElement(vnode.type);
            // 将每个child挂载到真实dom
            if (typeof vnode.children === 'string') {
                el.textContent = vnode.children;
            }
            else if (Array.isArray(vnode.children)) {
                vnode.children.forEach(function (child) {
                    patch(null, child, el);
                });
            }
            // 为dom挂载attr
            if (vnode.props) {
                for (var key in vnode.props) {
                    patchProps(el, key, null, vnode.props[key]);
                }
            }
            container.insertBefore(el, null);
        }
        /**
         * 卸载vnode
         * @param vnode 需要卸载的vnode
         */
        function unmountElement(vnode) {
            var parent = vnode.el.parentNode;
            if (parent) {
                parent.removeChild(vnode.el);
            }
        }
        /**
         * 更新某节点的子节点
         * @param oldVNode 旧vnode
         * @param newVNode 新vnode
         * @param container
         */
        function updateElementChild(oldVNode, newVNode, container) {
            if (typeof newVNode.children === 'string') { // 新vnode的children为字符串的情况
                if (Array.isArray(oldVNode.children)) {
                    oldVNode.children.forEach(function (child) {
                        unmountElement(child);
                    });
                }
                container.textContent = newVNode.children;
            }
            else if (Array.isArray(newVNode.children)) { // 新vnode的children类型为一组组件的情况
                if (Array.isArray(oldVNode.children)) {
                    // 卸载后更新全部子节点
                    oldVNode.children.forEach(function (child) {
                        unmountElement(child);
                    });
                    newVNode.children.forEach(function (child) {
                        patch(null, child, container);
                    });
                }
                else {
                    container.textContent = '';
                    newVNode.children.forEach(function (child) {
                        patch(null, child, container);
                    });
                }
            }
            else { // 若新子节点不存在则挨个卸载
                if (Array.isArray(oldVNode.children)) {
                    oldVNode.children.forEach(function (child) {
                        unmountElement(child);
                    });
                }
                else if (typeof oldVNode.children === 'string') {
                    container.textContent = '';
                }
            }
        }
        /**
         * 更新修补vnode并重新挂载
         * @param oldVNode
         * @param newVNode
         */
        function updateElement(oldVNode, newVNode) {
            var el = newVNode.el = oldVNode.el;
            var oldProps = oldVNode.props;
            var newProps = newVNode.props;
            // 更新props
            for (var key in newProps) {
                if (newProps[key] !== oldProps[key]) {
                    patchProps(el, key, oldProps[key], newProps[key]);
                }
            }
            // 清除新vnode中不存在的老prop
            for (var key in oldProps) {
                if (!(key in newProps)) {
                    patchProps(el, key, oldProps[key], null);
                }
            }
            // 更新子节点
            updateElementChild(oldVNode, newVNode, el);
        }
        /**
         * 完成vnode的挂载更新
         * @param oldVNode 原vnode
         * @param newVNode 需要挂载更新的vnode
         * @param container 渲染容器
         */
        function patch(oldVNode, newVNode, container) {
            // 若新旧vnode类型不同，则卸载并重新挂载
            if (oldVNode && oldVNode.type !== newVNode.type) {
                unmountElement(oldVNode);
                oldVNode = null;
            }
            var vnodeType = typeof newVNode.type;
            if (vnodeType === 'string') { // vnode为普通标签
                if (!oldVNode) {
                    mountElement(newVNode, container); // 挂载vnode
                }
                else {
                    updateElement(oldVNode, newVNode); // 更新vnode
                }
            }
            else if (vnodeType === 'object') ;
            else if (vnodeType === 'symbol') { // 标准普通标签以外的标签
                if (newVNode.type === TextVnodeSymbol) { // 文本节点
                    if (typeof newVNode.children !== 'string') {
                        error("text node requires children being type of \"string\", received type ".concat(typeof newVNode.children), newVNode);
                    }
                    if (!oldVNode) {
                        var el = newVNode.el = document.createTextNode(newVNode.children);
                        container.insertBefore(el, null);
                    }
                    else { // 若原节点存在则更新
                        var el = newVNode.el = oldVNode.el;
                        if (newVNode.children !== oldVNode.children) {
                            el.nodeValue = newVNode.children;
                        }
                    }
                }
                else if (newVNode.type === CommentVnodeSymbol) ;
            }
        }
        /**
         * 渲染vnode到真实dom
         * @param vnode 虚拟dom
         * @param container 渲染容器
         */
        function render(vnode, container) {
            if (vnode) {
                patch(container._vnode, vnode, container); // 挂载或更新vnode
            }
            else {
                if (container._vnode) {
                    unmountElement(container._vnode); // 卸载原有vnode
                }
            }
            container._vnode = vnode;
        }
        return {
            render: render
        };
    }

    function test() {
        var a = ref(false);
        var renderer = createRenderer();
        effect(function () {
            ({
                type: 'div',
                props: a.value ? {
                    onClick: function () {
                        console.log('parent');
                    }
                } : {},
                children: [{
                        type: 'button',
                        children: 'btn'
                    }]
            });
            var vnode2 = {
                type: 'span',
                props: {
                    onClick: function () {
                        console.log('parent');
                    }
                },
                children: [
                    {
                        type: 'h1',
                        children: 'fuck'
                    },
                    {
                        type: 'p',
                        children: 'shit'
                    }
                ]
            };
            var vnode3 = VnodeUtil.builder().setType('h1').setChildren('fuckme').build();
            renderer.render(vnode3, document.querySelector('#app'));
            setTimeout(function () {
                renderer.render(vnode2, document.querySelector('#app'));
            }, 1000);
        });
    }

    exports.test = test;

}));
