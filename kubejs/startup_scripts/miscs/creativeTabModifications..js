// priority: 10000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Creative Tab Modification
 * @author Pelemenguin
 */

/* global
    StartupEvents
    Ingredient
*/

StartupEvents.modifyCreativeTab("kubejs:tab", event => {
    event.remove(Ingredient.all);

    // Spawn Eggs
    event.add(["kubejs:icy_terracube"]);

    // Fluid Buckets
    event.add(["kubejs:animation_fluid_bucket"]);

    // Boss Summmoners
    event.add(["kubejs:frozen_terracube_core"]);

    // Treasure Bags
    event.add(["kubejs:icy_terracube_treasure_bag"]);
    event.add(["kubejs:icy_terracube_treasure_bag_no_hit"]);

    // Materials
    event.add([
        "kubejs:icy_clay_ball",
        "kubejs:scrapped_tinker_metal",
        "kubejs:animated_tinker_metal"
    ]);

    // Technology - Mechanism
    event.add(["kubejs:basic_mechanism"]);

    // Adventure - Important Structure Blocks
    event.add([
        "kubejs:permanent_induction_coil",
        "kubejs:fluid_infusion_core"
    ]);

    // Decorations
    event.add(["kubejs:tinker_lab_wall"]);
});