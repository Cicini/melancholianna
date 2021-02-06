//=============================================================================
// MPP_ChoiceEX.js
//=============================================================================
// Copyright (c) 2018 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.3.8】選択肢の機能拡張
 * @author 木星ペンギン
 *
 * @help ※[]内は未設定でも動作します。
 * プラグインコマンド:
 *   ChoicePos x y[ row]    # 選択肢の位置(x,y)と行数(row)指定
 *   ChoiceVariableId n     # 選択肢のデフォルト位置を変数n番にする
 *   ChoiceRect x y width height
 *                          # 選択肢の座標とサイズを指定
 *   ChoiceUnderMessage     # 選択肢をメッセージの下に表示
 * 
 * 注釈:
 *   選択肢ヘルプ             # 各項目の下に設定することでヘルプを表示させる
 *
 * 選択肢テキスト:
 *   if(条件)                # 条件が偽になると項目が表示されなくなる
 *   en(条件)                # 条件が偽になると項目が選択不可
 *
 * ================================================================
 * ▼ 使い方
 * --------------------------------
 *  〇 選択肢を増やす
 *   イベントコマンド『選択肢の表示』を続けて配置すると
 *   一つの選択肢にまとめられます。
 *   まとめたくない場合は、間に注釈などを入れることで
 *   通常通り分けることができます。
 * 
 *   『デフォルト』の処理は、なし以外を設定したものが適用されます。
 *   『デフォルト』の処理が複数ある場合、
 *   後に設定された選択肢のものが適用されます。
 * 
 *   『キャンセル』の処理は、禁止以外を設定したものが適用されます。
 *   『キャンセル』の処理が複数ある場合、
 *   後に設定された選択肢のものが適用されます。
 * 
 *  『背景』と『ウィンドウ位置』は後の選択肢のものが適用されます。
 * 
 * 
 * ================================================================
 * ▼ プラグインコマンド 詳細
 * --------------------------------
 *  〇 ChoicePos x y[ row]
 *      x   : 選択肢ウィンドウのX座標
 *      y   : 選択肢ウィンドウのY座標
 *      row : 選択肢ウィンドウの行数。未設定の場合はすべて表示
 *   
 *   次に表示する選択肢の位置(x,y)と行数(row)指定します。
 *   
 * --------------------------------
 *  〇 ChoiceVariableId n
 *      n : 変数番号
 *   
 *   次に表示する選択肢のデフォルト位置を変数の値にします。
 *   さらに現在のカーソル位置を変数に入れます。
 *   
 *   カーソル位置は最初の選択肢が上から0～5、次の選択肢は10～15と、
 *   選択肢毎に+10されます。
 * 
 *   変数に入った値の項目が表示されない場合、なしと同じ処理をします。
 * 
 * --------------------------------
 *  〇 ChoiceRect x y width height
 *      x      : X座標
 *      y      : Y座標
 *      width  : 幅
 *      height : 高さ
 *   
 *   次に表示する選択肢の座標とサイズを指定します。
 *   
 *   各項目、未設定もしくは-1を指定した場合、通常の値が適用されます。
 *   
 * --------------------------------
 *  〇 ChoiceUnderMessage
 *  
 *   次に表示する選択肢をメッセージウィンドウ内に表示させます。
 *   
 *   この機能は[文章の表示]と併用しなければ機能しません。
 *   [文章の表示]の前に実行してください。
 *   
 *   選択肢ウィンドウの[背景]は設定したものが適用されます。
 * 
 * 
 * ================================================================
 * ▼ 選択肢テキスト 詳細
 * --------------------------------
 *  〇 項目が表示される条件の設定
 *   選択肢の文章中に
 *     if(条件)
 *   と入れ、その条件が偽になると項目が表示されなくなります。
 * 
 *   『デフォルト』や『キャンセル』の項目が表示されない場合、
 *   なしや禁止と同じ処理をします。
 * 
 *   条件内では s でスイッチ、v で変数を参照できます。
 *   
 *     例：if(s[1]) とした場合
 *          => スイッチ１番がONで表示、OFFで非表示。
 *        if(!s[2]) とした場合
 *          => スイッチ２番がOFFで表示、ONで非表示。
 *        if(v[5]>0) とした場合
 *          => 変数５番が0より大きければ表示、0以下で非表示。
 *     
 *     変数で使える不等号
 *       === : 等しい
 *       !== : 等しくない
 *       <   : より小さい
 *       <=  : より小さいまたは等しい
 *       >   : より大きい
 *       >=  : より大きいまたは等しい
 *     
 *     条件式はeval関数で処理されているため、他演算子も使用できます。
 * 
 * --------------------------------
 *  〇 項目を半透明で表示する条件の設定
 *   選択肢の文章中に
 *     en(条件)
 *   と入れ、その条件が偽になると項目が半透明で表示されます。
 *   半透明となった項目は選択できなくなります。
 * 
 *   条件は上の『項目が表示される条件の設定』と同じです。
 * 
 *   『キャンセル』の項目が半透明の場合、ブザーが鳴ります。
 * 
 *
 * ================================================================
 * ▼ プラグインパラメータ 詳細
 * --------------------------------
 *  〇 Plugin Commands (プラグインコマンド名) /
 *     Event Comment (イベントの注釈で使うコマンド名)
 *  
 *   プラグインコマンドや注釈で使用するコマンドは、
 *   プラグインパラメータから変更できます。
 *  
 *   コマンドを短くしたり日本語にしたりなどして、
 *   自分が使いやすいようにしてください。
 *  
 *   プラグインコマンドのみ、変更後もデフォルトのコマンドでも動作します。
 * 
 * ================================================================
 * ▼ その他
 * --------------------------------
 *  〇 プラグインコマンドの実行タイミング
 *   プラグインコマンドを使用する場合、[選択肢の表示]の前に実行するのが
 *   好ましいです。
 *   ただし、メッセージウィンドウを表示したまま選択肢の処理を実行したい場合、
 *   [文章の表示]より前にプラグインコマンドを実行してください。
 * 
 * --------------------------------
 *  〇 ヘルプメッセージの表示
 *   各選択肢項目の下に注釈で以下の文字列を入れると、
 *   続きの文章をヘルプメッセージとしてカーソルを合わせたときに
 *   標示させることができます。
 *  
 *     選択肢ヘルプ
 * 
 *   ※注意点
 *    ヘルプメッセージは[文章の表示]と同じ機能を使っているため、
 *    制御文字が使用できます。
 *    ただし、\!と\^は使用できません。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param maxPageRow
 * @type number
 * @desc 1ページに表示される行数
 * @default 6
 *
 *
 * @param === Command ===
 * 
 * @param Plugin Commands
 * @type struct<Plugin>
 * @desc プラグインコマンド名
 * @default {"ChoicePos":"ChoicePos","ChoiceVariableId":"ChoiceVariableId","ChoiceRect":"ChoiceRect","ChoiceUnderMessage":"ChoiceUnderMessage"}
 * @parent === Command ===
 * 
 * @param Event Comment
 * @type struct<EventComment>
 * @desc イベントの注釈で使うコマンド名
 * @default {"ChoiceHelp":"選択肢ヘルプ"}
 * @parent === Command ===
 * 
 */

