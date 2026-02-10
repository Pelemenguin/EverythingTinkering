/**
 * @fileoverview Artifact Tab | Artifact 创造模式标签页
 * @author Pelemenguin
 */

/* global
    StartupEvents
    global
*/

StartupEvents.registry("minecraft:creative_mode_tab", event => {
    event.create("kubejs:artifacts")
        .icon(() => {
            // Return random Artifact
            let artifacts = global.Artifacts.getAllArtifacts();
            if (artifacts.length === 0) {
                return "minecraft:barrier";
            }
            let randomIndex = Math.floor(Math.random() * artifacts.length);
            return artifacts[randomIndex];
        })
        .content(() => global.Artifacts.getAllArtifacts())
    ;
});
