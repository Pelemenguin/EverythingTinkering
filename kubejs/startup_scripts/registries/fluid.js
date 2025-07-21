/**
 * @fileoverview Fluid registries | 流体注册
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/**
 * Used for modpack fluid operations.  
 * 用于整合包流体管理。
 * - - - - -
 * @class
 */
const KubeJSFluid = function () {};
/**
 * A list for all fluids for the modpack.
 * 整合包中所有流体的列表。
 * - - - - -
 * @type {Object<string, Internal.FluidBuilder>}
 */
KubeJSFluid.ALL = {};
/**
 * A list for properties of all fluids for the modpack.
 * 整合包中所有流体属性的列表。
 * - - - - -
 * @type {Object<string, Annotation.FluidProperties>}
 */
KubeJSFluid.PROPERTIES = {};

/**
 * An interface containing all fluid presets.
 * 包含所有流体预设的接口。
 * - - - - -
 * @class
 * @interface
 */
KubeJSFluid.Presets = function () {};

/**
 * @typedef {function(Registry.Fluid, string): Internal.FluidBuilder} Annotation.FluidPreset
 * - A fluid preset.
 * - 一个流体预设。
 */

/**
 * A fluid preset: hot / molten fluids  
 * 流体预设：热 / 熔融液体
 * 
 * Referred to Tinker's Construct's source code
 * - - - - -
 * @param {Registry.Fluid} event
 * - The fluid registry event.
 * - 流体注册事件。
 * - - - - -
 * @param {string} name
 * - Id of the fluid.  
 * - 液体 ID。
 * - - - - -
 * @returns {Internal.FluidBuilder}
 */
KubeJSFluid.Presets.hot = (event, name) => {
    return event.create(name)
        .density(2000)
        .viscosity(10000)
        .temperature(1000);
};

/**
 * Create a new fluid.
 * 创建一个新的流体。
 * - - - - -
 * @typedef {Object} Annotation.FluidProperties
 * @property {?number} temperature
 * - Fluid temperature.
 * - 液体温度。
 * @property {?Annotation.FluidPreset} preset
 * @todo More builder properties.
 * - - - - -
 * @param {string} name
 * @param {Annotation.FluidProperties} properties
 */
KubeJSFluid.create = (name, properties) => {
    KubeJSFluid.PROPERTIES[name] = properties;
};

// - - - - - - - - - -
// Fluid Registry

StartupEvents.registry("minecraft:fluid", event => {
    for (let key in KubeJSFluid.PROPERTIES) {
        let {
            temperature,
            preset
        } = KubeJSFluid.PROPERTIES[key];
        /** @type {Internal.FluidBuilder} */
        let builder = null;
        if (preset === undefined) {
            builder = event.create(key);
        } else {
            builder = preset(event, key)
        }
        KubeJSFluid.ALL[key] = builder
            .temperature(temperature);
    }
});

KubeJSFluid.create("molten_sea_alloy", {
    temperature: 1400,
    preset: KubeJSFluid.Presets.hot
})