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
    console
*/

const KubeJSAiFactory = {};

KubeJSAiFactory.createAi = (actionsList) => {

    /** @type {Internal.Map<Internal.Mob, KubeJSAiFactory.ActionsController>} */
    const CONTROLLERS = Utils.newMap();

    /** @type {Annotation.Entities.AiFunctions} */
    let result = {
        aiStep: (entity) => {
            if (entity.getLevel().isClientSide()) return;
            if (entity.isDeadOrDying()) {
                if (CONTROLLERS.remove(entity) != null) {
                    console.info("Controller removed for entity " + entity);
                }
                return;
            }
            if (entity.isNoAi()) return;

            let controller;
            if (CONTROLLERS.containsKey(entity)) {
                controller = CONTROLLERS.get(entity);
            } else {
                controller = new KubeJSAiFactory.ActionsController(actionsList);
                CONTROLLERS.put(entity, controller);
            }

            controller.tick(entity);
        },
        getController: (entity) => {
            return CONTROLLERS.getOrDefault(entity, undefined);
        }
    };
    if ("onHurt" in actionsList) {
        result.onHurt = (context) => {
            let entity = context.entity;
            if (entity.getLevel().isClientSide()) return;
            if (entity.isDeadOrDying()) return;

            actionsList.onHurt(context, CONTROLLERS.get(entity));
        };
    }
    return result;
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

/** @type {Annotation.Entities.ActionsController["schedule"]} */
KubeJSAiFactory.ActionsController.prototype.schedule = function(actionName, ticksUntilActivate) {
    if (this.isActive(actionName)) return;
    if (this.ticking[actionName] === undefined) {
        this.ticking[actionName] = -ticksUntilActivate;
        return;
    }
    this.ticking[actionName] = Math.max(-ticksUntilActivate, this.ticking[actionName]);
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
        let time = this.ticking[i];
        if (time === undefined) continue;
        if (time >= 0) this.actions[i](mob, this, time, dataStorage);
        ++ this.ticking[i];
    }

    // Removal
    for (let r of this.toRemove) {
        this.ticking[r] = undefined;
    }
    this.toRemove.clear();

};
