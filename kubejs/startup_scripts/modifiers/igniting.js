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
    global: writable
    ModifierRegisterer
    CustomUtils
    NBT
    JavaMath
    console
    Component
    Utils
*/

/** */
let IGNITING_FIRE_PERCENTAGE_PER_LEVEL = 0.25;

/**
 * - Set an item's `igniting` persistent data.
 * - 设置一个物品的 `点燃` 的 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item
 * @param {number} current
 * @param {number} max
 */
let ignitingSetTime = (item, current, max) => {
    // In case of overflow
    if (global.Tinker.IGNITING_TIMER_COUNTER > 2147483600) {
        global.Tinker.IGNITING_TIMER_COUNTER = 0;
        global.Tinker.IGNITING_TIMER.clear();
    }

    let newObject = {
        current: NBT.intTag(current),
        max: NBT.intTag(max)
    };
    // CustomUtils.Tinker.Persistent.set(item, "kubejs:igniting", NBT.toTagCompound(newNbt));
    global.Tinker.IGNITING_TIMER.put(global.Tinker.IGNITING_TIMER_COUNTER, newObject);
    CustomUtils.Tinker.Persistent.set(item, "kubejs:igniting", NBT.intTag(global.Tinker.IGNITING_TIMER_COUNTER));
    global.Tinker.IGNITING_TIMER_COUNTER++;
};

/**
 * - Read an item's `igniting` presistent data.
 * - 读取一个物品的 `点燃` 的 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item
 * @returns {Annotation.Tinker.IgnitingTimeRepresentation}
 */
let ignitingGet = (item) => {
    /** @type {Internal.CompoundTag} */
    try {
        let obj = global.Tinker.IGNITING_TIMER.getOrDefault(CustomUtils.Tinker.Persistent.get(item, "kubejs:igniting").asInt, null);
        return obj;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        ignitingSetTime(item, 0, 0);
    }
};

/**
 * - Calculate the color of the tooltip.
 * - 计算工具提示的颜色。
 * - - - - -
 * @param {number} ratio 
 * - - - - -
 * @returns {number}
 */
let calculateColor = (ratio) => {
    let p = ratio * 3;
    let red = JavaMath["min(float,float)"](p, 1);
    p -= red;
    let green = JavaMath["min(float,float)"](p, 1);
    p -= green;
    let blue = JavaMath["min(float,float)"](p, 1);
    red *= 255;
    green *= 255;
    blue *= 255;
    red = JavaMath["round(float)"](red);
    green = JavaMath["round(float)"](green);
    blue = JavaMath["round(float)"](blue);
    let color = (red * 65536 + green * 256 + blue);
    return color;
};

/**
 * - - - - -
 * @typedef {{
 *     current: number,
 *     max: number
 * }} Annotation.Tinker.IgnitingTimeRepresentation
 * - - - - -
 * @type {Internal.Map<number, Annotation.Tinker.IgnitingTimeRepresentation} 
 */
global.Tinker.IGNITING_TIMER = Utils.newMap();
global.Tinker.IGNITING_TIMER_COUNTER = 0;

let IGNITING = ModifierRegisterer.registerModifier("kubejs:igniting", ["onInventoryTick", "onAfterMeleeHit", "tooltipSetting"]);
IGNITING.onAfterMeleeHit((view, lvl, context /*, damage*/) => {
    if (context.getLevel().isClientSide()) return;

    let item = context.attacker.getItemInHand(context.getHand());
    if (CustomUtils.Tinker.getModifiersFromItem(item)[IGNITING.id] === undefined) return;

    /** @type {Internal.IntTag} */
    let targetFireTag = context.target.nbt.get("Fire");
    if (targetFireTag == null) return;

    let targetFire = 0;
    // eslint-disable-next-line no-unused-vars
    try {targetFire = targetFireTag.asInt;} catch (e) {/* Do nothing */}

    let ignitingPersistent = ignitingGet(item);
    if (ignitingPersistent == null) {
        ignitingSetTime(item, targetFire, targetFire);
        return;
    }
    let toolFire = 0;
    try {
        toolFire = ignitingPersistent.current;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        ignitingSetTime(item, targetFire, targetFire);
        return;
    }

    if (toolFire < targetFire) {
        ignitingSetTime(item, targetFire, targetFire);
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
        let repr = ignitingGet(itemStack);
        if (repr == null) return;
        let toolFire = repr.current;
        if (toolFire > 0) {
            if (toolFire % 10 == 0) {
                if (level.isClientSide()) entity.playSound("block.fire.ambient", 1, 1);
                else CustomUtils.Tinker.tryDamageItem(itemStack, 1, entity);
            } else if (toolFire <= 1) {
                if (level.isClientSide()) entity.playSound("block.fire.extinguish", 1, 1);
            }
        }
    } catch (e) {console.error(e);}
});
IGNITING.tooltipSetting((view, lvl, player, tooltip /*, key, flags */) => {
    try {
        let reference = view.persistentData.getInt("kubejs:igniting");
        let persistent = global.Tinker.IGNITING_TIMER.get(reference);
        if (persistent == null) return;
        let current = persistent.current;
        if (current <= 0) return;

        let max = persistent.max;
        let color = calculateColor(current / max);
        let progreeComponent = Component.literal("");
        progreeComponent.append(Component.literal((current / 20).toFixed()).color(color));
        progreeComponent.append(Component.literal(" / ").gray());
        progreeComponent.append(Component.literal((max / 20).toFixed()));
        let component = Component.translatable("modifier.kubejs.igniting.tooltip", progreeComponent);
        tooltip.add(component);
    } catch (e) {console.error(e); }
});