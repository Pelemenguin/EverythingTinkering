/**
 * @fileoverview Icy Clay Ball
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    StartupEvents
    Blocks
    BlockProperties
    MobEffectInstance
    JavaUtils
    ResourceLocation
    Direction
    TagKey
    Registries
*/

global.Entities.CommonFunctions.IcyClayBall = {

    /**
     * @param {Internal.Projectile} entity 
     */
    tick: (entity) => {
        let blockIn = entity.getBlock();
        if (blockIn.getBlockState().getBlock() === Blocks.WATER) {
            if (!blockIn.getBlockState().getFluidState().isSource()) return;
            entity.getLevel().setBlockAndUpdate(blockIn.getPos(), Blocks.ICE.defaultBlockState());
            entity.discard();
        } else if (blockIn.getBlockState().getBlock() === Blocks.LAVA) {
            if (!blockIn.getBlockState().getFluidState().isSource()) return;
            entity.getLevel().setBlockAndUpdate(blockIn.getPos(), Blocks.OBSIDIAN.defaultBlockState());
            entity.discard();
        } else if (blockIn.getBlockState().getBlock() === Blocks.SNOW) {
            let layer = blockIn.getBlockState().getValue(BlockProperties.LAYERS);
            if (layer >= 8) return;
            let newState = blockIn.getBlockState().setValue(BlockProperties.LAYERS, JavaUtils.Integer["valueOf(int)"](layer + 1));
            entity.getLevel().setBlockAndUpdate(blockIn.getPos(), newState);
            entity.discard();
        }
    },

    /**
     * @param {Internal.ContextUtils$ProjectileBlockHitContext} context
     */
    onHitBlock: (context) => {
        let {x: offsetX, y: offsetY, z: offsetZ} = context.result.getDirection();
        let placingPos = context.result.getBlockPos().offset(offsetX, offsetY, offsetZ);
        let placingBlock = context.entity.getLevel().getBlock(placingPos.getX(), placingPos.getY(), placingPos.getZ());
        if (placingBlock.getBlockState().isAir() && placingBlock.getDown().getBlockState().isFaceSturdy(context.entity.getLevel().getChunkSource().getLevel(), placingBlock.getPos().below(), Direction.UP)) {
            context.entity.getLevel().setBlockAndUpdate(placingBlock.getPos(), Blocks.SNOW.defaultBlockState());
        }
        context.entity.discard();
    },

    /**
     * @param {Internal.ContextUtils$ProjectileEntityHitContext} context
     */
    onHitEntity: (context) => {
        context.entity.discard();
        /** @type {Internal.LivingEntity} */
        let living = context.result.getEntity();
        if (living.getType() === "kubejs:icy_terracube") {
            living.heal(4);
        } else if (context.result.getEntity().isAttackable()) {
            if (living.attack(context.entity.damageSources().freeze(), global.Entities.CommonFunctions.IcyClayBall.DAMAGE)) {
                if (living.isLiving()) living.addEffect(new MobEffectInstance("minecraft:slowness", 20, 0));
            }
        }
    },

    DAMAGE: 4

};

global.Entities.TagKeys.ICY_CLAY_BALL = TagKey.create(Registries.ENTITY_TYPE, "kubejs:icy_clay_ball");

StartupEvents.registry("minecraft:entity_type", event => {
    event.create("kubejs:icy_clay_ball", "entityjs:projectile")
        .textureLocation(() => ResourceLocation.tryParse("kubejs:textures/item/icy_clay_ball.png"))
        .renderScale(0.5, 0.5, 0.5)
        .onHitBlock(context => global.Entities.CommonFunctions.IcyClayBall.onHitBlock(context))
        .onHitEntity(context => global.Entities.CommonFunctions.IcyClayBall.onHitEntity(context))
        .tick(entity => global.Entities.CommonFunctions.IcyClayBall.tick(entity))
        .sized(0.25, 0.25)
    ;
});
