// SPDX-License-Identifier: LGPL-3.0-or-later
 
/* global
    global: writable
    JEIAddedEvents
    Component
    $Integer
    $RepairKitItem
    $MaterialStatsId
    $MaterialIngredient
    ToolPartItem
    $FakeIngotItem
*/

global.JEIFunctions.FluidInfusion = {};

/** @type {Internal.CustomRecipeCategory<?>} */
global.JEIFunctions.AllCategories.FLUID_INFUSION_CORE;

/**
 * @param {Internal.RecipeCategoryBuilder<Internal.CustomJSRecipe>} category 
 */
global.JEIFunctions.FluidInfusion.Background = (category) => {
    return category.getJeiHelpers().getGuiHelper().createBlankDrawable(0, 0);
};

global.JEIFunctions.FluidInfusion.RECIPE_ARROW = null;

/**
 * 
 * @param {Internal.CustomJSRecipe} recipe 
 * @param {Internal.IRecipeSlotsView} recipeSlotsView 
 * @param {Internal.GuiGraphics} guiGraphics 
 * @param {number} mouseX 
 * @param {number} mouseY 
 * @param {Internal.RecipeCategoryBuilder<Internal.CustomJSRecipe>} category 
 */
global.JEIFunctions.FluidInfusion.DrawHandler = (_recipe, _recipeSlotsView, guiGraphics, _mouseX, _mouseY, category) => {
    let arrow = global.JEIFunctions.FluidInfusion.RECIPE_ARROW;
    if (arrow === null) {
        arrow = category.getJeiHelpers().getGuiHelper().createAnimatedRecipeArrow(60);
        global.JEIFunctions.FluidInfusion.RECIPE_ARROW = arrow;
    }

    arrow.draw(guiGraphics, 48, 16);
};

/**
 * 
 * @param {Internal.IRecipeLayoutBuilder} recipeLayoutBuilder 
 * @param {Internal.CustomJSRecipe} recipe 
 * @param {Internal.IFocusGroup} focusGroup 
 * @param {Internal.RecipeCategoryBuilder<Internal.CustomJSRecipe>} category 
 */
global.JEIFunctions.FluidInfusion.HandleLookup = (recipeLayoutBuilder, recipe, _focusGroup, category) => {
    /** @type {Annotation.BatchRecipes.FluidInfusion.Item} */
    let data = recipe.getData();

    let inputItem = data.inputItem;
    let outputItem = data.outputItem;

    let type = category.getJeiHelpers().getIngredientManager().getIngredientTypeForUid("item_stack").get();

    recipeLayoutBuilder.addSlot("input", 16, 16).addIngredients(type, inputItem.getStacks().toList()).setSlotName("input");
    recipeLayoutBuilder.addSlot("output", 78, 16).addItemStack(outputItem).setSlotName("output");

    recipeLayoutBuilder.addInputSlot(0, 0).addFluidStack(data.inputFluids[0], 1000).setSlotName("fluid1");
    recipeLayoutBuilder.addInputSlot(32, 0).addFluidStack(data.inputFluids[1], 1000).setSlotName("fluid2");
    recipeLayoutBuilder.addInputSlot(32, 32).addFluidStack(data.inputFluids[2], 1000).setSlotName("fluid3");
    recipeLayoutBuilder.addInputSlot(0, 32).addFluidStack(data.inputFluids[3], 1000).setSlotName("fluid4");
};

global.JEIFunctions.FluidInfusion.WIDTH = $Integer["valueOf(int)"](94);
global.JEIFunctions.FluidInfusion.HEIGHT = $Integer["valueOf(int)"](48);

(() => {

JEIAddedEvents.registerCategories(event => {
    global.JEIFunctions.AllCategories.FLUID_INFUSION_CORE = event.custom("kubejs:fluid_infusion_core", category => {
        category.backgroundSupplier(() => global.JEIFunctions.FluidInfusion.Background(category));
        category.title(Component.translatable("jei.kubejs.fluid_infusion.title"));
        category.icon(category.getJeiHelpers().getGuiHelper().createDrawableItemStack("kubejs:fluid_infusion_core"));
        category.setDrawHandler((recipe, recipeSlotsView, guiGraphics, mouseX, mouseY) => global.JEIFunctions.FluidInfusion.DrawHandler(recipe, recipeSlotsView, guiGraphics, mouseX, mouseY, category));
        category.handleLookup((recipeLayoutBuilder, recipe, focusGroup) => global.JEIFunctions.FluidInfusion.HandleLookup(recipeLayoutBuilder, recipe, focusGroup, category));
        category.setWidthSupplier(() => global.JEIFunctions.FluidInfusion.WIDTH);
        category.setHeightSupplier(() => global.JEIFunctions.FluidInfusion.HEIGHT);
    });
});

JEIAddedEvents.registerRecipes(event => {
    let builder = event.custom("kubejs:fluid_infusion_core");
    global.BlockFunctions.FluidInfusionCore.MATERIAL_RECIPES.forEach((_, inner) => {
        inner.forEach((_, recipe) => {
            let supported = recipe.statTypes;
            for (let toolPartItem of global.TOOL_PARTS) {
                if (toolPartItem instanceof $RepairKitItem) {
                    if (toolPartItem instanceof $FakeIngotItem) {
                        if (!supported.contains(new $MaterialStatsId("tconstruct", "ingot"))) continue;
                    }
                    if (!supported.contains(new $MaterialStatsId("tconstruct", "repair_kit"))) continue;
                } else if (toolPartItem instanceof ToolPartItem) {
                    if (!supported.contains(toolPartItem.getStatType())) continue;
                } else {
                    continue;
                }

                /** @type {Annotation.BatchRecipes.FluidInfusion.Item} */
                let transformedData = {
                    inputItem: $MaterialIngredient["of(net.minecraft.world.level.ItemLike,slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](toolPartItem, recipe.inputMaterial),
                    outputItem: toolPartItem.withMaterialForDisplay(recipe.outputMaterial),
                    inputFluids: recipe.inputFluids
                };

                builder.add(transformedData);
            }
        });
    });
    global.BlockFunctions.FluidInfusionCore.RECIPES.forEach((_, inner) => {
        inner.forEach((_, recipe) => {
            builder.add(recipe);
        });
    });
});

JEIAddedEvents.registerRecipeCatalysts(event => {
    event.data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]("kubejs:fluid_infusion_core", global.JEIFunctions.AllCategories.FLUID_INFUSION_CORE);
    event.data["addRecipeCatalyst(net.minecraft.world.item.ItemStack,mezz.jei.api.recipe.RecipeType[])"]("create:depot", global.JEIFunctions.AllCategories.FLUID_INFUSION_CORE);

});

})();
