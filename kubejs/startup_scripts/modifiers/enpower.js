// SPDX-License-Identifier: LGPL-3.0-or-later
 
/**
 * @fileoverview Enpower | 充能
 * - - - - -
 * ## Enpower
 * ### Description
 * WIP
 * - - - - -
 * ## 充能
 * ### 描述
 * WIP
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
    KubeJSModifierManager
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

// let ENPOWER = ModifierRegisterer.registerModifier("kubejs:enpower", ["projectileLaunch", "onServerTick"]);
// ENPOWER.projectileLaunch((view, lvl, /** @type {Internal.Player} */ living, projectile/*, arrow, modData, isPrimary*/) => {
//     // console.info(projectile);
//     if (!living.isPlayer()) return;
//     let found = false;
//     living.inventory.getAllItems().forEach(stack => {
//         if (found) return;
//         if (!ENPOWER_ACCEPTABLE_PREDICATE(stack)) return;
//         projectile.addMotion(
//             projectile.motionX * ENPOWER_PROJECTILE_SPEED_MODIFIER * lvl,
//             projectile.motionY * ENPOWER_PROJECTILE_SPEED_MODIFIER * lvl,
//             projectile.motionZ * ENPOWER_PROJECTILE_SPEED_MODIFIER * lvl
//         );
//         found = true;
//         if (!living.isCreative()) stack.count -= 1;

//         projectile.mergeNbt({ForgeData: {IsLaunchedByEnpower: NBT.byteTag(1)}});
//     });
// });
// ENPOWER.onServerTick((event) => {
//     event.getServer().getEntities().forEach(entity => {
//         if (entity.nbt.contains("inGround") && entity.nbt.get("inGround").asByte == 1) return;
//         /** @type {Internal.CompoundTag} */ let forgeData = entity.getNbt().get("ForgeData");
//         if (forgeData == null) return;
//         /** @type {Internal.ByteTag} */ let shouldAddParticles = forgeData.get("IsLaunchedByEnpower");
//         if (shouldAddParticles == null) return;
//         if (shouldAddParticles.asByte != 1) return;
//         entity.getLevel().spawnParticles(new DustParticleOptions(new Vec3f(1, 0, 0), 1), false, entity.x, entity.y, entity.z, 0, 0, 0, 5, 0);
//     });
// });

// eslint-disable-next-line no-unused-vars
let ENPOWER = KubeJSModifierManager.registerCommonModifier("enpower", "EnpowerModifier", {
    ProjectileLaunchModifierHook: (tool, modifier, shooter, ammo, projectile /*, arrow, persistent, isPrimary */) => {
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
        ServerTick: (event) => {
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