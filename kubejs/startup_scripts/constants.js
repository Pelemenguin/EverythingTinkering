// priority: 10000

/**
 * @fileoverview Constants | 常量
 * - Because Rhino made `const`-defined objects global, use a special JS file to create these.
 * - 由于 Rhino 使得 `const` 定义的对象全局可访问，这里使用一个特殊文件来创建。
 */

/* eslint-disable no-unused-vars */

/* global
    Java
    global
*/

const LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity");
const Player = Java.loadClass("net.minecraft.world.entity.player.Player");

/**
 * - An interface for custom KubeJS utils.
 * - 用于自定义 KubeJS 杂项的接口。
 * - - - - -
 * @class
 * @interface
 */
const CustomUtils = function() {};

CustomUtils.toString = () => "CustomUtils";

/**
 * - n interface for tinker things.
 * - 用于匠魂相关的接口。
 * - - - - -
 * @class
 * @interface
 */
CustomUtils.Tinker = function() {};

CustomUtils.Tinker.toString = () => "CustomUtils.Tinker";

/**
 * - Check if a tool is broken.
 * - 检查一个工具是否损坏。
 * - - - - -
 * @param {Internal.ItemStack} item 
 * - - - - -
 * @returns {boolean}
 */
CustomUtils.Tinker.isBroken = (item) => {
    let nbt = item.getNbt();
    if (nbt.contains("tic_broken")) {
        try {
            return (nbt.get("tic_broken").asInt == 1);
        } catch (e) { /* empty */ }
    }
    return (item.damageValue == item.maxDamage);
};

/**
 * - An interface for custom KubeJS utils.
 * - 用于自定义 KubeJS 杂项的接口。
 * - - - - -
 * @class
 * @interface
 */
global.CustomUtils = CustomUtils;