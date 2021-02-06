/*---------------------------------------------------------------------------*
 * Torigoya_Tween.js
 *---------------------------------------------------------------------------*
 * 2016/11/10 ru_shalm
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc [Base] Tween-animation Engine
 * @author ru_shalm
 * @help
 *   This plugin is a base-plugin for Torigoya plugins.
 */

/*:ja
 * @plugindesc [ベースプラグイン] Tweenアニメーション
 * @author ru_shalm
 * @help
 * このプラグインはベースプラグインです。
 * このプラグインを導入しただけでは特に何も起きません。
 */

(function (global) {
    'use strict';

    var Tween = {
        name: 'Torigoya_Tween'
    };

    // -------------------------------------------------------------------------
    // Animator

    function Animator() {
        this.initialize.apply(this, arguments);
    }

    Animator.prototype.initialize = function (obj, initialParams) {
        this._obj = obj;
        this._stack = [];
        this._reset();
        if (initialParams) {
            var keys = Object.keys(initialParams);
            for (var i = 0; i < keys.length; ++i) {
                this._obj[keys[i]] = initialParams[keys[i]];
            }
        }
    };

    Animator.prototype.to = function (finishParams, duration, easingFunc) {
        this._stack.push({
            finishParams: finishParams,
            duration: duration,
            easingFunc: easingFunc || Tween.Easing.linear
        });
        return this;
    };

    Animator.prototype.wait = function (duration) {
        this._stack.push({
            finishParams: {},
            easingFunc: Tween.Easing.linear,
            duration: duration
        });
        return this;
    };

    Animator.prototype.onComplete = function (func) {
        this._callback = func;
        return this;
    };

    Animator.prototype.start = function () {
        if (this.__init()) Tween.$animatorList.push(this);
        return this;
    };

    Animator.prototype._reset = function () {
        this._finishParams = {};
        this._easingFunc = null;
        this._callback = null;
        this._duration = 0;
        this._timer = 0;
    };

    Animator.prototype.__init = function () {
        var item = this._stack.shift();
        if (item) {
            this._startParams = {};
            this._finishParams = item.finishParams;
            this._easingFunc = item.easingFunc;
            this._duration = item.duration;
            this._timer = 0;
            var keys = Object.keys(this._finishParams);
            for (var i = 0; i < keys.length; ++i) {
                this._startParams[keys[i]] = this._obj[keys[i]];
            }
            return true;
        } else {
            if (this._callback) Tween.$callbackList.push(this._callback);
            return false;
        }
    };

    Animator.prototype.__update = function () {
        var n = this._easingFunc(this._timer / this._duration);
        var keys = Object.keys(this._finishParams);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            this._obj[key] = this._startParams[key] + (this._finishParams[key] - this._startParams[key]) * n;
        }
        if (this._timer < this._duration) {
            this._timer++;
            return true;
        } else {
            return this.__init();
        }
    };

    Tween.Animator = Animator;

    // -------------------------------------------------------------------------
    // Easing functions

    Tween.Easing = {
        linear: function (n) {
            return n;
        },
        easeInSine: function (n) {
            return 1 - Math.cos(n * Math.PI / 2);
        },
        easeOutSine: function (n) {
            return Math.sin(n * Math.PI / 2);
        },
        easeInOutSine: function (n) {
            return (1 - Math.cos(n * Math.PI)) / 2;
        },
        easeInQuad: function (n) {
            return n * n;
        },
        easeOutQuad: function (n) {
            return n * (2 - n);
        },
        easeInOutQuad: function (n) {
            n *= 2;
            if (n < 1) {
                return n * n / 2;
            } else {
                --n;
                return (1 + n * (2 - n)) / 2;
            }
        },
        easeInCubic: function (n) {
            return n * n * n;
        },
        easeOutCubic: function (n) {
            --n;
            return (n * n * n + 1);
        },
        easeInOutCubic: function (n) {
            n *= 2;
            if (n < 1) {
                return n * n * n / 2;
            } else {
                n -= 2;
                return (n * n * n + 2) / 2;
            }
        },
        easeInCircular: function (n) {
            return 1 - Math.sqrt(1 - n * n);
        },
        easeOutCircular: function (n) {
            n--;
            return Math.sqrt(1 - n * n);
        },
        easeInOutCircular: function (n) {
            n *= 2;
            if (n < 1) {
                return -(Math.sqrt(1 - n * n) - 1) / 2;
            } else {
                n -= 2;
                return (Math.sqrt(1 - n * n) + 1) / 2;
            }
        }
    };

    // -------------------------------------------------------------------------
    // Manager

    Tween.create = function (obj, initialParams) {
        return new Tween.Animator(obj, initialParams);
    };

    Tween.$animatorList = [];
    Tween.$callbackList = [];

    Tween.__update = function () {
        if (Tween.$animatorList.length > 0) {
            Tween.$animatorList = Tween.$animatorList.filter(function (tween) {
                return tween.__update();
            });
        }
        while (Tween.$callbackList.length > 0) {
            Tween.$callbackList.shift()();
        }
    };

    // -------------------------------------------------------------------------
    // Alias

    (function () {
        var upstream_updateScene = SceneManager.updateScene;
        SceneManager.updateScene = function () {
            upstream_updateScene.apply(this);
            if (this._scene) Tween.__update();
        };
    })();

    // -------------------------------------------------------------------------
    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.Tween = Tween;
})(this);
