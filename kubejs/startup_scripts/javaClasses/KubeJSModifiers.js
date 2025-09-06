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
    JavaUtils
    ClassCreator
    TinkerFunctionsSet
    CodeAttribute
    Utils
    console
*/

global.TinkerFunctions = {};

/** @type {Internal.Map<string, (event: Internal.ServerEventJS) => void>} */
global.TinkerFunctions.onServerTickFunctions = Utils.newMap();

// eslint-disable-next-line no-unused-vars
let ModifierClass = new ClassCreator("Modifier")
    .createDefaultConstructor()
    .defineClass(JavaUtils.MethodHandles.lookup());

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
        let modifierClassCreator = new ClassCreator(`Modifier$${className}`)
            .extends("slimeknights.tconstruct.library.modifiers.Modifier");

                            // =============================
                            // =     FIRST SWITCH-CASE     =
                            // =============================

        Object.keys(hooks).forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
            switch (hook) {
                case "onDamageTool": {
                    TinkerFunctionsSet.ToolDamgeFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "onInventoryTick": {
                    TinkerFunctionsSet.InventoryTickFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "addTooltip": {
                    TinkerFunctionsSet.AddTooltipFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "addToolStats": {
                    TinkerFunctionsSet.ToolStatsFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "getMeleeDamage": {
                    TinkerFunctionsSet.MeleeDamageFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "beforeMeleeHit": {
                    TinkerFunctionsSet.BeforeMeleeHitFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "afterMeleeHit": {
                    TinkerFunctionsSet.AfterMeleeHitFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "onAttacked":{
                    TinkerFunctionsSet.OnAttackedFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "onBreakSpeed": {
                    TinkerFunctionsSet.BreakSpeedFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "afterBlockBreak": {
                    TinkerFunctionsSet.BlockBreakFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "onProjectileLaunch": {
                    TinkerFunctionsSet.ProjectileLaunchFunction.addClassMethod(modifierClassCreator);
                    break;
                }
                case "__custom__": {
                    customHookHandler(name, hooks.__custom__);
                }
            }
        });

        modifierClassCreator.addMethod("registerHooks", "(Lslimeknights/tconstruct/library/module/ModuleHookMap$Builder;)V", method => {
            method.setProtected().addAttribute("Code", new CodeAttribute(3, 2).setCustomByteCodeGenerator(classCreator => {
                let commonReferences = JavaUtils.ByteBuffer.allocate(2)
                    .putShort(0, classCreator.CONSTANT_Methodref("slimeknights/tconstruct/library/module/ModuleHookMap$Builder", "addHook", "(Ljava/lang/Object;Lslimeknights/tconstruct/library/module/ModuleHook;)Lslimeknights/tconstruct/library/module/ModuleHookMap$Builder;"))
                    .array();
                
                let hookAdder = Array.from(new Set(Object.keys(hooks).map((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {

                                // ==============================
                                // =     SECOND SWITCH-CASE     =
                                // ==============================

                    switch (hook) {
                        case "onDamageTool": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "TOOL_DAMAGE", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "onInventoryTick": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "INVENTORY_TICK", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "addTooltip": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "TOOLTIP", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "addToolStats": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "TOOL_STATS", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "getMeleeDamage": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "MELEE_DAMAGE", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "beforeMeleeHit": {/* fallthrough to `afterMeleeHit` */}
                        case "afterMeleeHit": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "MELEE_HIT", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "onAttacked": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "ON_ATTACKED", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "onBreakSpeed": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "BREAK_SPEED", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "afterBlockBreak": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "BLOCK_BREAK", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        case "onProjectileLaunch": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "PROJECTILE_LAUNCH", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        default: {
                            return undefined;
                        }
                    }
                }).filter(a => a !== undefined)
                .map(a => JSON.stringify(a))))
                .map(v => JSON.parse(v))
                .map((/** @type {[string, string, string]} */attr) => {

                    let ref = JavaUtils.ByteBuffer.allocate(2).putShort(0, classCreator.CONSTANT_Fieldref(attr[0], attr[1], attr[2])).array();

                    return [
                        0x2a, // aload_0
                        0xb2, // getstatic
                            ref[0], ref[1],
                        0xb6, // invokevirtual
                            commonReferences[0], commonReferences[1],
                    ];
                });

                let result = [0x2b]; // aload_1
                hookAdder.forEach(l => result = result.concat(l));
                result.push(0xb1); // return
                return result;
            }));
        });

        if ('__class__' in hooks && 'post' in hooks.__class__) {
            hooks.__class__.post(modifierClassCreator);
        }

        if (modifierClassCreator.methods.findIndex(m => m.name === '<init>') == -1) modifierClassCreator.createDefaultConstructor();
            
        let modifierClass = modifierClassCreator.defineClass(JavaUtils.MethodHandles.lookup());

        Object.keys(hooks).forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {

                                // =============================
                                // =     THIRD SWITCH-CASE     =
                                // =============================

            switch (hook) {
                case "onDamageTool": {
                    modifierClass['onDamageToolFunction'] = (arg0, arg1, arg2, arg3, arg4) => {
                        try {return hooks.onDamageTool(arg0, arg1, arg2, arg3, arg4);}
                        catch (e) {console.error(e); return arg2;}
                    };
                    break;
                }
                case "onInventoryTick": {
                    modifierClass['onInventoryTickFunction'] = (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
                        try {hooks.onInventoryTick(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "addTooltip": {
                    modifierClass['addTooltipFunction'] = (arg0, arg1, arg2, arg3, arg4, arg5) => {
                        try {hooks.addTooltip(arg0, arg1, arg2, arg3, arg4, arg5);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "addToolStats": {
                    modifierClass['addToolStatsFunction'] = (arg0, arg1, arg2) => {
                        try {hooks.addToolStats(arg0, arg1, arg2);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "getMeleeDamage": {
                    modifierClass['getMeleeDamageFunction'] = (arg0, arg1, arg2, arg3, arg4) => {
                        try {return hooks.getMeleeDamage(arg0, arg1, arg2, arg3, arg4);}
                        catch (e) {console.error(e); return arg4;}
                    };
                    break;
                }
                case "beforeMeleeHit": {
                    modifierClass['beforeMeleeHitFunction'] = (arg0, arg1, arg2, arg3, arg4, arg5) => {
                        try {return hooks.beforeMeleeHit(arg0, arg1, arg2, arg3, arg4, arg5);}
                        catch (e) {console.error(e); return arg5;}
                    };
                    break;
                }
                case "afterMeleeHit": {
                    modifierClass['afterMeleeHitFunction'] = (arg0, arg1, arg2, arg3) => {
                        try {hooks.afterMeleeHit(arg0, arg1, arg2, arg3);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "onAttacked": {
                    modifierClass['onAttackedFunction'] = (arg0, arg1, arg2, arg3, arg4, arg5, arg6) => {
                        try {hooks.onAttacked(arg0, arg1, arg2, arg3, arg4, arg5, arg6);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "onBreakSpeed": {
                    modifierClass['onBreakSpeedFunction'] = (arg0, arg1, arg2, arg3, arg4, arg5) => {
                        try {hooks.onBreakSpeed(arg0, arg1, arg2, arg3, arg4, arg5);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "afterBlockBreak": {
                    modifierClass['afterBlockBreakFunction'] = (arg0, arg1, arg2) => {
                        try {hooks.afterBlockBreak(arg0, arg1, arg2);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
                case "onProjectileLaunch": {
                    modifierClass['onProjectileLaunchFunction'] = (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
                        try {hooks.onProjectileLaunch(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);}
                        catch (e) {console.error(e);}
                    };
                    break;
                }
            }
        });
        
        ModifierManager.ALL_MODIFIERS[name] = {
            className: modifierClassCreator.name,
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