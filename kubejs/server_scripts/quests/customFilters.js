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
    $HashSet
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
    if (!(stack.getItem() instanceof $IModifiable)) {
        event.cancel();
        return;
    }
    let materialList = ToolStack.from(stack).getMaterials().getList();
    if (materialList.size() <= 1) {
        // Do you really want to complete this task with only one material?
        event.cancel();
        return;
    }
    // Success if all materials are distinct
    let materialSet = new $HashSet();
    for (let i = 0; i < materialList.size(); i++) {
        let material = materialList.get(i).getId();
        if (materialSet.contains(material)) {
            event.cancel();
            return;
        }
        materialSet.add(material);
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
    if (!(stack.getItem() instanceof $IModifiable)) {
        event.cancel();
        return;
    }
    let requiredMaterials = event.getData().split(",");
    let allMaterials = ToolStack.from(stack).getMaterials().getList();
    if (allMaterials.size() != requiredMaterials.length) {
        event.cancel();
        return;
    }
    for (let i = 0; i < requiredMaterials.length; i++) {
        let requiredMaterial = $MaterialVariantId.parse(requiredMaterials[i]);

        let actualMaterialTag = allMaterials.get(i);
        if (!requiredMaterial["matchesVariant(slimeknights.tconstruct.library.materials.definition.MaterialVariant)"](actualMaterialTag)) {
            event.cancel();
            return;
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
