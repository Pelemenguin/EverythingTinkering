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

});