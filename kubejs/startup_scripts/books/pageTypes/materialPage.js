// priority: 2000

/**
 * @fileoverview Page Types
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * @author Pelemenguin
 */

/* global
    MantleJSEvents
    DetailedBase
    TinkerTools
    StatTypeBase
    ArmorStatPage
*/

/**
 * @param {Internal.ArrayList<Internal.BookElement>} elements
 * @param {Internal.MaterialId} materialId
 * 
 */

MantleJSEvents.pageTypeRegistry(event => {
    event.create("kubejs:melee_harvest_material_page_left")
        .buildPage((/**@type {BookArguments.MaterialPageLeft}*/args, book, elements/*, rightSide*/) => {
            StatTypeBase.build(elements, book, args, {
                stats: ["tconstruct:head", "tconstruct:handle", "tconstruct:binding"]
            });
        });
    
    event.create("kubejs:melee_harvest_material_page_right")
        .buildPage((/**@type {BookArguments.MaterialPageRight}*/args, book, elements) => {
            DetailedBase.build(elements, book, args, {
                tools: [
                    TinkerTools.pickaxe,
                    TinkerTools.handAxe,
                    TinkerTools.mattock,
                    TinkerTools.kama,
                    TinkerTools.sword,
                    TinkerTools.dagger,
                    TinkerTools.sledgeHammer,
                    TinkerTools.excavator,
                    TinkerTools.broadAxe,
                    TinkerTools.cleaver
                ],
                translationSuffix: "encyclopedia"
            });
        });
    
    event.create("kubejs:ranged_material_page_left")
        .buildPage((/** @type {BookArguments.MaterialPageLeft} */ args, book, elements) => {
            StatTypeBase.build(elements, book, args, {
                stats: ["tconstruct:limb", "tconstruct:grip", "tconstruct:bowstring"]
            });
        });
    
    event.create("kubejs:ranged_material_page_right")
        .buildPage((/**@type {BookArguments.MaterialPageRight}*/args, book, elements) => {
            DetailedBase.build(elements, book, args, {
                tools: [
                    TinkerTools.crossbow,
                    TinkerTools.longbow,
                    TinkerTools.fishingRod
                ],
                translationSuffix: "ranged"
            });
        });
    
    event.create("kubejs:ammo_material_page_left")
        .buildPage((/** @type {BookArguments.MaterialPageLeft} */ args, book, elements) => {
            StatTypeBase.build(elements, book, args, {
                stats: ["tconstruct:arrow_head", "tconstruct:arrow_shaft", "tconstruct:fletching"]
            });
        });
    
    event.create("kubejs:ammo_material_page_right")
        .buildPage((/**@type {BookArguments.MaterialPageRight}*/args, book, elements) => {
            DetailedBase.build(elements, book, args, {
                tools: [
                    TinkerTools.fishingRod,
                    TinkerTools.arrow,
                    TinkerTools.throwingAxe,
                    TinkerTools.shuriken
                ],
                translationSuffix: "ammo"
            });
        });
    
    event.create("kubejs:armor_material_page_left")
        .buildPage((/** @type {BookArguments.MaterialPageLeft} */ args, book, elements) => {
            ArmorStatPage.build(elements, book, args);
        });
    
    event.create("kubejs:armor_material_page_right")
        .buildPage((/**@type {BookArguments.MaterialPageRight}*/args, book, elements) => {
            DetailedBase.build(elements, book, args, {
                tools: [
                    TinkerTools.plateShield
                ].concat(TinkerTools.plateArmor.values().toArray().map(a => ({getOrNull: () => a}))),
                translationSuffix: "armor"
            });
        });
});