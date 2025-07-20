// priority: 100

/**
 * @file This JS file is for modifier registry.
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

TConJSEvents.modifierRegistry(event => {
    RegisteredModifiers.keySet().forEach(id => {
        event.createNew(id, RegisteredModifiers.get(id));
    });
});

/**
 * A JS object to store all registered modifiers.
 * - - - - -
 * 用于存储已注册的 modifier。
 * - - - - -
 * @type {Internal.Map<string, ((event: Internal.ModifierBuilder) => void)>}
 */
const RegisteredModifiers = Utils.newMap();

/**
 * An interface for modifier registries.
 * - - - - -
 * 该接口为整合包通用的 modifier 注册接口。
 * 
 * @interface
 */
function ModifierRegisterer() {}

/**
 * @param {string} id
 * The modifier id.  
 * modifier 的 id。
 * - - - - -
 * @param {(modifier: Internal.ModifierBuilder) => void} builder 
 * A consumer to build a modifier.  
 * 一个用于注册 modifier 的函数。
 */
ModifierRegisterer.registerModifier = (id, builder) => {
    RegisteredModifiers.put(id, builder);
};