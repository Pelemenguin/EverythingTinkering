// priority: 5000

/**
 * @fileoverview Stat Page Type Base
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
    MaterialRegistry
    BookTextComponentData
    Item
    BookTextData
    Component
    CustomUtils
    BookElement
    RepresentativeItems
    MaterialStatsId
    BookScreen
    ChatFormatting
    TinkerItemElement
    TinkerToolParts
    NonNullList
*/

let StatRepresentativeItem = {
    "tconstruct:head": "tconstruct:pick_head",
    "tconstruct:handle": "tconstruct:tool_handle",
    "tconstruct:binding": "tconstruct:tool_binding",
    "tconstruct:limb": "tconstruct:bow_limb",
    "tconstruct:grip": "tconstruct:bow_grip",
    "tconstruct:bowstring": "tconstruct:bowstring"
};

/**
 * @param {Internal.ArrayList<Internal.BookElement>} elements
 * @param {number} y
 * @param {Internal.MaterialId} materialId
 * @param {string} statId
 * - - - - -
 * @returns {number}
 */
let writeStat = (elements, y, materialId, statId) => {

    let registry = MaterialRegistry.getInstance();
    let processedStatId = MaterialStatsId.tryParse(statId);

    let statsOptional = registry.getMaterialStats(materialId, processedStatId);
    if (statsOptional.isEmpty()) return 0;

    let yIncresement = 18;

    let reprItem = Item.of(StatRepresentativeItem[statId], 1, {Material: materialId.toString()});
    let itemElement = new TinkerItemElement(reprItem);
    itemElement.y = y;
    itemElement.scale(0.5);
    itemElement.width = 8;
    itemElement.width = 8;
    elements.add(itemElement);

    let stats = statsOptional.get();
    let [statTitle] = BookTextData.fromComponent(stats.getLocalizedName());
    statTitle.underlined = true;
    statTitle.bold = true;
    elements.add(BookElement.text(10, y, BookScreen.PAGE_WIDTH, 9, [statTitle]));

    /** @type {Internal.ModifierEntry[]} */
    let traits = registry.getTraits(materialId, processedStatId).toArray();

    let [statLines, statYIncreasement] = writeStatDesc(stats);
    elements.add(BookElement.textComponent(10, y + 1, BookScreen.PAGE_WIDTH * 0.55, BookScreen.PAGE_HEIGHT, statLines));
    yIncresement += statYIncreasement;

    let traitLines = writeTraitDesc(traits);
    elements.add(BookElement.textComponent(BookScreen.PAGE_WIDTH * 0.55, y - 9, BookScreen.PAGE_WIDTH * 0.45, BookScreen.PAGE_HEIGHT, traitLines));

    return yIncresement;
};

/**
 * @param {Internal.IMaterialStats} stats
 * - - - - -
 * @returns {[Internal.TextComponentData[], number]}
 */
let writeStatDesc = (stats) => {
    let result = [BookTextComponentData.literal("\n")];
    let y = 0;

    /** @type {Internal.Component[]} */
    let info = stats.getLocalizedInfo().toArray();
    /** @type {Internal.Component[]} */
    let tooltips = stats.getLocalizedDescriptions().toArray();
    for (let i = 0; i < Math.min(info.length, tooltips.length); i++) {
        let thisTooltip = tooltips[i];
        let text = BookTextComponentData.of(info[i]);
        if (thisTooltip.getString().length() == 0) {
            text.tooltips = null;
        } else {
            text.tooltips = [thisTooltip];
        }
        result.push(text);
        result.push(BookTextComponentData.literal("\n"));
        y += 9;
    }

    return [result, y];
};

/**
 * 
 * @param {Internal.ModifierEntry[]} traits 
 * - - - - -
 * @returns {Internal.TextComponentData[]}
 */
let writeTraitDesc = (traits) => {
    let result = [BookTextComponentData.LINEBREAK];
    traits.forEach(trait => {
        let modifier = trait.getModifier();
        let textCopmonentData = BookTextComponentData.of(modifier.getDisplayName());

        textCopmonentData.tooltips = modifier.getDescriptionList(trait.getLevel()).toArray();
        textCopmonentData.text = textCopmonentData.text.copy().withStyle(ChatFormatting.DARK_GRAY, ChatFormatting.UNDERLINE);

        result.push(textCopmonentData);

        result.push(BookTextComponentData.LINEBREAK);
    });
    return result;
};

