/**
 * @fileoverview Damage Sources
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* eslint-disable no-unused-vars */

/* global
    DamageSource
    Registries
    ResourceKey
*/

const KubeJSDamageSources = {

    /**
     * - Create damage source of type `kubejs:papercut`.
     * - 创建一个类型为 `kubejs:papercut` 的伤害来源。
     * - - - - -
     * @param {Internal.Level} level
     * @param {Internal.Entity | undefined} direct 
     * @param {Internal.Entity | undefined} actual
     * @param {Vec3d | undefined} pos
     * - - - - -
     * @returns {DamageSource}
     */
    papercut: (level, direct, actual, pos) => {
        return new DamageSource(
            level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE).getHolderOrThrow(KubeJSDamageTypes.PAPERCUT),
            direct === undefined ? null : direct,
            actual === undefined ? (direct === undefined ? null : direct) : actual,
            pos === undefined ? (direct === undefined ? null : direct.pos) : pos,
        );
    },

    /**
     * - - - - -
     * @param {Internal.Level} level
     * @param {!Internal.Entity} direct
     * @param {Internal.Entity | undefined} actual
     * @param {Vec3d | undefined} pos
     * - - - - -
     * @returns {DamageSource}
     */
    source: (level, direct, actual, pos) => {
        let newDirect = direct === undefined ? null : direct;
        let newActual = actual === undefined ? newDirect : actual;
        let newPos = pos === undefined ? (newActual == null ? null : newActual.pos) : pos;
        return new DamageSource(
            level.registryAccess().registryOrThrow(Registries.DAMAGE_TYPE).getHolderOrThrow(KubeJSDamageTypes.PAPERCUT),
            newDirect,
            newActual,
            newPos
        );
    }

};

const KubeJSDamageTypes = {
    PAPERCUT: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:papercut")
};