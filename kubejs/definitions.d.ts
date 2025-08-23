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
        /** @deprecated */
        type Hook = "addToolStats" | "armorTakeAttacked" | "getBreakSpeed" | "onAfterBreak" | "getMeleeDamage" | "onAfterMeleeHit" | "onBeforeMeleeHit" | "onInventoryTick"
            | "projectileLaunch" | "tooltipSetting" | "onServerTick";
        type ModifierHookArgument = {
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
            onBreakSpeed: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, event: Internal.PlayerEvent$BreakSpeed, sideHit: Internal.Direction, isEffective: boolean, miningSpeedModifier: number) => void;
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
            onProjectileLaunch: (tool: Internal.IToolStackView, modifier: Internal.ModifierEntry, shooter: Internal.LivingEntity, ammo: Internal.ItemStack, projectile: Internal.Projectile, arrow: Internal.AbstractArrow, persistent: Internal.ModDataNBT, isPrimary: boolean) => void
            /**
             * Some custom methods for modifiers written by our KubeJS scripts.
             * These are not standard Tinker's Construct modifier hooks.  
             * 使用我们的KubeJS脚本编写的一些自定义方法，
             * 并非标准的匠魂特性钩子机制。
             */
            __custom__: {
                /**
                 * Triggers **every tick** on server side,
                 * regardless of whether there are modifier instances in the world.
                 * Usually used to validate or evaluate something together with other methods.  
                 * 在服务端**每个tick**触发一次，
                 * 无论世界中是否存在这一特性的实例。
                 * 常用于检验或计算某些东西，
                 * 配合其它方法使用。
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
                ServerTick: (event: Internal.ServerEventJS) => void
            }
        }
        type ModifierHooks = keyof ModifierHookArgument;
    }

    namespace JavaClass {
        type AnnotationStructure = {
                name: string
            } & ({
                tag: 'B' | 'C' | 'I' | 'S' | 'Z',
                value: number
            } | {
                tag: 'D',
                value: number
            } | {
                tag: 'F',
                value: number
            } | {
                tag: 'J',
                value: number
            } | {
                tag: 's',
                value: string
            } | {
                tag: 'e',
                type: string,
                constName: string
            } | {
                tag: 'c',
                className: string
            } | {
                tag: '@',
                annotation: Annnotation.JavaClass.AnnotationStructure
            } | {
                tag: '[',
                values: AnnotationStructure[]
            });
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