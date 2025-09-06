// priority: 1000

/**
 * @fileoverview Command | 命令
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
    global: writable
    ServerEvents
*/

/**
 * - Contains custom command creator.
 * - 包含自定义指令创建器
 */
global.Commands = {};

ServerEvents.commandRegistry(event => {
    const {commands: Commands} = event;

    event.register(Commands.literal('modpack')
        .then(global.Commands.itemListCommand(event))
        .then(global.Commands.artifactCommand(event))
        .then(global.Commands.rescueCommand(event))
    );
});