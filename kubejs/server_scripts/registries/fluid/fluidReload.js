// priority: 1000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Fluid registries | 流体注册
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
    ServerEvents
*/

global.Fluids.reload();

ServerEvents.tags("minecraft:fluid", event => {
    Object.keys(global.Fluids.PROPERTIES).forEach(fluidName => {
        let fluidProperty = global.Fluids.getProperties(fluidName);
        let fluidBuilder = global.Fluids.getBuilder(fluidName);
        if (fluidProperty.fluidTooltip !== undefined) {
            event.add(fluidProperty.fluidTooltip, fluidBuilder.id.toString(), fluidBuilder.flowingFluid.id.toString());
        }
    });
});
