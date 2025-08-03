// priority: 2000

/**
 * @fileoverview Page Types
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    MantleJSEvents
    StatTypeBase
    MaterialSuggestions
    BookScreen
    Component
    BookElement
    BookTextComponentData
*/

/**
 * @param {Internal.ArrayList<Internal.BookElement>} elements
 * @param {Internal.MaterialId} materialId
 * 
 */

MantleJSEvents.pageTypeRegistry(event => {
    event.create("kubejs:general_material_page_left")
        .buildPage((/**@type {BookArguments.MaterialPageLeft}*/args, book, elements/*, rightSide*/) => {

            let {
                materialId
            } = args;

            StatTypeBase.createTitle(elements, materialId);
            StatTypeBase.createStats(elements, 20, materialId, ["tconstruct:head", "tconstruct:handle", "tconstruct:binding"]);

        });
    
    event.create("kubejs:general_material_page_right")
        .buildPage((/**@type {BookArguments.MaterialPageRight}*/args, book, elements) => {

            // let {
            //     materialId,
            //     isEncyclopedia
            // } = args;

            
            let [usage, multiplier] = MaterialSuggestions.getUsage(args.materialId.toString());
            elements.add(MaterialSuggestions.getElement(args.materialId.toString(), BookScreen.PAGE_WIDTH - 18, 0));
            let usageComponent = Component.literal(multiplier).color(MaterialSuggestions.getColor(usage.toLowerCase())).bold(true);
            
            let usageWidth = book.fontRenderer.width(usageComponent.getString());
            let usageTextCompData = BookTextComponentData.of(usageComponent);
            usageTextCompData.scale = 1.2;
            elements.add(BookElement.textComponent(BookScreen.PAGE_WIDTH - 22 - usageWidth * 1.2, 2, BookScreen.PAGE_WIDTH, 9, [usageTextCompData]));

        });
});