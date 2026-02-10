/**
 * @fileoverview /modpack item_list
 * - - - - -
 * - Give player item list.
 * - 给予玩家物品列表。
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * @author Pelemenguin
 */

/* global
    global
    console
    NBT
    MaterialId
*/

/**
 * - Gives the part list to the player
 * - 给予玩家材料列表。
 * - - - - -
 * @param {Internal.Player} player 
 * @returns {int}
 */

let give_part_list = (target, materialId) => {
    let translation_key = `material.${materialId.replace('#', '.').replace(':', '.')}`;
    let new_nbt = {
        BlockEntityTag: {
            Items: []
        },
        display: {
            Name: `{"translate":"command.kubejs.item_list.parts.name","italic":false,"with":[{"translate":"${translation_key}","underlined":true}]}`,
            Lore: [
                `{"translate":"command.kubejs.item_list.parts.lore","color":"gray","italic":false}`
            ]
        },
    };
    let current_slot = 0;
    global.TOOL_PARTS.forEach(item => {
        // console.info(item)
        if (partSupportsMaterial(item, materialId)) {
            let this_item = {Count: NBT.byteTag(1),
                Slot: NBT.intTag(current_slot),
                id: item.id,
                tag: {
                    Material: materialId
                }
            }; // A JSON object representing the item
            new_nbt['BlockEntityTag'].Items.push(this_item);
            current_slot++;
        }
    });
    new_nbt = NBT.compoundTag(new_nbt);
    new_nbt = new_nbt.asString;
    target.runCommand(`give @s tconstruct:part_chest${new_nbt}`);
    return 1;
};

let partSupportsMaterial = (item, materialId) => {
    try {
        let material = MaterialId.tryParse(materialId.split('#')[0]);
        if (material != null) {
            return item.canUseMaterial(material);
        } else {
            console.error(`MaterialId ${materialId} is null`);
            return false;
        }
    } catch (e) {
        console.error(`Error parsing materialId ${materialId} with item ${item}:`);
        console.error(e);
        return false;
    }
};

/**
 * @param {Internal.CommandRegistryEventJS} event
 */
let itemListCommand = (event) => {
    const {commands: Commands, arguments: Arguments} = event;
    return Commands.literal('item_list')
        .then(Commands.literal('parts')
            .then(Commands.argument('materialId', Arguments.STRING.create(event))
                .requires(s => s.hasPermission(2))
                .executes(command => {
                    if (give_part_list(command.source.player, Arguments.STRING.getResult(command, 'materialId'))) {
                        return 1;
                    }
                    return 0;
                })
                .then(Commands.argument('targets', Arguments.PLAYERS.create(event))
                    /**
                     * When the command is run,
                     * it gives the player a Part Chest containing all the Tinkers' parts of the given material.
                     * The command is registered as /give_tconstruct_part_pack <player> <material>.
                     */
                    .requires(s => s.hasPermission(2))
                    .executes(command => {
                        let success = 0;
                        Arguments.PLAYERS.getResult(command, "targets").forEach(player => {
                            success += give_part_list(player, Arguments.STRING.getResult(command, 'materialId'));
                        });
                        return success;
                }))
            )
        );
};

global.Commands.itemListCommand = itemListCommand;