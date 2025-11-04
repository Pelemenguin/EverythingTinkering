// priority: 32767

// SPDX-License-Identifier: LGPL-3.0-or-later

/// <reference path="../../../definitions.d.ts" />

/**
 * @fileoverview KubeJS AI Factory
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    NBT
    Utils
*/

const KubeJSAiFactory = {};

KubeJSAiFactory.createAi = (actionsList) => {

    /** @type {Internal.Map<Internal.Mob, KubeJSAiFactory.ActionsController>} */
    const CONTROLLERS = Utils.newMap();

    return (entity) => {
        let controller;
        if (CONTROLLERS.containsKey(entity)) {
            controller = CONTROLLERS.get(entity);
        } else {
            controller = new KubeJSAiFactory.ActionsController(actionsList);
            CONTROLLERS.put(entity, controller);
        }
        
        controller.tick(entity);
    };
};

KubeJSAiFactory.ActionsController = function(/** @type {Annotation.Entities.AiActionsMap<?, ?>} */ actions) {
    this.actions = actions.actions;
    this.ticking = {};
    for (let i in this.actions) {
        this.ticking[i] = undefined;
    }
    this.ticking[actions.initAction] = 0;
    this.toRemove = new Set();
    this.memories = {};
};

/** @type {Annotation.Entities.ActionsController["activate"]} */
KubeJSAiFactory.ActionsController.prototype.activate = function(actionName) {
    if (!this.isActive(actionName)) this.ticking[actionName] = 0;
};

/** @type {Annotation.Entities.ActionsController["activate"]} */
KubeJSAiFactory.ActionsController.prototype.deactivate = function(actionName) {
    this.toRemove.add(actionName);
};

/** @type {Annotation.Entities.ActionsController["isActive"]} */
KubeJSAiFactory.ActionsController.prototype.isActive = function(actionName) {
    return this.ticking != undefined && this.ticking[actionName] >= 0;
};

/** @type {Annotation.Entities.ActionsController["setMemory"]} */
KubeJSAiFactory.ActionsController.prototype.setMemory = function(key, value) {
    this.memories[key] = value;
};

/** @type {Annotation.Entities.ActionsController["getMemory"]} */
KubeJSAiFactory.ActionsController.prototype.getMemory = function(key) {
    return this.memories[key];
};

/** @type {Annotation.Entities.ActionsController["removeMemory"]} */
KubeJSAiFactory.ActionsController.prototype.removeMemory = function(key) {
    delete this.memories[key];
};

/** @type {Annotation.Entities.ActionsController["isMemoryPresent"]} */
KubeJSAiFactory.ActionsController.prototype.isMemoryPresent = function(key) {
    return key in this.memories;
};

/** @type {Annotation.Entities.ActionsController["getMemoryOrSetDefault"]} */
KubeJSAiFactory.ActionsController.prototype.getMemoryOrSetDefault = function(key, defaultValue) {
    if (!(key in this.memories)) {
        this.memories[key] = defaultValue;
    }
    return this.memories[key];
};

/** @type {Annotation.Entities.ActionsController["tick"]} */
KubeJSAiFactory.ActionsController.prototype.tick = function(mob) {

    let entityId = mob.getType();

    /** @type {Internal.CompoundTag} */
    let dataStorage;
    if (!mob.getForgePersistentData().contains(entityId)) {
        dataStorage = NBT.compoundTag();
        mob.getForgePersistentData().put(entityId, dataStorage);
    } else {
        dataStorage = mob.getForgePersistentData().getCompound(entityId);
    }

    for (let i in this.ticking) {
        if (!this.isActive(i)) continue;
        this.actions[i](mob, this, this.ticking[i], dataStorage);
        ++ this.ticking[i];
    }

    // Removal
    for (let r of this.toRemove) {
        this.ticking[r] = undefined;
    }
    this.toRemove.clear();

};
