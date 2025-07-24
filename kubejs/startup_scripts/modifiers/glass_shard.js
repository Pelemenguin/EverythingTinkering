/**
 * @fileoverview Glass Shard | 玻璃碎片
 */

/* global
    ModifierRegisterer
    AABB
*/

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

ModifierRegisterer.registerModifier("kubejs:glass_shard", modifier => {
    modifier.onBeforeMeleeHit((view, lvl, context, damage, baseKnockback, finalKnockback) => {
        // let ifRepeated = checkIfEntityRepeated(context.getTarget());
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
        let source = context.getLevel().damageSources().playerAttack(context.getAttacker());
        /** @type {Internal.Entity[]} */
        let attackables = [];
        entityList.forEach(entity => {
            if (entity.isAttackable()) {
                attackables.push(entity);
            }
        });
        if (attackables.length == 0) return;
        let damagePerEntity = damage / attackables.length;
        attackables.forEach(entity => {
            entity.attack(source, damagePerEntity);
        });
        view.getMaterials().forEach(material => {
            let material_name = material.getId().toString();
            if (material_name in GLASS_TYPE_TO_PARTICLE) {
                let particle_block = GLASS_TYPE_TO_PARTICLE[material_name];
                context.attacker.runCommandSilent("particle minecraft:block "+particle_block+" "+x+" "+y+" "+z+" 1 1 1 1 50");
                // event.server.runCommandSilent("playsound minecraft:block.glass.break player @a "+particle_block+" "+target_x+" "+target_y+" "+target_z+" 10 "+sound_pitch)
                // context.attacker.playSound("block.glass.break", 5, 0.8);
                context.target.playSound("block.glass.break", 5, 0.8);
            }
        });
        return finalKnockback;
    });
});