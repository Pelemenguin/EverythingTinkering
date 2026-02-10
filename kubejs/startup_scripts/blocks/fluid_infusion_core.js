// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Fluid Infusion Core | 流体注入核心
 * @author Pelemenguin
 */

/* global
    global: writable
    StartupEvents
    $DepotBlockEntity
    DustParticleOptions
    Vec3f
    Component
    Blocks
    $ItemEntity
    BlockProperties
    $Boolean
    $MaterialItem
    $RepairKitItem
    $MaterialStatsId
    $FakeIngotItem
    ToolPartItem
*/

/** @type {Internal.BlockEntityCallback_} */
global.BlockFunctions.FluidInfusionCore.blockEntityTick;

/** @type {Internal.Consumer_<Internal.BlockRightClickedEventJS>} */
global.BlockFunctions.FluidInfusionCore.rightClick;

(function () {

const FLUID_INFUSION_CORE_ID = "kubejs:fluid_infusion_core";

const DIRECTIONS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const MAX_SEARCH_DISTANCE = 4;

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

/**
 * @param {Internal.Fluid[]} foundFluids 
 * @param {Internal.Fluid[]} requiredFluids 
 * @returns {boolean}
 */
let queryFluids = (foundFluids, requiredFluids) => {
    let foundFluidsCopy = foundFluids.slice();
    
    for (let requiredFluid of requiredFluids) {
        for (let i = 0; i < foundFluidsCopy.length; i++) {
            let fluid = foundFluidsCopy[i];
            if (fluid == null) continue;
            if (requiredFluid.equals(fluid)) {
                foundFluidsCopy[i] = null;
                break;
            }
        }
    }
    for (let fluid of foundFluidsCopy) {
        if (fluid != null) return false;
    }
    return true;
};

/**
 * @param {Internal.ItemStack} inputItemStack 
 * @param {Internal.Fluid[]} fluidsFound
 */
let findOutputItem = (inputItemStack, fluidsFound) => {
    let depotHeldItemType = inputItemStack.getItem();

    /** @type {Internal.ItemStack} */
    let outputItem = null;

    if (depotHeldItemType instanceof $MaterialItem) {
        let variantId = depotHeldItemType.getMaterial(inputItemStack);

        /** @type {Annotation.BatchRecipes.FluidInfusion.Material} */
        let foundRecipe = null;

        global.BlockFunctions.FluidInfusionCore.MATERIAL_RECIPES.forEach((ingredient, innerMap) => {
            if (foundRecipe != null) return;
            if (ingredient.getId().equals(variantId.getId())) {
                innerMap.forEach((fluids, recipe) => {
                    if (foundRecipe != null) return;
                    let match = queryFluids(fluidsFound, fluids);

                    if (depotHeldItemType instanceof $RepairKitItem) {
                        if (!recipe.statTypes.contains(new $MaterialStatsId("tconstruct", "repair_kit"))) {
                            match = false;
                        }
                    } else if (depotHeldItemType instanceof $FakeIngotItem) {
                        if (!recipe.statTypes.contains(new $MaterialStatsId("tconstruct", "ingot"))) {
                            match = false;
                        }
                    } else if (depotHeldItemType instanceof ToolPartItem) {
                        if (!recipe.statTypes.contains(depotHeldItemType.getStatType())) {
                            match = false;
                        }
                    } else match = false;

                    if (match) {
                        foundRecipe = recipe;
                    }
                });
            }
        });

        if (foundRecipe != null) {
            outputItem = depotHeldItemType.withMaterialForDisplay(foundRecipe.outputMaterial);
        }
    }

    if (outputItem == null) {
        /** @type {Annotation.BatchRecipes.FluidInfusion.Item} */
        let foundRecipe = null;
        global.BlockFunctions.FluidInfusionCore.RECIPES.forEach((ingredient, innerMap) => {
            if (foundRecipe != null) return;
            let pass = ingredient["test(net.minecraft.world.item.ItemStack)"](inputItemStack);
            if (!pass) return;
            innerMap.forEach((fluids, recipe) => {
                if (foundRecipe != null) return;
                
                let match = queryFluids(fluidsFound, fluids);
                if (match) {
                    foundRecipe = recipe;
                }
            });
        });

        if (foundRecipe != null) {
            outputItem = foundRecipe.outputItem;
        }
    }

    return outputItem;
};

/**
 * 
 * @param {Internal.BlockContainerJS} blockContainer 
 * @param {Internal.Level} world 
 * @param {Internal.LivingEntity | null} clicker 
 * @returns 
 */
let findFluidDistance = (blockContainer, world, clicker) => {
    let foundDistance = -1;
    for (let d = 1; d <= MAX_SEARCH_DISTANCE; d++) {
        let isAtThisDistance = false;

        for (let [dx, dy] of DIRECTIONS) {
            let newBlockPos = blockContainer.getPos().offset(dx * d, 0, dy * d);
            let newBlockContainer = world.getBlock(newBlockPos);

            if (newBlockContainer.getBlockState().canOcclude()) {
                if (clicker != null) {
                    queryParticle(world, newBlockContainer.getX(), newBlockContainer.getY(), newBlockContainer.getZ(), true);
                    clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.solid_blocking").red(), true);
                }
                return foundDistance;
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
                    if (clicker != null) queryParticle(world, newBlockContainer.getX(), newBlockContainer.getY(), newBlockContainer.getZ(), true);
                    err = true;
                } else {
                    if (clicker != null) queryParticle(world, newBlockContainer.getX(), newBlockContainer.getY(), newBlockContainer.getZ(), false);
                }
            }
            if (err) {
                if (clicker != null) clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.incomplete_fluid").red(), true);
                return foundDistance;
            } else {
                foundDistance = d;
                break;
            }
        }
    }
    return foundDistance;
};

/**
 * 
 * @param {Internal.BlockContainerJS} blockContainer 
 * @param {Internal.Level} world 
 * @param {number} distance 
 */
let getFluidIdsFromDistance = (blockContainer, world, distance) => {
    /** @type {Internal.BlockState[]} */
    let fluidsFound = [];
    for (let [dx, dy] of DIRECTIONS) {
        let newBlockPos = blockContainer.getPos().offset(dx * distance, 0, dy * distance);
        let newBlockContainer = world.getBlock(newBlockPos);
        let fluid = newBlockContainer.getBlockState();
        fluidsFound.push(fluid);
    }
    return fluidsFound;
};

global.BlockFunctions.FluidInfusionCore.blockEntityTick = (blockEntity) => {

    let data = blockEntity.getPersistentData();

    let recipeProgress = data.getInt("RecipeProgress");

    if (recipeProgress > 0) {
        data.putInt("RecipeProgress", recipeProgress + 1);
    }

    // Tick lazier
    if (blockEntity.tick % 5 != 0) return;

    let depot = blockEntity.getBlock().getUp();
    let depotBE = depot.getEntity();

    if (!(depotBE instanceof $DepotBlockEntity)) {
        data.remove("LastTickItem");
        data.putInt("RecipeProgress", -1);
        return;
    }

    let itemOn = depotBE.getHeldItem();

    if (itemOn == null || itemOn.isEmpty()) {
        data.remove("LastTickItem");
        data.putInt("RecipeProgress", -1);
        return;
    }

    let lastTickItem = data.getCompound("LastTickItem");
    let thisTickItem = itemOn.serializeNBT();

    // Force validating when recipe processing
    let cacheValid = recipeProgress > 0 ? false : true;

    if (!lastTickItem.equals(thisTickItem)) {
        data.put("LastTickItem", thisTickItem);
        cacheValid = false;
    }

    let oldFluidDistance = -1;
    if (cacheValid) {
        // Storage liquid square distance in tag "LastTickFluidDistance"
        // 4 fluid blocks in "LastTickFluid1", "LastTickFluid2", ...
        // Stored fluid objects are actually fluid IDs

        // Find them first, according to last tick's fluid distance
        oldFluidDistance = data.getInt("LastTickFluidDistance");
        if (oldFluidDistance <= 0) {
            data.remove("LastTickFluidDistance");
            data.remove("LastTickFluid1");
            data.remove("LastTickFluid2");
            data.remove("LastTickFluid3");
            data.remove("LastTickFluid4");
            cacheValid = false;
        }
    }

    let world = blockEntity.getLevel();

    if (cacheValid) {
        for (let i = 0; i < 4; i++) {
            // Validate
            let fluidIdTag = "LastTickFluid" + (i + 1);
            let storedFluidId = data.getString(fluidIdTag);
            if (storedFluidId == null || storedFluidId == "") {
                cacheValid = false;
                break;
            }
            let actualFluidInWorld = world.getBlockState(blockEntity.getBlockPos().offset(DIRECTIONS[i][0] * oldFluidDistance, 0, DIRECTIONS[i][1] * oldFluidDistance)).getBlock().getId();

            if (storedFluidId != actualFluidInWorld) {
                cacheValid = false;
                break;
            }
        }
    }

    if (cacheValid) return;

    // Recalculate

    let foundDistance = findFluidDistance(blockEntity.getBlock(), world, null);
    if (foundDistance <= 0) {
        data.remove("LastTickFluidDistance");
        data.remove("LastTickFluid1");
        data.remove("LastTickFluid2");
        data.remove("LastTickFluid3");
        data.remove("LastTickFluid4");
        data.putInt("RecipeProgress", -1);
        return;
    }

    let fluidsFound = getFluidIdsFromDistance(blockEntity.getBlock(), world, foundDistance);
    data.putInt("LastTickFluidDistance", foundDistance);
    for (let i = 0; i < 4; i++) {
        let fluidIdTag = "LastTickFluid" + (i + 1);
        data.putString(fluidIdTag, fluidsFound[i].getBlock().getId());
    }

    // Process recipe after recaculation

    let outputItem = findOutputItem(itemOn, fluidsFound.map(f => f.getFluidState().getType()));
    if (outputItem == null) {
        data.putInt("RecipeProgress", -1);
        return;
    } else if (recipeProgress <= 0) {
        data.putInt("RecipeProgress", 1);
    }

    if (recipeProgress < 60) {
        // Play particle
        for (let i = 0; i < 4; i++) {
            // let particle = new $BlockParticleOption(ParticleTypes.BLOCK, fluidsFound[i]);
            let particle = new DustParticleOptions(new Vec3f(0, 1, 1), 1);
            let [dx, dy] = DIRECTIONS[i];
            let pos = blockEntity.getBlockPos();

            // Move particles slowly to the depot
            // In parabola
            let horizontal = (60 - recipeProgress) / 60;
            let vertical = -3 * horizontal * horizontal + horizontal * 1.5 + 1.5;

            world.spawnParticles(particle, false, pos.getX() + 0.5 + dx * foundDistance * horizontal, pos.getY() + 0.5 + vertical, pos.getZ() + 0.5 + dy * foundDistance * horizontal, 0, 0, 0, 10, 1);
            world.spawnParticles(particle, false, pos.getX() + 0.5, pos.getY() + 2, pos.getZ() + 0.5, 0, 0.5, 0, 10, 1);
        }

        return;
    }

    data.putInt("RecipeProgress", -1);

    // Clear fluid
    for (let [dx, dy] of DIRECTIONS) {
        let newBlockPos = blockEntity.getBlock().getPos().offset(dx * foundDistance, 0, dy * foundDistance);
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

    let BEPos = depotBE.getBlockPos();

    // Replace item
    depotBE.getHeldItem().shrink(1);
    let recipeResult = new $ItemEntity(world, BEPos.getX() + 0.5, BEPos.getY() + 1, BEPos.getZ() + 0.5, outputItem.copy(), 0, 0.2, 0);
    world.addFreshEntity(recipeResult);
    depotBE.notifyUpdate();

};

global.BlockFunctions.FluidInfusionCore.rightClick = (event) => {

    let blockContainer = event.getBlock();
    let world = event.getLevel();
    let clicker = event.getPlayer();

    blockContainer.getEntity().getPersistentData().remove("LastTickItem");

    let depotContainer = blockContainer.getUp();
    let depotBE = depotContainer.getEntity();
    if (!(depotBE instanceof $DepotBlockEntity)) {
        queryParticle(world, blockContainer.getX(), blockContainer.getY() + 1, blockContainer.getZ(), true);
        clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.missing_depot").red(), true);
        return;
    }
    queryParticle(world, blockContainer.getX(), blockContainer.getY() + 1, blockContainer.getZ(), false);

    let foundDistance = findFluidDistance(blockContainer, world, clicker);

    if (foundDistance < 0) {
        clicker.displayClientMessage(Component.translatable("block.kubejs.fluid_infusion_core.missing_fluid").red(), true);
        return;
    }

};

StartupEvents.registry("minecraft:block", event => {
    event.create(FLUID_INFUSION_CORE_ID)
        .blockEntity(be => {
            be.serverTick((blockEntity) => global.BlockFunctions.FluidInfusionCore.blockEntityTick(blockEntity));
        })
        .rightClick((event) => global.BlockFunctions.FluidInfusionCore.rightClick(event))
    ;
});

})();
