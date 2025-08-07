/**
 * @fileoverview /modpack artifact
 * - - - - -
 * - Give players artifact.
 * - 给予玩家 Artifact。
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
    Component
    ArtifactGroup
*/

/**
 * - Give the artifact to a player.
 * - 给予玩家对应的 Artifact。
 * - - - - -
 * @typedef {"SUCCESS" | "IS_GROUP" | "NOT_FOUND"} Annotation.Command.ArtifactResult
 * - - - - -
 * @param {Internal.CommandSourceStack_} source
 * @param {Internal.Player} player 
 * @param {string} artifact 
 * @param {number} count
 * - - - - -
 * @returns {Annotation.Command.ArtifactResult}
 */
let give_artifact = (source, player, artifactName, count) => {
    let artifact = global.Artifacts.getRecursive(artifactName);
    if (artifact instanceof ArtifactGroup) {
        source.sendFailure(Component.translatable("command.kubejs.artifact.is_group", artifactName).red());
        groupList(artifact).forEach(component => {
            source.player.sendSystemMessage(component.red());
        });
        return "IS_GROUP";
    }
    else if (artifact == null) {
        source.sendFailure(Component.translatable("command.kubejs.artifact.not_found", artifactName).red());
        return "NOT_FOUND";
    }
    let stack = artifact.createStack(count || 1);
    player.give(stack);
    return "SUCCESS";
};

/**
 * - Show the player the content of an artifact group.
 * - 向玩家展示一个 Artifact 组的内容。
 * - - - - -
 * @param {Internal.Player} player 
 * @param {ArtifactGroup} group 
 * @param {boolean} error
 * - - - - -
 * @returns {Internal.MutableComponent[]}
 */
let groupList = (group) => {
    let result = [];
    group.children.forEach((name, instance) => {
        let component = Component.literal(`- ${name}`);
        if (instance instanceof ArtifactGroup) {
            component = Component.translatable("command.kubejs.artifact.group_mark").append(Component.literal(' ')).append(component);
        }
        result.push(component);
    });
    return result;
};

/**
 * 
 * @param {Internal.CommandSourceStack} source 
 * @param {Internal.Player[]} targets 
 * @param {string} artifactPath 
 * @param {number} count 
 */
let artifactRun = (source, targets, artifactPath, count) => {
    let success = 0;
    for (let i = 0; i < targets.length; i++) {
        let player = targets[i];
        let result = give_artifact(source, player, artifactPath, count);
        switch (result) {
            case "SUCCESS": success++; break;
            case "IS_GROUP": return 0;
            case "NOT_FOUND": return 0;
        }
    }
    let print_count = count;
    let print_success = success;
    try {
        print_success = success.toFixed();
        print_count = count.toFixed();
    // eslint-disable-next-line no-unused-vars
    } catch (e) { /* Do nothing */ }
    source.sendSuccess(Component.translatable("command.kubejs.artifact.success", artifactPath, print_count, print_success), true);
    return success;
};

/**
 * 
 * @param {Internal.CommandRegistryEventJS} event 
 * @returns 
 */
let artifactCommand = (event) => {
    const {commands: Commands, arguments: Arguments} = event;
    return Commands.literal('artifact')
        .then(Commands.literal('give')
            .then(Commands.argument('artifactPath', Arguments.STRING.create(event))
                .requires(s => s.hasPermission(2))
                .executes(command => artifactRun(command.source, [command.source.player], Arguments.STRING.getResult(command, 'artifactPath'), 1))
                .then(Commands.argument('targets', Arguments.PLAYERS.create(event))
                    .requires(s => s.hasPermission(2))
                    .executes(command => artifactRun(command.source, Arguments.PLAYERS.getResult(command, 'targets'), Arguments.STRING.getResult(command, 'artifactPath'), 1))
                    .then(Commands.argument('count', Arguments.INTEGER.create(event))
                        .requires(s => s.hasPermission(2))
                        .executes(command => artifactRun(command.source, Arguments.PLAYERS.getResult(command, 'targets'), Arguments.STRING.getResult(command, 'artifactPath'), Arguments.INTEGER.getResult(command, 'count')))
                    )
                )
            )
        );
};

global.Commands.artifactCommand = artifactCommand;