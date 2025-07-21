/**
 * @fileoverview Hot fluids | 热流体
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/**
 * A fluid preset: hot / molten fluids  
 * 流体预设：热 / 熔融液体
 * 
 * Referred to Tinker's Construct's source code
 * - - - - -
 * @type {Annotation.FluidPreset}
 */
KubeJSFluid.Presets.hot = (event, name) => {
    return event.create(name)
        .density(2000)
        .viscosity(10000)
        .temperature(1000);
};

// ----- Fluid registries below ----- //

KubeJSFluid.create("molten_sea_alloy", {
    temperature: 1400,
    preset: KubeJSFluid.Presets.hot
})