/*~struct~Plugin:
 * @param ChoicePos
 * @desc 選択肢の位置(x,y)と行数(row)指定
 * @default ChoicePos
 *
 * @param ChoiceVariableId
 * @desc 選択肢のデフォルト位置を変数n番にする
 * @default ChoiceVariableId
 *
 * @param ChoiceRect
 * @desc 選択肢の座標とサイズ(x,y,width,height)指定
 * @default ChoiceRect
 *
 * @param ChoiceUnderMessage
 * @desc 選択肢をメッセージの下に表示
 * @default ChoiceUnderMessage
 *
 */

/*~struct~EventComment:
 * @param ChoiceHelp
 * @desc 各項目の下に設定することでヘルプを表示させる
 * @default 選択肢ヘルプ
 */

(function() {

var MPPlugin = {};

(function() {
    
    var parameters = PluginManager.parameters('MPP_ChoiceEX');
    
    MPPlugin.maxPageRow = Number(parameters['maxPageRow']);
    
    MPPlugin.PluginCommands = JSON.parse(parameters['Plugin Commands']);
    MPPlugin.EventComment = JSON.parse(parameters['Event Comment']);

})();

var Alias = {};

//-----------------------------------------------------------------------------
// Game_Message

//15
Alias.GaMe_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
    Alias.GaMe_clear.call(this);
    this._choiceEnables = [];
    this._choiceResults = [];
    this._helpTexts = [];
    this._choiceX = -1;
    this._choiceY = -1;
    this._choiceWidth = -1;
    this._choiceHeight = -1;
    this._choiceMaxRow = MPPlugin.maxPageRow;
    this._choiceVariableId = 0;
    this.choiceUnderMes = false;
};

Game_Message.prototype.setChoiceEnables = function(enables) {
    this._choiceEnables = enables;
};

Game_Message.prototype.choiceEnables = function() {
    return this._choiceEnables;
};

Game_Message.prototype.setChoiceResults = function(results) {
    this._choiceResults = results;
};

Game_Message.prototype.setChoiceHelpTexts = function(texts) {
    this._helpTexts = texts;
};

Game_Message.prototype.isHelp = function() {
    return this._helpTexts.length > 0;
};

Game_Message.prototype.setChoicePos = function(x, y, row) {
    this._choiceX = x;
    this._choiceY = y;
    this._choiceWidth = -1;
    this._choiceHeight = -1;
    this._choiceMaxRow = row;
};

Game_Message.prototype.setChoiceRect = function(x, y, width, height) {
    this._choiceX = x;
    this._choiceY = y;
    this._choiceWidth = width;
    this._choiceHeight = height;
};

Game_Message.prototype.setChoiceVariableId = function(id) {
    this._choiceVariableId = id;
};

Game_Message.prototype.shiftLine = function(height) {
    this._choiceY += height;
    this._choiceHeight -= height;
};


//-----------------------------------------------------------------------------
// Game_Interpreter

//336
Game_Interpreter.prototype.setupChoices = function(params) {
    var data = {
        choices: [],
        enables: [],
        results: [],
        helpTexts: [],
        cancelType: -1,
        defaultType: -1,
        positionType: 0,
        background: 0
    };
    data = this.addChoices(params, this._index, data, 0);
    if (data.choices.length > 0) {
        var helpTexts = [];
        if (data.helpTexts.length > 0) {
            helpTexts = data.results.map(function(i) {
                return data.helpTexts[i];
            });
        }
        var cancelType = -1;
        if (data.cancelType.mod(10) === 8 || data.results.contains(data.cancelType)) {
            data.results.push(data.cancelType);
            cancelType = data.choices.length;
        }
        var defaultType = -1;
        if ($gameMessage._choiceVariableId > 0) {
            var index = $gameVariables.value($gameMessage._choiceVariableId);
            defaultType = data.results.indexOf(index);
        } else {
            defaultType = data.results.indexOf(data.defaultType);
        }
        $gameMessage.setChoices(data.choices, defaultType, cancelType);
        $gameMessage.setChoiceEnables(data.enables);
        $gameMessage.setChoiceResults(data.results);
        $gameMessage.setChoiceHelpTexts(helpTexts);
        $gameMessage.setChoiceBackground(data.background);
        $gameMessage.setChoicePositionType(data.positionType);
        $gameMessage.setChoiceCallback(function(n) {
            this._branch[this._indent] = data.results[n];
        }.bind(this));
    } else {
        this._branch[this._indent] = -1;
    }
};

Game_Interpreter.prototype.addChoices = function(params, i, data, d) {
    var regIf = /\s*if\((.+?)\)/;
    var regEn = /\s*en\((.+?)\)/;
    for (var n = 0; n < params[0].length; n++) {
        var str = params[0][n];
        if (regIf.test(str)) {
            str = str.replace(regIf, '');
            if (RegExp.$1 && !this.evalChoice(RegExp.$1)) continue;
        }
        var enable = true;
        if (regEn.test(str)) {
            str = str.replace(regEn, '');
            enable = this.evalChoice(RegExp.$1);
        }
        data.choices.push(str);
        data.enables.push(enable);
        data.results.push(n + d);
    }
    var cancelType = params[1];
    if (cancelType !== -1) {
        data.cancelType = cancelType + d;
    }
    var defaultType = params.length > 2 ? params[2] : 0;
    if (defaultType >= 0) {
        data.defaultType = defaultType + d;
    }
    data.positionType = params.length > 3 ? params[3] : 2;
    data.background = params.length > 4 ? params[4] : 0;
    var command;
    for (;;) {
        i++;
        command = this._list[i];
        if (!command) break;
        if (command.indent === this._indent) {
            if (command.code === 402) {
                this.getHelpText(command.parameters[0] + d, i + 1, data);
            } else if (command.code === 404) {
                break;
            }
        }
    }
    command = this._list[i + 1];
    if (command && command.code === 102) {
        this.addChoices(command.parameters, i + 1, data, d + 10);
    }
    return data;
};

Game_Interpreter.prototype.getHelpText = function(c, i, data) {
    var command = MPPlugin.EventComment.ChoiceHelp || '選択肢ヘルプ';
    if (this._list[i].code === 108 && this._list[i].parameters[0] === command) {
        var texts = [];
        while (this._list[i + 1].code === 408) {
            i++;
            texts.push(this._list[i].parameters[0]);
        }
        data.helpTexts[c] = texts;
    }
};

Game_Interpreter.prototype.evalChoice = function(formula) {
    try {
        var s = $gameSwitches._data;
        formula = formula.replace(/v\[(\d+)\]/g, function() {
            return $gameVariables.value(parseInt(arguments[1]));
        });
        return !!eval(formula);
    } catch (e) {
        alert("条件エラー \n\n " + formula);
        return true;
    }
};

//362
Game_Interpreter.prototype.command403 = function() {
    if (this._branch[this._indent] !== -2) {
        this.skipBranch();
    }
    return true;
};

Game_Interpreter.prototype.command404 = function() {
    if (this.nextEventCode() === 102) {
        this._branch[this._indent] -= 10;
        this._index++;
    }
    return true;
};

//1739
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    switch (command) {
        case MPPlugin.PluginCommands.ChoicePos:
        case 'ChoicePos':
            var x = Number(args[0]);
            var y = Number(args[1]);
            var row = Number(args[2] || 99);
            $gameMessage.setChoicePos(x, y, row);
            break;
        case MPPlugin.PluginCommands.ChoiceVariableId:
        case 'ChoiceVariableId':
            $gameMessage.setChoiceVariableId(Number(args[0]));
            break;
        case MPPlugin.PluginCommands.ChoiceRect:
        case 'ChoiceRect':
            var x = Number(args[0] || -1);
            var y = Number(args[1] || -1);
            var width = Number(args[2] || -1);
            var height = Number(args[3] || -1);
            $gameMessage.setChoiceRect(x, y, width, height);
            break;
        case MPPlugin.PluginCommands.ChoiceUnderMessage:
        case 'ChoiceUnderMessage':
            $gameMessage.choiceUnderMes = true;
            break;
    }
    return true;
};

