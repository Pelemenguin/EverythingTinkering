/**
 * @fileoverview Friable | 松散
 * - - - - -
 * Every game tick, the tool has `(0.2 * level)`'s chance to lose durability.  
 * 每游戏刻有 `(0.2 * level)` 的概率损失耐久。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    JavaMath
    EquipmentSlot
    ToolDamageUtil
*/

// eslint-disable-next-line no-unused-vars
let FIRABLE = ModifierManager.registerCommonModifier("friable", "FriableModifier", {
    onInventoryTick: (tool, modifier, world, holder, _itemSlot, _isSelected, _isCorrectSlot, stack) => {
        if (world.isClientSide()) return;
        if (holder.isPlayer() && holder.isCreative()) return;
        if (JavaMath.random() >= 0.2 * modifier.level) return;
        ToolDamageUtil["damageAnimated(slimeknights.tconstruct.library.tools.nbt.IToolStackView,int,net.minecraft.world.entity.LivingEntity,net.minecraft.world.entity.EquipmentSlot)"](tool, modifier.level + JavaMath.round(modifier.level * 2 * JavaMath.random()), holder, stack.getEquipmentSlot() || EquipmentSlot.MAINHAND);
    }
});