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
     * @param {Annotation.TinkerFunction.ModifierHookArgument extends infer T ? T : never} hooks Hooks to register. You should receive a more detailed typing hint when checking the object's keys  
     *                                                                                           要注册的钩子。你应该会在查看该对象的键时获取到更详细的介绍
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
            .extends("slimeknights.tconstruct.library.modifiers.Modifier")
            .createDefaultConstructor();

        Object.keys(hooks).forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
            switch (hook) {
                case "onProjectileLaunch": {
                    let interfaceName = TinkerFunctionsSet.ProjectileLaunchFunction.__javaObject__.getName().replace('.', '/');
                    let methodDescriptor = "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V";

                    modifierClassCreator.implements("slimeknights.tconstruct.library.modifiers.hook.ranged.ProjectileLaunchModifierHook")
                        .addField("onProjectileLaunchFunction", `L${interfaceName};`, 9)
                        .addMethod("onProjectileLaunch", methodDescriptor, method => {
                            method.addAttribute("Code", new CodeAttribute(9, 9).setCustomByteCodeGenerator((classCreator) => {
                                let references = JavaUtils.ByteBuffer.allocate(4)
                                    .putShort(0, classCreator.CONSTANT_Fieldref(classCreator.name.replace(/\./g, '/'), "onProjectileLaunchFunction", `L${interfaceName};`))
                                    .putShort(2, classCreator.CONSTANT_InterfaceMethodref(interfaceName, "onProjectileLaunch", methodDescriptor))
                                    .array();

                                return [
                                    0xb2, // getstatic thisClass.onProjectileLaunchFunction
                                        references[0],
                                        references[1],
                                    0x2b, // aload_1
                                    0x2c, // aload_2
                                    0x2d, // aload_3
                                    0x19, // aload 4
                                        0x04,
                                    0x19, // aload 5
                                        0x05,
                                    0x19, // aload 6
                                        0x06,
                                    0x19, // aload 7
                                        0x07,
                                    0x15, // iload 8
                                        0x08,
                                    0xb9, // invokeinterface
                                        references[2],
                                        references[3],
                                        0x09,
                                        0x00,
                                    0xb1, // return
                                ];
                            }));
                        });
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
                
                let hookAdder = Object.keys(hooks).map((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
                    switch (hook) {
                        case "onProjectileLaunch": {
                            return ["slimeknights/tconstruct/library/modifiers/ModifierHooks", "PROJECTILE_LAUNCH", "Lslimeknights/tconstruct/library/module/ModuleHook;"];
                        }
                        default: {
                            return undefined;
                        }
                    }
                }).map(attr => {
                    if (attr === undefined) return [];

                    let ref = JavaUtils.ByteBuffer.allocate(2).putShort(0, classCreator.CONSTANT_Fieldref(attr[0], attr[1], attr[2])).array();

                    return [
                        0x2b, // aload_1
                        0x2a, // aload_0
                        0xb2, // getstatic
                            ref[0], ref[1],
                        0xb6, // invokevirtual
                            commonReferences[0], commonReferences[1],
                    ];
                });

                let result = [];
                hookAdder.forEach(l => result = result.concat(l));
                result.push(0xb1); // return
                return result;
            }));
        });
            
        let modifierClass = modifierClassCreator.defineClass(JavaUtils.MethodHandles.lookup());

        Object.keys(hooks).forEach((/** @type {Annotation.TinkerFunction.ModifierHooks} */ hook) => {
            switch (hook) {
                case "onProjectileLaunch": {
                    modifierClass['onProjectileLaunchFunction'] = hooks.onProjectileLaunch;
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
 * @param {Annotation.TinkerFunction.ModifierHookArgument['__custom__']} hook 
 */
let customHookHandler = (modifierId, hook) => {
    Object.keys(hook).forEach((/** @type {keyof hook} */ customHook) => {
        switch (customHook) {
            case "ServerTick": {
                global.TinkerFunctions.onServerTickFunctions.put(`kubejs:${modifierId}`, hook.ServerTick);
            }
        }
    });
};