//priority: 10000

/**
 * @fileoverview Recipe display
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

/* global
    TinkerItemElement
    Component
    Utils
    BookElement
    ImageData
    TinkerToolParts
    $ItemStack
    BookTextData
    console
    JavaUtils
    Item
    NonNullList
    BookTextComponentData
*/

/**
 * 
 * @param {number | undefined} x 
 * @param {number | undefined} y 
 */
const RecipeDisplay = function(x, y) {
    /** @type {number} */
    this.x = x === undefined ? RecipeDisplay.DEFAULT_X : x;
    /** @type {number} */
    this.y = y === undefined ? RecipeDisplay.DEFAULT_Y : y;
};

RecipeDisplay.DEFAULT_X = 8;
RecipeDisplay.DEFAULT_Y = 18;

/**
 * @param {Internal.MaterialVariantId[]} referenceMaterials
 * @returns {Internal.ToolPartItem | Internal.RepairKitItem}
 */
let getIndicatorToolPart = (referenceMaterials) => {

    let item = TinkerToolParts.toolBinding.getOrNull();
    let materialId = referenceMaterials.map(material => material.getId());
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.toolHandle.getOrNull();  else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.pickHead.getOrNull();    else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.bowGrip.getOrNull();     else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.bowLimb.getOrNull();     else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.bowstring.getOrNull();   else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.arrowHead.getOrNull();   else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.arrowShaft.getOrNull();  else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.fletching.getOrNull();   else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.maille.getOrNull();      else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.plating.values().get(0); else return item;
    if (materialId.some(m => !item.canUseMaterial(m))) item = TinkerToolParts.shieldCore.getOrNull();  else return item;

    return TinkerToolParts.repairKit.getOrNull();
};

/**
 * @param {Internal.MaterialVariantId} variantId
 * @param {number} value
 * @param {number} x
 * @param {number} y
 * @param {Internal.MaterialVariantId[]} referenceMaterials
 * - - - - -
 * @returns {Internal.TinkerItemElement}
 */
RecipeDisplay.materialValueIndicator = (variantId, value, x, y, referenceMaterials) => {
    if (referenceMaterials === undefined) referenceMaterials = [];

    let result = new TinkerItemElement(getIndicatorToolPart([variantId].concat(referenceMaterials)).withMaterial(variantId).withCount(value));
    result.x = x;
    result.y = y;
    result.tooltip = Utils.newList();
    let translation = 'material.' + variantId.toString().replace(':', '.').replace('#', '.');
    result.tooltip.add(Component.translatable("book.kubejs.material.recipes.material_value_indicator", [Component.literal(value.toFixed()), RecipeDisplay.translationFallback(translation).underlined()]));
    return result;
};

/**
 * @param {Internal.MaterialVariantId} referenceMaterial
 * @param {number} x
 * @param {number} y
 * @returns {Internal.TinkerItemElement}
 */
RecipeDisplay.castIndicator = (referenceMaterial, x, y) => {

    let indicatorToolPart = getIndicatorToolPart([referenceMaterial]);
    /** @type {Internal.ItemStack} */ let item;
    switch (indicatorToolPart.idLocation) {

        case (TinkerToolParts.toolBinding.id):          item = Item.of("tconstruct:tool_binding_cast");   break;
        case (TinkerToolParts.toolHandle.id):           item = Item.of("tconstruct:tool_handle_cast");    break;
        case (TinkerToolParts.pickHead.id):             item = Item.of("tconstruct:pick_head_cast");      break;
        case (TinkerToolParts.bowGrip.id):              item = Item.of("tconstruct:bow_grip_cast");       break;
        case (TinkerToolParts.bowLimb.id):              item = Item.of("tconstruct:bow_limb_cast");       break;
        case (TinkerToolParts.bowstring.id):            item = Item.of("minecraft:structure_void");       break;
        case (TinkerToolParts.arrowHead.id):            item = Item.of("minecraft:structure_void");       break;
        case (TinkerToolParts.arrowShaft.id):           item = Item.of("minecraft:structure_void");       break;
        case (TinkerToolParts.fletching.id):            item = Item.of("minecraft:structure_void");       break;
        case (TinkerToolParts.maille.id):               item = Item.of("tconstruct:maille_cast");         break;
        case (TinkerToolParts.plating.values().get(0)): item = Item.of("tconstruct:helmet_plating_cast"); break;
        case (TinkerToolParts.shieldCore.id):           item = Item.of("minecraft:structure_void");       break;

    }

    let cast = new TinkerItemElement(item);
    cast.x = x;
    cast.y = y;
    cast.tooltip = JavaUtils.ArrayList["of(java.lang.Object[])"]([
        Component.translatable("book.kubejs.material.recipes.casting.cast")
    ]);
    return cast;

};

