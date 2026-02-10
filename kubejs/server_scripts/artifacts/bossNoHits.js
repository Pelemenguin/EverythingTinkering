// priority: 998

/**
 * @fileoverview Boss No Hit Artifacts | Boss无伤Artifact
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * @author Pelemenguin
 */

/* global
    global: writable
    Item
    $ArmorDefinitions
    Component
*/

let BOSS_NO_HIT = global.Artifacts.createArtifactGroup("boss_no_hit");

let ICY_TERRACUBE_NO_HIT_LOOT = BOSS_NO_HIT.createArtifact("icy_terracube", Item.getItem("tconstruct:plate_boots"), $ArmorDefinitions.PLATE.getArmorDefinition("boots"), ["tconstruct:iron", "tconstruct:seared_stone"]);
ICY_TERRACUBE_NO_HIT_LOOT.addModifier("kubejs:glacial_strike", 1);
ICY_TERRACUBE_NO_HIT_LOOT.addModifier("tconstruct:shiny", 1);
ICY_TERRACUBE_NO_HIT_LOOT.addModifier("tconstruct:protection", 2);
ICY_TERRACUBE_NO_HIT_LOOT.addModifier("tconstruct:reinforced", 2);
ICY_TERRACUBE_NO_HIT_LOOT.addTooltip(Component.translatable("item.kubejs.artifact.boss_no_hit.icy_terracube.extra").gray().italic(false));
