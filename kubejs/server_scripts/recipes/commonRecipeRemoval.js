// priority: 1000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Common Recipe Removal | 一般配方删除
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ServerEvents
*/

ServerEvents.recipes(event => {

    event.remove({id: "tconstruct:tools/materials/wood/planks/default"});
    event.remove({id: "tconstruct:tools/materials/wood/logs/default"});

    // Remove grout recipes
    event.remove({id: "tconstruct:smeltery/seared/grout"});
    event.remove({id: "tconstruct:smeltery/seared/grout_multiple"});

    // Remove Create mechines
    event.remove({id: "create:crafting/kinetics/mechanical_press"});
    event.remove({id: "create:crafting/kinetics/deployer"});
    event.remove({id: "create:crafting/kinetics/mechanical_bearing"});
    event.remove({id: "create:crafting/kinetics/mechanical_drill"});
    event.remove({id: "create:crafting/kinetics/mechanical_saw"});
    event.remove({id: "create:crafting/kinetics/encased_fan"});
    event.remove({id: "create:crafting/kinetics/mechanical_mixer"});
    event.remove({id: "create:crafting/kinetics/mechanical_harvester"});
    event.remove({id: "create:crafting/kinetics/mechanical_plough"});
    event.remove({id: "create:crafting/kinetics/portable_storage_interface"});

    // Remove Create machines' ingredients
    event.remove({id: "thermal:drill_head"});
    event.remove({id: "thermal:saw_blade"});

});