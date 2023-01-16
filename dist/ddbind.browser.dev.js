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

    /**
     * 创建一个渲染器
     */
    function createRenderer() {
        // 判断某个属性是否需要通过setAttribute方式设置
        function shouldSetAsDomProps(el, key, value) {
            if (key === 'form' && el.tagName === 'INPUT')
                return false;
            return key in el;
        }
        function mountElement(vnode, container) {
            var el = document.createElement(vnode.type);
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
                    var value = vnode.props[key];
                    if (shouldSetAsDomProps(el, key)) {
                        var type = typeof el[key];
                        if (type === 'boolean' && value === '') {
                            el[key] = true;
                        }
                        else {
                            el[key] = value;
                        }
                    }
                    else {
                        // 不存在于DOM properties的属于用此方法设置
                        el.setAttribute(key, vnode.props[key]);
                    }
                }
            }
            container.appendChild(el);
        }
        /**
         * 完成vnode的挂载更新
         * @param oldVNode 原vnode
         * @param newVNode 需要挂载更新的vnode
         * @param container 渲染容器
         */
        function patch(oldVNode, newVNode, container) {
            if (!oldVNode) {
                mountElement(newVNode, container); // 挂载vnode
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
                    container.innerHTML = ''; // 卸载原有vnode
                }
            }
            container._vnode = vnode;
        }
        return {
            render: render
        };
    }

    function test() {
        var renderer = createRenderer();
        var vnode = {
            type: 'div',
            children: [
                {
                    type: 'p',
                    children: 'fuck',
                    props: {
                        id: 'dd'
                    }
                },
                {
                    type: 'h1',
                    children: 'shit'
                }
            ]
        };
        renderer.render(vnode, document.querySelector('#app'));
    }

    exports.test = test;

}));
