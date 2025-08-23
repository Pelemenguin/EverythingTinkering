// SPDX-License-Identifier: LGPL-3.0-or-later
 
/**
 * @fileoverview Enpower | 充能
 * - - - - -
 * Consumes Redstone Dust to speed up a projectile.  
 * 消耗红石粉加速弹射物。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    DustParticleOptions
    Vec3f
    NBT
    ModifierManager
*/

/**
 * - Checks if a item can be accepted by `enpower`.
 * - 检查一个物品是否能被`充能`接受。
 * - - - - -
 * @type {(stack: Internal.ItemStack) => boolean}
 */
let ENPOWER_ACCEPTABLE_PREDICATE = (item) => {
    return item.id === "minecraft:redstone";
};

/**
 * - Projectile speed multiplier.
 * - 弹射物速度乘数。
 */
let ENPOWER_PROJECTILE_SPEED_MODIFIER = 0.05;

// eslint-disable-next-line no-unused-vars
let ENPOWER = ModifierManager.registerCommonModifier("enpower", "EnpowerModifier", {
    onProjectileLaunch: (tool, modifier, shooter, ammo, projectile /*, arrow, persistent, isPrimary */) => {
        if (!shooter.isPlayer()) return;
        let found = false;
        shooter.inventory.getAllItems().forEach(stack => {
            if (found) return;
            if (!ENPOWER_ACCEPTABLE_PREDICATE(stack)) return;
            projectile.addMotion(
                projectile.motionX * ENPOWER_PROJECTILE_SPEED_MODIFIER * modifier.level,
                projectile.motionY * ENPOWER_PROJECTILE_SPEED_MODIFIER * modifier.level,
                projectile.motionZ * ENPOWER_PROJECTILE_SPEED_MODIFIER * modifier.level
            );
            found = true;
            if (!shooter.isCreative()) stack.count -= 1;

            projectile.mergeNbt({ForgeData: {IsLaunchedByEnpower: NBT.byteTag(1)}});
        });
    },
    __custom__: {
        onServerTick: (event) => {
            event.getServer().getEntities().forEach(entity => {
                if (entity.nbt.contains("inGround") && entity.nbt.get("inGround").asByte == 1) return;
                /** @type {Internal.CompoundTag} */ let forgeData = entity.getNbt().get("ForgeData");
                if (forgeData == null) return;
                /** @type {Internal.ByteTag} */ let shouldAddParticles = forgeData.get("IsLaunchedByEnpower");
                if (shouldAddParticles == null) return;
                if (shouldAddParticles.asByte != 1) return;
                entity.getLevel().spawnParticles(new DustParticleOptions(new Vec3f(1, 0, 0), 1), false, entity.x, entity.y, entity.z, 0, 0, 0, 5, 0);
            });
        }
    }
});
