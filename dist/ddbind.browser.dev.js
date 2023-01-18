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

    var error;
    {
        error = function (msg, source) {
            console.error("[DdBind-error]: at ".concat(source, " \n ").concat(msg));
        };
    }

    /**
     * 解析HTML文本模版并转化为模版AST
     * @param template HTML文本
     */
    function parse(template) {
        // 解析器上下文对象
        var context = {
            source: template,
            mode: 0 /* ParserModes.DATA */,
            advanceBy: function (num) {
                // 消费指定数量字符
                context.source = context.source.slice(num);
            },
            trimSpaces: function () {
                // 匹配空白字符
                var match = /^[\t\r\n\f ]+/.exec(context.source);
                if (match) {
                    // 清除空白字符
                    context.advanceBy(match[0].length);
                }
            },
            trimEndSpaces: function () {
                context.source = context.source.trimEnd();
            }
        };
        // 先清除行首空白
        context.trimSpaces();
        context.trimEndSpaces();
        var nodes = parseChildren(context, []);
        return {
            type: 'Root',
            children: nodes
        };
    }
    /**
     * 解析某节点的子节点
     * @param context 上下文对象
     * @param parenStack 父节点栈
     */
    function parseChildren(context, parenStack) {
        var nodes = [];
        var mode = context.mode, source = context.source;
        while (!isEnd(context, parenStack)) {
            var node 
            // 仅*DATA模式支持解析标签节点
            = void 0;
            // 仅*DATA模式支持解析标签节点
            if (mode === 0 /* ParserModes.DATA */ || mode === 1 /* ParserModes.RCDATA */) {
                if (mode === 0 /* ParserModes.DATA */ && source[0] === '<') {
                    if (source[1] === '!') {
                        if (source.startsWith('<!--')) { // 注释标签开头
                            node = parseComment();
                        }
                        else if (source.startsWith('<![CDATA[')) { // CDATA标签
                            node = parseCDATA();
                        }
                    }
                    else if (source[1] === '/') { // 结束标签
                        error('invalid end tag in HTML.', source);
                        continue;
                    }
                    else if (/[a-z]/i.test(source[1])) {
                        node = parseElement(context, parenStack);
                    }
                }
                else if (source.startsWith('{{')) {
                    // 插值解析
                    node = parseInterpolation();
                }
            }
            // 若node不存在则说明处于非DATA模式，一律当作text处理
            if (!node) {
                node = parseText();
                context.advanceBy(1);
            }
            nodes.push(node);
        }
        return nodes;
    }
    /**
     * 校验是否解析到了文本末尾
     * @param context 上下文对象
     * @param parenStack 父节点栈
     */
    function isEnd(context, parenStack) {
        if (!context.source || context.source === '')
            return true;
        // 当存在最靠近栈顶的父节点与当前处理的结束标签一致时说明应停止当前状态机
        for (var i = parenStack.length - 1; i >= 0; i--) {
            var parent_1 = parenStack[i];
            if (parent_1 && context.source.startsWith("</".concat(parent_1.tag))) {
                return true;
            }
        }
        return false;
    }
    /**
     * 解析HTML标签的属性
     * @param context 上下文对象
     */
    function parseAttributes(context) {
        // TODO 完成标签属性解析
        return null;
    }
    /**
     * 解析HTML标签
     * @param context 上下文对象
     * @param type 标签类型
     */
    function parseTag(context, type) {
        if (type === void 0) { type = 'start'; }
        var advanceBy = context.advanceBy, trimSpaces = context.trimSpaces;
        // 根据标签类型使用不同的正则
        var match = type === 'start'
            ? /^<([a-z][^\t\r\n\f />]*)/i.exec(context.source)
            : /^<\/([a-z][^\t\r\n\f />]*)/i.exec(context.source);
        var tag = match[1]; // 匹配到的标签名称
        advanceBy(match[0].length); // 消费该标签内容
        trimSpaces();
        var props = parseAttributes();
        var isSelfClosing = context.source.startsWith('/>');
        advanceBy(isSelfClosing ? 2 : 1); // 自闭合标签则消费'/>'否则消费'>'
        return {
            type: 'Element',
            tag: tag,
            props: props,
            children: [],
            isSelfClosing: isSelfClosing
        };
    }
    /**
     * 解析HTML完整标签元素
     * @param context 上下文对象
     * @param parenStack 父节点栈
     */
    function parseElement(context, parenStack) {
        var element = parseTag(context);
        if (element.isSelfClosing)
            return element; // 自闭合标签无子节点，直接返回
        // 根据标签类型切换解析模式
        if (element.tag === 'textarea' || element.tag === 'title') {
            context.mode = 1 /* ParserModes.RCDATA */;
        }
        else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
            context.mode = 2 /* ParserModes.RAWTEXT */;
        }
        else {
            context.mode = 0 /* ParserModes.DATA */;
        }
        parenStack.push(element); // 作为父节点入栈
        element.children = parseChildren(context, parenStack);
        parenStack.pop(); // 解析完所有子元素即出栈
        if (context.source.startsWith("</".concat(element.tag))) {
            parseTag(context, 'end');
        }
        else {
            error("".concat(element.tag, " lacks the end tag."), context.source);
        }
        return element;
    }
    function parseComment(context) {
        return undefined;
    }
    function parseCDATA(context, parenStack) {
        return undefined;
    }
    function parseInterpolation(context) {
        return undefined;
    }
    function parseText(context) {
        return undefined;
    }

    var Compiler = /** @class */ (function () {
        function Compiler(el, vm) {
            this.$el = el;
            this.$vm = vm;
            if (this.$el) {
                this.compileElement(this.$el);
            }
        }
        Compiler.prototype.compileElement = function (el) {
            var source = el.innerHTML;
            var templateAst = parse(source);
            console.log(templateAst);
        };
        Compiler.prototype.compile = function () {
        };
        return Compiler;
    }());

    var DdBind = /** @class */ (function () {
        function DdBind(options) {
            this.$options = options;
        }
        /**
         * 将app挂载到指定dom上
         * @param el dom或selector
         */
        DdBind.prototype.mount = function (el) {
            var container;
            if (typeof el === 'string') {
                container = document.querySelector(el);
            }
            else {
                container = el || document.body;
            }
            this.$el = container;
            this.$compile = new Compiler(container, this); // 创建对应编译器
        };
        return DdBind;
    }());

    function createApp(options) {
        return new DdBind(options);
    }

    exports.createApp = createApp;

}));