const StatTypeBase = {

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {Internal.MaterialId} materialId
     */
    createTitle: (elements, materialId) => {

        let strMatId = materialId.toString();
        let [namespace, path] = strMatId.split(':');
        let translationKey = `material.${namespace}.${path}`;

        let [text] = BookTextData.fromComponent(Component.translatable(translationKey));
        text.scale = 1.2;
        text.underlined = true;
        text.useOldColor = false;
        text.rgbColor = CustomUtils.Tinker.getMantleColor(translationKey).getValue();
        text.dropshadow = true;

        let itemElement = new TinkerItemElement(RepresentativeItems.get(strMatId));
        itemElement.x = 1,

        elements.add(BookElement.text(21, 2, BookScreen.PAGE_WIDTH - 21, 15, text));
        elements.add(itemElement);

    },

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {number} y
     * @param {Internal.MaterialId} materialId
     * @param {string[]} statIds
     * - - - - -
     * @returns {boolean} If any stat is written
     */
    createStats: (elements, y, materialId, statIds) => {
        let curY = y;
        /** @type {Internal.MaterialId} */
        statIds.forEach(statId => {
            let yIncresement = writeStat(elements, curY, materialId, statId);
            curY += yIncresement;
        });

        return curY != y;
    },

    /**
     * - Stat page builder base.
     * - 属性书页构建器基类。
     * - - - - -
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {Internal.BookDataJS} book
     * @param {BookArguments.MaterialPageLeft} pageArguments
     * @param {{
     *     stats: string[]
     * }} statArguments
     */
    build: (elements, book, pageArguments, statArguments) => {

        let {
            materialId
        } = pageArguments;

        StatTypeBase.createTitle(elements, materialId);
        StatTypeBase.createStats(elements, 20, materialId, statArguments.stats);

    }

};

/**
 * @param {Internal.ArrayList<Internal.BookElement>} elements
 * @param {Internal.MaterialId} materialId
 * @param {number} y
 * - - - - -
 * @returns {number}
 */
let addArmorStats = (elements, materialId, y) => {

    let registry = MaterialRegistry.getInstance();
    
    let stats = {
        helmet: registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:plating_helmet")),
        chestplate: registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:plating_chestplate")),
        leggings: registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:plating_leggings")),
        boots: registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:plating_boots")),
        shield: registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:plating_shield"))
    };

    /**
     * @type {{
     *     helmet: Internal.Component[],
     *     chestplate: Internal.Component[],
     *     leggings: Internal.Component[],
     *     boots: Internal.Component[],
     *     shield: Internal.Component[],
     * }}
     */
    let statInfo = {
        helmet: stats.helmet.isPresent() ? stats.helmet.get().getLocalizedInfo().toArray() : [],
        chestplate: stats.chestplate.isPresent() ? stats.chestplate.get().getLocalizedInfo().toArray() : [],
        leggings: stats.leggings.isPresent() ? stats.leggings.get().getLocalizedInfo().toArray() : [],
        boots: stats.boots.isPresent() ? stats.boots.get().getLocalizedInfo().toArray() : [],
        shield: stats.shield.isPresent() ? stats.shield.get().getLocalizedInfo().toArray() : [],
    };

    // console.info(statInfo.helmet);

    /** @type {{[translationKey: string]: Internal.MutableComponent}} */
    let statComponents = {};
    for (let part in statInfo) {
        let marked = [];

        /** @type {Internal.MutableComponent} */ let info = statInfo[part];
        info.forEach((line) => {
            // console.info(line.getSiblings());

            let key = line.getContents().key;
            marked.push(key);
            if (key in statComponents) {
                statComponents[key].append(Component.literal(' / ')).append(line.getSiblings().toArray());
            } else {
                statComponents[key] = Component.translatable(key).append(line.getSiblings().toArray()[0]);
            }

        });

        for (let key in statComponents) {
            if (marked.indexOf(key) == -1) {
                statComponents[key] = statComponents[key].append(Component.literal(' / ')).append(Component.literal(' - '));
            }
        }
    }

    let curY = 9;

    /** @type {Internal.TextComponentData[]} */
    let finalComponentData = [BookTextComponentData.of(Component.translatable("stat.tconstruct.plating").bold().underlined()), BookTextComponentData.LINEBREAK];
    for (let part in statComponents) {
        let component = statComponents[part];
        let data = BookTextComponentData.of(component);
        data.tooltips = [Component.translatable(part + '.description')];
        
        finalComponentData.push(data);
        finalComponentData.push(BookTextComponentData.LINEBREAK);
        curY += 9;
    }

    elements.add(BookElement.textComponent(0, y, BookScreen.PAGE_WIDTH, curY, finalComponentData));

    /** @type {Internal.ToolPartItem[]} */
    let platingItems = TinkerToolParts.plating.values().toArray();
    let itemElement = new TinkerItemElement(platingItems[0].withMaterial(materialId));
    itemElement.x = 0;
    itemElement.y = y + curY;
    itemElement.itemCycle = NonNullList.of(
        platingItems[1],
        platingItems.map(item => item.withMaterial(materialId))
    );

    elements.add(itemElement);

    return curY;

};

const ArmorStatPage = {

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {number} y
     * @param {Internal.MaterialId} materialId
     * - - - - -
     * @returns {boolean} If any stat is written
     */
    createStats: (elements, y, materialId) => {
        let curY = y;

        curY += addArmorStats(elements, materialId, y);

        return curY != y;
    },

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {Internal.BookDataJS} book
     * @param {BookArguments.MaterialPageLeft} pageArguments
     */
    build: (elements, book, pageArguments) => {

        let {
            materialId
        } = pageArguments;

        StatTypeBase.createTitle(elements, materialId);
        ArmorStatPage.createStats(elements, 20, materialId);

    }

};