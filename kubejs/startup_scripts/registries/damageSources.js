/**
 * @fileoverview Damage Sources
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

/* eslint-disable no-unused-vars */

/* global
    DamageSource
    Entity
    Registries
    ResourceKey
    $Holder
*/

/**
 * @param {Internal.ResourceKey<Internal.DamageType>} resKey
 * @returns {(level: Internal.Level, direct: Internal.Entity, actual?: Internal.Entity, pos?: Vec3d) => DamageSource}
 */
let damageSourceCreatorHelper = (resKey) => {
    return (level, direct, actual, pos) => {
        let holder = level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE).getHolderOrThrow(resKey);
        if (actual === undefined && pos === undefined) return DamageSource.__javaObject__.getConstructor($Holder, Entity).newInstance(holder, direct);
        if (pos === undefined) return new DamageSource(holder, direct, actual);
        return new DamageSource(holder, direct, actual, pos);
    };
};

const KubeJSDamageTypes = {
    PAPERCUT: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:papercut"),
    HOT_TOOL: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:hot_tool"),
    HOT_TOOL_ATTACK: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:hot_tool_attack"),
    ICY_TERRACUBE_SMASH: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:icy_terracube_smash"),
    ICY_CLAY_BALL: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:icy_clay_ball")
};

const KubeJSDamageSources = {

    /**
     * - Create damage source of type `kubejs:papercut`.
     * - 创建一个类型为 `kubejs:papercut` 的伤害来源。
     */
    papercut: damageSourceCreatorHelper(KubeJSDamageTypes.PAPERCUT),

    /**
     * - Create damage source of type `kubejs:hot_tool`.
     * - 创建一个类型为 `kubejs:hot_tool` 的伤害来源。
     */
    hotTool: damageSourceCreatorHelper(KubeJSDamageTypes.HOT_TOOL),

    /**
     * - Create damage source of type `kubejs:hot_tool_attack`.
     * - 创建一个类型为 `kubejs:hot_tool_attack` 的伤害来源。
     */
    hotToolAttack: damageSourceCreatorHelper(KubeJSDamageTypes.HOT_TOOL_ATTACK),

    /**
     * - Create damage source of type `kubejs:icy_terracube_smash`.
     * - 创建一个类型为 `kubejs:icy_terracube_smash` 的伤害来源。
     */
    icyTerracubeSmash: damageSourceCreatorHelper(KubeJSDamageTypes.ICY_TERRACUBE_SMASH),

    /**
     * - Create damage source of type `kubejs:icy_clay_ball`.
     * - 创建一个类型为 `kubejs:icy_clay_ball` 的伤害来源。
     */
    icyClayBall: damageSourceCreatorHelper(KubeJSDamageTypes.ICY_CLAY_BALL)

};