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
    Registries
    ResourceKey
*/

/**
 * @param {Internal.ResourceKey<Internal.DamageType>} resKey
 * @returns {(level: Internal.Level, direct: Internal.Entity, actual: Internal.Entity, pos: Vec3d) => DamageSource}
 */
let damageSourceCreatorHelper = (resKey) => {
    return (level, direct, actual, pos) => {
        let newDirect = direct === undefined ? null : direct;
        let newActual = actual === undefined ? newDirect : actual;
        let newPos = pos === undefined ? (newActual == null ? null : newActual.pos) : pos;
        return new DamageSource(
            level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE).getHolderOrThrow(resKey),
            newDirect,
            newActual,
            newPos
        );
    };
};

const KubeJSDamageTypes = {
    PAPERCUT: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:papercut"),
    HOT_TOOL: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:hot_tool")
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
    hotTool: damageSourceCreatorHelper(KubeJSDamageTypes.HOT_TOOL)

};