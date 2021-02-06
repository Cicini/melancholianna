//
//  アニメサイズ変更 ver1.01
//
// ------------------------------------------------------
// Copyright (c) 2017 Yana
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------
//
// author Yana
//

var Imported = Imported || {};
Imported['VariableSizeAnimation'] = 1.01;

/*:
 * @plugindesc ver1.01/アニメーションで設定する画像サイズをアニメの名称に合わせて可変にします。
 * @author Yana
 *
 * @help ------------------------------------------------------
 * 使用方法
 * ------------------------------------------------------
 * アニメーションのファイル名に(size)または、(width,height)を追加することで、
 * そのアニメーションの1セルのサイズを変更することができます。
 *
 * サイズを変更することで、より大きなアニメを使用したり、より小さなアニメで軽量化したりといったことができます。
 *
 * 使い方手順
 * 1．まず、通常サイズの画像でアニメーションを作成します。この際、アニメの座標が画像の中心であることに注意します。
 * 2．作成したアニメの画像を(size)また、(width,height)を含むものに変更します。
 * (この際、下のアニメセル欄の表示とアニメのテスト再生が正常でなくなりますが、ゲーム中は正常に動作します)
 *
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.01:
 * アニメ画像1とアニメ画像2でサイズ指定が違う時、片方のサイズが正常でないバグを修正
 * ver1.00:
 * 公開
 */

(function() {

    ////////////////////////////////////////////////////////////////////////////////////

    'use strict';

    var parameters = PluginManager.parameters('VariableSizeAnimation');

    ////////////////////////////////////////////////////////////////////////////////////

    Sprite_Animation.prototype.sizeW = function(pattern) {
        var type = pattern < 100 ? 0 : 1;
        if (this._sizeW && this._sizeW[type]) return this._sizeW[type];
        if (!this._sizeW) this._sizeW = [];
        this._sizeW[type] = 192;
        var name = type === 0 ? this._animation.animation1Name : this._animation.animation2Name;
        if (name.match(/\((\d+)(?:,\d+)?\)/gi)) {
            this._sizeW[type] = Number(RegExp.$1);
        }
        return this._sizeW[type];
    };

    Sprite_Animation.prototype.sizeH = function(pattern) {
        var type = pattern < 100 ? 0 : 1;
        if (this._sizeH && this._sizeH[type]) return this._sizeH[type];
        if (!this._sizeH) this._sizeH = [];
        this._sizeH[type] = 192;
        var name = type === 0 ? this._animation.animation1Name : this._animation.animation2Name;
        if (name.match(/\((\d+)(?:,(\d+))?\)/gi)) {
            this._sizeH[type] = RegExp.$2 ? Number(RegExp.$2) : Number(RegExp.$1);
        }
        return this._sizeH[type];
    };

    // 再定義
    Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {
        var pattern = cell[0];
        if (pattern >= 0) {
            var sizeX = this.sizeW(pattern);
            var sizeY = this.sizeH(pattern);
            var sx = pattern % 5 * sizeX;
            var sy = Math.floor(pattern % 100 / 5) * sizeY;
            var mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setFrame(sx, sy, sizeX, sizeY);
            sprite.x = cell[1];
            sprite.y = cell[2];
            if (this._mirror) {
                sprite.x *= -1;
            }
            sprite.rotation = cell[4] * Math.PI / 180;
            sprite.scale.x = cell[3] / 100;
            if ((cell[5] && !mirror) || (!cell[5] && mirror)) {
                sprite.scale.x *= -1;
            }
            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    };


    ////////////////////////////////////////////////////////////////////////////////////

}());