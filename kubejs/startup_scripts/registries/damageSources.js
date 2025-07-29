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
    }

};

const KubeJSDamageTypes = {
    PAPERCUT: ResourceKey.create(Registries.DAMAGE_TYPE, "kubejs:papercut")
};