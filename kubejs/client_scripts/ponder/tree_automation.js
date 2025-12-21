/* global
    Ponder
    Block
    Blocks
*/

Ponder.registry(event => {
    event.create("minecraft:barrier").scene("kubejs:tree_automation", "Tree Automation Example", "kubejs:automation/tree", (scene, _util) => {

        /** @type {Internal.MechanicalBearingBlock} */
        const MECHANICAL_BEARING = Block.getBlock("create:mechanical_bearing");

        scene.showStructure();

        scene.idle(20);

        for (let x = 1; x < 8; x++) for (let z = 1; z < 8; z++) {
            scene.world.destroyBlock([x, 0, z]);
            scene.idle(1);
            scene.world.setBlock([x, 0, z], Blocks.GRASS_BLOCK.defaultBlockState(), true);
        }

        scene.idle(10);

        scene.world.setBlock([4, 0, 4], MECHANICAL_BEARING.defaultBlockState(), true);

        scene.markAsFinished();
    });
});