/*---------------------------------------------------------------------------*
 * Torigoya_GameRecorder.js
 *---------------------------------------------------------------------------*
 * 2018/06/06 ru_shalm
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc ゲーム画面録画システムさん(β)
 * @author ru_shalm
 *
 * @help
 * 【重要】
 * ・このプラグインはRPGツクールMV 1.6以上で動作します
 * ・長時間録画するとゲームごと死に至ります
 *
 *
 * ゲーム画面を録画する機能を追加します。
 * 録画したファイルはセーブフォルダの横に保存されます。
 * ブラウザの場合はファイル保存ダイアログが表示されます。
 *
 * ------------------------------------------------------------
 * ■ プラグインコマンド
 * ------------------------------------------------------------
 *
 * ● ゲーム画面の録画を開始する
 * 画面録画 開始
 *
 * ● ゲーム画面の録画を終了する
 * 画面録画 終了
 *
 */

(function (global) {
    'use strict';

    var GameRecorder = {
        name: 'Torigoya_GameRecorder'
    };
    GameRecorder.settings = {};

    // -------------------------------------------------------------------------
    // Constant
    var MIMETYPE_LIST = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm;codecs=h264',
        'video/webm',
        'video/mpeg'
    ];

    // -------------------------------------------------------------------------
    // functions

    GameRecorder.isSupported = function () {
        return !!this.supportedMimeType();
    };

    GameRecorder.supportedMimeType = function () {
        if (!window.MediaRecorder) return null;

        for (var i = 0; i < MIMETYPE_LIST.length; ++i) {
            if (MediaRecorder.isTypeSupported(MIMETYPE_LIST[i])) {
                return MIMETYPE_LIST[i];
            }
        }
        return null;
    };

    GameRecorder.generateFileName = function () {
        var ext = this.supportedMimeType().match(/\/([^;]+)/)[1];
        var date = new Date();

        return [
            'video_',
            date.getFullYear(),
            String(date.getMonth() + 1).padZero(2),
            String(date.getDate()).padZero(2),
            '_',
            String(date.getHours() + 1).padZero(2),
            String(date.getMinutes()).padZero(2),
            String(date.getSeconds()).padZero(2),
            '.',
            ext
        ].join('');
    };

    GameRecorder.saveBlob = function (blob) {
        if (StorageManager.isLocalMode()) {
            var reader = new FileReader();
            reader.addEventListener('loadend', function () {
                var buffer = Buffer.from(reader.result);

                var path = require('path');
                var fs = require('fs');
                var dirPath = path.join(StorageManager.localFileDirectoryPath(), '..', 'video');
                var filePath = path.join(dirPath, this.generateFileName());
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(filePath, buffer);
            }.bind(this));
            reader.readAsArrayBuffer(blob);
        } else {
            var element = document.createElement('a');
            element.setAttribute('href', window.URL.createObjectURL(blob));
            element.setAttribute('download', this.generateFileName());
            element.click();
        }
    };

    // -------------------------------------------------------------------------
    // Recorder
    function Recorder() {
        this.initialize.apply(this, arguments);
    }

    Recorder.prototype.initialize = function () {
        this._listeners = {};
        this._reset();
    };

    Recorder.prototype.addEventListener = function (name, func) {
        this._listeners[name] = this._listeners[name] || [];
        this._listeners[name].push(func);
    };

    Recorder.prototype.removeEventListener = function (name, func) {
        if (!this._listeners[name]) return;
        this._listeners[name] = this._listeners[name].filter(function (f) {
            return f !== func;
        });
    };

    Recorder.prototype.emit = function (name, data) {
        if (!this._listeners[name]) return;
        this._listeners[name].forEach(function (func) {
            func(data);
        });
    };

    Recorder.prototype.start = function () {
        if (this._isRecording) return;

        this._reset();
        var stream = this._createStream();

        this._recorder = new MediaRecorder(stream, {mimeType: this._usableMimeType()});
        this._recorder.addEventListener('dataavailable', function (e) {
            this._chunks.push(e.data);
        }.bind(this));
        this._recorder.start(5000);
        this._isRecording = true;

        this.emit('start', this);
    };

    Recorder.prototype.stop = function () {
        if (!this._isRecording) return Promise.reject();

        return new Promise(function (resolve) {
            this._isRecording = false;
            this._recorder.addEventListener('stop', function (_e) {
                this._result = new Blob(this._chunks, {type: this._usableMimeType()});
                resolve(this._result);
                this.emit('stop', this);
            }.bind(this));
            this._recorder.stop();
        }.bind(this));
    };

    Recorder.prototype.isRecording = function () {
        return this._isRecording;
    };

    Recorder.prototype._reset = function () {
        this._chunks = [];
        this._isRecording = false;
        this._result = null;
    };

    Recorder.prototype._usableMimeType = function () {
        for (var i = 0; i < MIMETYPE_LIST.length; ++i) {
            if (MediaRecorder.isTypeSupported(MIMETYPE_LIST[i])) {
                return MIMETYPE_LIST[i];
            }
        }
        return MIMETYPE_LIST[MIMETYPE_LIST.length - 1];
    };

    Recorder.prototype._createStream = function () {
        var audioContext = window.WebAudio._context;
        var audioNode = window.WebAudio._masterGainNode;
        var destination = audioContext.createMediaStreamDestination();
        audioNode.connect(destination);

        var oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 0;
        oscillator.start();
        oscillator.connect(destination);

        var audioStream = destination.stream;
        var canvasStream = document.querySelector('canvas').captureStream();

        var mediaStream = new MediaStream();
        [canvasStream, audioStream].forEach(function (stream) {
            stream.getTracks().forEach(function (track) {
                mediaStream.addTrack(track);
            });
        });

        return mediaStream;
    };

    GameRecorder.Recorder = Recorder;

    // -------------------------------------------------------------------------
    // シングルトンなレコーダー

    var globalRecorder = null;
    GameRecorder.getRecorder = function () {
        globalRecorder = globalRecorder || new Recorder();
        return globalRecorder;
    };

    // -------------------------------------------------------------------------
    // プラグインコマンド

    var upstream_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        if (command === 'GameRecorder' || command === '画面録画') {
            switch (args[0]) {
                case 'start':
                case 'スタート':
                case '開始':
                    if (GameRecorder.isSupported()) {
                        GameRecorder.getRecorder().start();
                    }
                    return;
                case 'stop':
                case 'ストップ':
                case '終了':
                    if (GameRecorder.isSupported()) {
                        GameRecorder.getRecorder().stop().then(function (e) {
                            GameRecorder.saveBlob(e);
                        });
                    }
                    return;
            }
        }
        upstream_Game_Interpreter_pluginCommand.apply(this, arguments);
    };

    // -------------------------------------------------------------------------
    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.GameRecorder = GameRecorder;
})(this);
