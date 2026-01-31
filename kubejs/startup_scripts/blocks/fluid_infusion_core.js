// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Fluid Infusion Core | 流体注入核心
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
    $DepotBlockEntity
    DustParticleOptions
    Vec3f
    Component
    Utils
    Blocks
    InputItem
    Items
    $ItemEntity
    BlockProperties
    $Boolean
*/

global.BlockFunctions.FluidInfusionCore = {};

/** @type {Internal.BlockEntityCallback_} */
global.BlockFunctions.FluidInfusionCore.blockEntityTick;

/** @type {Internal.Consumer_<Internal.BlockRightClickedEventJS>} */
global.BlockFunctions.FluidInfusionCore.rightClick;

/**
 * @typedef {{
 *     inputMaterial: Internal.MaterialVariantId,
 *     inputFluids: Internal.Fluid[],
 *     outputMaterial: Internal.MaterialVariantId
 * }} Annotation.BatchRecipes.FluidInfusion.Material
 * 
 * @typedef {{
 *     inputItem: Internal.Ingredient,
 *     inputFluids: Internal.Fluid[],
 *     outputItem: Internal.ItemStack,
 * }} Annotation.BatchRecipes.FluidInfusion.Item
 */

/** @type {Internal.Map<Internal.MaterialVariantId, Internal.Map<Internal.Fluid[], Annotation.BatchRecipes.FluidInfusion.Material>>} */
global.BlockFunctions.FluidInfusionCore.MATERIAL_RECIPES = Utils.newMap();

/** @type {Internal.Map<Internal.Ingredient, Internal.Map<Internal.Fluid[], Annotation.BatchRecipes.FluidInfusion.Item>>} */
global.BlockFunctions.FluidInfusionCore.RECIPES = Utils.newMap();

let testRecipe = {
    inputItem: InputItem.of(Items.IRON_INGOT).kjs$asIngredient(),
    inputFluids: [
        Blocks.WATER.getFluid(),
        Blocks.WATER.getFluid(),
        Blocks.WATER.getFluid(),
        Blocks.LAVA.getFluid()
    ],
    outputItem: Items.GOLD_INGOT.getDefaultInstance()
};

let tempMap = Utils.newMap();

tempMap.put(testRecipe.inputFluids, testRecipe);

global.BlockFunctions.FluidInfusionCore.RECIPES.put(testRecipe.inputItem, tempMap);