//-----------------------------------------------------------------------------
// Window

Window.prototype.isClearWindowRect = function() {
    return true;
};

//-----------------------------------------------------------------------------
// WindowLayer

//7100
Alias.WiLa__canvasClearWindowRect = WindowLayer.prototype._canvasClearWindowRect;
WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {
    if (window.isClearWindowRect()) {
        Alias.WiLa__canvasClearWindowRect.apply(this, arguments);
    }
};

//7162
Alias.WiLa__maskWindow = WindowLayer.prototype._maskWindow;
WindowLayer.prototype._maskWindow = function(window, shift) {
    Alias.WiLa__maskWindow.apply(this, arguments);
    if (!window.isClearWindowRect()) {
        var rect = this._windowRect;
        rect.x = 0;
        rect.y = 0;
        rect.width = 0;
        rect.height = 0;
    }
};

//-----------------------------------------------------------------------------
// Window_ChoiceList

Window_ChoiceList.prototype.isClearWindowRect = function() {
    return !this._underMessage;
};

if (Window_ChoiceList.prototype.hasOwnProperty('close')) {
    Alias.WiChLi_close = Window_ChoiceList.prototype.close
}
Window_ChoiceList.prototype.close = function() {
    if ($gameMessage.isHelp()) this._messageWindow.onShowFast();
    if (Alias.WiChLi_close) {
        Alias.WiChLi_close.apply(this, arguments);
    } else {
        Window_Command.prototype.close.apply(this, arguments);
    }
};

