// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Fluid registry init
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
    $FluidDeferredRegisterExtension
    FMLJavaModLoadingContext
*/

/**
 * Stores registered fluids.  
 * 储存已注册的流体。
 * 
 * @type {}
 */
global.Fluids;

if (global.Fluids == undefined) {
    global.Fluids = {};

    global.Fluids.register = new $FluidDeferredRegisterExtension("kubejs");
}

/**
 * The fluid deferred register.  
 * 流体延迟注册。
 * 
 * @type {}
 */
global.Fluids.register;

/**
 * @type {(fluids: Internal.FluidDeferredRegisterExtension) => void}
 */
global.Fluids.registryFunction = () => {};

/**
 * @param {(fluids: Internal.FluidDeferredRegisterExtension) => void} callback 
 */
global.Fluids.addFluidRegistry = (callback) => {
    let original = global.Fluids.registryFunction;
    global.Fluids.registryFunction = (fluids) => {
        original(fluids);
        callback(fluids);
    };
};

StartupEvents.init(() => {
    global.Fluids.registryFunction(global.Fluids.register);

    global.Fluids.register["register(net.minecraftforge.eventbus.api.IEventBus)"](FMLJavaModLoadingContext.get().getModEventBus());
});
