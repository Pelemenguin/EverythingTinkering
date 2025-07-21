const LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity");
const FlowingFluid = Java.loadClass("net.minecraft.world.level.material.FlowingFluid");
const MapColor = Java.loadClass("net.minecraft.world.level.material.MapColor");
const BlockPathTypes = Java.loadClass("net.minecraft.world.level.pathfinder.BlockPathTypes")
const SoundEvents = Java.loadClass("net.minecraft.sounds.SoundEvents");

const FluidType = Java.loadClass("net.minecraftforge.fluids.FluidType");
const FluidType$Properties = Java.loadClass("net.minecraftforge.fluids.FluidType$Properties");
const ForgeFlowingFluid = Java.loadClass("net.minecraftforge.fluids.ForgeFlowingFluid");
const SoundActions = Java.loadClass("net.minecraftforge.common.SoundActions")

const FluidDeferredRegister = Java.loadClass("slimeknights.mantle.registration.deferred.FluidDeferredRegister");
const FlowingFluidObject = Java.loadClass("slimeknights.mantle.registration.object.FlowingFluidObject");

const BurningLiquidBlock = Java.loadClass("slimeknights.tconstruct.fluids.block.BurningLiquidBlock");

const FLUIDS = new FluidDeferredRegister("kubejs");