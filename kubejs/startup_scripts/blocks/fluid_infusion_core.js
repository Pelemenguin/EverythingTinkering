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
*/

global.BlockFunctions.FluidInfusionCore = {};

/** @type {Internal.BlockEntityCallback_} */
global.BlockFunctions.FluidInfusionCore.blockEntityTick;

/** @type {Internal.Consumer_<Internal.BlockRightClickedEventJS>} */
global.BlockFunctions.FluidInfusionCore.rightClick;

(() => {

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
const MAX_SEARCH_DISTANCE = 8;

global.BlockFunctions.FluidInfusionCore.rightClick = (event) => {

    let blockContainer = event.getBlock();
    let world = event.getLevel();
    let clicker = event.getPlayer();

    if (!(blockContainer.getUp().getEntity() instanceof $DepotBlockEntity)) {
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
