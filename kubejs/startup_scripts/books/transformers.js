// priority: 1000

/**
 * @fileoverview Book Transformers
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

const PageType2ToolParts = {
    "melee_harvest": [
        MaterialStatsId.tryParse("tconstruct:head"),
        MaterialStatsId.tryParse("tconstruct:handle"),
        MaterialStatsId.tryParse("tconstruct:binding")
    ],
    "ranged": [
        MaterialStatsId.tryParse("tconstruct:limb"),
        MaterialStatsId.tryParse("tconstruct:grip"),
        MaterialStatsId.tryParse("tconstruct:bowstring")
    ],
    "armor": [
        MaterialStatsId.tryParse("tconstruct:plating_helmet"),
        MaterialStatsId.tryParse("tconstruct:plating_chestplate"),
        MaterialStatsId.tryParse("tconstruct:plating_leggings"),
        MaterialStatsId.tryParse("tconstruct:plating_boots"),
        MaterialStatsId.tryParse("tconstruct:plating_shield"),
        MaterialStatsId.tryParse("tconstruct:maille"),
        MaterialStatsId.tryParse("tconstruct:shield_core")
    ]
};

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
                if (!section.extraData.containsKey(ResourceLocation.tryBuild("kubejs", "material_tier"))) return;
                let data = section.extraData.get(ResourceLocation.tryBuild("kubejs", "material_tier")).getAsJsonObject();
                let type = data.get("type").getAsString();

                let isEncyclopedia = data.get("isEncyclopedia");
                if (isEncyclopedia == null) isEncyclopedia = false;
                else isEncyclopedia = isEncyclopedia.getAsBoolean();

                /** @type {string[] | Internal.JsonElement} defaultMaterials */
                let defaultMaterials = data.get("defaultMaterials");
                if (defaultMaterials == null) defaultMaterials = ["tconstruct:wood"];
                else defaultMaterials = defaultMaterials.getAsJsonArray().asList().toArray().map((/** @type {Internal.JsonElement}*/ jsonString) => jsonString.getAsString());

                /** @type {number[] | Internal.JsonElement} */
                let tier = data.get("tier");
                let tierMax = 0;
                let tierMin = 0;
                if (tier.isJsonObject()) {
                    tierMax = tier.getAsJsonObject().get("max");
                    tierMin = tier.getAsJsonObject().get("min");
                } else {
                    tierMax = tier.getAsInt();
                    tierMin = tier.getAsInt();
                }

                /** @type {Internal.IMaterial[]} */
                let materials = registry.getVisibleMaterials().toArray().filter((/** @type {Internal.IMaterial} */material) => {
                    if (material.tier > tierMax || material.tier < tierMin) return false;
                    let result = false;
                    PageType2ToolParts[type].forEach(statId => {
                        if (!registry.getMaterialStats(material.identifier, statId).isEmpty()) {
                            result = true;
                        }
                    });
                    return result;
                });
                materials = RepresentativeItems.sortMaterials(materials);

                let contentTablePages = ContentPageIconList.getPagesNeededForItemCount(materials.length, section.origin, section.title, "");
                let contentTablePageCount = contentTablePages.length;

                let firstPageNumber = book.getFirstPageNumber(section, null);
                if ((firstPageNumber + contentTablePageCount) % 2 == 1) section.addPage((page) => {
                    page.setType("mantle:text", (content) => {
                        content.title = section.translate(section.title);
                    });
                });

                /** @type {Internal.ItemElement[]} */
                let icons = [];
                /** @type {Internal.PageDataJS[]} */
                let leftPages = [];
                /** @type {Internal.PageDataJS[]} */
                let rightPages = [];
                materials.forEach(material => {
                    let matId = material.identifier;
                    let leftPage = PageDataJS.createNewCustom(`kubejs:${type}_material_page_left`, {
                        materialId: matId
                    });
                    leftPage.setParent(section);
                    leftPage.setName(`${matId.toString()}`);
                    leftPages.push(leftPage);
                    icons.push(BookElement.item(0, 0, 1, RepresentativeItems.get(matId.toString())));

                    let rightPage = PageDataJS.createNewCustom(`kubejs:${type}_material_page_right`, {
                        materialId: matId,
                        isEncyclopedia: isEncyclopedia,
                        defaultMaterials: defaultMaterials
                    });
                    rightPage.setParent(section);
                    rightPage.setName(`${matId.toString()}.right`);
                    rightPages.push(rightPage);
                });

                addPages(section, contentTablePages.toArray(), icons, leftPages, rightPages);

            });
        });
});
