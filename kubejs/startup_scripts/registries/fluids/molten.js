/**
 * @fileoverview Molten fluids | 熔融液体
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
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