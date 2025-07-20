// priority: 100

/**
 * @file This JS file is for modifier registry.
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

TConJSEvents.modifierRegistry(event => {
    RegisteredModifiers.forEach(consumer => {
        consumer(event);
    });
})

/**
 * A JS object to store all registered modifiers.
 * - - - - -
 * 用于存储已注册的 modifier。
 * - - - - -
 * @type {((event: Internal.ModifierRegisterEventJS) => void)[]}
 */
const RegisteredModifiers = [];

/**
 * An interface for modifier registries.
 * - - - - -
 * 该接口为整合包通用的 modifier 注册接口。
 * 
 * @interface
 */
function ModifierRegisterer() {}

/**
 * - - - - -
 * @param {(event: Internal.ModifierRegisterEventJS) => void} handler 
 * A consumer to build a modifier.  
 * 一个用于注册 modifier 的函数。
 * - - - - -
 */
ModifierRegisterer.onRegisterEvent = (handler) => {
    RegisteredModifiers.push(handler)
};