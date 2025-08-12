// priority: 10000

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
    StartupEvents
    console
*/

/**
 * - Used for modpack fluid operations.  
 * - 用于整合包流体管理。
 * - - - - -
 * @class
 * @interface
 */
function KubeJSFluid () {}

if (global.Fluids === undefined) {
    /**
     * - A list for all fluids for the modpack.
     * - 整合包中所有流体的列表。
     * - - - - -
     * @type {Object<string, Internal.FluidBuilder>}
     */
    KubeJSFluid.ALL = {};
} else {
    KubeJSFluid.ALL = Object.assign({}, global.Fluids.ALL);
}

if (global.Fluids === undefined) {
    /**
     * - A list for properties of all fluids for the modpack.
     * - 整合包中所有流体属性的列表。
     * - - - - -
     * @type {Object<string, Annotation.FluidProperties>}
     */
    KubeJSFluid.PROPERTIES = {};
} else {
    KubeJSFluid.PROPERTIES = Object.assign({}, global.Fluids.PROPERTIES);
}

/**
 * An interface containing all fluid presets.
 * 包含所有流体预设的接口。
 * - - - - -
 * @class
 * @interface
 */
KubeJSFluid.Presets = function () {};

/**
 * Create a new fluid.
 * 创建一个新的流体。
 * - - - - -
 * @param {string} name
 * @param {Annotation.FluidProperties} properties
 */
KubeJSFluid.create = (name, properties) => {
    KubeJSFluid.PROPERTIES[name] = properties;
};

/**
 * @param {Annotation.FluidProperties} properties 
 * - - - - -
 * @private
 */
let logProperties = (properties) => {
    if (properties.presets !== undefined) {
        console.info(`|- Presets:`);
        properties.presets.forEach(p => {
            console.info(`|  - ${p}`);
        });
    }
    console.info(`|- Temperature: ${properties.temperature}`);
    console.info(`|- Light level: ${properties.lightLevel}`);
    console.info(`|- Tooltip tag: ${properties.fluidTooltip}`);
};

// - - - - - - - - - -
// Fluid Registry

StartupEvents.registry("minecraft:fluid", event => {
    for (let key in KubeJSFluid.PROPERTIES) {
        let {
            presets,
            temperature,
            lightLevel,
            stillTexture,
            flowingTexture,
            fluidTooltip
        } = KubeJSFluid.PROPERTIES[key];
        /** @type {!Internal.FluidBuilder} */
        let builder = event.create(key);
        KubeJSFluid.ALL[key] = builder;
        if (presets !== undefined) {
            presets.forEach(p => {
                builder = p.process(builder);
            });
        }
        if (lightLevel !== undefined) {
            builder.block = builder.block.lightLevel(lightLevel);
        }
        if (stillTexture !== undefined) {
            builder.stillTexture(stillTexture);
        }
        if (flowingTexture !== undefined) {
            builder.flowingTexture(flowingTexture);
        }
        builder = temperature === undefined ? builder : builder.temperature(temperature);
        builder.tag(`kubejs:${key}`).tag(fluidTooltip);
        builder.flowingFluid.tag(`kubejs:${key}`).tag(fluidTooltip);

        console.info(`Fluid \`${key}\` registered with properties:`);
        logProperties(KubeJSFluid.PROPERTIES[key]);
    }
});

KubeJSFluid.getProperties = (/** @type {string} */ name) => KubeJSFluid.PROPERTIES[name];
KubeJSFluid.getBuilder = (/** @type {string} */ name) => KubeJSFluid.ALL[name];

KubeJSFluid.reload = () => {
    for (let key in KubeJSFluid.PROPERTIES) {
        let {
            presets
        } = KubeJSFluid.PROPERTIES[key];
        let builder = KubeJSFluid.ALL[key];
        if (presets !== undefined) {
            presets.forEach(p => {
                builder = p.processReloadable(builder);
            });
        }
    }
};

global.Fluids = KubeJSFluid;

if (global.FluidData === undefined) {
    /**
     * @type {{
     *     HotFluidData: {[id: string]: Annotation.FluidPresetExtraData.Hot}
     * }}
     */
    global.FluidData = {};
}
