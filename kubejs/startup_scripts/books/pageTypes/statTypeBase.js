// priority: 9000

/**
 * @fileoverview Stat Page Type Base
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    BookTextData
    BookElement
    JavaMath
    Component
    RepresentativeItems
    CustomUtils
    MaterialId
    Item
    MaterialRegistry
    BookScreen
    MaterialStatsId
    TextComponentData
*/

// eslint-disable-next-line no-unused-vars
const MaterialPreferenceDisplay = {
    durability: {
        item: Item.of("tconstruct:plate_shield", {tic_materials: ["tconstruct:iron", "tconstruct:wood"]}),
        color: "#606060"
    }
};

let StatRepresentaticeItem = {
    "tconstruct:head": "tconstruct:pick_head"
};

/**
 * @param {string} materialId
 * @param {Internal.Font} font
 * - - - - -
 * @returns {Internal.TextElement}
 */
let createTitle = (materialId, font) => {

    let [namespace, path] = materialId.split(':');
    let translationKey = `material.${namespace}.${path}`;

    let [text] = BookTextData.fromComponent(Component.translatable(translationKey));
    text.scale = 1.2;
    text.underlined = true;
    text.useOldColor = false;
    text.rgbColor = CustomUtils.Tinker.getMantleColor(translationKey).getValue();
    text.dropshadow = true;

    let width = JavaMath.ceil(font.width(translationKey) * text.scale) + 1;

    return [
        BookElement.text(20, 2, width, 15, text),
        BookElement.item(0, 0, 1, RepresentativeItems[materialId])
    ];

};

/**
 * @param {number} x
 * @param {number} y
 * @param {string} materialId
 * @param {string[]} statIds
 * @param {Internal.Font} font
 * - - - - -
 * @returns {Internal.BookElement[]}
 */
let createStats = (x, y, materialId, statIds, font) => {
    // let result = createHeadStat(materialId, font, 16);
    let result = [];
    let curY = y;
    /** @type {Internal.MaterialId} */
    let parsedMaterial = MaterialId.tryParse(materialId);
    statIds.forEach(statId => {
        let [elements, yIncresement] = writeStat(curY, parsedMaterial, statId, font);
        curY += yIncresement;
        result = result.concat(elements);
        // result.push(BookElement.text(x, curY, BookScreen.PAGE_WIDTH - x, 32, BookTextData.literal(parsedId)));
    });
    return result;
};

/**
 * @param {number} y
 * @param {Internal.MaterialId} materialId
 * @param {string} statId
 * @param {Internal.Font} font
 */
let writeStat = (y, materialId, statId, font) => {

    let statsOptional = MaterialRegistry.getInstance().getMaterialStats(materialId, MaterialStatsId.tryParse(statId));
    if (statsOptional.isEmpty()) return [result, 0];

    let yIncresement = 25;
    let result = [];

    let reprItem = Item.of(StatRepresentaticeItem[statId], 1, {Material: materialId.toString()});
    result.push(BookElement.item(0, y + 1, 0.5, reprItem));

    let stats = statsOptional.get();
    let [statTitle] = BookTextData.fromComponent(stats.getLocalizedName());
    statTitle.underlined = true;
    statTitle.bold = true;
    result.push(BookElement.text(10, y, BookScreen.PAGE_WIDTH, 9, [statTitle]));
    // result.push(BookElement.textComponent(10, y + 9, writeStatDesc(materialId, stats)));

    return [result, yIncresement];
};

// /**
//  * @param {number} y
//  * @param {Internal.MaterialId} materialId
//  * @param {Internal.IMaterialStats} stats
//  * @param {Internal.Font} font
//  * - - - - -
//  * @returns {Internal.TextComponentData[]}
//  */
// let writeStatDesc = (materialId, stats) => {
//     let result = [];

//     let info = stats.getLocalizedInfo();
//     let tooltips = stats.getLocalizedDescriptions();
//     for (let i = 0; i < Math.min(info.length, tooltips.length); i++) {
//         let thisTooltip = tooltips.get(i);
//         let [text] = BookTextData.fromComponent(info.get(i));
//         if (thisTooltip.getString().length == 0) {
//             text.tooltips = null;
//         } else {
//             text.tooltips = [thisTooltip];
//         }
//         result.push(text);
//         result.push(new TextComponentData('\n'));
//     }

//     return result;
// };

// /**
//  * @param {Internal.ItemStack_} item
//  * @param {string} statTranslationKey
//  * @param {Internal.Font} font
//  * @param {number} y
//  * - - - - -
//  * @returns {Internal.TextData[]}
//  */
// let createStatIcon = (item, statTranslationKey, font, y) => {
//     let [text] = BookTextData.fromComponent(Component.translatable(statTranslationKey));
//     let w = font.width(text.text);

//     let itemElement = BookElement.item(0, y, 1.5, [item]);
//     return [
//         BookElement.text(12 - w / 2, y + 24, w, 16, [text]),
//         itemElement
//     ];
// };

// /**
//  * @param {string} materialId
//  * @param {Internal.Font} font
//  * @param {number} y
//  * - - - - -
//  * @returns {Internal.BookElement[]}
//  */
// let createHeadStat = (materialId, font, y) => {
//     let representativeItem = Item.of("tconstruct:pick_head", 1, {Material: materialId});
//     return createStatIcon(representativeItem, "stat.tconstruct.head", font, y);
// };

// eslint-disable-next-line no-unused-vars
const StatTypeBase = {
    createTitle: createTitle,
    createStats: createStats
};