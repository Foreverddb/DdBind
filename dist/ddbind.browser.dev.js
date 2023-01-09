/*!
 * ddb's mvvm-learning-framework 
 * ddbind framework as a temporary name 
 * for Baidu's courses
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ddbind = factory());
})(this, (function () { 'use strict';

    function fuck(a) {
        return a + 'ddd';
    }

    var Test = /** @class */ (function () {
        function Test() {
        }
        Test.prototype.t = function () {
            return 'shit';
        };
        Test.prototype.b = function () {
            return 1;
        };
        return Test;
    }());
    console.log(Object.keys(Test.prototype));

    return fuck;

}));
