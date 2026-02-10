/**
 * @fileoverview Igniting | 点燃
 * - - - - -
 * Transfer fire time from attacked entity to the the tool,
 * and release it at next attack.
 * When tool is still on fire, consume 2 durability per second.
 * 将燃烧时间从被攻击的生物转移到工具上，
 * 并在下次攻击释放。
 * 当工具仍然在着火时，每秒消耗耐久。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    JavaMath
    Component
    ToolDamageUtil
    NBT
*/

/** */
let IGNITING_FIRE_PERCENTAGE_PER_LEVEL = 0.25;

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

// eslint-disable-next-line no-unused-vars
let IGNITING = ModifierManager.registerCommonModifier("igniting", "IgnitingModifier", {
    afterMeleeHit: (tool, modifier, context, _damageDealt) => {
        if (context.getLevel().isClientSide()) return;

        let targetFire = context.getTarget().getRemainingFireTicks();

        let data = tool.getPersistentData().getCompound("kubejs:igniting");
        let toolFire = data.getInt("Current");

        if (toolFire < targetFire) {
            context.getTarget().playSound("item.flintandsteel.use");
            data.putInt("Current", targetFire);
            data.putInt("Max", targetFire);
            return;
        }

        let spreadFire = toolFire * Math.min(IGNITING_FIRE_PERCENTAGE_PER_LEVEL * modifier.getLevel(), 1.0);
        if (spreadFire > 0 && spreadFire > targetFire) {
            context.getTarget().setRemainingFireTicks(spreadFire);
            context.getTarget().playSound("item.firecharge.use");
            return;
        }
    },
    onInventoryTick: (tool, _modifier, world, holder, _itemSlot, _isSelected, _isCorrectSlot, stack) => {
        let data = tool.getPersistentData().getCompound("kubejs:igniting");

        if (data.isEmpty()) {
            stack.getNbt().getCompound("tic_persistent").put("kubejs:igniting", NBT.compoundTag({
                Max: NBT.intTag(0),
                Current: NBT.intTag(0)
            }));
            return;
        }

        let toolFire = data.getInt("Current");
        if (toolFire > 0) {
            if (toolFire % 10 == 0) {
                if (world.isClientSide()) holder.playSound("block.fire.ambient", 1, 1);
                else ToolDamageUtil.damageAnimated(tool, 1, holder);
            } else if (toolFire == 1) {
                if (world.isClientSide()) holder.playSound("block.fire.extinguish", 1, 1);
            }
            data.putInt("Current", toolFire - 1);
        }
    },
    addTooltip: (tool, modifier, player, tooltip/*, tooltipKey, tooltipFlag*/) => {
        let data  = tool.getPersistentData().getCompound("kubejs:igniting");
        let current = data.getInt("Current");
        if (current == 0) return;

        let max = data.getInt("Max");

        let color = calculateColor(current / max);
        let progreeComponent = Component.literal("");
        progreeComponent.append(Component.literal((current / 20).toFixed()).color(color));
        progreeComponent.append(Component.literal(" / ").gray());
        progreeComponent.append(Component.literal((max / 20).toFixed()));
        let component = Component.translatable("modifier.kubejs.igniting.tooltip", progreeComponent);
        tooltip.add(component);
    },
});
