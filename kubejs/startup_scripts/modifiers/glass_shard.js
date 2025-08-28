/**
 * @fileoverview Glass Shard | 玻璃碎片
 * - - - - -
 * ## Glass Shard
 * ### Description
 * Deal damage to entites in a 3x3x3 area near the target.
 * - - - - -
 * ## 玻璃碎片
 * ### 介绍
 * 对目标周围 3x3x3 范围内的实体造成伤害。
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
    ModifierManager
    AABB
    JavaMath
*/

/** */
let GLASS_TYPE_TO_PARTICLE = {
    "tconstruct:glass": "minecraft:glass",
    "tconstruct:glass#white_stained": "minecraft:white_stained_glass",
    "tconstruct:glass#orange_stained": "minecraft:orange_stained_glass",
    "tconstruct:glass#magenta_stained": "minecraft:magenta_stained_glass",
    "tconstruct:glass#light_blue_stained": "minecraft:light_blue_stained_glass",
    "tconstruct:glass#yellow_stained": "minecraft:yellow_stained_glass",
    "tconstruct:glass#lime_stained": "minecraft:lime_stained_glass",
    "tconstruct:glass#pink_stained": "minecraft:pink_stained_glass",
    "tconstruct:glass#gray_stained": "minecraft:gray_stained_glass",
    "tconstruct:glass#light_gray_stained": "minecraft:light_gray_stained_glass",
    "tconstruct:glass#cyan_stained": "minecraft:cyan_stained_glass",
    "tconstruct:glass#purple_stained": "minecraft:purple_stained_glass",
    "tconstruct:glass#blue_stained": "minecraft:blue_stained_glass",
    "tconstruct:glass#brown_stained": "minecraft:brown_stained_glass",
    "tconstruct:glass#green_stained": "minecraft:green_stained_glass",
    "tconstruct:glass#red_stained": "minecraft:red_stained_glass",
    "tconstruct:glass#black_stained": "minecraft:black_stained_glass",
    "tconstruct:glass#seared": "tconstruct:seared_glass",
    "tconstruct:glass#scorched": "tconstruct:scorched_glass"
};

// eslint-disable-next-line no-unused-vars
let GLASS_SHARD = ModifierManager.registerCommonModifier("glass_shard", "GlassShardModifier", {
    beforeMeleeHit: (tool, modifier, context, damageDealt, baseKnockback, knockback) => {
        let chance = (damageDealt - 5.0) * 0.2 * modifier.level;
        if (JavaMath.random() >= chance) return knockback;
        
        let {x, y, z} = context.getTarget();
        let box = AABB.of(
            x - 1,
            y - 1,
            z - 1,
            x + 1,
            y + 1,
            z + 1
        );
        let entityList = context.getLevel().getEntitiesWithin(box);
        let source = context.getLevel().damageSources().mobAttack(context.getAttacker());
        /** @type {Internal.Entity[]} */
        let attackables = [];
        entityList.forEach(entity => {
            if (entity.isAttackable()) {
                attackables.push(entity);
            }
        });
        if (attackables.length == 0) return knockback;
        let damagePerEntity = damageDealt / attackables.length;
        attackables.forEach(entity => {
            entity.attack(source, damagePerEntity);
        });
        tool.getMaterials().forEach(material => {
            // let material_name = material.getId().toString();
            let material_name = material.getVariant().toString();
            if (material_name in GLASS_TYPE_TO_PARTICLE) {
                let particle_block = GLASS_TYPE_TO_PARTICLE[material_name];
                context.attacker.runCommandSilent("particle minecraft:block "+particle_block+" "+x+" "+y+" "+z+" 1 1 1 1 50");
                context.target.playSound("block.glass.break", 5, 0.8);
            }
        });
        return knockback;
    }
});