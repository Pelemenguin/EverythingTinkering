// priority: 2000

/**
 * @fileoverview Page Types
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
    StatTypeBase
    MaterialSuggestions
    BookScreen
    Component
    BookElement
    BookTextComponentData
    DetailedBase
    BookTextData
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

            let {
                materialId,
                isEncyclopedia
            } = args;
            
            let [usage, multiplier] = MaterialSuggestions.getUsage(materialId.toString());
            elements.add(MaterialSuggestions.getElement(materialId.toString(), BookScreen.PAGE_WIDTH - 18, 0));
            let usageComponent = Component.literal(multiplier + '').color(MaterialSuggestions.getColor(usage.toLowerCase())).bold(true);
            
            let usageWidth = book.fontRenderer.width(usageComponent.getString());
            let usageTextCompData = BookTextComponentData.of(usageComponent);
            usageTextCompData.scale = 1.2;
            elements.add(BookElement.textComponent(BookScreen.PAGE_WIDTH - 22 - usageWidth * 1.2, 2, BookScreen.PAGE_WIDTH, 9, usageTextCompData));

            DetailedBase.drawRecipe(elements, materialId, 0);

            elements.add(isEncyclopedia
                ? BookElement.text(0, 92, BookScreen.PAGE_WIDTH - 18, BookScreen.PAGE_HEIGHT - 90,
                    BookTextData.fromComponent(Component.translatable('material.' + materialId.toString().replace(':', '.').replace('#', '.') + '.encyclopedia').darkGray())[0]
                )
                : BookElement.text(0, 92, BookScreen.PAGE_WIDTH - 18, BookScreen.PAGE_HEIGHT - 90,
                    BookTextData.fromComponent(Component.literal('"').darkGray())[0],
                    BookTextData.fromComponent(Component.translatable('material.' + materialId.toString().replace(':', '.').replace('#', '.') + '.flavor').italic().darkGray())[0],
                    BookTextData.fromComponent(Component.literal('"').darkGray())[0]
                )
            );

        });
});