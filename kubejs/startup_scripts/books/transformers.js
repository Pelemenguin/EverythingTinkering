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
    MaterialStatsId
    ContentPageIconList
    BookElement
    RepresentativeItems
    PageDataJS
    Component
*/

// eslint-disable-next-line no-unused-vars
const KubeJSTransformers = {
    /** @type {Internal.BookTransformer} */
    MATERIAL_TRANSFORMER: new MantleJSTransformer("kubejs:material_transformer")
};

//   public static void addPages(SectionData data, List<ContentPageIconList> indexList, Collection<PageWithIcon> pages) {
//     Iterator<ContentPageIconList> indexes = indexList.iterator();
//     ContentPageIconList overview = indexes.next();
//     for (PageWithIcon page : pages) {
//       data.pages.add(page.page);
//       while (!overview.addLink(page.icon, Component.literal(page.page.getTitle()), page.page)) {
//         overview = indexes.next();
//       }
//     }
//   }

/**
 * 
 * @param {Internal.SectionDataJS} section 
 * @param {Internal.ContentPageIconList[]} indexList
 * @param {Internal.ItemElement[]} icons
 * @param {Internal.PageDataJS[]} leftPages 
 * @param {Internal.PageDataJS[]} rightPages 
 */
let addPages = (section, indexList, icons, leftPages, rightPages) => {

    let indexIndex = 0;

    for (let i = 0; i < leftPages.length; i++) {
        let icon = icons[i];
        let leftPage = leftPages[i];
        let rightPage = rightPages[i];

        section.addRawPage(leftPage);
        section.addRawPage(rightPage);

        while (!indexList[indexIndex].addLink(icon, Component.translatable('material.' + leftPage.name.replace(':', '.')), leftPage.origin)) {
            indexIndex++;
        }
    }
};

MantleJSEvents.transformerRegistry(event => {
    event.create("kubejs:material_transformer")
        .transform(book => {

            let registry = MaterialRegistry.getInstance();

            /** @type {Internal.SectionDataJS[]} */
            let sections = book.getSections().toArray();

            sections.forEach(section => {
                if (!section.extraData.containsKey(ResourceLocation.tryBuild("kubejs", "general_materials"))) return;
                let tier = section.extraData.get(ResourceLocation.tryBuild("kubejs", "general_materials"));
                let isEncyclopedia = section.extraData.get(ResourceLocation.tryBuild("kubejs", "is_encyclopedia"));

                /** @type {Internal.IMaterial[]} */
                let materials = registry.getVisibleMaterials().toArray().filter((/** @type {Internal.IMaterial} */material) => {
                    if (material.tier != tier) return false;
                    let result = false;
                    [
                        MaterialStatsId.tryParse("tconstruct:head"),
                        MaterialStatsId.tryParse("tconstruct:handle"),
                        MaterialStatsId.tryParse("tconstruct:binding")
                    ].forEach(statId => {
                        if (!registry.getMaterialStats(material.identifier, statId).isEmpty()) {
                            result = true;
                        }
                    });
                    return result;
                });

                let contentTablePages = ContentPageIconList.getPagesNeededForItemCount(materials.length, section.origin, Component.translatable(`book.kubejs.material.title.general.${tier}`).getString(), "");
                let contentTablePageCount = contentTablePages.length;

                let firstPageNumber = book.getFirstPageNumber(section, null);
                if ((firstPageNumber + contentTablePageCount) % 2 == 1) section.addPage(() => {});

                /** @type {Internal.ItemElement[]} */
                let icons = [];
                /** @type {Internal.PageDataJS[]} */
                let leftPages = [];
                /** @type {Internal.PageDataJS[]} */
                let rightPages = [];
                materials.forEach(material => {
                    let matId = material.identifier;
                    // section.addPage(page => {
                    //     page.setCustomType("kubejs:general_material_page_left", {
                    //         materialId: matId
                    //     });
                    //     page.setName(`${strMatId}_left`);
                    //     pages.push(new ContentPageIconList$PageWithIcon(BookElement.item(0, 0, 1, RepresentativeItems.get(matId.toString())), page.origin));
                    // });
                    // section.addPage(page => {
                    //     page.setCustomType("kubejs:general_material_page_right", {
                    //         materialId: matId,
                    //         isEncyclopedia: false
                    //     });
                    //     page.setName(`${strMatId}_right`);
                    // });
                    let leftPage = PageDataJS.createNewCustom("kubejs:general_material_page_left", {
                        materialId: matId
                    });
                    leftPage.setParent(section);
                    leftPage.setName(`${matId.toString()}`);
                    // pages.push(new ContentPageIconList$PageWithIcon(BookElement.item(0, 0, 1, RepresentativeItems.get(matId.toString())), leftPage.origin));
                    leftPages.push(leftPage);
                    icons.push(BookElement.item(0, 0, 1, RepresentativeItems.get(matId.toString())));

                    let rightPage = PageDataJS.createNewCustom("kubejs:general_material_page_right", {
                        materialId: matId,
                        isEncyclopedia: isEncyclopedia
                    });
                    rightPage.setParent(section);
                    rightPage.setName(`${matId.toString()}.right`);
                    rightPages.push(rightPage);
                });

                // ContentPageIconList.addPages(section.origin, contentTablePages, JavaUtils.ArrayList["of(java.lang.Object[])"](pages));

                // let i = contentTablePageCount + 1;
                // rightPages.forEach(page => {
                //     section.addRawPage(i, page);
                //     i += 2;
                // });

                addPages(section, contentTablePages.toArray(), icons, leftPages, rightPages);

            });
        });
});
