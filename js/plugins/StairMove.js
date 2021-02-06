//=============================================================================
// StairMove.js
// by Tsukimi
// Last Updated: 2017.12.13
//=============================================================================


/*:ja
 * @plugindesc 階段自動斜め移動
 * @author ツキミ
 * 
 * @param 右斜め上移動リージョンID
 * @desc 右斜め上に移動するリージョンID（↗↙）
 * @type number
 * @min 1
 * @max 255
 * @default 33
 * 
 * @param 左斜め上移動リージョンID
 * @desc 左斜め上に移動するリージョンID（↖↘）
 * @type number
 * @min 1
 * @max 255
 * @default 34
 * 
 *
 * @help
 * 階段自動斜め移動
 * リージョンを設置すると自動で斜め移動する。
 * 
 * -----------------
 * 
 */

var Imported = Imported || {};
Imported.TKM_StairMove = true;
var $TKMvar = $TKMvar || {};
$TKMvar.stairMove = {};

(function() {
    'use strict';
    
    var pluginName = 'StairMove';
    var getParam = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    
    $TKMvar.stairMove = {};
    // PARAMETER
    var parameters = PluginManager.parameters(pluginName);
    var temp = 0;
    $TKMvar.stairMove.regionLDRU = Number( getParam("右斜め上移動リージョンID") ) || -1;
    $TKMvar.stairMove.regionLURD = Number( getParam("左斜め上移動リージョンID") ) || -1;
    
    
    var _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        var diagonalAccess = false;
        var sm = $TKMvar.stairMove;
        
        if(this.regionId() === sm.regionLDRU || this.regionId() === sm.regionLURD) {
            if(direction === 4 || direction === 6) {
                var yDirection;
                if(this.regionId() === sm.regionLDRU) yDirection = (direction === 4) ? 2 : 8;
                else yDirection = (direction === 4) ? 8 : 2;
                
                var x2 = $gameMap.roundXWithDirection(this.x, direction);
                var y2 = $gameMap.roundYWithDirection(this.y, yDirection);
                if($gameMap.regionId(x2, y2) === this.regionId()) {
                    diagonalAccess = true;
                    this._direction = direction;
                    this.moveDiagonally(direction, yDirection);
                }
            }
        }
        
        if(!diagonalAccess) {
            _Game_Player_executeMove.apply(this, arguments);
        }
    }
    /* TODO
    Game_Player.prototype.moveDiagonally = function(horz, vert) {
        Game_CharacterBase.prototype.moveDiagonally.apply(this, arguments);
        
        if(!this.isMovementSucceeded()) {
            var sm = $TKMvar.stairMove;
            var direction = this._direction;
            
            if(this.regionId() === sm.regionLDRU || this.regionId() === sm.regionLURD) {
                if(direction === 4 || direction === 6) {
                    var yDirection = 0;
                    if(this.regionId() === sm.regionLDRU) yDirection = (direction === 4) ? 2 : 8;
                    else yDirection = (direction === 4) ? 8 : 2;

                    var x2 = $gameMap.roundXWithDirection(this.x, direction);
                    var y2 = $gameMap.roundYWithDirection(this.y, yDirection);
                    if($gameMap.regionId(x2, y2) === this.regionId()) this.checkEventTriggerTouch(x2, y2);
                }
            }
        }
    }
    */
})();
