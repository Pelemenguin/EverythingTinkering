/**
 * @fileoverview Igniting | 点燃
 * - - - - -
 * ## Igniting
 * ### Description
 * Transfer fire time from attacked entity to the the tool,
 * and release it at next attack.
 * When tool is still on fire, consume 2 durability per second.
 * ### Configs
 * `IGNITING_FIRE_PERCENTAGE_PER_LEVEL` = `0.25`
 * - Fire time delay per transfer per level.
 * - Keep 25% more fire time each level at default.
 * - - - - -
 * ## 点燃
 * ### 介绍
 * 将燃烧时间从被攻击的生物转移到工具上，
 * 并在下次攻击释放。
 * 当工具仍然在着火时，每秒消耗耐久。
 * ### 配置
 * `IGNITING_FIRE_PERCENTAGE_PER_LEVEL` = `0.25`
 * - 每级的着火时间衰减。
 * - 默认每级多保留 25% 着火时间。
 */

/* global
    ModifierRegisterer
    CustomUtils
    NBT
    JavaMath
*/

/** */
let IGNITING_FIRE_PERCENTAGE_PER_LEVEL = 0.25;

let IGNITING = ModifierRegisterer.registerModifier("kubejs:igniting", ["onInventoryTick", "onAfterMeleeHit"]);
IGNITING.onAfterMeleeHit((view, lvl, context /*, damage*/) => {

    let item = context.attacker.getItemInHand(context.getHand());
    if (CustomUtils.Tinker.getModifiersFromItem(item)[IGNITING.id] === undefined) return;

    /** @type {Internal.IntTag} */
    let targetFireTag = context.target.nbt.get("Fire");
    if (targetFireTag == null) return;

    let targetFire = 0;
    // eslint-disable-next-line no-unused-vars
    try {targetFire = targetFireTag.asInt;} catch (e) {/* Do nothing */}

    /** @type {Internal.IntTag} */
    let ignitingPersistent = CustomUtils.Tinker.Persistent.get(item, IGNITING.id);
    if (ignitingPersistent == null) {
        CustomUtils.Tinker.Persistent.set(item, IGNITING.id, NBT.intTag(targetFire));
        return;
    }
    let toolFire = 0;
    try {
        toolFire = ignitingPersistent.asInt;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        CustomUtils.Tinker.Persistent.set(item, IGNITING.id, NBT.intTag(targetFire));
        return;
    }

    if (toolFire < targetFire) {
        CustomUtils.Tinker.Persistent.set(item, IGNITING.id, NBT.intTag(targetFire));
        context.target.playSound("item.flintandsteel.use");
        return;
    }

    let spreadFire = toolFire * JavaMath["min(float,float)"](IGNITING_FIRE_PERCENTAGE_PER_LEVEL * lvl, 1.0);
    if (spreadFire > 0 && spreadFire > targetFire) {
        context.target.setRemainingFireTicks(spreadFire);
        context.target.playSound("item.firecharge.use");
        return;
    }

});
IGNITING.onInventoryTick((view, lvl, level, entity, slot, inMainHand, inAvailableSlot, itemStack) => {
    try {
        let toolFire = CustomUtils.Tinker.Persistent.get(itemStack, IGNITING.id).asInt;
        if (toolFire > 0) {
            CustomUtils.Tinker.Persistent.set(itemStack, IGNITING.id, NBT.intTag(toolFire - 1));
            if (toolFire % 10 == 0) {
                CustomUtils.Tinker.tryDamageItem(itemStack, 1, entity);
                entity.playSound("block.fire.ambient", 1, 1);
            } else if (toolFire <= 1) {
                entity.playSound("block.fire.extinguish");
            }
        }
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        CustomUtils.Tinker.Persistent.set(itemStack, IGNITING.id, NBT.intTag(0));
    }
});