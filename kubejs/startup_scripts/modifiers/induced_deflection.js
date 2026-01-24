// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Induced Deflection | 感应偏转
 * - - - - -
 * Deflects projectiles when moving.  
 * 在移动时偏转弹射物。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    AABB
    $Projectile
    NBT
    Vec3d
*/

ModifierManager.registerCommonModifier("induced_deflection", "InducedDeflectionModifier", {
    onInventoryTick: (tool, modifier, world, holder, _itemSlot, _isSelected, isCorrectSlot, _stack) => {
        if (!isCorrectSlot) return;
        if (tool.isBroken()) return;

        // Still players won't active this effect
        if (!holder.isMoving()) return;

        let data;
        if (!world.isClientSide() && !tool.getPersistentData().contains("kubejs:induced_deflection")) {
            data = NBT.compoundTag();
            data.put("LastPosition", NBT.listTag([
                NBT.doubleTag(holder.getX()),
                NBT.doubleTag(holder.getY()),
                NBT.doubleTag(holder.getZ())
            ]));
            tool.getPersistentData().put("kubejs:induced_deflection", data);
        } else data = tool.getPersistentData().getCompound("kubejs:induced_deflection");
        let lastPos = data.getList("LastPosition", 6);
        let holderMotion = holder.position().subtract(new Vec3d(
            lastPos.getDouble(0),
            lastPos.getDouble(1),
            lastPos.getDouble(2)
        ));
        if (!world.isClientSide()) data.put("LastPosition", NBT.listTag([
            NBT.doubleTag(holder.getX()),
            NBT.doubleTag(holder.getY()),
            NBT.doubleTag(holder.getZ())
        ]));

        let holderMotionSqr = holderMotion.lengthSqr();
        if (holderMotionSqr >= 400) {
            holderMotion = holderMotion.normalize().scale(20);
        }
        let holderPosition = holder.position();

        let multiplier = modifier.getLevel() * 30;

        // Just work for nearby projectiles
        world.getEntitiesWithin(AABB.of(
            holder.getX() - 25 * multiplier, holder.getY() - 25 * multiplier, holder.getZ() - 25 * multiplier,
            holder.getX() + 25 * multiplier, holder.getY() + 25 * multiplier, holder.getZ() + 25 * multiplier
        )).filter(e => e instanceof $Projectile).forEach(/** @param {Internal.Projectile} projectile */ projectile => {
            let relativePosition = projectile.position().subtract(holderPosition);
            let distanceSqr = relativePosition.lengthSqr();
            if (distanceSqr <= 0) return;
            let mageticInduction = holderMotion.cross(relativePosition.normalize()).scale(multiplier / distanceSqr);
            let specificCharge = 1; // TODO: Should we have different values for different projectiles?
            let acceleration = projectile.getDeltaMovement().cross(mageticInduction).scale(specificCharge);
            
            // Final validation, in case of wrong calculation in specific situations that produces NaN or Infinity
            for (let i of [acceleration.x(), acceleration.y(), acceleration.z()]) {
                if (!isFinite(i) || isNaN(i) || i > 100 || i < -100) {
                    return;
                }
            }

            projectile.addDeltaMovement(acceleration);
        });
    }
});
