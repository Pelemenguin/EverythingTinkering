// priority: 2147483646

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview `TagKey`s
 * @author Pelemenguin
 */

/* global
    global: writable
    $TagKey
    $Registries
*/

/**
 * Declared `TagKey`s  
 * 声明的`TagKey`。
 */
const TagKeys = {};

/**
 * `TagKey`s for damage types  
 * 伤害类型的`TagKey`
 */
TagKeys.DamageType = {
    IS_FALL: $TagKey.create($Registries.DAMAGE_TYPE, "minecraft:is_fall"),
    BossImmune: {
        ICY_TERRACUBE: $TagKey.create($Registries.DAMAGE_TYPE, "kubejs:boss_immune/icy_terracube")
    }
};

TagKeys.Item = {
    Modifiable: {
        RANGED: $TagKey.create($Registries.ITEM, "tconstruct:modifiable/ranged"),
        ARMOR: $TagKey.create($Registries.ITEM, "tconstruct:modifiable/armor")
    }
};

global.TagKeys = TagKeys;
