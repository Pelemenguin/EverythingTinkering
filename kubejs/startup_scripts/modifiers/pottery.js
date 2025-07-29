/**
 * @fileoverview Pottery | 陶片
 * - - - - -
 * ## Pottery
 * ### Description
 * Random damage boost after tool is damaged.
 * - - - - -
 * ## 陶片
 * ### 描述
 * 工具损伤后随机伤害提升
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    ModifierRegisterer
    JavaMath
*/

let POTTERY = ModifierRegisterer.registerModifier("kubejs:pottery", ["getMeleeDamage"]);
POTTERY.getMeleeDamage((view, lvl, context, baseDamage, modifiedDamage) => {
    let boost = JavaMath.random() * (view.damage / (view.damage + view.currentDurability) * lvl);
    return modifiedDamage + boost;
});
