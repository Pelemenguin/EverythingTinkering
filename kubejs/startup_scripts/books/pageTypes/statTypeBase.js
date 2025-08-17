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
    MaterialId
    TinkerTools
    ToolStack
    MaterialNBT
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
    itemElement.y = y + 1;
    itemElement.scale(0.5);
    itemElement.width = 8;
    itemElement.height = 8;
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
 * @param {string} seperator
 * - - - - -
 * @returns {Internal.TextComponentData[]}
 */
let writeTraitDesc = (traits, seperator) => {
    let sep = seperator === undefined ? '\n' : seperator;
    let result = [BookTextComponentData.LINEBREAK];
    traits.forEach(trait => {
        let modifier = trait.getModifier();
        let textCopmonentData = BookTextComponentData.of(modifier.getDisplayName());

        textCopmonentData.tooltips = modifier.getDescriptionList(trait.getLevel()).toArray();
        textCopmonentData.text = textCopmonentData.text.copy().withStyle(ChatFormatting.DARK_GRAY, ChatFormatting.UNDERLINE);

        result.push(textCopmonentData);

        result.push(BookTextComponentData.literal(sep));
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
let addPlatingStats = (elements, materialId, y) => {

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

    if (
        statInfo.helmet.length == 0
        && statInfo.chestplate.length == 0
        && statInfo.leggings.length == 0
        && statInfo.boots.length == 0
        && statInfo.shield.length == 0
    ) return 0;

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

    let curY = 0;

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

    elements.add(BookElement.textComponent(10, y, BookScreen.PAGE_WIDTH, curY, finalComponentData));

    let traits = {
        helmet: registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:plating_helmet")),
        chestplate: registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:plating_chestplate")),
        leggings: registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:plating_leggings")),
        boots: registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:plating_boots")),
        shield: registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:plating_shield"))
    };

    let traitLines = {
        helmet: statInfo.helmet.length == 0 ? [] : writeTraitDesc(traits.helmet.toArray(), ' '),
        chestplate: statInfo.chestplate.length == 0 ? [] : writeTraitDesc(traits.chestplate.toArray(), ' '),
        leggings: statInfo.leggings.length == 0 ? [] : writeTraitDesc(traits.leggings.toArray(), ' '),
        boots: statInfo.boots.length == 0 ? [] : writeTraitDesc(traits.boots.toArray(), ' '),
        shield: statInfo.shield.length == 0 ? [] : writeTraitDesc(traits.shield.toArray(), ' ')
    };

    let [helmetPlating, chestplatePlating, leggingsPlating, bootPlating]
        = TinkerToolParts.plating.values().toArray().map((/** @type {Internal.ToolPartItem} */item) => item.withMaterial(materialId));
    
    let plateShield =  TinkerTools.plateShield.getOrNull();
    let shieldItem = ToolStack.createTool(plateShield, plateShield.getToolDefinition(), MaterialNBT.builder()
        .add(MaterialId.tryParse("tconstruct:wood"))
        .add(materialId)
        .build()
    ).createStack();

    let reprItemMap = {
        helmet: helmetPlating,
        chestplate: chestplatePlating,
        leggings: leggingsPlating,
        boots: bootPlating,
        shield: shieldItem
    };

    Object.keys(traitLines).forEach((key) => {
        if (traitLines[key].length == 0) return;

        let traitElement = BookElement.textComponent(10, y + curY, BookScreen.PAGE_WIDTH, 10, traitLines[key]);
        let itemElement = new TinkerItemElement(reprItemMap[key]);
        itemElement.x = 0,
        itemElement.y = y + curY + 9,
        itemElement.scale(0.5);
        itemElement.width = 8;
        itemElement.height = 8;

        elements.add(traitElement);
        elements.add(itemElement);
        curY += 9;
    });

    return curY + 18;

};

/**
 * 
 * @param {Internal.ArrayList<Internal.BookElement>} elements 
 * @param {Internal.MaterialId} materialId 
 * @param {number} y 
 */
let addMailleStats = (elements, materialId, y) => {

    let registry = MaterialRegistry.getInstance();

    if (registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:maille")).isEmpty()) return 0;

    let statName = BookElement.textComponent(10, y, BookScreen.PAGE_WIDTH, 10,
        BookTextComponentData.of(Component.translatable("stat.tconstruct.maille").bold().underlined())
    );

    elements.add(statName);

    let traitLines = writeTraitDesc(registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:maille")).toArray(), ' ');
    elements.add(BookElement.textComponent(0.4 * BookScreen.PAGE_WIDTH, y - 9, 0.7 * BookScreen.PAGE_WIDTH, 20, traitLines));

    let item = new TinkerItemElement(TinkerToolParts.maille.getOrNull().withMaterial(materialId));
    item.x = 0;
    item.y = y + 1;
    item.scale(0.5);
    item.width = 8;
    item.height = 8;
    elements.add(item);

    return 18;

};

/**
 * 
 * @param {Internal.ArrayList<Internal.BookElement>} elements 
 * @param {Internal.MaterialId} materialId 
 * @param {number} y 
 */
let addShieldCoreStats = (elements, materialId, y) => {

    let registry = MaterialRegistry.getInstance();

    if (registry.getMaterialStats(materialId, MaterialStatsId.tryParse("tconstruct:shield_core")).isEmpty()) return 0;

    let statName = BookElement.textComponent(10, y, BookScreen.PAGE_WIDTH, 10,
        BookTextComponentData.of(Component.translatable("stat.tconstruct.shield_core").bold().underlined())
    );

    elements.add(statName);

    let traitLines = writeTraitDesc(registry.getTraits(materialId, MaterialStatsId.tryParse("tconstruct:shield_core")).toArray(), ' ');
    elements.add(BookElement.textComponent(0.4 * BookScreen.PAGE_WIDTH, y - 9, 0.7 * BookScreen.PAGE_WIDTH, 20, traitLines));

    let item = new TinkerItemElement(TinkerToolParts.shieldCore.getOrNull().withMaterial(materialId));
    item.x = 0;
    item.y = y + 1;
    item.scale(0.5);
    item.width = 8;
    item.height = 8;
    elements.add(item);

    return 18;

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

        curY += addPlatingStats(elements, materialId, curY);
        curY += addMailleStats(elements, materialId, curY);
        curY += addShieldCoreStats(elements, materialId, curY);

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