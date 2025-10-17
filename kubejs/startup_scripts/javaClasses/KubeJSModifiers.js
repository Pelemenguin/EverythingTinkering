// priority: 65535

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview KubeJSModifiers
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    ModifierDeferredRegister
    FMLJavaModLoadingContext
    StartupEvents
    ClassCreator
    Utils
    console
*/

/**
 * Stores functions used in modifiers.
 * 储存在特性中使用的函数。
 */
global.TinkerFunctions = {};

/** @type {Internal.Map<string, (event: Internal.ServerEventJS) => void>} */
global.TinkerFunctions.onServerTickFunctions = Utils.newMap();

/**
 * @type {Object<Annotation.TinkerFunction.ModifierHooks, string>}
 */
let HOOK_TO_IMPLEMENTING_INTERFACE = {
    "modifyStat": "slimeknights.tconstruct.library.modifiers.hook.build.ConditionalStatModifierHook",
    "onDamageTool": "slimeknights.tconstruct.library.modifiers.hook.behavior.ToolDamageModifierHook",
    "onInventoryTick": "slimeknights.tconstruct.library.modifiers.hook.interaction.InventoryTickModifierHook",
    "addTooltip": "slimeknights.tconstruct.library.modifiers.hook.display.TooltipModifierHook",
    "addToolStats": "slimeknights.tconstruct.library.modifiers.hook.build.ToolStatsModifierHook",
    "getMeleeDamage": "slimeknights.tconstruct.library.modifiers.hook.combat.MeleeDamageModifierHook",
    "beforeMeleeHit": "slimeknights.tconstruct.library.modifiers.hook.combat.MeleeHitModifierHook",
    "afterMeleeHit": "slimeknights.tconstruct.library.modifiers.hook.combat.MeleeHitModifierHook",
    "getProtectionModifier": "slimeknights.tconstruct.library.modifiers.hook.armor.ProtectionModifierHook",
    "onAttacked": "slimeknights.tconstruct.library.modifiers.hook.armor.OnAttackedModifierHook",
    "onBreakSpeed": "slimeknights.tconstruct.library.modifiers.hook.mining.BreakSpeedModifierHook",
    "afterBlockBreak": "slimeknights.tconstruct.library.modifiers.hook.mining.BlockBreakModifierHook",
    "onProjectileLaunch": "slimeknights.tconstruct.library.modifiers.hook.ranged.ProjectileLaunchModifierHook"
};

