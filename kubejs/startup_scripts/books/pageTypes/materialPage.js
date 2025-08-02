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
 * @param {Internal.MaterialId} materialId
 */
let buildLeftPage = (elements, materialId) => {

    StatTypeBase.createTitle(elements, materialId);
    StatTypeBase.createStats(elements, 20, materialId, ["tconstruct:head", "tconstruct:handle", "tconstruct:binding"]);

};

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

            buildLeftPage(elements, materialId);

        });
    
    event.create("kubejs:general_material_page_right")
        // eslint-disable-next-line no-unused-vars
        .buildPage((/**@type {BookArguments.MaterialPageRight}*/args, book, elements) => {

            // let {
            //     materialId,
            //     isEncyclopedia
            // } = args;

            

        });
});