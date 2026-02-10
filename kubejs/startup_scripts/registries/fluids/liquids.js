/**
 * @fileoverview Liquid Fluids | 液体流体
 * @author Pelemenguin
 */

/* global
    global: writable
    $FluidType$Properties
    $SoundActions
    $MapColor
*/

/** @type {Internal.FlowingFluidObject<Internal.FlowingFluid>} */
global.Fluids.ANIMATION_FLUID;

global.Fluids.addFluidRegistry((fluids) => {

    /**
     * @type {Internal.FlowingFluidObject<Internal.FlowingFluid>}
     */
    global.Fluids.ANIMATION_FLUID = fluids["register(java.lang.String)"]("animation_fluid").type(
        $FluidType$Properties.create()
            .sound($SoundActions.BUCKET_FILL, "item.bucket.fill")
            .sound($SoundActions.BUCKET_EMPTY, "item.bucket.empty")
            .motionScale(0.0023333333333333335) // idk, tconstruct did so
            .canExtinguish(true)
            .temperature(310)
    ).bucket().block($MapColor.COLOR_CYAN, 15).commonTag().flowing();

});