if (Window_ChoiceList.prototype.hasOwnProperty('select')) {
    Alias.WiChli_select = Window_ChoiceList.prototype.select;
}
Window_ChoiceList.prototype.select = function(index) {
    var variableId = $gameMessage._choiceVariableId;
    if (index !== this.index() && variableId > 0) {
        var results = $gameMessage._choiceResults;
        $gameVariables.setValue(variableId, results[index]);
    }
    if (Alias.WiChli_select) {
        Alias.WiChli_select.apply(this, arguments);
    } else {
        Window_Command.prototype.select.apply(this, arguments);
    }
};

//34
Alias.WiChLi_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
Window_ChoiceList.prototype.updatePlacement = function() {
    Alias.WiChLi_updatePlacement.apply(this, arguments);
    if ($gameMessage._choiceWidth >= 0) {
        this.width = Math.min($gameMessage._choiceWidth, Graphics.boxWidth);
    }
    if ($gameMessage._choiceHeight >= 0) {
        this.height = Math.min($gameMessage._choiceHeight, Graphics.boxHeight);
    }
    if ($gameMessage._choiceX >= 0) {
        this.x = Math.min($gameMessage._choiceX, Graphics.boxWidth - this.width);
    }
    if ($gameMessage._choiceY >= 0) {
        this.y = Math.min($gameMessage._choiceY, Graphics.boxHeight - this.height);
    }
    this._underMessage = $gameMessage.choiceUnderMes;
};

