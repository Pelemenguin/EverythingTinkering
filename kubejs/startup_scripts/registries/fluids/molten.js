/**
 * @fileoverview Molten fluids | 熔融液体
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    KubeJSFluid
*/

KubeJSFluid.create("molten_sea_alloy", {
    temperature: 1400,
    lightLevel: 15,
    stillTexture: "kubejs:fluid/molten/alloy/sea_alloy/still",
    flowingTexture: "kubejs:fluid/molten/alloy/sea_alloy/flowing",
    presets: [
        new KubeJSFluid.Presets.Hot({
            burnTime: 10,
            damage: 6
        })
    ]
});