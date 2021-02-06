//=============================================================================
// EnemyPaper.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 エネミーの姿だけ変えます。
 * @author まっつＵＰ
 *
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * （プラグインコマンド）
 * command:EPbattlername
 * args:0 enemyIndex(敵キャラのindex)
 *      1 name(画像名)
 * 特定の順列のエネミーを別の画像に変えます。
 * 
 * 例：EPbattlername 0 Orc
 * 0番目の敵キャラをOrc.pngの画像に変更します。
 * 
 * 
 * command:EPbattlerhue
 * args:0 enemyIndex(敵キャラのindex)
 *      1 hue(数値)
 * 特定の順列のエネミーの色調を変更します。
 * 
 * 例：EPbattlerhue 0 180
 * 0番目の敵キャラのhueを180に変更します。
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
//var parameters = PluginManager.parameters('EnemyPaper');

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
        switch(command){
            case 'EPbattlername':
                var enemy = $gameTroop.members()[args[0]];
                if(enemy) enemy.EPsetname(args[1])
            break;

            case 'EPbattlerhue':
                var enemy = $gameTroop.members()[args[0]];
                if(enemy) enemy.EPsethue(Number(args[1] || -1));
            break;
        }
};

var _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
Game_Enemy.prototype.initMembers = function(){
    _Game_Enemy_initMembers.call(this);
    this._EPbattlername = null;
    this._EPbattlerhue = -1;
    this._EPforce = false;
};

Game_Enemy.prototype.EPsetname = function(name) {
    this._EPbattlername = name;
    this._EPforce = true;
};

Game_Enemy.prototype.EPsethue = function(value) {
    this._EPbattlerhue = value;
    this._EPforce = true;
};

Game_Enemy.prototype.EPischange = function() {
    if(!this._EPforce) return false;
    return this._EPbattlername || this._EPbattlerhue >= 0;
};

var _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
Sprite_Enemy.prototype.updateBitmap = function() {
    if (this._enemy.EPischange()){
        var name = this._enemy._EPbattlername || this._enemy.battlerName();
        var hue = this._enemy._EPbattlerhue;
        console.log(name)
        hue = Math.round(hue.clamp(0, 360));
        this._enemy._EPforce = false;
        this.loadBitmap(name, hue);
        this.initVisibility();
    }else{
        _Sprite_Enemy_updateBitmap.call(this);
    }
};
 
})();
