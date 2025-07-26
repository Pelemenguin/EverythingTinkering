// priority: 1000

/**
 * @fileoverview Startup | 初始
 * - - - - -
 * ## Startup
 * ### Description
 * Given at the beginning of the game.
 * ### Specials
 * Has a `welcome` modifier.
 * - - - - -
 * ## 初始
 * ### 描述
 * 在游戏开始时给予。
 * ### 特殊
 * 有 `欢迎` 强化。
 */

/* global
    ArtifactRegisterer
    TiCToolDefinitions
    Item
*/

let STARTUP = ArtifactRegisterer.createArtifactGroup("startup");

let PICKAXE = STARTUP.createArtifact("pickaxe", Item.getItem("tconstruct:pickaxe"), TiCToolDefinitions.PICKAXE, [
    "tconstruct:rock#stone",
    "tconstruct:wood#spruce",
    "tconstruct:wood#birch"
]);
PICKAXE.addModifier("kubejs:welcome", 1);

let HAND_AXE = STARTUP.createArtifact("hand_axe", Item.getItem("tconstruct:hand_axe"), TiCToolDefinitions.HAND_AXE, [
    "tconstruct:wood#oak",
    "tconstruct:wood#spruce",
    "tconstruct:wood#birch"
]);
HAND_AXE.addModifier("kubejs:welcome", 1);

let SWORD = STARTUP.createArtifact("sword", Item.getItem("tconstruct:sword"), TiCToolDefinitions.SWORD, [
    "tconstruct:wood#oak",
    "tconstruct:wood#dark_oak",
    "tconstruct:rock#stone"
]);
SWORD.addModifier("kubejs:welcome", 1);