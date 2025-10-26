// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview /modpack rescue  
 * 用于整合包开发时的紧急情况。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    Component
*/

/**
 * 
 * @param {Internal.CommandRegistryEventJS} event 
 * @returns 
 */
let rescue = (event) => {
    const {commands: Commands} = event;
    return Commands.literal('rescue')
        .then(Commands.literal('healthNaN')
            .requires(s => s.hasPermission(4))
            .executes(command => {
                let player = command.source.player;
                if (!Number.isNaN(player.health)) {
                    command.source.sendFailure(Component.translatable("command.kubejs.rescue.not_nan"));
                    return 0;
                }
                player.setHealth(0);
                command.source.sendSuccess(Component.translatable("command.kubejs.rescue.success"), true);
                return 1;
            })
        );
};

global.Commands.rescueCommand = rescue;