/**
 * @param {string} translationId
 * - - - - -
 * @returns {Internal.MutableComponent}
 */
RecipeDisplay.translationFallback = (translationId) => {
    let segments = translationId.split('.');
    if (segments.length < 4) {
        return Component.translatable(translationId);
    }
    let result = Component.translatable(translationId);
    if (result.getString() == translationId) {
        return Component.translatable(segments.slice(0, -1).join('.'));
    }
    return result;
};

RecipeDisplay.prototype = {
    /**
     * @type {(elements: Internal.ArrayList<Internal.BookElement>, recipe: Internal.MaterialRecipe) => number}
     */
    partBuilder: function(elements, recipe) {
        let craftable = recipe.getMaterial().get().isCraftable();

        let icon = new TinkerItemElement("tconstruct:part_builder");
        icon.x = this.x;
        icon.y = this.y;
        icon.tooltip = Utils.newList();
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.part_builder.name"));
        icon.tooltip.add(craftable
            ? Component.translatable("book.kubejs.material.recipes.part_builder.description").gray()
            : Component.translatable("book.kubejs.material.recipes.part_builder.description.uncraftable").gray());
        elements.add(icon);

        let pattern = new TinkerItemElement("tconstruct:pattern");
        pattern.x = icon.x + 24;
        pattern.y = icon.y;
        elements.add(pattern);

        let ingredient = new TinkerItemElement(Item.of("minecraft:air"));
        ingredient.x = pattern.x + 18;
        ingredient.y = pattern.y;
        ingredient.itemCycle = NonNullList.of(
            recipe.getIngredient().first.withCount(recipe.needed),
            recipe.getIngredient().getItemTypes().toArray().map(item => new $ItemStack(item, recipe.getNeeded()))
        );
        elements.add(ingredient);

        let arrow = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 20, 16, 22, 16, 15, 12));
        arrow.x = ingredient.x + 22;
        arrow.y = ingredient.y + 2;
        elements.add(arrow);

        if (!craftable) {
            let uncraftableIndicator = BookElement.image(new ImageData("minecraft:textures/gui/container/beacon.png", 114, 223, 13, 13, 256, 256));
            uncraftableIndicator.x = arrow.x + 2;
            uncraftableIndicator.y = arrow.y + 1;
            uncraftableIndicator.scale(0.8);
            elements.add(uncraftableIndicator);
        }

        elements.add(RecipeDisplay.materialValueIndicator(recipe.getMaterial().getVariant(), recipe.getValue(), arrow.x + 21, pattern.y));

        return 18;
    },

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {Internal.MaterialFluidRecipe} recipe
     * - - - - -
     * @returns {number}
     */
    casting: function(elements, recipe) {
        /** @type {Internal.Optional<Internal.Fluid>} */
        let fluid = recipe.getFluids().stream().map(fluid => fluid.getFluid()).findFirst();

        let icon = new TinkerItemElement("tconstruct:seared_table");
        icon.x = this.x;
        icon.y = this.y;
        icon.tooltip = Utils.newList();
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.casting.name"));
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.casting.description").gray());
        elements.add(icon);

        /** @type {Internal.TinkerItemElement} */
        let displayItem;
        try {
            displayItem = new TinkerItemElement(new $ItemStack(fluid.get().getBucket()));
        }
        catch (e) {
            console.error(e);
            displayItem = new TinkerItemElement("minecraft:barrier");
        }
        displayItem.x = icon.x + 24;
        displayItem.y = icon.y;

        let amountIndicator;
        let amount = '?';
        try {
            amount = recipe.getFluids().get(0).getAmount().toFixed();
            amountIndicator = BookElement.text(
                displayItem.x + 16,
                displayItem.y + 8,
                40,
                9,
                BookTextData.fromComponent(Component.translatable("book.kubejs.material.recipes.casting.amount", amount).getString())
            );
        } catch (e) {
            console.error(e);
            amountIndicator = BookElement.text(
                displayItem.x + 16,
                displayItem.y + 8,
                40,
                9,
                BookTextData.fromComponent(Component.translatable("book.kubejs.material.recipes.casting.amount", amount).getString())
            );
        }
        displayItem.tooltip = JavaUtils.ArrayList["of(java.lang.Object[])"]([
            Component.translatable("book.kubejs.material.recipes.casting.fluid", amount, fluid.isEmpty() ? Component.translatable("book.kubejs.material.recipes.casting.fluid.unknown") : fluid.get().getFluidType().getDescription())
        ]);

        elements.add(displayItem);
        elements.add(amountIndicator);

        let arrowExtend = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 12, 16, 22, 16, 9, 12));
        arrowExtend.x = displayItem.x + 42;
        arrowExtend.y = displayItem.y + 2;
        elements.add(arrowExtend);

        // let cast = new TinkerItemElement("tconstruct:tool_binding_cast");
        // cast.x = arrowExtend.x + 9;
        // cast.y = displayItem.y;
        // cast.tooltip = JavaUtils.ArrayList["of(java.lang.Object[])"]([
        //     Component.translatable("book.kubejs.material.recipes.casting.cast")
        // ]);
        // elements.add(cast);
        elements.add(RecipeDisplay.castIndicator(recipe.getOutput().getVariant(), arrowExtend.x + 9, displayItem.y));
        
        let arrow = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 20, 16, 22, 16, 15, 12));
        arrow.x = arrowExtend.x + 25;
        arrow.y = arrowExtend.y;
        elements.add(arrow);

        elements.add(RecipeDisplay.materialValueIndicator(recipe.getOutput().getVariant(), 1, arrow.x + 21, displayItem.y));

        return 18;
    },

    /**
     * 
     * @param {Internal.ArrayList<Internal.BookElement>} elements 
     * @param {Internal.MaterialFluidRecipe} recipe 
     */
    composite: function(elements, recipe) {
        /** @type {Internal.Optional<Internal.Fluid>} */
        let fluid = recipe.getFluids().stream().map(fluid => fluid.getFluid()).findFirst();

        let icon = new TinkerItemElement("tconstruct:seared_faucet");
        icon.x = this.x;
        icon.y = this.y;
        icon.tooltip = Utils.newList();
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.composite.name"));
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.composite.description").gray());
        elements.add(icon);

        /** @type {Internal.TinkerItemElement} */
        let displayItem;
        try {
            displayItem = new TinkerItemElement(new $ItemStack(fluid.get().getBucket()));
        }
        catch (e) {
            console.error(e);
            displayItem = new TinkerItemElement("minecraft:barrier");
        }
        displayItem.x = icon.x + 24;
        displayItem.y = icon.y;

        let amountIndicator;
        let amount = '?';
        try {
            amount = recipe.getFluids().get(0).getAmount().toFixed();
            amountIndicator = BookElement.text(
                displayItem.x + 16,
                displayItem.y + 8,
                40,
                9,
                BookTextData.fromComponent(Component.translatable("book.kubejs.material.recipes.composite.amount", amount).getString())
            );
        } catch (e) {
            console.error(e);
            amountIndicator = BookElement.text(
                displayItem.x + 16,
                displayItem.y + 8,
                40,
                9,
                BookTextData.fromComponent(Component.translatable("book.kubejs.material.recipes.composite.amount", amount).getString())
            );
        }
        displayItem.tooltip = JavaUtils.ArrayList["of(java.lang.Object[])"]([
            Component.translatable("book.kubejs.material.recipes.composite.fluid", amount, fluid.isEmpty() ? Component.translatable("book.kubejs.material.recipes.composite.fluid.unknown") : fluid.get().getFluidType().getDescription())
        ]);

        elements.add(displayItem);
        elements.add(amountIndicator);

        let arrowExtend = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 12, 16, 22, 16, 9, 12));
        arrowExtend.x = displayItem.x + 42;
        arrowExtend.y = displayItem.y + 2;
        elements.add(arrowExtend);

        let cast = RecipeDisplay.materialValueIndicator(recipe.getInput().getVariant(), 1, arrowExtend.x + 9, displayItem.y, [recipe.getOutput().getVariant()]);
        elements.add(cast);
        
        let arrow = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 20, 16, 22, 16, 15, 12));
        arrow.x = cast.x + 16;
        arrow.y = arrowExtend.y;
        elements.add(arrow);

        elements.add(RecipeDisplay.materialValueIndicator(recipe.getOutput().getVariant(), 1, arrow.x + 21, cast.y, [recipe.getInput().getVariant()]));

        return 18;
    },

    /**
     * 
     * @param {Internal.ArrayList<Internal.BookElement>} elements 
     * @param {Annotation.BatchRecipes.Deploying} recipe 
     */
    deploying: function(elements, recipe) {
        let icon = new TinkerItemElement("create:deployer");
        icon.x = this.x;
        icon.y = this.y;
        icon.tooltip = Utils.newList();
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.deploying.name"));
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.deploying.description").gray());
        elements.add(icon);
        
        let displayItem = new TinkerItemElement(Item.of("minecraft:air"));
        displayItem.x = icon.x + 24;
        displayItem.y = icon.y;
        displayItem.itemCycle = NonNullList.of(
            recipe.usingItem.withCount(1),
            recipe.usingItem.getItemTypes().toArray().map(item => new $ItemStack(item, 1))
        );
        elements.add(displayItem);

        let arrowExtend = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 12, 16, 22, 16, 9, 12));
        arrowExtend.x = displayItem.x + 21;
        arrowExtend.y = displayItem.y + 2;
        elements.add(arrowExtend);

        let cast = RecipeDisplay.materialValueIndicator(recipe.inputMaterial, 1, arrowExtend.x + 9, displayItem.y, [recipe.outputMaterial]);
        elements.add(cast);

        let arrow = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 20, 16, 22, 16, 15, 12));
        arrow.x = cast.x + 16;
        arrow.y = arrowExtend.y;
        elements.add(arrow);

        elements.add(RecipeDisplay.materialValueIndicator(recipe.outputMaterial, 1, arrow.x + 21, displayItem.y, [recipe.inputMaterial]));

        return 18;
    },

    /**
     * 
     * @param {Internal.ArrayList<Internal.BookElement>} elements 
     * @param {Annotation.BatchRecipes.SequencedAssembly} recipe 
     * @param {Internal.BookDataJS} book 
     */
    sequencedAssembly: function(elements, recipe, book) {
        let icon = new TinkerItemElement("create:precision_mechanism");
        icon.x = this.x;
        icon.y = this.y;
        icon.tooltip = Utils.newList();
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.sequenced_assembly.name"));
        icon.tooltip.add(Component.translatable("book.kubejs.material.recipes.sequenced_assembly.description").gray());
        elements.add(icon);

        let loop_indicator = BookElement.image(new ImageData("create:textures/gui/icons.png", 64, 80, 16, 16, 256, 256, 16, 16, 0x777777));
        loop_indicator.x = icon.x + 16;
        loop_indicator.y = icon.y;
        elements.add(loop_indicator);

        let loop_count_text = BookTextComponentData.of(Component.literal(recipe.loops.toFixed()).white());
        loop_count_text.dropShadow = true;
        loop_count_text.scale = 1.5;
        loop_count_text.tooltips = [Component.translatable("book.kubejs.material.recipes.sequenced_assembly.loops", recipe.loops.toFixed())];

        let loop_count = BookElement.textComponent(
            loop_indicator.x + 8 - book.getFontRenderer().width(recipe.loops.toFixed()) * 0.5,
            loop_indicator.y + 2,
            16,
            9,
            [loop_count_text]
        );
        elements.add(loop_count);

        let inputPart = RecipeDisplay.materialValueIndicator(recipe.inputMaterial, 1, loop_indicator.x + 32, icon.y, [recipe.outputMaterial]);
        elements.add(inputPart);

        let arrow = BookElement.image(new ImageData("jei:textures/jei/atlas/gui/recipe_arrow.png", 2, 0, 20, 16, 22, 16, 15, 12));
        arrow.x = inputPart.x + 24;
        arrow.y = inputPart.y + 2;
        elements.add(arrow);

        elements.add(RecipeDisplay.materialValueIndicator(recipe.outputMaterial, 1, arrow.x + 24, inputPart.y, [recipe.inputMaterial]));

        // Show "Seq." before sequence display
        let sequence_indicator = BookElement.text(
            icon.x,
            icon.y + 20,
            40,
            9,
            BookTextData.fromComponent(Component.translatable("book.kubejs.material.recipes.sequenced_assembly.sequence").gray())
        );
        elements.add(sequence_indicator);

        let curSequenceX = icon.x + 24;

        /**
         * @type {Parameters<Annotation.BatchRecipes.SequencedAssembly["displayRecipes"]>[0]}
         */
        let utils = {
            cutting: () => {
                let cutter = new TinkerItemElement("create:mechanical_saw");
                cutter.x = curSequenceX;
                cutter.y = icon.y + 16;
                cutter.tooltip = Utils.newList();
                cutter.tooltip.add(Component.translatable("book.kubejs.material.recipes.sequenced_assembly.cutting"));
                elements.add(cutter);

                curSequenceX += 16;
            },
            deployingIngredient: (ingredient) => {
                let deployer = new TinkerItemElement("create:deployer");
                deployer.x = curSequenceX;
                deployer.y = icon.y + 16;
                deployer.tooltip = Utils.newList();
                deployer.scale(0.5);
                deployer.tooltip.add(Component.translatable("book.kubejs.material.recipes.sequenced_assembly.deploying", ingredient.getFirst().getHoverName()));
                elements.add(deployer);

                let deployerItem = new TinkerItemElement(Item.of("minecraft:air"));
                deployerItem.x = deployer.x;
                deployerItem.y = deployer.y;
                deployerItem.itemCycle = NonNullList.of(
                    ingredient.getFirst().withCount(1),
                    ingredient.getDisplayStacks().toArray(),
                );
                deployerItem.noTooltip = true;
                elements.add(deployerItem);

                curSequenceX += 16;
            },
            deployingMaterial: (material) => {
                let deployer = new TinkerItemElement("create:deployer");
                deployer.x = curSequenceX;
                deployer.y = icon.y + 16;
                deployer.tooltip = Utils.newList();
                deployer.scale(0.5);
                deployer.tooltip.add(Component.translatable("book.kubejs.material.recipes.sequenced_assembly.deploying",
                    Component.translatable("book.kubejs.material.recipes.corresponding_part",
                        RecipeDisplay.translationFallback('material.' + material.toString().replace(':', '.').replace('#', '.')).underlined()
                    )
                ));
                elements.add(deployer);

                let part = RecipeDisplay.materialValueIndicator(material, 1, curSequenceX, deployer.y, [recipe.inputMaterial, recipe.outputMaterial]);
                part.noTooltip = true;
                elements.add(part);

                curSequenceX += 16;
            }
        };
        recipe.displayRecipes(utils);

        return 36;
    },
};