//67
Window_ChoiceList.prototype.numVisibleRows = function() {
    return Math.min($gameMessage.choices().length, $gameMessage._choiceMaxRow);
};

//103
Window_ChoiceList.prototype.makeCommandList = function() {
    var choices = $gameMessage.choices();
    var enables = $gameMessage._choiceEnables;
    for (var i = 0; i < choices.length; i++) {
        this.addCommand(choices[i], 'choice', enables[i]);
    }
};

//110
Alias.WiChLi_drawItem = Window_ChoiceList.prototype.drawItem;
Window_ChoiceList.prototype.drawItem = function(index) {
    this.changePaintOpacity(this.isCommandEnabled(index));
    Alias.WiChLi_drawItem.apply(this, arguments);
};

//123
Alias.WiChLi_callOkHandler = Window_ChoiceList.prototype.callOkHandler;
Window_ChoiceList.prototype.callOkHandler = function() {
    Alias.WiChLi_callOkHandler.apply(this, arguments);
    this._messageWindow.forceClear();
};

//129
Alias.WiChLi_callCancelHandler = Window_ChoiceList.prototype.callCancelHandler;
Window_ChoiceList.prototype.callCancelHandler = function() {
    Alias.WiChLi_callCancelHandler.apply(this, arguments);
    this._messageWindow.forceClear();
};

