// priority: 999

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Chest Loot Artifacts | 箱子战利品 Artifact
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    Item
    TiCToolDefinitions
*/

let CHEST_LOOT_ARTIFACT = global.Artifacts.createArtifactGroup("chest");

let STARTUP = CHEST_LOOT_ARTIFACT.createArtifactGroup("startup");

STARTUP.createArtifact("pickaxe", Item.getItem("tconstruct:pickaxe"), TiCToolDefinitions.PICKAXE, [
    "tconstruct:rock#stone",
    "tconstruct:wood#spruce",
    "tconstruct:wood#birch"
]).addModifier("kubejs:welcome", 1);

STARTUP.createArtifact("hand_axe", Item.getItem("tconstruct:hand_axe"), TiCToolDefinitions.HAND_AXE, [
    "tconstruct:wood#oak",
    "tconstruct:wood#spruce",
    "tconstruct:wood#birch"
]).addModifier("kubejs:welcome", 1);

STARTUP.createArtifact("sword", Item.getItem("tconstruct:sword"), TiCToolDefinitions.SWORD, [
    "tconstruct:wood#oak",
    "tconstruct:wood#dark_oak",
    "tconstruct:rock#stone"
]).addModifier("kubejs:welcome", 1);

let TINKERS_WORKSHOP = CHEST_LOOT_ARTIFACT.createArtifactGroup("tinkers_workshop");

TINKERS_WORKSHOP.createArtifact("classic_pickaxe", Item.getItem("tconstruct:pickaxe"), TiCToolDefinitions.PICKAXE, [
    "tconstruct:iron",
    "tconstruct:wood#oak",
    "tconstruct:wood#spruce"
]);

TINKERS_WORKSHOP.createArtifact("non_classic_pickaxe", Item.getItem("tconstruct:pickaxe"), TiCToolDefinitions.PICKAXE, [
    "kubejs:scrapped_tinker_metal",
    "tconstruct:wood#oak",
    "tconstruct:wood#spruce"
]).persistent((_artifact, persistent) => persistent.putInt("kubejs:tinker_coating_shield", 20));
