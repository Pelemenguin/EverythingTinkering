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
*/

/**
 * @param {Internal.ArrayList<Internal.BookElement>} elements
 * @param {Internal.Font} font
 * @param {string} materialId
 */
let buildLeftPage = (elements, materialId, font) => {

    elements.addAll(StatTypeBase.createTitle(materialId, font));
    elements.addAll(StatTypeBase.createStats(0, 18, materialId, ["tconstruct:head"], font));

};

MantleJSEvents.pageTypeRegistry(event => {
    event.create("kubejs:material_page")
        .buildPage((/**@type {BookArguments.MaterialPage}*/args, book, elements, rightSide) => {
            rightSide;

            let {
                materialId
            } = args;

            buildLeftPage(elements, materialId, book.fontRenderer);

        });
});