if (Window_ChoiceList.prototype.hasOwnProperty('processCancel')) {
    Alias.WiChLi_processCancel = Window_ChoiceList.prototype.processCancel
}
Window_ChoiceList.prototype.processCancel = function() {
    var type = $gameMessage.choiceCancelType();
    var results = $gameMessage._choiceResults;
    var index = results.indexOf(results[type]);
    if (this.isCancelEnabled() && index !== type && !this.isCommandEnabled(index)) {
        this.playBuzzerSound();
    } else {
        if (Alias.WiChLi_processCancel) {
            Alias.WiChLi_processCancel.apply(this, arguments);
        } else {
            Window_Command.prototype.processCancel.apply(this, arguments);
        }
    }
};

Window_ChoiceList.prototype.callUpdateHelp = function() {
    if (this.active && this._messageWindow && $gameMessage.isHelp()) {
        this.updateHelp();
    }
};

Window_ChoiceList.prototype.updateHelp = function() {
    this._messageWindow.forceClear();
    var texts = $gameMessage._helpTexts[this.index()];
    $gameMessage._texts = texts ? texts.clone() : [''];
    this._messageWindow.startMessage();
};


//-----------------------------------------------------------------------------
// Window_Message

//109
Alias.WiMe_updatePlacement = Window_Message.prototype.updatePlacement;
Window_Message.prototype.updatePlacement = function() {
    Alias.WiMe_updatePlacement.apply(this, arguments);
    this.clearUnderChoice();
};

Window_Message.prototype.clearUnderChoice = function() {
    if ($gameMessage.choiceUnderMes) {
        var x = this.x + this.standardPadding();
        x += this._textState.left || 0;
        var y = this.y + 4;
        var height = this.windowHeight();
        $gameMessage.setChoiceRect(x, y, -1, height);
    }
};

if (Window_Message.prototype.hasOwnProperty('processNewLine')) {
    Alias.WiMe_processNewLine = Window_Message.prototype.processNewLine;
}
Window_Message.prototype.processNewLine = function(textState) {
    if ($gameMessage.choiceUnderMes) {
        $gameMessage.shiftLine(textState.height);
    }
    if (Alias.WiMe_processNewLine) {
        Alias.WiMe_processNewLine.apply(this, arguments);
    } else {
        Window_Base.prototype.processNewLine.apply(this, arguments);
    }
};

//149
Alias.WiMe_updateInput = Window_Message.prototype.updateInput;
Window_Message.prototype.updateInput = function() {
    if ($gameMessage.isHelp() && this._textState) {
        return false;
    }
    return Alias.WiMe_updateInput.apply(this, arguments);
};

//196
Alias.WiMe_onEndOfText = Window_Message.prototype.onEndOfText;
Window_Message.prototype.onEndOfText = function() {
    if ($gameMessage.isHelp() && !this._choiceWindow.active) {
        this.startInput();
    } else {
        Alias.WiMe_onEndOfText.apply(this, arguments);
    }
};

//207
Alias.WiMe_startInput = Window_Message.prototype.startInput;
Window_Message.prototype.startInput = function() {
    if (this._choiceWindow.active) {
        return true;
    }
    if ($gameMessage.isChoice() && $gameMessage.choiceUnderMes) {
        $gameMessage.shiftLine(this._textState.height);
    }
    return Alias.WiMe_startInput.apply(this, arguments);
};

Window_Message.prototype.forceClear = function() {
    this._textState = null;
    this.close();
    this._goldWindow.close();
};

Window_Message.prototype.onShowFast = function() {
    this._showFast = true;
};

//243
Alias.WiMe_newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function(textState) {
    Alias.WiMe_newPage.apply(this, arguments);
    this.clearUnderChoice();
};






})();