/** @type {Object<string, [string[], string, <P extends any[], R>(func: (...args: P) => R) => (...args: P) => R]>} */
let HOOK_TO_METHOD_PARAMETERS = {
    "modifyStat": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "net.minecraft.world.entity.LivingEntity",
            "slimeknights.tconstruct.library.tools.stat.FloatToolStat",
            "float",
            "float"
        ],
        "float",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5) => {
                try {
                    return func(arg0, arg1, arg2, arg3, arg4, arg5);
                } catch (e) {
                    console.error(`Error in modifyStat of modifier ${arg1.getId().toString()}: ${e}`);
                    return arg4;
                }
            };
        }
    ],
    "onDamageTool": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "int",
            "net.minecraft.world.entity.LivingEntity",
            "net.minecraft.world.item.ItemStack"
        ],
        "int",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4) => {
                try {
                    return func(arg0, arg1, arg2, arg3, arg4);
                } catch (e) {
                    console.error(`Error in onDamageTool of modifier ${arg1.getId().toString()}: ${e}`);
                    return arg2;
                }
            };
        }
    ],
    "onInventoryTick": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "net.minecraft.world.level.Level",
            "net.minecraft.world.entity.LivingEntity",
            "int",
            "boolean",
            "boolean",
            "net.minecraft.world.item.ItemStack"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
                try {
                    func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                } catch (e) {
                    console.error(`Error in onInventoryTick of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "addTooltip": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "net.minecraft.world.entity.player.Player",
            "java.util.List",
            "slimeknights.mantle.client.TooltipKey",
            "net.minecraft.world.item.TooltipFlag"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5) => {
                try {
                    func(arg0, arg1, arg2, arg3, arg4, arg5);
                } catch (e) {
                    console.error(`Error in addTooltip of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "addToolStats": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolContext",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.stat.ModifierStatsBuilder"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2) => {
                try {
                    func(arg0, arg1, arg2);
                } catch (e) {
                    console.error(`Error in addToolStats of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "getMeleeDamage": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.context.ToolAttackContext",
            "float",
            "float"
        ],
        "float",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4) => {
                try {
                    return func(arg0, arg1, arg2, arg3, arg4);
                } catch (e) {
                    console.error(`Error in getMeleeDamage of modifier ${arg1.getId().toString()}: ${e}`);
                    return arg3;
                }
            };
        }
    ],
    "beforeMeleeHit": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.context.ToolAttackContext",
            "float",
            "float",
            "float"
        ],
        "float",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5) => {
                try {
                    return func(arg0, arg1, arg2, arg3, arg4, arg5);
                } catch (e) {
                    console.error(`Error in beforeMeleeHit of modifier ${arg1.getId().toString()}: ${e}`);
                    return arg5;
                }
            };
        }
    ],
    "afterMeleeHit": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.context.ToolAttackContext",
            "float"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3) => {
                try {
                    func(arg0, arg1, arg2, arg3);
                } catch (e) {
                    console.error(`Error in afterMeleeHit of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "getProtectionModifier": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.context.EquipmentContext",
            "net.minecraft.world.entity.EquipmentSlot",
            "net.minecraft.world.damagesource.DamageSource",
            "float"
        ],
        "float",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5) => {
                try {
                    return func(arg0, arg1, arg2, arg3, arg4, arg5);
                } catch (e) {
                    console.error(`Error in getProtectionModifier of modifier ${arg1.getId().toString()}: ${e}`);
                    return arg5;
                }
            };
        }
    ],
    "onAttacked": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.context.EquipmentContext",
            "net.minecraft.world.entity.EquipmentSlot",
            "net.minecraft.world.damagesource.DamageSource",
            "float",
            "boolean"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5, arg6) => {
                try {
                    func(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
                } catch (e) {
                    console.error(`Error in onAttacked of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "onBreakSpeed": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "net.minecraftforge.event.entity.player.PlayerEvent$BreakSpeed",
            "net.minecraft.core.Direction",
            "boolean",
            "float"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5) => {
                try {
                    func(arg0, arg1, arg2, arg3, arg4, arg5);
                } catch (e) {
                    console.error(`Error in onBreakSpeed of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "afterBlockBreak": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "slimeknights.tconstruct.library.tools.context.ToolHarvestContext"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2) => {
                try {
                    func(arg0, arg1, arg2);
                } catch (e) {
                    console.error(`Error in afterBlockBreak of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ],
    "onProjectileLaunch": [
        [
            "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
            "slimeknights.tconstruct.library.modifiers.ModifierEntry",
            "net.minecraft.world.entity.LivingEntity",
            "net.minecraft.world.item.ItemStack",
            "net.minecraft.world.entity.projectile.Projectile",
            "net.minecraft.world.entity.projectile.AbstractArrow",
            "slimeknights.tconstruct.library.tools.nbt.ModDataNBT",
            "boolean"
        ],
        "void",
        (func) => {
            return (arg0, /** @type {Internal.ModifierEntry} */ arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
                try {
                    func(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                } catch (e) {
                    console.error(`Error in onProjectileLaunch of modifier ${arg1.getId().toString()}: ${e}`);
                }
            };
        }
    ]
};

/** @type {{[x: string]: [string, string, string]}} */
let HOOK_TO_FIELDS = {
    "modifyStat": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "CONDITIONAL_STAT", "slimeknights.tconstruct.library.module.ModuleHook"],
    "onDamageTool": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "TOOL_DAMAGE", "slimeknights.tconstruct.library.module.ModuleHook"],
    "onInventoryTick": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "INVENTORY_TICK", "slimeknights.tconstruct.library.module.ModuleHook"],
    "addTooltip": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "TOOLTIP", "slimeknights.tconstruct.library.module.ModuleHook"],
    "addToolStats": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "TOOL_STATS", "slimeknights.tconstruct.library.module.ModuleHook"],
    "getMeleeDamage": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "MELEE_DAMAGE", "slimeknights.tconstruct.library.module.ModuleHook"],
    "beforeMeleeHit": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "MELEE_HIT", "slimeknights.tconstruct.library.module.ModuleHook"],
    "afterMeleeHit": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "MELEE_HIT", "slimeknights.tconstruct.library.module.ModuleHook"],
    "getProtectionModifier": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "PROTECTION", "slimeknights.tconstruct.library.module.ModuleHook"],
    "onAttacked": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "ON_ATTACKED", "slimeknights.tconstruct.library.module.ModuleHook"],
    "onBreakSpeed": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "BREAK_SPEED", "slimeknights.tconstruct.library.module.ModuleHook"],
    "afterBlockBreak": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "BLOCK_BREAK", "slimeknights.tconstruct.library.module.ModuleHook"],
    "onProjectileLaunch": ["slimeknights.tconstruct.library.modifiers.ModifierHooks", "PROJECTILE_LAUNCH", "slimeknights.tconstruct.library.module.ModuleHook"]
};

const ModifierManager = {
    /** @type {Internal.Map<string, {className: string, modifierClass: typeof any, registerer: () => Internal.Modifier}} */
    ALL_MODIFIERS: Utils.newMap(),
    /**
     * Register a common modifier.
     * 注册一个普通特性。
     * - - - - -
     * @param {string} name Modifier's name. Should not have `kubejs:` prefix  
     *                      特性名称，应无`kubejs:`前缀
     * @param {string} className Class' name. For example: `TestModifier`  
     *                           类名。例如：`TestModifier`
     * @param {Annotation.TinkerFunction.ModifierHookArgument} hooks Hooks to register. You should receive a more detailed typing hint when checking the object's keys  
     *                                                               要注册的钩子。你应该会在查看该对象的键时获取到更详细的介绍
     * - - - - -
     * Related links for the example | 此示例的相关链接：
     * - {@link Annotation.TinkerFunction.ModifierHookArgument.onProjectileLaunch `onProjectileLaunch`}  
     *   Hook method appears in the example  
     *   示例中出现的钩子方法
     * @example
     * let TEST = ModifierManager.registerCommonModifier("test", "TestModifier", {
     *     // Here we use `onProjectileLaunch` as an example, which triggers when projectiles are launched
     *     // 这里使用`onProjectileLaunch`为例，其在弹射物发射时触发
     *     onProjectileLaunch: (tool, modifier, shooter, ammo, projectile, arrow, persistent, isPrimary) => {
     *         // The reason of possibly appearing `null` see `onProjectileLaunch`'s descriptions.
     *         // 判空的原因详见`onProjectileLaunch`的介绍
     *         if (arrow == null) return;
     * 
     *         // Send a message to console
     *         // 向控制台发送信息
     *         console.info(`Arrow launched, damage: ${arrow.damage}`);
     *     }
     *     // Then the modifier `kubejs:test` can send a message to the console every time when a tool with this modifier launches a projectile
     *     // 现在特性`kubejs:test`就可以在带有此特性的工具每次发射弹射物的时候向控制台发送一次信息
     * })
     */
    registerCommonModifier: (name, className, hooks) => {
        /** @type {ClassCreator} */
        let modifierClassCreator = ClassCreator.create(`Modifier.${className}`);
        
        if ("__class__" in hooks && "extending" in hooks.__class__) modifierClassCreator.extending(hooks.__class__.extending);
        else modifierClassCreator.extending("slimeknights.tconstruct.library.modifiers.Modifier");

        let seenInterfaces = new Set();
        let hookKeys = Object.keys(hooks);
        hookKeys.forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
            if (hook == "__custom__") {
                customHookHandler(name, hooks.__custom__);
                return;
            }
            if (!(hook in HOOK_TO_IMPLEMENTING_INTERFACE)) return;
            let implementing = HOOK_TO_IMPLEMENTING_INTERFACE[hook];
            if (!seenInterfaces.has(implementing)) {
                seenInterfaces.add(hook);
                modifierClassCreator.implementing(implementing);
            }
        });
        hookKeys.forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
            if (!(hook in HOOK_TO_METHOD_PARAMETERS)) return;
            let [parameters, returnType, transformer] = HOOK_TO_METHOD_PARAMETERS[hook];

            modifierClassCreator.createMethod(hook, parameters, returnType)
                .toPublic()
                .codeJS(transformer(hooks[hook]));
            
            // SPECIAL HANDLING

            // 1. ToolDamageModifierHook needs another method
            if (hook == "onDamageTool") {
                modifierClassCreator.createMethod("onDamageTool", 
                    [
                        "slimeknights.tconstruct.library.tools.nbt.IToolStackView",
                        "slimeknights.tconstruct.library.modifiers.ModifierEntry",
                        "int",
                        "net.minecraft.world.entity.LivingEntity"
                    ],
                    "int"
                )
                    .toPublic()
                    .codeJS((arg0, arg1, arg2, arg3) => hooks.onDamageTool(arg0, arg1, arg2, arg3, null));
            }
        });

        let registerHooksCodeBuilder = modifierClassCreator.createMethod("registerHooks", ["slimeknights/tconstruct/library/module/ModuleHookMap$Builder"], "void")
            .toProtected()
            .code()
            .loadObject("arg0");

        let seenHooks = new Set();
        hookKeys.forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
            if (!(hook in HOOK_TO_FIELDS)) return;
            let fieldInfo = HOOK_TO_FIELDS[hook];
            let concated = fieldInfo.join("");
            if (seenHooks.has(concated)) return;
            else seenHooks.add(concated);

            registerHooksCodeBuilder
                .loadObject("this")
                .getStaticField(fieldInfo[0], fieldInfo[1], fieldInfo[2])
                .invokeVirtual("slimeknights.tconstruct.library.module.ModuleHookMap$Builder", "addHook", ["java.lang.Object", "slimeknights.tconstruct.library.module.ModuleHook"], "slimeknights.tconstruct.library.module.ModuleHookMap$Builder");
        });

        registerHooksCodeBuilder.returnVoid().build();

        if ("__class__" in hooks && "post" in hooks) {
            hooks.__class__.post(modifierClassCreator);
        }

        if ("__class__" in hooks && "generateConstructor" in hooks) {
            hooks.__class__.generateConstructor(modifierClassCreator);
        } else modifierClassCreator.defaultConstructor();

        /** @type {typeof Internal.Modifier} */
        let modifierClass = modifierClassCreator.defineClass();

        ModifierManager.ALL_MODIFIERS[name] = {
            className: modifierClassCreator.getClassName(),
            modifierClass: modifierClass,
            registerer: () => new modifierClass()
        };

        return modifierClass;
    }
};

StartupEvents.init(() => {
    const KUBEJS_MODIFIERS = new ModifierDeferredRegister.create("kubejs");

    console.info("Modifier Registration Begin:");

    ModifierManager.ALL_MODIFIERS.forEach((modifierName, modifierObject) => {
        console.info(`New Modifier: ${modifierName} (className: ${modifierObject.className})`);
        KUBEJS_MODIFIERS.register(modifierName, modifierObject.registerer);
    });

    KUBEJS_MODIFIERS.register(FMLJavaModLoadingContext.get().getModEventBus());
});

/**
 * @param {string} modifierId
 * @param {Annotation.TinkerFunction.CustomModifierHookArgument} hook 
 */
let customHookHandler = (modifierId, hook) => {
    Object.keys(hook).forEach((/** @type {keyof hook} */ customHook) => {
        switch (customHook) {
            case "onServerTick": {
                global.TinkerFunctions.onServerTickFunctions.put(`kubejs:${modifierId}`, hook.onServerTick);
            }
        }
    });
};
