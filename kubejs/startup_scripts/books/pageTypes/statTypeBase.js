// priority: 9000

/**
 * @fileoverview Stat Page Type Base
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
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
*/

// eslint-disable-next-line no-unused-vars
const MaterialPreferenceDisplay = {
    durability: {
        item: Item.of("tconstruct:plate_shield", {tic_materials: ["tconstruct:iron", "tconstruct:wood"]}),
        color: "#606060"
    }
};

let StatRepresentaticeItem = {
    "tconstruct:head": "tconstruct:pick_head",
    "tconstruct:handle": "tconstruct:tool_handle",
    "tconstruct:binding": "tconstruct:tool_binding"
};

/**
 * @param {Internal.ArrayList<Internal.BookElement>} elements
 * @param {number} y
 * @param {Internal.MaterialId} materialId
 * @param {string} statId
 * @param {Internal.Font} font
 * - - - - -
 * @returns {number}
 */
let writeStat = (elements, y, materialId, statId) => {

    let registry = MaterialRegistry.getInstance();
    let processedStatId = MaterialStatsId.tryParse(statId);

    let statsOptional = registry.getMaterialStats(materialId, processedStatId);
    if (statsOptional.isEmpty()) return 0;

    let yIncresement = 18;

    let reprItem = Item.of(StatRepresentaticeItem[statId], 1, {Material: materialId.toString()});
    let itemElement = new TinkerItemElement(reprItem);
    itemElement.y = y + 1;
    itemElement.scale = 0.5;
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
    let result = [BookTextComponentData.literal("\n")];
    traits.forEach(trait => {
        let modifier = trait.getModifier();
        let textCopmonentData = BookTextComponentData.of(modifier.getDisplayName());

        textCopmonentData.tooltips = modifier.getDescriptionList(trait.getLevel()).toArray();
        textCopmonentData.text = textCopmonentData.text.copy().withStyle(ChatFormatting.DARK_GRAY, ChatFormatting.UNDERLINE);

        result.push(textCopmonentData);
    });
    return result;
};

// eslint-disable-next-line no-unused-vars
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
    }

};