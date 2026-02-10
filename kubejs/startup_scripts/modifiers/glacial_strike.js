/**
 * @fileoverview Glacial Strike | 霜滞冲击
 * - - - - -
 * Press the key (default: G) to jump high and smash down.
 * 按下特定按键（默认：G）跃起并砸向地面，造成范围伤害。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    ModifierManager
    KubeJSKeybindHelper
    $NetworkDirection
    KubeJSNetworkHelper
    NBT
    console
    KubeJSDamageSources
    TagKeys
    ParticleTypes
    ToolDamageUtil
    Component
    $ModifierId
    $ModifierEntry
*/

KubeJSNetworkHelper.register("GlacialStrikeMessage", 378294469, {
    action: {
        className: "byte",
        write: (buf, value) => buf.writeByte(value),
        read: (buf) => buf.readByte()
    }
}, $NetworkDirection.PLAY_TO_SERVER, (message, context) => {
    context.get().enqueueWork(() => {
        let item = context.get().getSender().getFeetArmorItem();
        let persistent = item.getNbt().getCompound("tic_persistent").getCompound("kubejs:glacial_strike");

        /** @type {0 | 1} */
        let action = message.action;
        switch (action) {
            // Jump
            case 0: {
                if (persistent.getInt("SinceLastJump") < 20) return;

                context.get().getSender().addDeltaMovement([0, 1, 0]);

                persistent.putInt("SinceLastJump", 0);
                persistent.putByte("IsJumping", 1);
                persistent.putByte("IsFalling", 0);
                context.get().getSender().damageEquipment("feet");

                break;
            }
            // Fall
            case 1: {
                if (persistent.getByte("IsJumping") == 0) return;

                context.get().getSender().addDeltaMovement([0, -3, 0]);

                persistent.putDouble("FallPosition", context.get().getSender().getY());
                persistent.putByte("IsFalling", 1);

                break;
            }
            default: {
                console.error(`Unknown action for Glacial Strike: ${action}`);
            }
        }
    });
    context.get().setPacketHandled(true);
});

// eslint-disable-next-line no-unused-vars
let GLACIAL_STRIKE = ModifierManager.registerCommonModifier("glacial_strike", "GlacialStrikeModifier", {
    __keybind__: {
        registerKeys: () => {
            KubeJSKeybindHelper.register("glacial_strike", 71, "modifier");
        },
    },
    onInventoryTick: (tool, _modifier, world, holder, _itemSlot, _isSelected, isCorrectSlot, stack) => {
        if (!stack.canEquip("feet", holder)) return;
        if (!isCorrectSlot) return;
        if (tool.isBroken()) return;
        if (holder.isSpectator()) return;

        if (!stack.getNbt().getCompound("tic_persistent").contains("kubejs:glacial_strike")) {
            stack.getNbt().getCompound("tic_persistent").put("kubejs:glacial_strike", NBT.compoundTag());
        }

        /** @type {Internal.CompoundTag} */
        let persistent = stack.getNbt().getCompound("tic_persistent").getCompound("kubejs:glacial_strike");

        let jumpCooldown = persistent.getInt("SinceLastJump") + 1;
        let isJumping = persistent.getByte("IsJumping");
        let isFalling = persistent.getByte("IsFalling");

        if (!world.isClientSide()) {
            if (jumpCooldown <= 20) persistent.putInt("SinceLastJump", jumpCooldown);
            if (holder.onGround()) {
                persistent.putByte("IsJumping", 0);
                persistent.putByte("IsFalling", 0);
            }
            if (isFalling) {
                let fallDistance = persistent.getDouble("FallPosition") - holder.getY();
                if (holder.onGround()) {
                    persistent.putByte("IsFalling", 0);

                    let size = Math.min(5, Math.max(1, fallDistance * 0.25)) / 2;
                    let damage = Math.min(fallDistance, 50);
                    world.getEntitiesWithin(holder.getBoundingBox().inflate(size, 0, size)).forEach(e => {
                        if (e === holder || !e.isAttackable()) return;
                        e.attack(KubeJSDamageSources.icyTerracubeSmash(world, holder, holder), damage);
                    });

                    if (!holder.isShiftKeyDown()) {
                        holder.setMotionY(1.2);
                    }
                    world.spawnParticles(ParticleTypes.SNOWFLAKE, false, holder.getX(), holder.getY(), holder.getZ(), 1, 0, 1, 200, 0.1);

                    for (let i = 0; i < 5; ++i) {
                        global.Entities.AiFunctions.IceSpike.createIceSpikeAt(world, holder.blockPosition().offset(Math.round(Math.random() * 6 - 3), 5, Math.round(Math.random() * 6 - 3)), holder);
                    }

                    ToolDamageUtil.damageAnimated(tool, 1, holder);
                }
            }
        } else {
            let isPressing = KubeJSKeybindHelper.consumeClick("glacial_strike", "modifier");
            if (isPressing) {
                if (isJumping) {
                    KubeJSNetworkHelper.CHANNEL.sendToServer(KubeJSNetworkHelper.createMessage("GlacialStrikeMessage", {
                        action: 1
                    }));
                    holder.addDeltaMovement([0, -3, 0]);
                } else if (jumpCooldown >= 20) {
                    KubeJSNetworkHelper.CHANNEL.sendToServer(KubeJSNetworkHelper.createMessage("GlacialStrikeMessage", {
                        action: 0
                    }));
                    holder.addDeltaMovement([0, 1, 0]);
                }
            }
            if (isFalling && holder.onGround() && !holder.isShiftKeyDown()) {
                holder.setMotionY(1.2);
            }
        }
    },
    modifyDamageTaken: (tool, _modifier, _context, _slotType, source, amount, isDirectDamage) => {
        if (tool.isBroken()) return;
        if (source.is(TagKeys.DamageType.IS_FALL)) {
            return Math.max(0, amount - 20);
        }
        if (isDirectDamage && tool.getPersistentData().getCompound("kubejs:glacial_strike").getByte("IsFalling")) {
            return 0;
        }
        return amount;
    },
    onRemoved: (_tool, _modifier) => {
        return Component.translatable("modifier.kubejs.glacial_strike.remove");
    },
    validate: (tool, _modifier) => {
        if (
            tool.getModifierLevel(new $ModifierId("tconstruct", "shiny")) < 1 ||
            tool.getModifierLevel(new $ModifierId("tconstruct", "protection")) < 2 ||
            tool.getModifierLevel(new $ModifierId("tconstruct", "reinforced")) < 2
        ) return Component.translatable("modifier.kubejs.glacial_strike.requirements");
        return null;
    },
    displayModifiers: (_entry) => {
        return [
            new $ModifierEntry(new $ModifierId("tconstruct", "shiny"), 1),
            new $ModifierEntry(new $ModifierId("tconstruct", "protection"), 2),
            new $ModifierEntry(new $ModifierId("tconstruct", "reinforced"), 2)
        ];
    },
    requirementsError: (_entry) => {
        return Component.translatable("modifier.kubejs.glacial_strike.requirements");
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
