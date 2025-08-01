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
    MaterialRegistry
    ResourceLocation
*/

// eslint-disable-next-line no-unused-vars
const KubeJSTransformers = {
    /** @type {Internal.BookTransformer} */
    MATERIAL_TRANSFORMER: new MantleJSTransformer("kubejs:material_transformer")
};

MantleJSEvents.transformerRegistry(event => {
    event.create("kubejs:material_transformer")
        .transform(book => {

            let materials = MaterialRegistry.getInstance().getVisibleMaterials().filter(material => material.tier == 1);

            /** @type {Internal.SectionDataJS[]} */
            let sections = book.getSections().toArray();
            sections.forEach(section => {
                if (!section.extraData.containsKey(ResourceLocation.tryBuild("kubejs", "general_materials"))) return;
                let firstPageNumber = book.getFirstPageNumber(section, null);
                if (firstPageNumber % 2 == 1) section.addPage(() => {});
                materials.forEach(material => {
                    let matId = material.identifier.toString();
                    section.addPage(page => {
                        page.setCustomType("kubejs:general_material_page_left", {
                            materialId: matId
                        });
                        page.setName(`${matId.replace(':', '_')}_left`);
                    });
                    section.addPage(page => {
                        page.setName(`${matId.replace(':', '_')}_right`);
                    });
                });
            });
        });
});
