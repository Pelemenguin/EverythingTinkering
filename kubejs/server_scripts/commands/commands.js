// priority: 1000

/**
 * @fileoverview Command | 命令
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    global: writable
    ServerEvents
*/

/**
 * - Contains custom command creator.
 * - 包含自定义指令创建器
 * - - - - -
 * @class
 * @interface
 */
global.Commands = function() {};

ServerEvents.commandRegistry(event => {
    const {commands: Commands} = event;

    event.register(Commands.literal('modpack')
        .then(global.Commands.itemListCommand(event))
        .then(global.Commands.artifactCommand(event))
    );
});