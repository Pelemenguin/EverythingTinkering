// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Typings | 类型提示
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

declare namespace Annotation {
    interface FluidPreset {
        /**
         * - Process a fluid builder.
         * - 处理一个流体 Builder。
         * - - - - -
         * @inheritdoc
         * - - - - -
         * @param builder 
         * - Input fluid builder.
         * - 输入的流体 Builder。
         * - - - - -
         * @returns
         * - Processed fluid buidler.
         * - 处理后的流体 Builder.
         */
        process: (builder: Internal.FluidBuilder) => Internal.FluidBuilder;
        processReloadable: (builder: Internal.FluidBuilder) => Internal.FluidBuilder;
    }
    interface FluidProperties {
        /**
         * - List of used presets.
         * - 使用的预设列表。
         */
        presets: Annotation.FluidPreset[] | undefined;
        /**
         * - Temperature of the fluid.
         * - 流体温度。
         */
        temperature: number | undefined;
        /**
         * - Light level of the fluid block.
         * - 液体方块的亮度。
         */
        lightLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | undefined;
        /**
         * - Texture path of still fluid.
         * - 静止液体的材质路径。
         */
        stillTexture: string | undefined;
        /**
         * - Texture path of flowing fluid.
         * - 流动液体的材质路径。
         */
        flowingTexture: string | undefined;
        /**
         * - Fluid tooltip tag.
         * - 流体工具提示标签。
         */
        fluidTooltip: Special.FluidTag
        /** @todo More properties. */
    }

    namespace FluidPresetExtraData {
        interface Hot {
            /**
             * - The burn time of the entites inside.
             * - 内部实体的燃烧时间。
             */
            burnTime: number;
            /**
             * - The damage received by entites inside.
             * - 内部实体收到的伤害。
             */
            damage: number;
        }
    }

