/**
 * @fileoverview Fluid registries | 流体注册
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/**
 * An object contains all fluids registered by this modpack.  
 * 包含所有由该整合包注册的流体的对象。
 * - - - - -
 * @constant
 */
const KubeJSFluids = { }

/**
 * An interface containing all fluid presets.
 * 包含所有流体预设的接口。
 */

/**
 * A fluid preset: hot / molten fluids  
 * 流体预设：热 / 熔融液体
 * 
 * Referred to Tinker's Construct's source code
 * - - - - -
 * @param {Registry.Fluid} event
 * The fluid registry event.
 * 流体注册事件。
 * - - - - -
 * @param {String} name
 * Id of the fluid.  
 * 液体 ID。
 * - - - - -
 * @returns {Internal.FluidType$Properties}
 */
KubeJSFluids.presetHot = (event, name) => {
    return FluidType$Properties.create()
        .density(2000)
        .viscosity(10000)
        .temperature(1000)
        .descriptionId(`fluid.kubejs.${name}`)
        .sound(SoundActions.BUCKET_FILL, SoundEvents.BUCKET_FILL_LAVA)
        .sound(SoundActions.BUCKET_EMPTY, SoundEvents.BUCKET_EMPTY_LAVA)
        // from forge lava type
        .motionScale(0.0023333333333333335)
        .canSwim(false).canDrown(false)
        .pathType(BlockPathTypes.LAVA)
        .adjacentPathType(null);
}

// - - - - - - - - - -
// Fluid Registry

/** Molten Sea Alloy */
KubeJSFluids.moltenSeaAlloy = FLUIDS.register(null, "molten_sea_alloy")
    .type(KubeJSFluids.presetHot("molten_sea_alloy")
        .temperature(1400)
        .lightLevel(15)
    )
    .block(
        BurningLiquidBlock.createBurning(MapColor.METAL, 15, 10, 6.0)
    )
    .commonTag()
    .bucket()
    .flowing();

StartupEvents.registry("minecraft:fluid", event => {
    console.info("Fluid registered!");
    console.info(FLUIDS["register(net.minecraftforge.eventbus.api.IEventBus)"]);
    console.info(ForgeEvents.eventBus());
    console.info(KubeJSFluids.moltenSeaAlloy);
    FLUIDS["register(net.minecraftforge.eventbus.api.IEventBus)"](ForgeEvents.eventBus());
});