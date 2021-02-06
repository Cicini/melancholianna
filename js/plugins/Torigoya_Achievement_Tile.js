/*---------------------------------------------------------------------------*
 * Torigoya_Achievement_Tile.js
 *---------------------------------------------------------------------------*
 * 2018/03/11 ru_shalm
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc [実績システムさん] アイコンタイル表示アドオン
 * @author ru_shalm
 *
 * @param ■ タイル表示
 *
 * @param Cols Size
 * @type number
 * @min 1
 * @desc 一列に表示するアイコンの数
 * @default 5
 *
 * @param ■ テキスト表示
 *
 * @param Title Color ID
 * @type number
 * @desc 実績テキストのタイトルの文字色のID（\c[ここの数字]）
 * @default 1
 *
 * @param Disable Color ID
 * @type number
 * @desc 実績テキストの未獲得の文字色のID（\c[ここの数字]）
 * @default 8
 *
 * @param Help Line Size
 * @type number
 * @min 1
 * @desc 実績テキスト表示ウィンドウの行数
 * @default 2
 *
 * @help
 * ※このプラグインは「コモンイベントの注釈で実績システムさん」のアドオンプラグインです。
 * 　導入の際は「コモンイベントの注釈で実績システムさん」より下に導入してください。
 *
 * 実績画面の一覧表示を1行表示からアイコンのみのタイル表示に変更します。
 * 使用方法の詳細はブログをご確認ください。
 * http://torigoya.hatenadiary.jp/entry/achievement_mv
 */

(function (global) {
    'use strict';

    if (!global.Torigoya || !global.Torigoya.Achievement) {
        var errorMessage = '「[実績システムさん] アイコンタイル表示アドオン」より上に\n「コモンイベントの注釈で実績システムさん」が導入されていません。';
        alert(errorMessage);
        throw errorMessage;
    }

    var Achievement = global.Torigoya.Achievement;
    var AchievementTile = {
        name: 'Torigoya_Achievement_Tile'
    };
    AchievementTile.settings = (function () {
        var parameters = PluginManager.parameters(AchievementTile.name);
        return {
            colsSize: Number(parameters['Cols Size'] || 5),
            titleColorID: Number(parameters['Title Color ID'] || 1),
            disableColorID: Number(parameters['Disable Color ID'] || 9),
            helpLineSize: Number(parameters['Help Line Size'] || 2)
        };
    })();

    // -------------------------------------------------------------------------
    // Window_AchievementList

    var upstream_Window_AchievementList_initialize = Achievement.Window_AchievementList.prototype.initialize;
    Achievement.Window_AchievementList.prototype.initialize = function (x, y, width, height) {
        upstream_Window_AchievementList_initialize.apply(this, arguments);

        var w = AchievementTile.settings.colsSize;
        var h;
        if (Achievement.settings.listCancel) {
            h = Math.ceil((this.maxItems() - 1) / AchievementTile.settings.colsSize) + 1;
        } else {
            h = Math.ceil(this.maxItems() / AchievementTile.settings.colsSize);
        }

        this.width = w * this.itemWidth() + (w - 1) * this.spacing() + this.padding * 2;
        this.height = Math.min(
            h * this.itemHeight() + this.padding * 2,
            height
        );
        this.x = x + (width - this.width) / 2;
        this.y = y + (height - this.height) / 2;
        this.refresh();
    };

    Achievement.Window_AchievementList.prototype.itemRect = function (index) {
        var rect = new Rectangle();
        var maxCols = this.maxCols();
        var maxItems = this.maxItems();
        if (Achievement.settings.listCancel && index === maxItems - 1) {
            rect.width = this.width - this.padding * 2;
            rect.height = this.itemHeight();
            rect.x = -this._scrollX;
            rect.y = Math.ceil((maxItems - 1) / maxCols) * rect.height - this._scrollY;
        } else {
            rect.width = this.itemWidth();
            rect.height = this.itemHeight();
            rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
            rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
        }
        return rect;
    };

    Achievement.Window_AchievementList.prototype.spacing = function () {
        return 10;
    };

    Achievement.Window_AchievementList.prototype.maxCols = function () {
        return AchievementTile.settings.colsSize;
    };

    Achievement.Window_AchievementList.prototype.itemWidth = function () {
        return Window_Base._iconWidth + 10;
    };

    Achievement.Window_AchievementList.prototype.itemHeight = function () {
        return Window_Base._iconHeight + 10 + this.spacing();
    };

    Achievement.Window_AchievementList.prototype.translucentOpacity = function () {
        return 64;
    };

    Achievement.Window_AchievementList.prototype.lineHeight = function () {
        return this.itemHeight();
    };

    Achievement.Window_AchievementList.prototype.drawItem = function (index) {
        var item = this._data[index];
        var rect = this.itemRect(index);
        if (item) {
            this.changePaintOpacity(item.unlocked);
            this.drawIcon(item.icon, rect.x + 5, rect.y + 10);
            this.changePaintOpacity(true);
        } else {
            this.changePaintOpacity(true);
            this.drawText(Achievement.settings.listCancel, rect.x, rect.y, rect.width, 'center');
        }
    };

    Achievement.Window_AchievementList.prototype.setHelpWindowItem = function (item) {
        if (!this._helpWindow) return;
        if (item) {
            this._helpWindow.setItem({
                description: item.unlocked ?
                    ('\\c[' + AchievementTile.settings.titleColorID + ']' + item.title + '\\c[0]\n' + item.description)
                    : ('\\c[' + AchievementTile.settings.disableColorID + ']' + item.title + '\n' + item.description)
            });
        } else {
            this._helpWindow.setItem(null);
        }
    };

    var upstream_Window_AchievementList_updateCursor = Achievement.Window_AchievementList.prototype.updateCursor;
    Achievement.Window_AchievementList.prototype.updateCursor = function () {
        upstream_Window_AchievementList_updateCursor.apply(this);
        if (this.isCursorVisible()) {
            this._cursorRect.y += 5;
            this._cursorRect.height -= 10;
            this._refreshCursor();
        }
    };

    Achievement.Window_AchievementList.prototype.cursorUp = function (wrap) {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (Achievement.settings.listCancel && index === maxItems - 1) {
            this.select(index - 1);
        } else if (index >= maxCols || (wrap && maxCols === 1)) {
            this.select((index - maxCols + maxItems) % maxItems);
        }
    };

    Achievement.Window_AchievementList.prototype.cursorDown = function (wrap) {
        var index = this.index();
        var maxItems = this.maxItems();
        var maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.select((index + maxCols) % maxItems);
        } else if (Achievement.settings.listCancel) {
            this.select(maxItems - 1);
        }
    };

    // -------------------------------------------------------------------------
    // Scene_Achievement

    Achievement.Scene_Achievement.prototype.createHelpWindow = function () {
        this._helpWindow = new Window_Help(AchievementTile.settings.helpLineSize);
        this.addWindow(this._helpWindow);
    };

    // -------------------------------------------------------------------------
    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.AchievementTile = AchievementTile;
})(this);
