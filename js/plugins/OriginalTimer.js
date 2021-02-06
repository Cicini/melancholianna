//=============================================================================
// OriginalTimer.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 fftfantt
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.1.0 2016/2/15 β版
// 1.0.0 2016/2/21 初版
// 1.0.1 2016/2/21 TimerSaveがYESでも再実行されない不具合修正
// 1.0.2 2016/2/21 初期化関連の処理の見直し
// 1.0.3 2016/3/26 タイマースタート時に即時でカウントしないよう変更
// 1.0.4 2016/4/03 戦闘終了後にエラーになってしまう不具合を解消
// 1.1.0 2016/4/03 タイマーの終了後に指定のスイッチをONにするコマンド追加
// 1.2.0 2016/4/03 タイマーのカウントをリセットするコマンド追加
// 1.2.1 2016/4/03 タイマー値の取得で設定値が取れない不具合修正
// 1.3.0 2016/6/09 設定時間操作、実時間操作のコマンド追加
// ----------------------------------------------------------------------------
// [HomePage]: https://googledrive.com/host/0BxiSZT-B8lvFOUFhVTF6VjNnUGc/index.html 
// [Twitter] : https://twitter.com/fftfantt/
// [GitHub]  : https://github.com/fftfantt/
//=============================================================================
/*:
 * @plugindesc オリジナルタイマー
 * @author fftfantt
 *
 * @param TimerSave
 * @desc タイマーの値をセーブデータに含めるか YES or NO
 * @default NO
 * @help
 * 
 * ■説明
 * このプラグインは1日から1/100秒単位でカウントできるオリジナルタイマーを実装します。
 * カウントダウンのほか、カウントアップにも対応しています。
 * 動的テキスト表示部分のロジックについては、トリアコンタン様の「DTextPicture.js」
 * を参考にさせていただいております。この場をお借りして感謝申し上げます。
 *
 * ■利用規約
 * 当プラグインはMITライセンスのもとで公開されています。
 * https://osdn.jp/projects/opensource/wiki/licenses%2FMIT_license
 * ヘッダーのライセンス表記のみ残してください。
 * 商用利用、年齢制限のあるゲームへの使用、改変が可能です。
 * クレジットは不要です。
 * 当プラグインの不具合に損害の責任についても、MITライセンスの表記どおりです。
 *
 * ■使い方の概要
 * イベントのコマンド追加からプラグインコマンドを選択し、以下のようなプラグイン
 * コマンドでタイマーを設定後開始してください。
 * こちらにも詳しい使い方が記載されています。
 * https://github.com/fftfantt/RPGMakerMV/wiki/OriginalTimer.js
 *  
 * ■タイマーの設定
 * 　◆パラメータ
 * 　　引数1：タイマーの設定を行う場合の引数 [設定 or SET]
 * 　　引数2：タイマーの種類[アップ or ダウン or UP or DOWN] 
 * 　　引数3：設定時間 (1d1h1m1s1x1c のように記載)[日 or d  時間 or h  分 or m  秒 or s x(1/10秒) c(1/100秒)]
 * 　　引数4：ピクチャ番号[1～100]
 * 　　引数5：フォントサイズ
 * 　　引数6：画面Ｘ
 * 　　引数7：画面Ｙ
 * 　　引数8：表示モード[表示 or 非表示 or DISPLAY or HIDE]
 * 　　引数9：表示形式[D日 HH時MM分SS.XC秒 や HH:MM:SS:XC で自由に]
 * 　◆コマンド例
 * 　　オリジナルタイマー 設定 ダウン 2d1h30m 99 24 10 10 表示 D日 HH時MM分SS.XC秒
 * 　　ORIGINALTIMER SET DOWN 1h30m 99 24 10 10 DISPLAY HH:MM:SS:XC
 * 　　オリジナルタイマー 設定 アップ 1h30m 10 24 630 10 非表示 HH:MM:SS.XC
 * 　　ORIGINALTIMER SET UP 1h30m 10 24 630 10 HIDE HH:MM:SS.XC
 * 
 * ■タイマーの開始
 * 　◆パラメータ
 * 　　引数1：タイマーを開始もしくは再開する場合の引数 [開始 or 再開 or START]
 * 　◆コマンド例
 * 　　オリジナルタイマー 開始
 * 　　ORIGINALTIMER START
 * 
 * ■タイマーの停止
 * 　◆パラメータ
 * 　　引数1：タイマーを停止する場合の引数 [停止 or STOP]
 * 　◆コマンド例
 * 　　オリジナルタイマー 停止
 * 　　ORIGINALTIMER STOP
 * 
 * ■タイマーの表示
 * 　◆パラメータ
 * 　　引数1：タイマーを表示する場合の引数 [表示 or DISPLAY]
 * 　◆コマンド例
 * 　　オリジナルタイマー 表示
 * 　　ORIGINALTIMER DISPLAY
 * 
 * ■タイマーの非表示
 * 　◆パラメータ
 * 　　引数1：タイマーを非表示にする場合の引数 [非表示 or HIDE]
 * 　◆コマンド例
 * 　　オリジナルタイマー 非表示
 * 　　ORIGINALTIMER HIDE
 * 
 * ■タイマーの初期化
 * 　　引数1：タイマーを初期化する場合の引数 [初期化 or INITIALIZE]
 * 　◆コマンド例
 * 　　オリジナルタイマー 初期化
 * 　　ORIGINALTIMER INITIALIZE
 * 
 * ■タイマー値の取得
 * 　　引数1：タイマーに関する値を取得する場合の引数 [取得 or GET]
 * 　　引数2：取得する値の種類 [状態 or STATE or 値 or VALUE etc]
 * 　　引数3：値を格納する変数
 * 　◆コマンド例
 * 　　オリジナルタイマー 取得 状態 1
 * 　　ORIGINALTIMER GET STATE 1
 * 　　オリジナルタイマー 取得 値 1
 * 　　ORIGINALTIMER GET VALUE 1
 * 　　オリジナルタイマー 取得 日 1
 * 　　ORIGINALTIMER GET DAY 1
 * 　　オリジナルタイマー 取得 時 1
 * 　　ORIGINALTIMER GET HR 1
 * 　　オリジナルタイマー 取得 分 1
 * 　　ORIGINALTIMER GET MIN 1
 * 　　オリジナルタイマー 取得 秒 1
 * 　　ORIGINALTIMER GET SEC 1
 * 　　オリジナルタイマー 取得 コンマ秒 1
 * 　　ORIGINALTIMER GET HSEC 1
 * 
 * ■タイマー終了後のスイッチ操作
 * 　　引数1：タイマー終了後にスイッチを操作する場合の引数 [スイッチ or SWITCH]
 * 　　引数2：操作の種類  [オン or ON or オフ or OFF or リバース or REVERSE]
 * 　　引数3：操作するスイッチ番号
 * 　◆コマンド例
 * 　　オリジナルタイマー スイッチ オン 1
 * 　　ORIGINALTIMER SWITCH ON 1
 * 　　オリジナルタイマー スイッチ オフ 2
 * 　　ORIGINALTIMER SWITCH OFF 2
 * 　　オリジナルタイマー スイッチ リバース 3
 * 　　ORIGINALTIMER SWITCH REVERSE 3
 * 
 * ■タイマーカウントのリセット
 * 　　引数1：タイマーカウントのリセットを行う場合の引数 [リセット or RESET]
 * 　◆コマンド例
 * 　　オリジナルタイマー リセット
 * 　　ORIGINALTIMER RESET
 * 
 *
 * ■タイマー設定時間の操作
 *    引数1：タイマー設定時間の操作を行う場合の引数 [設定時間操作 or LIMITCHANGE]
 *    引数2：設定時間の増減[増加 or 減少 or UP or DOWN] 
 *    引数3：設定時間 (1d1h1m1s1x1c のように記載)[日 or d  時間 or h  分 or m  秒 or s x(1/10秒) c(1/100秒)]
 * 　◆コマンド例
 *     オリジナルタイマー 設定時間操作 増加 3m
 *     オリジナルタイマー 設定時間操作 減少 10s
 * 　　ORIGINALTIMER LIMITCHANGE UP 3m
 * 　　ORIGINALTIMER LIMITCHANGE DOWN 3m
 * 
 * ■タイマー実時間の操作
 *    引数1：タイマー実時間の操作を行う場合の引数 [実時間操作 or TIMECHANGE]
 *    引数2：実時間の増減[進行 or 逆行 or UP or DOWN] 
 *    引数3：設定時間 (1d1h1m1s1x1c のように記載)[日 or d  時間 or h  分 or m  秒 or s x(1/10秒) c(1/100秒)]
 * 　◆コマンド例
 *     オリジナルタイマー 実時間操作 進行 3m
 *     オリジナルタイマー 実時間操作 逆行 10s
 * 　　ORIGINALTIMER TIMECHANGE UP 3m
 * 　　ORIGINALTIMER TIMECHANGE DOWN 3m
 * 
 */

