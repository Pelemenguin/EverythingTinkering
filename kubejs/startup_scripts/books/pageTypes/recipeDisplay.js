//priority: 10000

/**
 * @fileoverview Recipe display
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    TinkerItemElement
    Component
    Utils
    BookElement
    ImageData
    TinkerToolParts
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

RecipeDisplay.DEFAULT_X = 0;
RecipeDisplay.DEFAULT_Y = 18;

/**
 * @param {Internal.MaterialVariantId} variantId
 * @param {number} value
 * @param {number} x
 * @param {number} y
 * - - - - -
 * @returns {Internal.TinkerItemElement}
 */
RecipeDisplay.materialValueIndicator = (variantId, value, x, y) => {
    let result = new TinkerItemElement(TinkerToolParts.toolBinding.getOrNull().withMaterial(variantId).withCount(value));
    result.x = x;
    result.y = y;
    result.tooltip = Utils.newList();
    // let outputName = 'material.' + recipe.getMaterial().getVariant().getSuffix().replace('_', '.');
    let translation = 'material.' + variantId.toString().replace(':', '.').replace('#', '.');
    // output.tooltip.add(Component.literal(recipe.getValue()).append(Component.literal(' ')).append(Component.translatable(outputName).underlined()));
    result.tooltip.add(Component.translatable("book.kubejs.material.recipes.material_value_indicator", [Component.literal(value), Component.translatable(translation).underlined()]));
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

        let ingredient = new TinkerItemElement(recipe.getIngredient().first.withCount(recipe.needed));
        // ingredient.itemCycle = NonNullList["of(java.lang.Object,java.lang.Object[])"](Item.of("minecraft:air"), recipe.ingredient.displayStacks.toArray()); // recipe.ingredient.displayStacks.toList();
        ingredient.x = pattern.x + 18;
        ingredient.y = pattern.y;
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
    }
};

    // /** @constant */BEGIN_X: 0,
    // /** @constant */BEGIN_Y: 18,

    // /**
    //  * @type {(elements: Internal.ArrayList<Internal.BookElement>, recipe: Internal.MaterialRecipe) => void}
    //  */
    // partBuilder: undefined