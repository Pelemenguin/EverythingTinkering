/**
 * @fileoverview Command | 命令
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    global
    ServerEvents
    NBT
    MaterialId
    console
*/

let toolParts = global.CustomUtils.Tinker.TOOL_PARTS;
let getMantleColor = global.CustomUtils.Tinker.getMantleColor;

ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;
    
    event.register(Commands.literal('modpack')
        .then(Commands.literal('item_list')
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
            )
        )
    );
});

/**
 * Gives the part list to the player
 * 
 * @param {Internal.Player} player 
 * @returns {int}
 */
function give_part_list(target, materialId) {
    let translation_key = `material.${materialId.replace('#', '.').replace(':', '.')}`;
    let material_color = getMantleColor(translation_key);
    let new_nbt = {
        BlockEntityTag: {
            Items: []
        },
        display: {
            Name: `{"translate":"command.kubejs.item_list.parts.name","italic":false,"with":[{"translate":"${translation_key}","color":"${material_color.toString()}","underlined":true}]}`,
            Lore: [
                `{"translate":"command.kubejs.item_list.parts.lore","color":"gray","italic":false}`
            ]
        },
    };
    let current_slot = 0;
    toolParts.forEach(item => {
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
}

function partSupportsMaterial(item, materialId) {
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
}