(function () {
  
  var parameters = PluginManager.parameters('OriginalTimer');
  var TimerSave = parameters['TimerSave'].toUpperCase();
  
  var OriginalTimer = null;
  var SetFlag = false;
  var RunFlag = false;
  var DisplayMode = '';
  var Count = 0;
  var CountUnit = 0;
  var CountTime = 0;
  var CommndType = '';
  var TimerType = '';
  var TimerLimit = 0;
  var day = 0;
  var hr = 0;
  var min = 0;
  var sec = 0;
  var Hsec = 0;
  var TimerText = '';
  var ShowText = '';
 
  var pictureId = 0;
  var fontsize = 32; 
  var name = '';
  var origin = 0;
  var x = 0;
  var y = 0;
  var scaleX = 100;
  var scaleY = 100;
  var opacity = 255;
  var blendMode = 0;
  
  var SwitchState = '';
  var SwitchNumber = 0;

  var prevMsec = 0;

  function getCurrentMsec(){
    return SceneManager._currentTime || Date.now();
  }

  //=============================================================================
  // Game_Interpreter_pluginCommand
  //  プラグインコマンドが実行されたときに処理されます
  //=============================================================================
  
  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
   
    if (command === "オリジナルタイマー" || command.toUpperCase() === "ORIGINALTIMER" ) {
      if ($gameTimer !== null){
        if (!Object.prototype.hasOwnProperty.call($gameTimer, '_fftfanttOriginalTimer_Run')){
           if (TimerSave == 'YES') Game_Timer.prototype.fftfanttOriginalTimer_Initialize();
        }
      }
      CommndType = args[0];
      
      if (CommndType == '設定' || CommndType.toUpperCase() == 'SET'){
        if (RunFlag){
          console.log('オリジナルタイマーは実行中です');
          return;
        }
      SetFlag = true;
      if (TimerSave == 'YES'){
        Game_Timer.prototype.fftfanttOriginalTimer_Initialize();
        $gameTimer._fftfanttOriginalTimer_Set = true;
      }
      TimerSet(args);
      }
      if (CommndType == '開始' || CommndType == '再開' || CommndType.toUpperCase() == 'START'){
        if (RunFlag){
          if ($gameTemp.isPlaytest()) console.log('オリジナルタイマーは実行中です');
          return;
        }
        if (!SetFlag){
          if (!$gameTemp.isPlaytest()) console.log('タイマーが設定されていません');
          return;
        }
        RunFlag = true;
        if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_Run = true;
        prevMsec = getCurrentMsec();
        TimerRun();
        OriginalTimer = setInterval(TimerRun,CountUnit);
      }
      
      if (CommndType == '停止' || CommndType.toUpperCase() == 'STOP'){
        clearInterval(OriginalTimer);
        RunFlag = false;
        if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_Run = false;
      }
      
      if (CommndType == '表示' || CommndType.toUpperCase() == 'DISPLAY'){
        opacity = 255
        if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_DisplayMode = '表示';
        return;
      }
      
      if (CommndType == '非表示' || CommndType.toUpperCase() == 'HIDE'){
        opacity = 0;
        if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_DisplayMode = '非表示';
        return;
      }
      
      if (CommndType == '初期化' || CommndType.toUpperCase() == 'INITIALIZE'){
        if (TimerSave == 'YES'){
          Game_Timer.prototype.fftfanttOriginalTimer_Initialize();
        }
        TimerInitialize();
        return;
      }

      if (CommndType == '取得' || CommndType.toUpperCase() == 'GET'){
        TimerGet(args);
      }
      
      if (CommndType == 'スイッチ' || CommndType.toUpperCase() == 'SWITCH'){
        if (!SetFlag){
          if (!$gameTemp.isPlaytest()) console.log('タイマーが設定されていません');
          return;
        }
        SwitchState =args[1]
        switch (args[1]) {
          case 'オン':
            SwitchState = 'ON';
            break;
          case 'オフ':
            SwitchState = 'OFF';
            break;
          case 'リバース':
            SwitchState = 'REVERSE';
            break;
        }
        SwitchNumber = parseInt(args[2], 10);
        if (TimerSave == 'YES'){
          $gameTimer._fftfanttOriginalTimer_SwitchState = SwitchState
          $gameTimer._fftfanttOriginalTimer_SwitchNumber = SwitchNumber
        }
      }
      
      if (CommndType == 'リセット' || CommndType.toUpperCase() == 'RESET'){
        if (!SetFlag){
          if (!$gameTemp.isPlaytest()) console.log('タイマーが設定されていません');
          return;
        }
        Count = 0;
        if (!RunFlag && pictureId !== 0) $gameScreen.erasePicture(pictureId);
      }
      
      if (CommndType == '設定時間操作' || CommndType.toUpperCase() == 'LIMITCHANGE'){
        if (!SetFlag){
          if (!$gameTemp.isPlaytest()) console.log('タイマーが設定されていません');
          return;
        }
        var timer_tmp_array = args[2].match(/((\d+)(d|日))?((\d+)(h|時間))?((\d+)(m|分間?))?((\d+)(s|秒間?))?((\d+)(x))?((\d+)(c))?/);
        if (args[1] == '増加' || args[1] == 'UP'){
          if (timer_tmp_array[2])  TimerLimit = TimerLimit + parseInt(timer_tmp_array[2],10) * 8640000;
          if (timer_tmp_array[5])  TimerLimit = TimerLimit + parseInt(timer_tmp_array[5],10) * 360000;
          if (timer_tmp_array[8])  TimerLimit = TimerLimit + parseInt(timer_tmp_array[8],10) * 6000;
          if (timer_tmp_array[11]) TimerLimit = TimerLimit + parseInt(timer_tmp_array[11],10) * 100;
          if (timer_tmp_array[14]) TimerLimit = TimerLimit + parseInt(timer_tmp_array[14],10) * 10;
          if (timer_tmp_array[17]) TimerLimit = TimerLimit + parseInt(timer_tmp_array[17],10);
        }
        else if (args[1] == '減少' || args[1] == 'DOWN'){
          if (timer_tmp_array[2])  TimerLimit = TimerLimit - parseInt(timer_tmp_array[2],10) * 8640000;
          if (timer_tmp_array[5])  TimerLimit = TimerLimit - parseInt(timer_tmp_array[5],10) * 360000;
          if (timer_tmp_array[8])  TimerLimit = TimerLimit - parseInt(timer_tmp_array[8],10) * 6000;
          if (timer_tmp_array[11]) TimerLimit = TimerLimit - parseInt(timer_tmp_array[11],10) * 100;
          if (timer_tmp_array[14]) TimerLimit = TimerLimit - parseInt(timer_tmp_array[14],10) * 10;
          if (timer_tmp_array[17]) TimerLimit = TimerLimit - parseInt(timer_tmp_array[17],10);
          if (TimerLimit < 0) TimerLimit = 0;
        }
          if (!RunFlag && pictureId !== 0) $gameScreen.erasePicture(pictureId); 
      }
      
      if (CommndType == '実時間操作' || CommndType.toUpperCase() == 'TIMECHANGE'){
        if (!SetFlag){
          if (!$gameTemp.isPlaytest()) console.log('タイマーが設定されていません');
          return;
        }
        var timer_tmp_array = args[2].match(/((\d+)(d|日))?((\d+)(h|時間))?((\d+)(m|分間?))?((\d+)(s|秒間?))?((\d+)(x))?((\d+)(c))?/);
        if (args[1] == '進行' || args[1].toUpperCase() == 'UP'){
          if (timer_tmp_array[2])  Count = Count + parseInt(timer_tmp_array[2],10) * 8640000;
          if (timer_tmp_array[5])  Count = Count + parseInt(timer_tmp_array[5],10) * 360000;
          if (timer_tmp_array[8])  Count = Count + parseInt(timer_tmp_array[8],10) * 6000;
          if (timer_tmp_array[11]) Count = Count + parseInt(timer_tmp_array[11],10) * 100;
          if (timer_tmp_array[14]) Count = Count + parseInt(timer_tmp_array[14],10) * 10;
          if (timer_tmp_array[17]) Count = Count + parseInt(timer_tmp_array[17],10);
          if (Count > TimerLimit) Count = TimerLimit;
        }
        else if (args[1] == '逆行' || args[1].toUpperCase() == 'DOWN'){
          if (timer_tmp_array[2])  Count = Count - parseInt(timer_tmp_array[2],10) * 8640000;
          if (timer_tmp_array[5])  Count = Count - parseInt(timer_tmp_array[5],10) * 360000;
          if (timer_tmp_array[8])  Count = Count - parseInt(timer_tmp_array[8],10) * 6000;
          if (timer_tmp_array[11]) Count = Count - parseInt(timer_tmp_array[11],10) * 100;
          if (timer_tmp_array[14]) Count = Count - parseInt(timer_tmp_array[14],10) * 10;
          if (timer_tmp_array[17]) Count = Count - parseInt(timer_tmp_array[17],10);
          if (Count < 0) Count = 0;
        }
          if (!RunFlag && pictureId !== 0) $gameScreen.erasePicture(pictureId); 
      }
      
    }
  };


  //=============================================================================
  // TimerInitialize
  //  プラグインコマンドで指定された値をセットします
  //=============================================================================
  
  function TimerInitialize(){
    OriginalTimer = null;
    SetFlag = false;
    RunFlag = false;
    DisplayMode = '';
    Count = 0;
    CountUnit = 0;
    CountTime = 0;
    CommndType = '';
    TimerType = '';
    TimerLimit = 0;
    day = 0;
    hr = 0;
    min = 0;
    sec = 0;
    Hsec = 0;
    TimerText = '';
    ShowText = '';
    pictureId = 0;
    fontsize = 32; 
    name = '';
    origin = 0;
    x = 0;
    y = 0;
    scaleX = 100;
    scaleY = 100;
    opacity = 255;
    blendMode = 0;
    SwitchState = '';
    SwitchNumber = 0;
    if (pictureId !== 0) $gameScreen.erasePicture(pictureId);
  };
  
  
  //=============================================================================
  // TimerSet
  //  プラグインコマンドで指定された値をセットします
  //=============================================================================
  
  function TimerSet(args){
    if (pictureId !== 0) $gameScreen.erasePicture(pictureId);
    TimerType = args[1];
    var timer_tmp_array = args[2].match(/((\d+)(d|日))?((\d+)(h|時間))?((\d+)(m|分間?))?((\d+)(s|秒間?))?((\d+)(x))?((\d+)(c))?/);
    TimerLimit = 0;
    if (timer_tmp_array[2])  TimerLimit = TimerLimit + parseInt(timer_tmp_array[2],10) * 8640000;
    if (timer_tmp_array[5])  TimerLimit = TimerLimit + parseInt(timer_tmp_array[5],10) * 360000;
    if (timer_tmp_array[8])  TimerLimit = TimerLimit + parseInt(timer_tmp_array[8],10) * 6000;
    if (timer_tmp_array[11]) TimerLimit = TimerLimit + parseInt(timer_tmp_array[11],10) * 100;
    if (timer_tmp_array[14]) TimerLimit = TimerLimit + parseInt(timer_tmp_array[14],10) * 10;
    if (timer_tmp_array[17]) TimerLimit = TimerLimit + parseInt(timer_tmp_array[17],10);
    pictureId = parseInt(args[3],10);
    fontsize = parseInt(args[4],10);
    x = parseInt(args[5],10);
    y = parseInt(args[6],10);
    DisplayMode = args[7];
    if (DisplayMode == '非表示' || DisplayMode.toUpperCase() == 'HIDE'){
      opacity = 0;
      if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_DisplayMode = '非表示';
    }else{
      opacity = 255;
      if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_DisplayMode = '表示';
    }
    TimerText = args[8];
    if (args.length > 8){
      for (var i=9;i<args.length; i++) {
        TimerText = TimerText + ' ' + args[i];
      }
    }
    TimerText = TimerText.toUpperCase();
    Count = 0;
    CountUnit = 1000;
    if (~TimerText.indexOf('X') || ~args[2].indexOf('x')) CountUnit = 100;
    if (~TimerText.indexOf('C') || ~args[2].indexOf('x')) CountUnit = 10;
    if (TimerSave == 'YES'){
      $gameTimer._fftfanttOriginalTimer_TimerType = TimerType;
      $gameTimer._fftfanttOriginalTimer_TimerLimit = args[2];
      $gameTimer._fftfanttOriginalTimer_TimerText = TimerText;
      $gameTimer._fftfanttOriginalTimer_PctureId = pictureId;
      $gameTimer._fftfanttOriginalTimer_FontSize = fontsize;
      $gameTimer._fftfanttOriginalTimer_X = x;
      $gameTimer._fftfanttOriginalTimer_Y = y;
      $gameTimer._fftfanttOriginalTimer_DisplayMode = DisplayMode;
      $gameTimer._fftfanttOriginalTimer_TimerText = TimerText;
      $gameTimer._fftfanttOriginalTimer_Set = true;
    }
  }


  //=============================================================================
  // TimerRun
  //  タイマー実行時の処理
  //=============================================================================
  
  function TimerRun(){
    if (Count >= TimerLimit) {
      RunFlag = false;
      if (SwitchNumber > 0){
        if (SwitchState = 'ON') SwitchState = true;
        if (SwitchState = 'OFF') SwitchState = false;
        if (SwitchState = 'REVERSE'){
          console.log(SwitchState)
          if ($gameSwitches._data[SwitchNumber] == null) SwitchState = false;
          SwitchState = !$gameSwitches._data[SwitchNumber]
        }
      $gameSwitches.setValue(SwitchNumber,SwitchState);
      }
      if (pictureId !== 0) $gameScreen.erasePicture(pictureId);
      if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_Run = false;
    }
    if (!RunFlag){
      clearInterval(OriginalTimer);
      return;
    }
    var now = getCurrentMsec();
    // NB: SceneManager.updateMain と同じ判定である事
    var fTime = (now - prevMsec) / 1000;
    if (fTime > 0.25) fTime = 0.25;
    Count = Count + Math.max(0, fTime * 100);
    prevMsec = now;
    if (TimerType == 'アップ' || TimerType.toUpperCase() == 'UP'){
      CountTime = Math.round(Count);
    }else{
      CountTime = TimerLimit - Math.round(Count);
    }
    day = parseInt(Math.floor(CountTime / 8640000),10);
    hr = parseInt((CountTime % 8640000) / 360000,10);
    min = parseInt((CountTime % 360000) / 6000,10);
    sec = parseInt((CountTime % 6000)/100,10);
    Hsec = CountTime % 100;
    ShowText = TimerText;
    ShowText = ShowText.replace("D",day);
    ShowText = ShowText.replace("HH",("0"+hr).slice(-2));
    ShowText = ShowText.replace("H",hr);
    ShowText = ShowText.replace("MM",("0"+min).slice(-2));
    ShowText = ShowText.replace("M",min);
    ShowText = ShowText.replace("SS",("0"+sec).slice(-2));
    ShowText = ShowText.replace("S",sec);
    ShowText = ShowText.replace("X",("0"+Hsec).slice(-2).substr(0,1));
    ShowText = ShowText.replace("C",("0"+Hsec).slice(-2).substr(1,1));
    name = 'OriginalTimer' + Date.now().toString();
    $gameScreen.showPicture(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    if (TimerSave == 'YES') $gameTimer._fftfanttOriginalTimer_Count = Count;
  };


  //=============================================================================
  // TimerGet
  //  プラグインコマンドで指定されたタイマーの値を取得します
  //=============================================================================

  function TimerGet(args){
    var GetType = args[1].toUpperCase
    if (args[1] == '表示値' || args[1].toUpperCase() == 'DISPLAYVALUE'){
      $gameVariables._data[parseInt(args[2],10)] = ShowText;
      return;
    }
    if (args[1] == '値' || args[1].toUpperCase() == 'VALUE'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(CountTime,10);
      return;
    }
    if (args[1] == 'セット値' || args[1].toUpperCase() == 'SETVALUE'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(TimerLimit,10);
      return;
    }
    if (args[1] == '日' || args[1].toUpperCase() == 'DAY' || args[1].toUpperCase() == 'D'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(day,10);
      return;
    }
    if (args[1] == '時' || args[1].toUpperCase() == 'HR' || args[1].toUpperCase() == 'H'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(hr,10);
      return;
    }
    if (args[1]== '分' || args[1].toUpperCase() == 'MIN' || args[1].toUpperCase() == 'M'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(min,10);
      return;
    }
    if (args[1] == '秒' || args[1].toUpperCase() == 'SEC' || args[1].toUpperCase() == 'S'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(sec,10);
      return;
    }
    if (args[1] == 'コンマ秒' || args[1].toUpperCase() == 'HSEC' || args[1].toUpperCase() == 'XC'){
      $gameVariables._data[parseInt(args[2],10)] = parseInt(Hsec,10);
      return;
    }
    if (args[1] == '状態'){
      if (RunFlag) {
        $gameVariables._data[parseInt(args[2],10)] = '実行中';
      } else {
        $gameVariables._data[parseInt(args[2],10)] = '停止中'
      }
      return;
    }
    if (args[1].toUpperCase() == 'STATE'){
      if (RunFlag) {
        $gameVariables._data[parseInt(args[2],10)] = 'RUN';
      } else {
        $gameVariables._data[parseInt(args[2],10)] = 'STOP';
      }
      return;
    }
  }


  //=============================================================================
  // Sprite_Picture
  //  画像の動的生成を追加定義します。
  //=============================================================================

  var _Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap;
  Sprite_Picture.prototype.loadBitmap = function() {
        if (this.picture()._name == name) {
      this.fftfanttOriginalTimer_UpdateShowText();
    } else {
      _Sprite_Picture_loadBitmap.call(this);
    }
  };

  Sprite_Picture.prototype.fftfanttOriginalTimer_UpdateShowText = function(bitmap) {
    this.bitmap = new Bitmap(ShowText.length * fontsize + x ,(fontsize + y) *1.0 )  ;
    this.bitmap.fontSize = fontsize;
    this.bitmap.clear();
    this.bitmap.drawText(ShowText, x, y,0 ,0, "left");
  };


  //=============================================================================
  // Scene_Save
  //  TimerSaveがNOの場合、セーブ前にオリジナルタイマーのオブジェクトを削除します
  //=============================================================================
  
  var _Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
  Scene_Save.prototype.onSavefileOk = function() {
    if (pictureId !== 0) $gameScreen.erasePicture(pictureId);
    if (TimerSave !== 'YES'){
      delete $gameTimer._fftfanttOriginalTimer_Count;
      delete $gameTimer._fftfanttOriginalTimer_Set;
      delete $gameTimer._fftfanttOriginalTimer_Run;
      delete $gameTimer._fftfanttOriginalTimer_Display;
      delete $gameTimer._fftfanttOriginalTimer_TimerType;
      delete $gameTimer._fftfanttOriginalTimer_TimerLimit;
      delete $gameTimer._fftfanttOriginalTimer_PctureId;
      delete $gameTimer._fftfanttOriginalTimer_FontSize;
      delete $gameTimer._fftfanttOriginalTimer_X;
      delete $gameTimer._fftfanttOriginalTimer_Y;
      delete $gameTimer._fftfanttOriginalTimer_DisplayMode;
      delete $gameTimer._fftfanttOriginalTimer_TimerText;
      delete $gameTimer._fftfanttOriginalTimer_SwitchState;
      delete $gameTimer._fftfanttOriginalTimer_SwitchNumber;
    }
  _Scene_Save_onSavefileOk.call(this);
  };

  //=============================================================================
  // Scene_Base
  //  戦闘終了後にピクチャが呼び出せないエラーを回避します
  //=============================================================================

  var _Scene_Base_prototype_isReady = Scene_Base.prototype.isReady;
   Scene_Base.prototype.isReady = function() {
    if (pictureId !== 0) $gameScreen.erasePicture(pictureId);
    return _Scene_Base_prototype_isReady.call(this);
  };

  //=============================================================================
  // Scene_Load
  //  ロード時にタイマーを再実行するための処理追加定義します
  //=============================================================================

  var _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
  Scene_Load.prototype.onLoadSuccess = function() {
    _Scene_Load_onLoadSuccess.call(this);
    Game_Timer.prototype.fftfanttOriginalTimer_Reinitiation();
  };
  

  //=============================================================================
  // Game_Timer
  //  オリジナルタイマー用のメソッドを追加定義します
  //=============================================================================
  
  Game_Timer.prototype.fftfanttOriginalTimer_Initialize = function() {
    if (TimerSave !== 'YES') return;
    if (pictureId !== 0) $gameScreen.erasePicture(pictureId);
    this._fftfanttOriginalTimer_Count = 0;
    this._fftfanttOriginalTimer_Set = false;
    this._fftfanttOriginalTimer_Run = false;
    this._fftfanttOriginalTimer_TimerType = '';
    this._fftfanttOriginalTimer_TimerLimit = 0;
    this._fftfanttOriginalTimer_PctureId = 0;
    this._fftfanttOriginalTimer_FontSize = 0;
    this._fftfanttOriginalTimer_X = 0;
    this._fftfanttOriginalTimer_Y = 0;
    this._fftfanttOriginalTimer_DisplayMode = '';
    this._fftfanttOriginalTimer_TimerText = '';
    this._fftfanttOriginalTimer_SwitchNumber = 0;
    this._fftfanttOriginalTimer_SwitchState = '';
  };
  
  Game_Timer.prototype.fftfanttOriginalTimer_Reinitiation = function() {
    if (TimerSave !== 'YES') return;
    if ($gameTimer == null) return;
    if (!Object.prototype.hasOwnProperty.call($gameTimer, '_fftfanttOriginalTimer_Set')) return;
    if (!$gameTimer._fftfanttOriginalTimer_Set) return;
    var args = [];
    args[0] = '設定';
    args[1] = $gameTimer._fftfanttOriginalTimer_TimerType;
    args[2] = $gameTimer._fftfanttOriginalTimer_TimerLimit;
    args[3] = $gameTimer._fftfanttOriginalTimer_PctureId;
    args[4] = $gameTimer._fftfanttOriginalTimer_FontSize;
    args[5] = $gameTimer._fftfanttOriginalTimer_X;
    args[6] = $gameTimer._fftfanttOriginalTimer_Y;
    args[7] = $gameTimer._fftfanttOriginalTimer_DisplayMode;
    args[8] = $gameTimer._fftfanttOriginalTimer_TimerText;
    SetFlag = $gameTimer._fftfanttOriginalTimer_Set
    RunFlag = $gameTimer._fftfanttOriginalTimer_Run
    SwitchState = $gameTimer._fftfanttOriginalTimer_SwitchState
    SwitchNumber = $gameTimer._fftfanttOriginalTimer_SwitchNumber
    TimerSet(args);
    Count = $gameTimer._fftfanttOriginalTimer_Count
    if (!RunFlag) return;
    clearInterval(OriginalTimer);
    prevMsec = getCurrentMsec();
    OriginalTimer = setInterval(TimerRun,CountUnit);
  };
  
})();