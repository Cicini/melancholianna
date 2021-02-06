/*---------------------------------------------------------------------------*
 * Torigoya_Achievement.js
 *---------------------------------------------------------------------------*
 * 2018/06/06 ru_shalm
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc コモンイベントの注釈で実績システムさん
 * @author ru_shalm
 *
 * @param ■ 基本
 *
 * @param Common Event ID
 * @type common_event
 * @desc 実績の注釈を記述するコモンイベントのID
 * @default 1
 *
 * @param Storage Key
 * @type string
 * @desc 【Web公開用】保存キー名。1つのWebサイトで複数のゲームを公開する場合は、それぞれ別の名前にしてください。
 * @default Achievement: Game
 *
 * @param ■ ポップアップ表示
 *
 * @param Use Popup
 * @type select
 * @option ON
 * @option OFF
 * @desc ポップアップ表示のON/OFF
 * ON: 表示する　OFF: 表示しない　（default: ON）
 * @default ON
 *
 * @param Popup Position
 * @type select
 * @option left
 * @option right
 * @desc メッセージを表示する場所
 * left: 左上  right: 右上
 * @default left
 *
 * @param Popup Width
 * @type number
 * @min 200
 * @desc ポップアップ表示の横幅(px)
 * 最低200以上で設定してください
 * @default 250
 *
 * @param Popup Wait
 * @type number
 * @decimals 2
 * @min 0
 * @desc ポップアップの表示時間(秒)
 * （フェードイン/アウトの時間は含みません）
 * @default 0.75
 *
 * @param Popup Message
 * @type string
 * @desc 獲得時に表示するメッセージ
 * @default 実績を獲得しました
 *
 * @param Popup Sound
 * @desc 獲得時に再生する効果音(SE)の名前
 * 空欄の場合は再生しません
 * @default Saint5
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param Popup Window Image
 * @desc ポップアップ表示に使用するウィンドウ画像のファイル名 (default: Window)
 * @default Window
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param Popup Opacity
 * @desc ポップアップ表示ウィンドウの背景の透明度(0〜255)
 * -1の場合はデフォルトの透明度を使用します。
 * @type number
 * @min -1
 * @max 255
 * @default -1
 *
 * @param ■ タイトル/メニュー
 *
 * @param Use Title
 * @type select
 * @option ON
 * @option OFF
 * @desc タイトル画面に項目を表示するか
 * ON: 表示する　OFF: 表示しない　（default: ON）
 * @default ON
 *
 * @param Use Menu
 * @type select
 * @option ON
 * @option OFF
 * @desc メニュー画面に項目を表示するか
 * ON: 表示する　OFF: 表示しない　（default: ON）
 * @default ON
 *
 * @param Menu Text
 * @type string
 * @desc タイトル/メニューに表示する際の項目名
 * @default 実績
 *
 * @param ■ 実績画面
 *
 * @param List Hidden Title
 * @type string
 * @desc シークレット実績のタイトル
 * @default ？？？？？
 *
 * @param List Hidden Description
 * @type string
 * @desc シークレット実績の説明文
 * @default (未獲得)
 *
 * @param List Hidden Icon
 * @type number
 * @min 0
 * @desc シークレット実績のアイコンID
 * @default 0
 *
 * @param List Cancel Message
 * @type string
 * @desc 実績画面を閉じるボタンのテキスト。
 * 空欄の場合は閉じるボタンを表示しません
 * @default 閉じる
 *
 * @help
 * 実績・トロフィー的なシステムを定義します。
 * 実績の項目はコモンイベントに記述することで追加できます。
 *
 * 使用方法の詳細はブログをご確認ください。
 * http://torigoya.hatenadiary.jp/entry/achievement_mv
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド
 * ------------------------------------------------------------
 *
 * ● 実績ID:1番を解除します
 * 実績 1
 *
 * ● 実績画面を表示
 * 実績表示
 */

