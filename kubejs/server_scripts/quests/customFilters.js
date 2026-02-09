// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Item Filters
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    FTBFilterSystemEvents
    $ModifierNBT
    $ModifierId
    $MaterialItem
    $MaterialVariantId
    ToolStack
    $IModifiable
*/

FTBFilterSystemEvents.customFilter("PartMaterialTest", event => {
    let stack = event.getStack();
    let item = stack.getItem();
    let requiredVariant = $MaterialVariantId.parse(event.getData());
    if (item instanceof $MaterialItem) {
        if (!requiredVariant["matchesVariant(net.minecraft.world.item.ItemStack)"](stack)) {
            event.cancel();
            return;
        }
        event.success();
    }
    if (item instanceof $IModifiable) {
        let toolStack = ToolStack.from(stack);
        let success = toolStack.getMaterials().getList().some(mv => requiredVariant["matchesVariant(slimeknights.tconstruct.library.materials.definition.MaterialVariant)"](mv));
        if (success) {
            event.success();
            return;
        }
    }
    event.cancel();
});

FTBFilterSystemEvents.customFilter("DistinctMaterialTest", event => {
    let stack = event.getStack();
    if (!stack.hasTag("tconstruct:modifiable")) {
        event.cancel();
        return;
    }
    let allMaterials = stack.getNbt().getList("tic_materials", 8).toArray();
    // Success if all materials are distinct
    // KubeJS's Set has bug, so we don't use Set
    let materialSet = {};
    for (let i = 0; i < allMaterials.length; i++) {
        let material = allMaterials[i];
        if (material in materialSet) {
            event.cancel();
            return;
        }
        materialSet[material] = true;
    }
    event.success();
});

FTBFilterSystemEvents.customFilter("ToolMaterialTest", event => {

    // A filter specify every material (ordered) of the tool
    // event data format: <material1>,<material2>,...
    // use `*` for any material
    // If variant id is `*`, (for example: "tconstruct:wood#*")
    // It accept any variant of that material

    let stack = event.getStack();
    if (!stack.hasTag("tconstruct:modifiable")) {
        event.cancel();
        return;
    }
    let requiredMaterials = event.getData().split(",");
    /** @type {Internal.StringTag[]} */
    let allMaterials = stack.getNbt().getList("tic_materials", 8).toArray();
    for (let i = 0; i < requiredMaterials.length; i++) {
        let requiredMaterial = requiredMaterials[i];
        if (requiredMaterial == "*") continue;

        let actualMaterialTag = allMaterials[i];
        if (actualMaterialTag == undefined) {
            event.cancel();
            return;
        }
        let actualMaterial = actualMaterialTag.getAsString();
        if (requiredMaterial.endsWith("#*")) {
            // Check only material id
            let requiredMaterialId = requiredMaterial.split("#")[0];
            let actualMaterialId = actualMaterial.split("#")[0];
            if (requiredMaterialId != actualMaterialId) {
                event.cancel();
                return;
            }
        } else {
            // Check full material id
            if (requiredMaterial != actualMaterial) {
                event.cancel();
                return;
            }
        }
    }
    event.success();
});

FTBFilterSystemEvents.customFilter("ToolModifiedTest", event => {
    
    // event data format: A standard JSON. keys are modifier ids, values are min levels

    let stack = event.getStack();
    if (!stack.hasTag("tconstruct:modifiable")) {
        event.cancel();
        return;
    }
    let requiredModifiers = JSON.parse(event.getData());
    let modifierNBT = $ModifierNBT.readFromNBT(stack.getNbt().getList("tic_modifiers", 10));
    for (let modId in requiredModifiers) {
        let requiredLevel = requiredModifiers[modId];
        let actualLevel = modifierNBT.getLevel($ModifierId.tryParse(modId));
        if (actualLevel < requiredLevel) {
            event.cancel();
            return;
        }
    }

    event.success();

});