    namespace TinkerFunction {
        /** @deprecated Use {@linkcode ModifierHooks} instead */
        type Hook = "addToolStats" | "armorTakeAttacked" | "getBreakSpeed" | "onAfterBreak" | "getMeleeDamage" | "onAfterMeleeHit" | "onBeforeMeleeHit" | "onInventoryTick"
            | "projectileLaunch" | "tooltipSetting" | "onServerTick";
        type ModifierHookArgument = {
            /**
             * Method to modify a stat as the tool is being used  
             * 工具使用时修改属性的方法。
             * - - - - -
             * @param tool       Tool instance  
             *                   工具实例
             *
             * @param modifier   Modifier instance  
             *                   特性实例
             *
             * @param living     Entity holding the tool  
             *                   持有工具的实体
             *
             * @param stat       Stat to be modified, safe to do instance equality  
             *                   要修改的属性，可安全判断实例是否相等
             *
             * @param baseValue  Value before this hook modified the stat  
             *                   在该钩子修改属性之前的值
             *
             * @param multiplier Global multiplier, same value contained in the tool, but fetched for convenience as it's commonly needed for stat bonuses  
             *                   全局系数，工具中含有相同的值，但为了方便，仍然在此抓去，因为其广泛用于属性增幅
             *
             * @returns          New value of the stat, or baseValue if you choose not to modify this stat  
             *                   该属性的新值，或`baseValue`若你不想修改
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     modifyStat: (tool, modifier, living, stat, baseValue, multiplier) => {
             *         if (stat == ToolStats.ATTACK_DAMAGE) {
             *             return baseValue + 1;
             *             // Add 1 point of attack damage
             *             // 添加1点攻击伤害
             *         }
             *         return baseDamage;
             *         // Return baseDamage when modifying other stats
             *         // 修改其它属性时返回baseDamage
             *     }
             * });
             */ 
            modifyStat?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, living: Internal.LivingEntity, stat: Internal.FloatToolStat, baseValue: number, multiplier: number) => number,
            /**
             * Called when the tool is damaged.
             * Can be used to cancel, decrease, or increase the damage.  
             * 在工具消耗耐久时调用。
             * 可以被用于取消，减少，或增加损失的耐久值。
             * - - - - -
                 * @param tool     Tool stack  
             *                 工具堆叠
             * 
             * @param modifier Modifier running this hook  
             *                 运行该钩子函数的特性条目
             * 
             * @param amount   Amount of damage to deal  
             *                 要消耗的耐久
             * 
             * @param holder   Entity holding the tool (Nullable)  
             *                 持有工具的实体（可为`null`）
             * 
             * @param stack    Stack instance being damaged.
             *                 Useful for identifying the slot being damaged. (Nullable)  
             *                 要损坏的物品堆叠实例。
             *                 可用于辨别要损坏的栏位。（可为`null`）
             * 
             * @returns        Replacement damage.
             *                 Returning 0 cancels the damage and stops other modifiers from processing.  
             *                 要替换为的耐久值消耗。
             *                 返回`0`取消耐久值消耗并停止其它特性的耐久值消耗计算。
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     onBreakSpeed: (tool, modifier, amount, holder, stack) => {
             *         return amount + 1; // Increase 1 durability point consumption
             *                            // 增加一点耐久消耗
             *     }
             * });
             */
            onDamageTool?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, amount: number, holder: Internal.LivingEntity | null, stack: Internal.ItemStack | null) => number,
            /**
             * Triggers every tick in the inventory.
             * Not to be confused with {@link CustomModifierHookArgument.onServerTick `__custom__.onServerTick`}  
             * 在物品栏中每Tick触发。
             * 不要与{@link CustomModifierHookArgument.onServerTick `__custom__.onServerTick`}混淆。
             * - - - - -
             * @param tool          Current tool instance  
             *                      当前工具实例
             * 
             * @param modifier      Modifier running the hook  
             *                      使用此钩子函数的特性
             * 
             * @param world         World containing tool  
             *                      工具所在的世界
             * 
             * @param holder        Entity holding tool  
             *                      手持工具的实体
             * 
             * @param itemSlot      Slot containing this tool. Note this may be from the hotbar, main inventory, or armor inventory  
             *                      放置工具的栏位。注意，其可能来自快捷栏，主物品栏，或护甲栏
             * 
             * @param isSelected    If true, this item is currently in the player's main hand  
             *                      若为真，则该物品正在玩家的主手上
             * 
             * @param isCorrectSlot If true, this item is in the proper slot. For tools, that is main hand or off hand. For armor, this means its in the correct armor slot  
             *                      若为真，则该物品在正确的栏位上。对于工具来说，这是主手或副手。对于盔甲，这意味着其对应的护甲栏位
             * 
             * @param stack         Item stack instance to check other slots for the tool. Do not modify  
             *                      用以检查工具其它栏位的物品堆叠实例。不要更改
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     onInventoryTick: (tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
             *         tool.damage += 1; // Reduce 1 durability point every tick
             *                           // 每Tick损失一点耐久值
             *     }
             * });
             */
            onInventoryTick?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, world: Internal.Level, holder: Internal.LivingEntity, itemSlot: number, isSelected: boolean, isCorrectSlot: boolean, stack: Internal.ItemStack) => void,
            /**
             * Adds additional information from the modifier to the tooltip.
             * Shown when holding `shift` on a tool, or in the stats area of the tinker station  
             * 从特性向工具提示中添加额外信息。
             * 在工具上按`Shift`时显示，或工匠站的`stats`区域
             * - - - - -
             * @param tool        Tool instance  
             *                    工具实例
             * 
             * @param modifier    Tool level  
             *                    工具等级
             * 
             * @param player      Player holding this tool  
             *                    持有工具的玩家
             * 
             * @param tooltip     Tooltip  
             *                    工具提示
             * 
             * @param tooltipKey  Shows if the player is holding shift, control, or neither  
             *                    表示玩家正在按下`Shift`，`Ctrl`，或均不
             * 
             * @param tooltipFlag Flag determining tooltip type  
             *                    决定工具提示的标记
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     addTooltip: (tool, modifier, player, tooltip, tooltipKey, tooltipFlag) => {
             *         tooltip.add(Component.literal("Test Tooltip")); // Add `Test Tooltip` to the tool's tooltips
             *                                                         // 向工具的工具提示中加入`Test Tooltip`
             *     }
             * });
             */
            addTooltip?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, player: Internal.Player | null, tooltip: Internal.List<Internal.Component>, tooltipKey: Internal.TooltipKey, tooltipFlag: Internal.TooltipFlag) => void,
            /**
             * Adds raw stats to the tool. Called whenever tool stats are rebuilt.  
             * 向工具添加直接属性数据。在工具属性重建时调用。
             * - - - - -
             * @param context  Context about the tool built.
             *                 Partial view of {@link Internal.IToolStackView `IToolStackView`} as the tool is not fully built.
             *                 Note this hook runs after volatile data builds  
             *                 工具重建上下文。
             *                 {@link Internal.IToolStackView `IToolStackView`}的部分视图，因为工具还未完全建成。
             *                 注意：该钩子方法在易失数据建立后运行
             * 
             * @param modifier Modifier level  
             *                 特性（及其）等级
             * 
             * @param builder  Tool stat builder
             *                 工具属性构建器
             * - - - - -
             * Related Links | 相关链接
             * - {@linkcode Internal.ToolStats ToolStats}  
             *     A Java class that records all Tinker's Construct tool stat types  
             *     记录了所有匠魂工具属性类型的Java类
             * @example
             * // const ToolStats = Java.loadClass("slimeknights.tconstruct.library.tools.stat.ToolStats");
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     addToolStats: (context, modifier, builder) => {
             *         ToolStats.ATTACK_DAMAGE.add(builder, 1.0); // Add 1.0 attack damage
             *                                                    // 增加1.0攻击伤害
             *     }
             * });
             */
            addToolStats?: (context: Internal.IToolContext, modifier: Internal.ModifierEntry, builder: Internal.ModifierStatsBuilder) => void,
            /**
             * Called when an entity is attacked, before critical hit damage is calculated.
             * Allows modifying the damage dealt.
             * Do not modify the entity here,
             * its possible the attack will still be canceled without calling further hooks due to 0 damage being dealt.  
             * 生物被攻击时调用，在暴击伤害计算之前。
             * 允许修改伤害。
             * 不要在此处修改实体，攻击可能仍然会由于造成0伤害而被取消，不调用更后面的钩子函数。
             * - - - - -
             * @param tool       Tool used to attack  
             *                   用于攻击的工具
             * 
             * @param modifier   Modifier level  
             *                   特性（及其）等级
             * 
             * @param context    Attack context  
             *                   攻击上下文
             * 
             * @param baseDamage Base damage dealt before modifiers  
             *                   特性计算前的基础伤害
             * 
             * @param damage     Computed damage from all prior modifiers  
             *                   由更优先的特性计算之后的伤害
             * 
             * @returns          New damage to deal  
             *                   要造成的新伤害
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     getMeleeDamage: (tool, modifier, context, baseDamage, damage) => {
             *         return damage + modifier.level; // Add damage that equals to modifier's level
             *                                         // 增加相当于特性等级的伤害
             *     }
             * });
             */
            getMeleeDamage?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, context: Internal.ToolAttackContext, baseDamage: number, damage: number) => number,
            /**
             * Called right before an entity is hit, used to modify knockback applied or to apply special effects that need to run before damage.
             * {@linkcode damage} is final damage including critical damage.
             * Note there is still a chance this attack won't deal damage, if that happens {@linkcode ModifierHookArgument.failedMeleeHit} will run.  
             * 在实体被攻击前调用，用于修改击退或添加需要在计算攻击伤害前运行的药水效果。
             * {@linkcode damage}是包含暴击加成的最终伤害。
             * 注意：此时仍有可能该攻击不会造成任何伤害，这将导致{@linkcode ModifierHookArgument.failedMeleeHit}运行。
             * - - - - -
             * @param tool          Tool used to attack  
             *                      用于攻击的工具
             * 
             * @param modifier      Modifier level  
             *                      特性（及其）等级
             * 
             * @param context       Attack context  
             *                      攻击上下文
             * 
             * @param damage        Damage to deal to the attacker  
             *                      造成的伤害
             * 
             * @param baseKnockback Base knockback before modifiers  
             *                      修改前的击退
             * 
             * @param knockback     Computed knockback from all prior modifiers  
             *                      由更优先的特性计算后的击退
             * 
             * @returns             New knockback to apply. 0.5 is equivelent to 1 level of the vanilla enchant  
             *                      新的击退。`0.5`与原版的一级击退附魔等价
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     beforeMeleeHit: (tool, modifier, context, damage, baseKnockback, knockback) => {
             *         return knockback + 0.5; // Add 0.5 knockback
             *                                 // 增加 0.5 击退
             *     }
             * });
             */
            beforeMeleeHit?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, context: Internal.ToolAttackContext, damage: number, baseKnockback: number, knockback: number) => number,
            /**
             * Called after a living entity is successfully attacked.
             * Used to apply special effects on hit.  
             * 在一个生物被成功攻击时调用。
             * 常用于用于攻击时添加特殊效果。
             * - - - - -
             * @param tool        Tool used to attack  
             *                    用于攻击的工具
             * 
             * @param modifier    Modifier level  
             *                    特性（及其）等级
             * 
             * @param context     Attack context  
             *                    攻击上下文
             * 
             * @param damageDealt Amount of damage successfully dealt
             *                    (After testing, this is always `0.0`)  
             *                    成功造成的伤害
             *                    （经过测试，总为`0.0`）
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     afterMeleeHit: (tool, modifier, context, damageDealt) => {
             *         console.info(`Damage dealt: ${damageDealt}`); // Display dealt damage in the console
             *                                                       // 在控制台中显示造成的伤害
             *     }
             * });
             */
            afterMeleeHit?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, context: Internal.ToolAttackContext, damageDealt: number) => void,
            /**
             * Gets the protection value of the armor from this modifier.
             * A value of 1 blocks about 4% of damage, equivalent to 1 level of the protection enchantment.
             * Maximum effect is 80% reduction from a modifier value of 20.
             * Can also go negative, up to 180% increase from a modifier value of -20  
             * 该护甲从这个特性得到的保护值。
             * 每`1`点值可以抵挡大约4%的伤害，等价于1级的原版保护附魔。
             * 最大效果是80%伤害减免，即该值为`20`。
             * 也可以变为负数，最小为`-20`，即受到180%伤害。
             * - - - - -
             * @param tool          Worn armor  
             *                      穿戴的护甲
             * 
             * @param modifier      Modifier level  
             *                      特性（及其）等级
             * 
             * @param context       Equipment context of the entity wearing the armor  
             *                      穿戴护甲的实体的装备上下文
             * 
             * @param slotType      Slot containing the armor  
             *                      护甲所在的栏位
             * 
             * @param source        Damage source  
             *                      伤害来源
             * 
             * @param modifierValue Modifier value from previous modifiers to add  
             *                      来自更优先的特性的特性值
             * 
             * @returns             New modifier value  
             *                      要添加的新特性值
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     getProtectionModifier: (tool, modifier, context, slotType, source, modifierValue) => {
             *         return modifierValue + modifier.level; // Add protection that equals to modifier's level
             *                                                // 增加相当于特性等级的防护
             *     }
             * }
             */
            getProtectionModifier?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, context: Internal.EquipmentContext, slotType: Internal.EquipmentSlot, source: DamageSource, modifierValue: number) => number,
            /**
             * Runs after an entity is attacked (and we know the attack will land).
             * Note you can attack the entity here,
             * but you are responsible for preventing infinite recursion if you do so (by detecting your own attack source for instance)  
             * 在一个实体被攻击之前运行（且我们知道攻击会发生）。
             * 注意：你可以在此处攻击实体，但若这么做，你有责任防止无限递归（例如，检测你自己的攻击源）
             * - - - - -
             * @param tool           Tool being used  
             *                       使用的工具
             * 
             * @param modifier       Level of the modifier  
             *                       特性（及其）等级
             * 
             * @param context        Context of entity and other equipment  
             *                       实体与其其它装备的上下文
             * 
             * @param slotType       Slot containing the tool  
             *                       该工具的栏位
             * 
             * @param source         Damage source causing the attack  
             *                       导致该攻击的伤害来源
             * 
             * @param amount         Amount of damage caused
             *                       伤害量
             * 
             * @param isDirectDamage If true, this attack is direct damage from an entity
             *                       若为真，则该攻击时来自实体的直接伤害
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     onAttacked: (tool, modifier, context, slotType, source, amount, isDirectDamage) => {
             *         console.info(`Damage dealt: ${amount}`); // Display dealt damage in the console
             *                                                  // 在控制台中显示造成的伤害
             *     }
             * });
             */
            onAttacked?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, context: Internal.EquipmentContext, slotType: Internal.EquipmentSlot, source: DamageSource, amount: number, isDirectDamage: boolean) => void,
            /**
             * Triggers when mining blocks.
             * Note that modification on mining speed should be done on `newSpeed` field of {@link event `event`}.  
             * 挖掘方块时触发。
             * 注意：对于挖掘速度的修改都应该在{@link event `event`}的`newSpeed`字段上完成。
             * - - - - -
             * @param tool                Current tool instance  
             *                            当前工具实例
             * 
             * @param modifier            Modifier level  
             *                            特性（及其）等级
             * 
             * @param event               Event instance  
             *                            事件实例
             * 
             * @param sideHit             Side of the block that was hit  
             *                            挖掘的方块的面
             * 
             * @param isEffective         If true, the tool is effective against this block type  
             *                            若为真，则对该方块种类来说是有效工具
             * 
             * @param miningSpeedModifier Calculated modifier from potion effects such as haste and environment such as water, use for additive bonuses to ensure consistency with the mining speed stat  
             *                            从药水效果（例如急迫）或环境（例如在水中）计算得来，用于额外速度奖励来保证与挖掘速度统计数据的一致性
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     onBreakSpeed: (tool, modifier, event, sideHit, isEffective, miningSpeedModifier) => {
             *         event.newSpeed *= 2; // Double the mining speed
             *                              // 将挖掘速度翻倍
             *     }
             * });
             */
            onBreakSpeed?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, event: Internal.PlayerEvent$BreakSpeed, sideHit: Internal.Direction, isEffective: boolean, miningSpeedModifier: number) => void,
            /**
             * Called after a block is broken to apply special effects  
             * 在方块被破坏后调用来添加特殊效果
             * - - - - -
             * @param tool     Tool used  
             *                 使用的工具
             * 
             * @param modifier Modifier level  
             *                 特性（及其）等级
             * 
             * @param context  Harvest context  
             *                 收获上下文
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     afterBlockBreak: (tool, modifier, context) => {
             *         console.info(context.getState()); // Send block state of the block mined to the console
             *                                           // 向控制台发送破坏的方块的方块状态
             *     }
             * });
             */
            afterBlockBreak?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, context: Internal.ToolHarvestContext) => void,
            /**
             * Triggers when launching a projectile.
             * 发射弹射物时触发。
             * - - - - -
             * @param tool       Bow instance  
             *                   弓实例
             * 
             * @param modifier   Modifier being used  
             *                   特性条目。
             * 
             * @param shooter    Entity firing the arrow  
             *                   发射者实体。
             * 
             * @param ammo       Ammo stack used to fire this projectile. May be empty if the projectile is unusual, e.g. fluid projectiles.  
             *                   使用的弹药。对于不寻常的弹射物，该项为空，例如：流体弹药。
             * 
             * @param projectile Projectile to modify  
             *                   要修改的弹射物
             * 
             * @param arrow      Arrow to modify as most modifiers wish to change that, will be null for non-arrow projectiles  
             *                   要修改的箭（由于很多特性都需要修改这个），对于非箭类的弹射物，将为`null`
             * 
             * @param persistent Persistent data instance stored on the arrow to write arbitrary data. Note the modifier list was already written  
             *                   保存在箭实体上的持久数据实例，可以向其中写入任意数据。注意：特性列表在之前就已写入
             * 
             * @param isPrimary  If true, this is the primary projectile. Multishot may launch multiple  
             *                   若为`true`，则这是主要的弹射物。多重射击可能会发射多个
             * - - - - -
             * @example
             * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
             *     onProjectileLaunch: (tool, modifier, shooter, ammo, projectile, arrow, persistent, isPrimary) => {
             *         if (arrow == null) return; // Prevent non-arrow projectiles. See descriptions for parameter `arrow`.
             *                                    // 防止非箭类弹射物。见参数`arrow`的介绍。
             * 
             *         arrow.baseDamage += 5;     // Add 5 damage to the arrow
             *                                    // 向箭矢增加 5 伤害
             *     }
             * });
             */
            onProjectileLaunch?: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, shooter: Internal.LivingEntity, ammo: Internal.ItemStack, projectile: Internal.Projectile, arrow: Internal.AbstractArrow | null, persistent: Internal.ModDataNBT, isPrimary: boolean) => void,
            /**
             * Some custom methods for modifiers written by our KubeJS scripts.
             * These are not standard Tinker's Construct modifier hooks.  
             * 使用我们的KubeJS脚本编写的一些自定义方法，
             * 并非标准的匠魂特性钩子机制。
             */
            __custom__?: CustomModifierHookArgument,
            /**
             * Some custom methods on class definitions.  
             * 一些在类定义上的自定义方法。
             */
            __class__?: ClassModifierHookArgument
        };
        type CustomModifierHookArgument = {
            /**
             * Triggers **every tick** on server side.
             * 在服务端**每个tick**触发一次。
             * - - - - -
             * Not to be confused with {@link ModifierHookArgument.onInventoryTick `onInventoryTick`}.
             * `onInventoryTick` functions focus on real tool instances,
             * they are called only when tool with that modifier exists.
             * May also be called more than once respectively for multiple tools in one tick.  
             * However, this `onServerTick` function is not related to any real tool instances.
             * `onServerTick` functions are called even if no tool exists in the world,
             * and can never be called multiple times within a single tick.
             * (They are called once and only once within a tick.)  
             * 不要与{@link ModifierHookArgument.onInventoryTick `onInventoryTick`}混淆。
             * `onInventoryTick`函数更注重实际的工具实例，
             * 它们只在带有该特性的工具存在时被调用，
             * 也可能在一刻内为多个工具分别调用。  
             * 但是，这个`onServerTick`函数并不与任何真正的工具实例相关，
             * `onServerTick`函数即使在没有相应工具存在时也会被调用，
             * 且不能再同一刻内被调用多次。
             * （即它们在一个刻内会被调用一次，且仅有一次。）
             * - - - - -
             * @param event Server tick event
             *              服务端tick事件
             * - - - - -
             * @example
             * let TEST = KubeJSModifierManager.registerCommonModifier("test", "TestModifier", {
             *     __custom__: {
             *         ServerTick: (event) => {
             *             console.info("Test message"); // Send `Test message` to console
             *                                           // 向控制台发送`Test message`
             *         }
             *     }
             * });
             */
            onServerTick?: (event: Internal.ServerEventJS) => void
        };
        type ClassModifierHookArgument = {
            /**
             * Called before finally defining the modifier class.
             * For example, overriding class to extend from.
             * Note this is called still before default constructor is created.
             * You can manually add a custom constructor to cancel the creation of default constructor.  
             * 在最后定义类之前调用，例如可以覆盖要继承的类。
             * 注意，调用时间仍然在创建默认构造方法之前。
             * 你可以在此时手动添加一个自定义构造方法来取消默认构造方法的创建。
             * - - - - -
             * @param classCreator Class Creator object to define modifier class  
             *                     类创建器对象，用于创建特性类
             * - - - - -
             * Related Link | 相关链接
             * - ***(Will open browser)*** [`NoLevelsModifier`](https://github.com/SlimeKnights/TinkersConstruct/blob/1.20.1/src/main/java/slimeknights/tconstruct/library/modifiers/impl/NoLevelsModifier.java)
             * @example
             * let TEST = KubeJSModifierManager.registerCommonModifier("test", "TestModifier", {
             *     __class__: {
             *         post: (classCreator) => {
             *             classCreator.extends("slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier");
             *             // Let the modifier class extends `NoLevelsModifier` to remove level display at the end of modifier name
             *             // 让特性继承`NoLevelsModifier`来移除特性名称末尾的等级显示
             *         }
             *     }
             * });
             */
            post?: (classCreator: ClassCreator) => void
        };
        type ModifierHooks = keyof ModifierHookArgument;
    }

    namespace JavaClass {
    }

}