(function (global) {
    'use strict';

    var Achievement = {
        name: 'Torigoya_Achievement'
    };
    Achievement.settings = (function () {
        var parameters = PluginManager.parameters(Achievement.name);
        return {
            commonEventID: Number(parameters['Common Event ID'] || 1),
            storageKey: String(parameters['Storage Key'] || 'Achievement-Game'),
            usePopup: String(parameters['Use Popup'] || 'ON') === 'ON',
            popupPosition: String(parameters['Popup Position'] || 'left'),
            popupWidth: Number(parameters['Popup Width'] || 250),
            popupMessage: String(parameters['Popup Message'] || '実績を獲得しました'),
            popupSound: String(parameters['Popup Sound'] || ''),
            popupWait: Number(parameters['Popup Wait'] || 0.75),
            popupWindowImage: String(parameters['Popup Window Image'] || 'Window'),
            popupOpacity: Number(parameters['Popup Opacity'] === undefined ? -1 : parameters['Popup Opacity']),
            listHiddenTitle: String(parameters['List Hidden Title'] || '？？？？？'),
            listHiddenDescription: String(parameters['List Hidden Description'] || ''),
            listHiddenIcon: Number(parameters['List Hidden Icon'] || 0),
            listCancel: String(parameters['List Cancel Message']),
            useTitle: String(parameters['Use Title'] || 'ON') === 'ON',
            useMenu: String(parameters['Use Menu'] || 'ON') === 'ON',
            menuText: String(parameters['Menu Text'] || '実績')
        };
    })();

    // -------------------------------------------------------------------------
    // Constant

    // 内部処理用に使うユニークなスロット名
    // 実際のファイル名/キー名は設定のものを使う
    Achievement.saveSlotID = 'Torigoya Achievement';

    // -------------------------------------------------------------------------
    // AchievementItem

    var AchievementItem = (function () {
        function AchievementItem(id, icon, title, description, secret) {
            this.id = id;
            this.icon = icon;
            this.title = title;
            this.description = description;
            this.isSecret = !!secret;
        }

        AchievementItem.parse = function (array) {
            var id, icon, title, description = '', secret = false;
            array.forEach(function (line) {
                var match;
                if (!id && (match = line.match(/^\s*id:\s*(\d+)/))) {
                    id = ~~match[1];
                } else if (!icon && (match = line.match(/^\s*icon:\s*(\d+)/))) {
                    icon = ~~match[1];
                } else if (!title && (match = line.match(/^\s*title:\s*(.+)\s*$/))) {
                    title = match[1];
                } else if (match = line.match(/^\s*secret:\s*(.+)\s*$/)) {
                    secret = (match[1] === 'true');
                } else {
                    description += line + '\n';
                }
            });
            return new AchievementItem(id, icon, title, description, secret);
        };

        return AchievementItem;
    })();

    // -------------------------------------------------------------------------
    // AchievementParser

    Achievement.loadFromCommonEvent = function (commonEventID) {
        var event = new Game_CommonEvent(commonEventID);

        var list = event.list();
        var result = [];
        var isRouting = false;
        for (var i = 0; i < list.length; ++i) {
            if (isRouting && list[i].code === 408) {
                result[result.length - 1].push(list[i].parameters[0]);
            } else if (list[i].code === 108 && list[i].parameters[0].indexOf('id:') === 0) {
                result.push([list[i].parameters[0]]);
                isRouting = true;
            } else {
                isRouting = false;
            }
        }

        return result.map(function (array) {
            return AchievementItem.parse(array);
        }).filter(function (item, i, items) {
            // Array#findIndex
            for (var j = 0; j < items.length; ++j) {
                if (items[j].id === item.id) {
                    return i === j;
                }
            }
            return false;
        }).sort(function (a, b) {
            return a.id - b.id;
        });
    };

    // -------------------------------------------------------------------------
    // AchievementManager

    var AchievementManager = (function () {
        function AchievementManager() {
            this._achievements = [];
            this._callbacks = [];
        }

        AchievementManager.prototype.data = function (id) {
            // Array#find
            for (var i = 0; i < this._items.length; ++i) {
                if (this._items[i].id === id) return this._items[i];
            }
            return null;
        };

        AchievementManager.prototype.allData = function () {
            return this._items;
        };

        AchievementManager.prototype.init = function () {
            this._items = Achievement.loadFromCommonEvent(Achievement.settings.commonEventID);
            this.load();
        };

        AchievementManager.prototype.isUnlocked = function (id) {
            return this._achievements[id];
        };

        AchievementManager.prototype.unlock = function (id) {
            if (this._achievements[id]) return;
            if (!this.data(id)) return;
            this._achievements[id] = true;
            this.save();
            this.notify(id);
        };

        AchievementManager.prototype.on = function (callback) {
            this._callbacks.push(callback);
        };

        AchievementManager.prototype.off = function (callback) {
            this._callbacks = this._callbacks.filter(function (n) {
                return n !== callback;
            });
        };

        AchievementManager.prototype.notify = function (id) {
            var data = this.data(id);
            this._callbacks.forEach(function (callback) {
                callback(data);
            }.bind(this));
        };

        AchievementManager.prototype.load = function () {
            this._achievements = this._loadAchievements();
        };

        AchievementManager.prototype.save = function () {
            // [多重起動対応] 旧データとの差異があったら吸収する
            var oldData = this._loadAchievements();
            for (var i = 0; i < this._items.length; ++i) {
                this._achievements[i] = (oldData[i] || this._achievements[i]);
            }

            StorageManager.save(Achievement.saveSlotID, JSON.stringify({
                achievements: this._achievements
            }));
        };

        AchievementManager.prototype.clear = function () {
            this._achievements = [];
            StorageManager.save(Achievement.saveSlotID, JSON.stringify({
                achievements: []
            }));
        };

        AchievementManager.prototype._loadAchievements = function () {
            try {
                var json = StorageManager.load(Achievement.saveSlotID);
                var obj = JSON.parse(json);
                return obj.achievements || [];
            } catch (_e) {
                return [];
            }
        };

        return new AchievementManager();
    })();

    Achievement.Manager = AchievementManager;

    // -------------------------------------------------------------------------
    // AchievementPopupManager

    var AchievementPopupManager = (function () {
        function AchievementPopupManager() {
            this.reset();
        }

        AchievementPopupManager.prototype.init = function () {
            Torigoya.Achievement.Manager.on(this.onNotify.bind(this));
            this.reset();
        };

        AchievementPopupManager.prototype.reset = function () {
            this._stacks = [];
        };

        AchievementPopupManager.prototype.onNotify = function (item) {
            var window = new Window_AchievementPopup(item);
            SceneManager._scene.addChild(window); // 行儀悪い

            var isLeft = Achievement.settings.popupPosition === 'left';
            var x = isLeft ? 10 : Graphics.width - window.width - 10;
            var y = (function () {
                var y = 10;
                for (var i = 0; i < this._stacks.length; ++i) {
                    if (this._stacks[i].y !== y) return y;
                    y += window.height + 10;
                }
                return y;
            }.bind(this))();

            var originalOpacity = window.opacity;
            var originalBackOpacity = window.backOpacity;
            Torigoya.Tween.create(window, {
                x: x + window.width * (isLeft ? -1 : 1),
                y: y,
                opacity: 0,
                backOpacity: 0,
                contentsOpacity: 0
            })
                .to({
                    x: x,
                    opacity: originalOpacity,
                    backOpacity: originalBackOpacity,
                    contentsOpacity: 255
                }, 30, Torigoya.Tween.Easing.easeOutCircular)
                .wait(Math.floor(Achievement.settings.popupWait * 60))
                .to({
                    y: y - window.height,
                    opacity: 0,
                    backOpacity: 0,
                    contentsOpacity: 0
                }, 30, Torigoya.Tween.Easing.easeInCircular)
                .onComplete(function () {
                    this._stacks = this._stacks.filter(function (stack) {
                        return window !== stack;
                    });
                    if (window.parent) {
                        window.parent.removeChild(window);
                    }
                }.bind(this))
                .start();

            this._stacks.push(window);
            this._stacks.sort(function (a, b) {
                return a.y - b.y;
            });

            // 効果音の再生
            if (Achievement.settings.popupSound.length > 0) {
                AudioManager.playSe({
                    name: Achievement.settings.popupSound,
                    pan: 0,
                    pitch: 100,
                    volume: 90
                });
            }
        };

        return new AchievementPopupManager();
    })();

    Achievement.PopupManager = AchievementPopupManager;

    // -------------------------------------------------------------------------
    // Window_AchievementPopup

    function Window_AchievementPopup() {
        this.initialize.apply(this, arguments);
    }

    Window_AchievementPopup.prototype = Object.create(Window_Base.prototype);
    Window_AchievementPopup.prototype.constructor = Window_AchievementPopup;

    Window_AchievementPopup.prototype.initialize = function (item) {
        Window_Base.prototype.initialize.call(this, 0, 0, this.windowWidth(), 50);
        this.item = item;
        this.refresh();
    };

    Window_AchievementPopup.prototype.windowWidth = function () {
        return Achievement.settings.popupWidth;
    };

    Window_AchievementPopup.prototype.standardFontSize = function () {
        return 16;
    };

    Window_AchievementPopup.prototype.lineHeight = function () {
        return 20;
    };

    Window_AchievementPopup.prototype.standardPadding = function () {
        return 0;
    };

    Window_AchievementPopup.prototype.refresh = function () {
        this.contents.clear();
        this.drawIcon(this.item.icon, 10, 10);
        this.drawTitle();
        this.drawMessage();
    };

    Window_AchievementPopup.prototype.drawTitle = function () {
        this.drawTextEx('\\c[1]' + this.item.title, 50, 5);
    };

    Window_AchievementPopup.prototype.drawMessage = function () {
        var textWidth = this.windowWidth() - 60;
        this.resetTextColor();
        this.contents.fontSize = 12;
        this.contents.drawText(Achievement.settings.popupMessage, 50, 29, textWidth, 12, 'left');
    };

    Window_AchievementPopup.prototype.loadWindowskin = function () {
        this.windowskin = ImageManager.loadSystem(Achievement.settings.popupWindowImage);
    };

    Window_AchievementPopup.prototype.standardBackOpacity = function () {
        return Achievement.settings.popupOpacity === -1 ?
            Window_Base.prototype.standardBackOpacity.call(this) : Achievement.settings.popupOpacity;
    };

    Achievement.Window_AchievementPopup = Window_AchievementPopup;

    // -------------------------------------------------------------------------
    // Window_AchievementPopup

    function Window_AchievementList() {
        this.initialize.apply(this, arguments);
    }

    Window_AchievementList.prototype = Object.create(Window_Selectable.prototype);
    Window_AchievementList.prototype.constructor = Window_AchievementList;

    Window_AchievementList.prototype.initialize = function (x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.makeItemList();
        this.refresh();
    };

    Window_AchievementList.prototype.maxItems = function () {
        return this._data ? this._data.length : [];
    };

    Window_AchievementList.prototype.item = function () {
        return this._data[this.index()];
    };

    Window_AchievementList.prototype.refresh = function () {
        this.contents.clear();
        this.drawAllItems();
    };

    Window_AchievementList.prototype.makeItemList = function () {
        this._data = AchievementManager.allData().map(function (achievement) {
            var unlocked = AchievementManager.isUnlocked(achievement.id);
            if (!unlocked && achievement.isSecret) {
                return {
                    title: Achievement.settings.listHiddenTitle,
                    description: Achievement.settings.listHiddenDescription,
                    icon: Achievement.settings.listHiddenIcon,
                    unlocked: unlocked
                };
            } else {
                return {
                    title: achievement.title,
                    description: achievement.description,
                    icon: achievement.icon,
                    unlocked: unlocked
                };
            }
        });
        if (Achievement.settings.listCancel) this._data.push(null);
    };

    Window_AchievementList.prototype.drawItem = function (index) {
        var item = this._data[index];
        var rect = this.itemRect(index);
        var iconBoxWidth = Window_Base._iconWidth + 4;
        if (item) {
            this.changePaintOpacity(item.unlocked);
            this.drawIcon(item.icon, rect.x, rect.y);
            this.drawText(item.title, rect.x + iconBoxWidth, rect.y, rect.width - iconBoxWidth, 'left');
            this.changePaintOpacity(true);
        } else {
            this.changePaintOpacity(true);
            this.drawText(Achievement.settings.listCancel, rect.x, rect.y, rect.width, 'center');
        }
    };

    Window_AchievementList.prototype.updateHelp = function () {
        this._helpWindow.clear();
        this.setHelpWindowItem(this.item());
    };

    Window_AchievementList.prototype.processOk = function () {
        if (this.item()) return;
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    };

    Achievement.Window_AchievementList = Window_AchievementList;

    // -------------------------------------------------------------------------
    // Scene_Achievement

    function Scene_Achievement() {
        this.initialize.apply(this, arguments);
    }

    Scene_Achievement.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Achievement.prototype.constructor = Scene_Achievement;

    Scene_Achievement.prototype.initialize = function () {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Achievement.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createAchievementWindow();
    };

    Scene_Achievement.prototype.createAchievementWindow = function () {
        this._achievementWindow = new Window_AchievementList(0, this._helpWindow.y + this._helpWindow.height, Graphics.boxWidth, Graphics.boxHeight - this._helpWindow.y - this._helpWindow.height);
        this._achievementWindow.setHelpWindow(this._helpWindow);
        this._achievementWindow.select(0);
        this._achievementWindow.activate();
        this._achievementWindow.setHandler('ok', this.popScene.bind(this));
        this._achievementWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._achievementWindow);
    };

    Achievement.Scene_Achievement = Scene_Achievement;

    // -------------------------------------------------------------------------
    // 保存周り

    var upstream_StorageManager_localFilePath = StorageManager.localFilePath;
    StorageManager.localFilePath = function (savefileId) {
        if (savefileId === Achievement.saveSlotID) {
            return this.localFileDirectoryPath() + 'achievements.rpgsave';
        }
        return upstream_StorageManager_localFilePath.apply(this, arguments);
    };

    var upstream_StorageManager_webStorageKey = StorageManager.webStorageKey;
    StorageManager.webStorageKey = function (savefileId) {
        if (savefileId === Achievement.saveSlotID) {
            return Achievement.settings.storageKey;
        }
        return upstream_StorageManager_webStorageKey.apply(this, arguments);
    };

    // -------------------------------------------------------------------------
    // 起動時初期化処理

    var upstream_Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        AchievementManager.init();
        upstream_Scene_Boot_start.apply(this);
        if (Achievement.settings.usePopup && global.Torigoya.Tween) {
            AchievementPopupManager.init();
        }
    };

    // -------------------------------------------------------------------------
    // タイトル画面への追加

    if (Achievement.settings.useTitle) {
        var upstream_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
        Window_TitleCommand.prototype.makeCommandList = function () {
            upstream_Window_TitleCommand_makeCommandList.apply(this);
            this.addCommand(Achievement.settings.menuText, 'achievement');
        };

        var upstream_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
        Scene_Title.prototype.createCommandWindow = function () {
            upstream_Scene_Title_createCommandWindow.apply(this);
            this._commandWindow.setHandler('achievement', function () {
                this._commandWindow.close();
                SceneManager.push(Scene_Achievement);
            }.bind(this));
        };
    }

    // -------------------------------------------------------------------------
    // メニュー画面への追加

    if (Achievement.settings.useMenu) {
        var upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function () {
            upstream_Window_MenuCommand_addOriginalCommands.apply(this);
            this.addCommand(Achievement.settings.menuText, 'achievement');
        };

        var upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function () {
            upstream_Scene_Menu_createCommandWindow.apply(this);
            this._commandWindow.setHandler('achievement', function () {
                SceneManager.push(Scene_Achievement);
            }.bind(this));
        };
    }

    // -------------------------------------------------------------------------
    // プラグインコマンド

    var upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        switch (command) {
            case 'Achievement':
            case '実績':
                var achievementID = ~~Number(args[0]);
                AchievementManager.unlock(achievementID);
                return;
            case 'ShowAchievement':
            case '実績表示':
                SceneManager.push(Scene_Achievement);
                return;
            case 'ResetAchievement':
            case '実績リセット':
                AchievementManager.clear();
                return;
        }
        upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
    };

    // -------------------------------------------------------------------------
    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.Achievement = Achievement;
})(this);