(function () {

const FLUID_INFUSION_CORE_ID = "kubejs:fluid_infusion_core";

global.BlockFunctions.FluidInfusionCore.blockEntityTick = (blockEntity) => {
    let depot = blockEntity.getBlock().getUp();
    let depotBE = depot.getEntity();

    if (!(depotBE instanceof $DepotBlockEntity)) return;

    let itemOn = depotBE.getHeldItem();

    if (itemOn == null || itemOn.isEmpty()) return;


};

/**
 * 
 * @param {Internal.Level} world 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {boolean} error
 */
let queryParticle = (world, x, y, z, error) => {
    world.spawnParticles(new DustParticleOptions(error ? new Vec3f(1, 0, 0) : new Vec3f(0, 1, 1), 1), false, x + 0.5, y + 0.5, z + 0.5, 0.2, 0.4, 0.2, 50, 0.1);
};

const DIRECTIONS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const MAX_SEARCH_DISTANCE = 4;

global.BlockFunctions.FluidInfusionCore.rightClick = (event) => {

    let blockContainer = event.getBlock();
    let world = event.getLevel();
    let clicker = event.getPlayer();

    let depotContainer = blockContainer.getUp();
    let depotBE = depotContainer.getEntity();
    if (!(depotBE instanceof $DepotBlockEntity)) {
        queryParticle(world, blockContainer.getX(), blockContainer.getY() + 1, blockContainer.getZ(), true);
        clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.missing_depot").red(), true);
        return;
    }
    queryParticle(world, blockContainer.getX(), blockContainer.getY() + 1, blockContainer.getZ(), false);

    let foundDistance = -1;
    for (let d = 1; d <= MAX_SEARCH_DISTANCE; d++) {
        let isAtThisDistance = false;

        for (let [dx, dy] of DIRECTIONS) {
            let newBlockPos = blockContainer.getPos().offset(dx * d, 0, dy * d);
            let newBlockContainer = world.getBlock(newBlockPos);

            if (newBlockContainer.getBlockState().canOcclude()) {
                queryParticle(world, newBlockContainer.getX(), newBlockContainer.getY(), newBlockContainer.getZ(), true);
                clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.solid_blocking").red(), true);
                return;
            }

            let isSource = newBlockContainer.getBlockState().getFluidState().isSource();

            if (isSource) {
                isAtThisDistance = true;
                break;
            }
        }

        if (isAtThisDistance) {
            let err = false;
            for (let [dx, dy] of DIRECTIONS) {
                let newBlockPos = blockContainer.getPos().offset(dx * d, 0, dy * d);
                let newBlockContainer = world.getBlock(newBlockPos);
                let isSource = newBlockContainer.getBlockState().getFluidState().isSource();
                if (!isSource) {
                    queryParticle(world, newBlockContainer.getX(), newBlockContainer.getY(), newBlockContainer.getZ(), true);
                    err = true;
                } else {
                    queryParticle(world, newBlockContainer.getX(), newBlockContainer.getY(), newBlockContainer.getZ(), false);
                }
            }
            if (err) {
                clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.incomplete_fluid").red(), true);
                return;
            } else {
                foundDistance = d;
                break;
            }
        }
    }

    if (foundDistance < 0) {
        clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.missing_fluid").red(), true);
        return;
    }

    /** @type {Internal.Fluid[]} */
    let fluidsFound = [];
    for (let [dx, dy] of DIRECTIONS) {
        let newBlockPos = blockContainer.getPos().offset(dx * foundDistance, 0, dy * foundDistance);
        let newBlockContainer = world.getBlock(newBlockPos);
        let fluid = newBlockContainer.getBlockState().getFluidState().getType();

        fluidsFound.push(fluid);
    }

    /** @type {Annotation.BatchRecipes.FluidInfusion.Item} */
    let foundRecipe = null;
    global.BlockFunctions.FluidInfusionCore.RECIPES.forEach((ingredient, innerMap) => {
        if (foundRecipe != null) return;
        let pass = ingredient["test(net.minecraft.world.item.ItemStack)"](depotBE.getHeldItem());
        if (!pass) return;
        innerMap.forEach((fluids, recipe) => {
            if (foundRecipe != null) return;

            let fluidsFoundCopy = fluidsFound.slice();

            let allMatch = true;
            for (let requiredFluid of fluids) {
                let thisMatch = false;

                fluidsFoundCopy.forEach((fluid, index) => {
                    if (thisMatch) return;
                    if (fluid == null) return;
                    if (requiredFluid.equals(fluid)) {
                        thisMatch = true;
                        fluidsFoundCopy[index] = null;
                    }
                });
                if (!thisMatch) {
                    allMatch = false;
                    return;
                }
            }
            if (allMatch) {
                foundRecipe = recipe;
            }
        });
    });

    if (foundRecipe == null) return;

    // Clear fluid
    for (let [dx, dy] of DIRECTIONS) {
        let newBlockPos = blockContainer.getPos().offset(dx * foundDistance, 0, dy * foundDistance);
        let bottomFluidType = world.getBlock(newBlockPos).getBlockState().getFluidState().getType();
        
        // Consume the top fluid of a fluid pillar first
        while (true) {
            newBlockPos = newBlockPos.offset(0, 1, 0);
            let newBlockContainer = world.getBlock(newBlockPos);
            let thisState = newBlockContainer.getBlockState().getFluidState();
            if (!(thisState.isSource() && thisState.getType().equals(bottomFluidType))) break;
        }

        let topFluidPos = newBlockPos.offset(0, -1, 0);
        if (world.getBlockState(topFluidPos).hasProperty(BlockProperties.WATERLOGGED)) {
            world.setBlockAndUpdate(topFluidPos, world.getBlockState(topFluidPos).setValue(BlockProperties.WATERLOGGED, $Boolean.valueOf(false)));
        } else {
            world.setBlockAndUpdate(topFluidPos, Blocks.AIR.defaultBlockState());
        }
    }    

    // Replace item
    if (foundRecipe != null) {
        depotBE.getHeldItem().shrink(1);
        let recipeResult = new $ItemEntity(world, depotContainer.getX() + 0.5, depotContainer.getY() + 1, depotContainer.getZ() + 0.5, foundRecipe.outputItem.copy(), 0, 0.4, 0);
        world.addFreshEntity(recipeResult);
        depotBE.notifyUpdate();
    }

};

StartupEvents.registry("minecraft:block", event => {
    event.create(FLUID_INFUSION_CORE_ID)
        .blockEntity(be => {
            be.tick((blockEntity) => global.BlockFunctions.FluidInfusionCore.blockEntityTick(blockEntity));
        })
        .rightClick((event) => global.BlockFunctions.FluidInfusionCore.rightClick(event))
    ;
});

})();
