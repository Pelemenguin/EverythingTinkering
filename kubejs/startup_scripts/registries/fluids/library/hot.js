// priority: 5000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Hot fluids | 热流体
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
    KubeJSFluid

*/

/**
 * A fluid preset: hot / molten fluids  
 * 流体预设：热 / 熔融液体
 * 
 * Referred to Tinker's Construct's source code
 * - - - - -
 * @constructor
 * @implements {Annotation.FluidPreset}
 * - - - - -
 * @param {Annotation.FluidPresetExtraData.Hot} extraData
 */
KubeJSFluid.Presets.Hot = function(extraData) {
    /** @type {!number} */ this.burnTime = extraData.burnTime;
    /** @type {!number} */ this.damage = extraData.damage;
};

if (global.FluidData.HotFluidData === undefined) {
    global.FluidData.HotFluidData = {};
}

/**
 * @type {Annotation.FluidPreset['processReloadable']}
 */
KubeJSFluid.Presets.Hot.prototype.processReloadable = function(builder) {
    global.FluidData.HotFluidData[builder.id.toString()] = {
        burnTime: this.burnTime,
        damage: this.damage
    };
    global.FluidData.HotFluidData[builder.flowingFluid.id.toString()] = {
        burnTime: this.burnTime,
        damage: this.damage
    };
    return builder;
};

/**
 * @override
 * @type {Annotation.FluidPreset['process']}
 */
KubeJSFluid.Presets.Hot.prototype.process = function(builder) {
    this.processReloadable(builder);
    return builder.density(2000)
        .viscosity(10000)
        .temperature(1000);
};
KubeJSFluid.Presets.Hot.prototype.toString = function() {
    return `Preset[Hot]{burnTime=${this.burnTime}, damage=${this.damage}}`;
};
