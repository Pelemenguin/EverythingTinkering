// priority: 50

/**
 * @fileoverview Hot fluids | 热流体
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

/**
 * @override
 * @type {Annotation.FluidPreset['process']}
 */
KubeJSFluid.Presets.Hot.prototype.process = function(builder) {
    return builder.density(2000)
        .viscosity(10000)
        .temperature(1000);
};
KubeJSFluid.Presets.Hot.prototype.toString = function() {
    return `Preset[Hot]{burnTime=${this.burnTime}, damage=${this.damage}}`;
};