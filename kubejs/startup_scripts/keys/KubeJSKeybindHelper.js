// priority: 32767

/**
 * @fileoverview Keybind Helper
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    Java
    global: writable
    NativeEvents
*/

/** 
 * @type {{[name: string]: {
 *     key: Internal.KeyMapping,
 *     consumed: boolean
 * }}}
 */
global.KeyMappings;

if (global.KeyMappings == undefined) global.KeyMappings = {};

/** @type {typeof Internal.RegisterKeyMappingsEvent | null} */
const $RegisterKeyMappingsEvent = Java.tryLoadClass("net.minecraftforge.client.event.RegisterKeyMappingsEvent");
/** @type {typeof Internal.KeyMapping | null} */
const $KeyMapping = Java.tryLoadClass("net.minecraft.client.KeyMapping");

const KubeJSKeybindHelper = {
    /**
     * Registers a new key.
     * In order to keep keys available after reloads,
     * keys in the same category and having the same name will not be created twice.
     * When reloading, new `KeyMapping`s are not created, the original ones are returned instead.  
     * 注册一个新的按键。
     * 为了在重载后保持按键可用，
     * 同一类别且具有相同名称的按键不会被创建两次。
     * 在重载时，不会创建新的`KeyMapping`，而是返回原始的按键映射。
     * - - - - -
     * @param {string} keyName 
     * The name of the key.  
     * 按键名称。
     * 
     * @param {number} defaultKey 
     * The default key. Use numbers specified by `GLFW`.  
     * 默认按键，使用`GLFW`规定的数字。
     * 
     * @param {string | undefined} category 
     * The key's category. Emit or use `undefined` to place the key in the modpack's main category.  
     * 按键类别，省略或传入`undefined`以将按键放置在整合包的主类别中。
     * 
     * @returns {Internal.KeyMapping | null} 
     * The key mapping created.
     * `null` is returned on a dedicated server.  
     * 创建的按键映射。
     * 在专用服务器上返回`null`。
     */
    register: (keyName, defaultKey, category) => {
        if ($KeyMapping == null) return null;
        let name = category == undefined ? keyName : `${category}.${keyName}`;
        if (name in global.KeyMappings) return global.KeyMappings[name];
        let result = new $KeyMapping(
            `key.kubejs.${name}`,
            defaultKey,
            category == undefined ? "category.kubejs.keys" : `category.kubejs.keys.${category}`
        );
        global.KeyMappings[name] = {
            consumed: false,
            key: result
        };
        return result;
    },
    /**
     * Gets a registered key.
     * 获取一个已注册的按键。
     * - - - - -
     * @param {string} keyName 
     * The name of the key.  
     * 按键名称。
     * 
     * @param {string | undefined} category 
     * The key's category. Emit or use `undefined` to place the key in the modpack's main category.  
     * 按键类别，省略或传入`undefined`以将按键放置在整合包的主类别中。
     * 
     * @returns {Internal.KeyMapping | undefined} 
     * The key mapping registered, or `undefined` if not found.  
     * 已注册的按键映射，未找到则返回`undefined`。
     */
    get: (keyName, category) => {
        let name = category == undefined ? keyName : `${category}.${keyName}`;
        return global.KeyMappings[name].key;
    },
    consumeClick: (keyName, category) => {
        let name = category == undefined ? keyName : `${category}.${keyName}`;
        let obj = global.KeyMappings[name];

        if (obj.key.isDown() && !obj.consumed) {
            obj.consumed = true;
            return true;
        }
        return false;
    }
};

global.KubeJSKeybindHelper = KubeJSKeybindHelper;

if ($RegisterKeyMappingsEvent != null) {
    NativeEvents.onEvent($RegisterKeyMappingsEvent, /** @param {Internal.RegisterKeyMappingsEvent} event */ event => {
        for (let key in global.KeyMappings) {
            event.register(global.KeyMappings[key].key);
        }
    });
}