declare namespace BookArguments {
    type MaterialPageLeft = {
        /**
         * - The string ID of the material.
         * - 材料 ID。
         */
        materialId: Internal.MaterialId
    }
    type MaterialPageRight = {
        /**
         * - The string ID of the material.
         * - 材料 ID。
         */
        materialId: Internal.MaterialId,
        isEncyclopedia: boolean,
        defaultMaterials: string[]
    }
}

declare class ClassCreator<T extends typeof any> {

    name: string;
    internalName: string;
    constantPoolCounter: number;
    methods: Method[];
    attributes: [string, {generateByteCode: (classCreator: ClassCreator) => number[]}][];
    fields: {name: string, descriptor: string, access: number}[];
    access: number;
    constantPool: [tag: number, {generateByteCode: () => number[]}][];
    superClass: string;
    superInterfaces: string[];

    defineHiddenClass(lookup: Internal.MethodHandles$Lookup): T;
    defineClass(lookup: Internal.MethodHandles$Lookup): T;
    generateByteCode(): number[];
    /**
     * 生成一个默认的构造器方法，
     * 若需指定父类，则必须要在生成该方法之前设置。
     * 请确保父类有公开的无参数构造器，
     * 生成构造器方法时我们不会检测。
     * - - - - -
     * Generate a default constructor method.
     * If you want to set super class, do so before calling this method.
     * Please ensure that the super class has a constructor with no arguments.
     * We do not detect that when generating constructors.
     */
    createDefaultConstructor(): this;
    /**
     * - Push a constant into the Constant Pool, and return the index of this constant.
     * - Directly return the index of the constant if it already exists.
     * - 将一个常量放入常量池，并返回该常量的索引。
     * - 当常量已存在时，直接返回该常量的索引。
     */
    createConstant(tag: number, constant: {generateByteCode: () => number[]}): number;
    /**
     * - Get constant from the Constant Pool at the specific index.
     * - 从常量池获取指定索引的常量。
     */
    getConstant(index: number): {generateByteCode: () => number[]};
    /**
     * - Set the super class.
     * - 设置父类。
     */
    extends(superClass: string): this;
    /**
     * - Add a superinterface.
     * - 添加一个父接口。
     */
    implements(superInterface: string): this;
    /**
     * - Mark the class as an interface.
     * - 将类标记为接口。
     * - - - - -
     * @returns {this}
     */
    setIsInterface(): this;
    /**
     * - Add a method.
     * - 添加一个方法。
     */
    addMethod(name: string, descriptor: string, method: (method: Method) => void): this;
    /**
     * - Add an attribute.
     * - 添加一个属性。
     */
    addAttribute(name: string, attribute: {generateByteCode: (classCreator: ClassCreator) => number[]}): this;
    /**
     * - Add a field.
     * - 添加一个字段。
     * - - - - -
     * @param {string} name
     * @param {string} descriptor
     * @param {number} access
     */
    addField(name: string, descriptor: string, access: number): this;
    CONSTANT_Utf8(str: string): number;
    CONSTANT_NameAndType(name: string, type: string): number;
    CONSTANT_Class(name: string): number;
    CONSTANT_Methodref(className: string, methodName: string, methodDescriptor: string): number;
    CONSTANT_Fieldref(className: string, fieldName: string, fieldDescriptor: string): number;
    CONSTANT_InterfaceMethodref(className: string, methodName: string, methodDescriptor: string): number;
}

declare namespace BatchRecipe {

    /**
     * A recipe allow compositing an item onto an existing tool part and converting it to another material.  
     * 将一个物品复合到存在的工具部件上并转化为另一个材料的配方。
     */
    interface PartBuilderCompositeRecipe {
        /**
         * - Input material.
         * - 输入材料。
         */
        input: Internal.MaterialVariantId;
        /**
         * - Output material.
         * - 输出材料。
         */
        output: Internal.MaterialVariantId;
        /**
         * - Material required to composite into a part.
         * - 复合用材料。
         */
        material?: Internal.MaterialVariantId;
    }

}
