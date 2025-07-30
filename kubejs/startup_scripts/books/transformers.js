// priority: 1000

/**
 * @fileoverview Book Transformers
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    MantleJSEvents
    MantleJSTransformer
*/

// eslint-disable-next-line no-unused-vars
const KubeJSTransformers = {
    /** @type {Internal.BookTransformer} */
    MATERIAL_TRANSFORMER: new MantleJSTransformer("kubejs:material_transformer")
};

MantleJSEvents.transformerRegistry(event => {
    event.create("kubejs:material_transformer")
        .transform(book => {
            book.findSection("melee_harvest_materials").addPage(page => {
                page.setCustomType("kubejs:material_page", {
                    materialId: "kubejs:sea_alloy"
                });
            });
        });
});
