//=============================================================================
// ExcludeStatus.js
// ----------------------------------------------------------------------------
// <利用規約>
//  利用はRPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
//  商用、非商用、ゲームの内容を問わず利用可能です。
//  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
//  二次配布や転載は禁止します。
//  ソースコードURL、ダウンロードURLへの直接リンクも禁止します。
//  不具合対応以外のサポートやリクエストは受け付けておりません。
//  スクリプト利用により生じたいかなる問題においても、一切責任を負いかねます。
// ----------------------------------------------------------------------------
//  Ver1.01  2016/01/30  装備画面に対応しました。
//  Ver1.00  2016/01/29  初版
//=============================================================================

/*:
 * @plugindesc 指定したステータス項目を、ステータス画面と装備画面に表示しないようにします。
 * @author こま
 *
 * @param Exclude Status
 * @desc ステータス画面と装備画面で表示しない項目を指定します。
 *（詳細はヘルプを参照）
 * @default 0
 *
 * @help Exclude Statusパラメータに、非表示にしたい項目を指定してください。
 * 項目はカンマ区切りで複数指定できます。
 *
 * 1：攻撃力
 * 2：防御力
 * 3：魔法力
 * 4：魔法防御
 * 5：敏捷性
 * 6：運
 *
 * 3,4と指定すると、魔法力と魔法防御を表示しなくなります。
 */

(function(){
    var parameters = PluginManager.parameters('ExcludeStatus');
    var ExcludeStatus = parameters['Exclude Status'];

    ExcludeStatus = ExcludeStatus.split(',');

    Window_Status.prototype.drawParameters = function(x, y) {
        var lineHeight = this.lineHeight();
        var line = 0;
        for (var i = 0; i < 6; i++) {
            if (!ExcludeStatus.some(function(s) { return i + 1 === Number(s); })) {
                var paramId = i + 2;
                var y2 = y + lineHeight * line;
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(paramId), x, y2, 160);
                this.resetTextColor();
                this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
                line++;
            }
        }
    };
    
    Window_EquipStatus.prototype.refresh = function() {
        this.contents.clear();
        if (this._actor) {
            this.drawActorName(this._actor, this.textPadding(), 0);
            var line = 0;
            for (var i = 0; i < 6; i++) {
                if (!ExcludeStatus.some(function(s) { return i + 1 === Number(s); })) {
                    this.drawItem(0, this.lineHeight() * (1 + line), 2 + i);
                    line++;
                }
            }
        }
    };
}());
