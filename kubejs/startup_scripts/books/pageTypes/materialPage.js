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

    StatTypeBase.createTitle(elements, materialId, font);
    StatTypeBase.createStats(elements, 20, materialId, ["tconstruct:head", "tconstruct:handle", "tconstruct:binding"]);

};

MantleJSEvents.pageTypeRegistry(event => {
    event.create("kubejs:general_material_page_left")
        .buildPage((/**@type {BookArguments.MaterialPage}*/args, book, elements, rightSide) => {
            rightSide;

            let {
                materialId: stringMatId
            } = args;

            buildLeftPage(elements, stringMatId, book.fontRenderer);

        });
});