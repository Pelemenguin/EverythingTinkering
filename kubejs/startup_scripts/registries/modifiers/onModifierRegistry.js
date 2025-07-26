// priority: 100

/**
 * @file This JS file is for modifier registry.
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    TConJSEvents
    Utils
    console
    global
*/

TConJSEvents.modifierRegistry(event => {
    console.info("Registering modifiers...");
    RegisteredModifiers.keySet().forEach(id => {
        event.createNew(id, builder => {
            let modifier = RegisteredModifiers.get(id);
            modifier.hooks.forEach(hook => {
                switch (hook) {
                    case "addToolStats":
                        builder.addToolStats((arg0, arg1, arg2) => {
                            try {
                                global.TinkerFunctions.addToolStatsFunctions.get(id)(arg0, arg1, arg2);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                    case "getBreakSpeed":
                        builder.getBreakSpeed((arg0, arg1, arg2, arg3, arg4, arg5) => {
                            try {
                                global.TinkerFunctions.getBreakSpeedFunctions.get(id)(arg0, arg1, arg2, arg3, arg4, arg5);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                    case "onAfterBreak":
                        builder.onAfterBreak((arg0, arg1, arg2) => {
                            try {
                                global.TinkerFunctions.onAfterBreakFunctions.get(id)(arg0, arg1, arg2);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                    case "getMeleeDamage":
                        builder.getMeleeDamage((arg0, arg1, arg2, arg3, arg4) => {
                            try {
                                return global.TinkerFunctions.getMeleeDamageFunctions.get(id)(arg0, arg1, arg2, arg3, arg4);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                    case "onAfterMeleeHit":
                        builder.onAfterMeleeHit((arg0, arg1, arg2, arg3) => {
                            try {
                                global.TinkerFunctions.onAfterMeleeHitFunctions.get(id)(arg0, arg1, arg2, arg3);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                    case "onBeforeMeleeHit":
                        builder.onBeforeMeleeHit((arg0, arg1, arg2, arg3, arg4, arg5) => {
                            try {
                                global.TinkerFunctions.onBeforeMeleeHitFunctions.get(id)(arg0, arg1, arg2, arg3, arg4, arg5);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                    case "onInventoryTick":
                        builder.onInventoryTick((arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
                            try {
                                global.TinkerFunctions.onInventoryTickFunctions.get(id)(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7);
                            } catch (e) {
                                console.error(`Exception occurred! ${e}`);
                            }
                        });
                        break;
                }
            });
        });
    });
});

/**
 * - A class for KubeJS custom modifiers.
 * - 用于 KubeJS 自定义匠魂特性的类。
 * - - - - -
 * @param {string} name
 * - Modifier's name. 
 * - 特性名称。
 * - - - - -
 * @param {Annotation.TinkerFunction.Hook[]} hooks
 * - Record what will the modifier modify.
 * - 记录这个特性要更改什么。
 * - - - - -
 * @class
 */
const KubeJSModifier = function(name, hooks) {
    /**
     * - Modifier's name.
     * - 特性名称。
     * - - - - -
     * @type {string}
     */
    this.id = name;
    /**
     * - Modfier's hooks.
     * - 特性的 Hook。
     * - - - - -
     * @type {Annotation.TinkerFunction.Hook[]}
     */
    this.hooks = hooks;
};


// ---------- Function definition ---------- //


/**
 * - Modity tool stats.
 * - 修改工具属性。
 * - - - - -
 * @param {Internal.ModifierBuilder$ToolStatModifyFunction_} consumer 
 */
KubeJSModifier.prototype.addToolStats = function(consumer) {
    global.TinkerFunctions.addToolStatsFunctions.put(this.id, consumer);
};
/**
 * - Modify break speed.
 * - 修改挖掘速度。
 * - - - - -
 * @param {Internal.ModifierBuilder$GetBreakSpeedFunction_} consumer 
 */
KubeJSModifier.prototype.getBreakSpeed = function(consumer) {
    global.TinkerFunctions.getBreakSpeedFunctions.put(this.id, consumer);
};
/**
 * - Triggers after a block is mined.
 * - 破坏方块后触发。
 * - - - - -
 * @param {Internal.ModifierBuilder$BreakBlockFunction_} consumer 
 */
KubeJSModifier.prototype.onAfterBreak = function(consumer) {
    global.TinkerFunctions.onAfterBreakFunctions.put(this.id, consumer);
};
/**
 * - Modify damage while attacking.
 * - 攻击时修改伤害。
 * - - - - -
 * @param {Internal.ModifierBuilder$GetMeleeDamageFunction_} consumer 
 */
KubeJSModifier.prototype.getMeleeDamage = function(consumer) {
    global.TinkerFunctions.getMeleeDamageFunctions.put(this.id, consumer);
};
/**
 * - Triggers after melee damage is dealt.
 * - 造成近战伤害后触发。
 * - - - - -
 * @param {Internal.ModifierBuilder$AfterMeleeHitFunction_} consumer 
 */
KubeJSModifier.prototype.onAfterMeleeHit = function(consumer) {
    global.TinkerFunctions.onAfterMeleeHitFunctions.put(this.id, consumer);
};
/**
 * - Triggers before melee damage is dealt.
 * - 造成近战伤害前触发。
 * - - - - -
 * @param {Internal.ModifierBuilder$BeforeMeleeHitFunction_} consumer 
 */
KubeJSModifier.prototype.onBeforeMeleeHit = function(consumer) {
    global.TinkerFunctions.onBeforeMeleeHitFunctions.put(this.id, consumer);
};
/**
 * - Triggers every tick while the item is in inventory.
 * - 在物品栏中每 tick 触发一次。
 * - - - - -
 * @param {Internal.ModifierBuilder$InventoryTickFunction_} consumer 
 */
KubeJSModifier.prototype.onInventoryTick = function(consumer) {
    global.TinkerFunctions.onInventoryTickFunctions.put(this.id, consumer);
};


// ---------- Map Initialization ---------- //


/**
 * - An interface stored functions of a modifier.
 * - 用于存储特性的函数的接口。
 * - - - - -
 * @class
 * @interface
 */
global.TinkerFunctions = function() {};

/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$ToolStatModifyFunction_>}
 */
global.TinkerFunctions.addToolStatsFunctions = Utils.newMap();
/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$GetBreakSpeedFunction_>}
 */
global.TinkerFunctions.getBreakSpeedFunctions = Utils.newMap();
/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$BreakBlockFunction_>}
 */
global.TinkerFunctions.onAfterBreakFunctions = Utils.newMap();
/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$GetMeleeDamageFunction_>}
 */
global.TinkerFunctions.getMeleeDamageFunctions = Utils.newMap();
/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$AfterMeleeHitFunction_>}
 */
global.TinkerFunctions.onAfterMeleeHitFunctions = Utils.newMap();
/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$BeforeMeleeHitFunction_>}
 */
global.TinkerFunctions.onBeforeMeleeHitFunctions = Utils.newMap();
/**
 * @type {Internal.Map<string, Internal.ModifierBuilder$InventoryTickFunction_>}
 */
global.TinkerFunctions.onInventoryTickFunctions = Utils.newMap();

/**
 * - A JS object to store all registered modifiers.
 * - 用于存储已注册的 modifier。
 * - - - - -
 * @type {Internal.Map<string, KubeJSModifier>}
 */
const RegisteredModifiers = Utils.newMap();


// ---------- Modifier Registerer ---------- //


/**
 * - An interface for modifier registries.
 * - 该接口为整合包通用的 modifier 注册接口。
 * - - - - -
 * @class
 * @interface
 */
function ModifierRegisterer() {}

/**
 * @param {string} id
 * - The modifier id.  
 * - modifier 的 id。
 * - - - - -
 * @param {Annotation.TinkerFunction.Hook[]} hooks
 * - Functions that modifier will register.
 * - 将会注册的函数。
 * - - - - -
 * @returns {KubeJSModifier}
 * - The new modifier.
 * - 新的自定义特性。
 */
ModifierRegisterer.registerModifier = (id, hooks) => {
    let modifier = new KubeJSModifier(id, hooks);
    RegisteredModifiers.put(modifier.id, modifier);
    console.log(`[Modifier] "${modifier.id}" registered! With functions: [${modifier.hooks}]`);
    return modifier;
};