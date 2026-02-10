/**
 * @fileoverview Fluid Infusion Core | 流体注入核心
 * @author Pelemenguin
 */

/* global
    Ponder
    Direction
    PonderPalette
    Block
    $DepotBlockEntity
    NBT
    TinkerToolParts
    $MaterialVariantId
    Blocks
    PonderPointing
*/

(() => {

/**
 * @param {Internal.PonderSceneBuilder} scene
 */
let doParticles = (scene) => {
    for (let i = 0; i < 60; i += 5) {
        let horizontal = (60 - i) / 60;
        let vertical = -3 * horizontal * horizontal + horizontal * 1.5 + 1.5;
        horizontal *= 2;

        for (let dx of [-1, 1]) for (let dz of [-1, 1]) {
            scene.getParticles().dust(10, 0x00FFFF, [3.5, 2.5, 3.5]);
            scene.getParticles().dust(10, 0x00FFFF, [3.5 + dx * horizontal, 1.5 + vertical, 3.5 + dz * horizontal]);
        }

        scene.idle(5);
    }
};

/**
 * @param {Internal.PonderSceneBuilder$PonderWorldInstructions} world 
 * @param {number?} count
 */
let placeInputItem = (world, count) => {
    count = count == undefined ? 1 : count;
    world.modifyBlockEntityNBT([3, 2, 3], $DepotBlockEntity, tag => {
        tag.put("HeldItem", NBT.compoundTag({
            Item: TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:scrapped_tinker_metal")).withCount(count).serializeNBT(),
            Pos: NBT.floatTag(0)
        }));
    });
};

/**
 * @param {Internal.PonderSceneBuilder$PonderWorldInstructions} world 
 * @param {number} oneItemRemains 
 */
let createOutput = (world, oneItemRemains) => {
    world.modifyBlockEntityNBT([3, 2, 3], $DepotBlockEntity, tag => {
        if (oneItemRemains) {
            tag.getCompound("HeldItem").getCompound("Item").putByte("Count", 2);
        } else tag.remove("HeldItem");
    });

    return world.createItemEntity([3.5, 3, 3.5], [0, 0.2, 0], TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:animated_tinker_metal")));
};

Ponder.registry(event => {
    event.create("kubejs:fluid_infusion_core")
        .scene("fluid_infusion_core", "Fluid Infusion Core", "kubejs:fluid_infusion_core/fluid_infusion_core", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
            /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
            let world = scene.getWorld();

            /** @type {Internal.PonderSceneBuilder$PonderOverlayInstructions} */
            let overlay = scene.getOverlay();

            scene.showBasePlate();
            world.showSection([3, 1, 3, 3, 1, 3], Direction.DOWN);

            scene.idle(20);

            world.showSection([3, 2, 3, 3, 2, 3], Direction.DOWN);
            scene.text(60, "Place a Depot on the Fluid Infusion Core ...", [3.5, 2.5, 3.5])
                .attachKeyFrame();

            scene.idle(80);

            for (let x of [2, 4]) {
                for (let y of [2, 4]) {
                    world.showSection([x, 1, y, x, 1, y], Direction.DOWN);
                }
            }

            scene.text(60, "... Then four buckets of liquid along the diagonals", [2.5, 1.5, 2.5])
                .attachKeyFrame();

            scene.idle(80);

            scene.text(60, "These fluids can be at most four diagonals away from the core ...", [0.5, 1.5, 0.5])
                .attachKeyFrame();

            scene.idle(20);

            for (let x of [2, 4]) for (let z of [2, 4]) world.hideSection([x, 1, z, x, 1, z], Direction.UP);
            for (let x of [1, 5]) for (let z of [1, 5]) world.showSection([x, 1, z, x, 1, z], Direction.DOWN);

            scene.idle(20);

            for (let x of [1, 5]) for (let z of [1, 5]) world.hideSection([x, 1, z, x, 1, z], Direction.UP);
            for (let x of [0, 6]) for (let z of [0, 6]) world.showSection([x, 1, z, x, 1, z], Direction.DOWN);

            scene.idle(20);

            for (let x of [0, 6]) for (let z of [0, 6]) world.hideSection([x, 1, z, x, 1, z], Direction.UP);
            for (let x of [-1, 7]) for (let z of [-1, 7]) overlay.showOutline(PonderPalette.BLUE, {}, [x, 1, z, x, 1, z], 20);

            scene.idle(20);

            for (let x of [1, 5]) for (let z of [1, 5]) world.showSection([x, 1, z, x, 1, z], Direction.DOWN);

            scene.idle(20);

            world.setBlock([2, 1, 2], Block.getBlock("create:andesite_casing").defaultBlockState(), false);
            world.showSection([2, 1, 2, 2, 1, 2], Direction.DOWN);

            scene.idle(20);

            // overlay.showOutline(PonderPalette.RED, {}, [2, 1, 2, 2, 1, 2], 60);
            overlay.showOutlineWithText([2, 1, 2, 2, 1, 2], 60)
                .text("... But not allowed to be blocked")
                .colored(PonderPalette.RED)
                .attachKeyFrame();

            scene.idle(80);

            scene.text(60, "Place the item to be processed onto the Depot ...", [3.5, 2.5, 3.5])
                .attachKeyFrame();

            world.hideSection([2, 1, 2, 2, 1, 2], Direction.UP);

            scene.idle(40);

            scene.showControls(20, [3.5, 3, 3.5], PonderPointing.DOWN)
                .rightClick()
                .withItem(TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:scrapped_tinker_metal")));

            scene.idle(10);

            placeInputItem(world);

            scene.idle(20);

            scene.text(60, "... Then the process is started if liquids match the recipe's requirements", [3.5, 2.5, 3.5])
                .attachKeyFrame();

            doParticles(scene);

            createOutput(world);

            for (let x of [1, 5]) for (let z of [1, 5]) world.setBlock([x, 1, z], Blocks.AIR.defaultBlockState(), false);

            scene.idle(20);

            scene.showControls(40, [3.5, 3.5, 3.5], PonderPointing.DOWN)
            .withItem(TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:animated_tinker_metal")));

            scene.idle(40);

            scene.markAsFinished();
        })
        .scene("using_fluid_columns", "Using Fluid Columns", "kubejs:fluid_infusion_core/using_fluid_columns", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
            /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
            let world = scene.getWorld();
            /** @type {Internal.PonderSceneBuilder$PonderOverlayInstructions} */
            let overlay = scene.getOverlay();

            scene.showBasePlate();

            world.showSection([3, 1, 3, 3, 2, 3], Direction.DOWN);
            for (let x of [1, 5]) for (let z of [1, 5]) world.showSection([x, 1, z, x, 1, z], Direction.DOWN);

            scene.idle(20);

            scene.text(60, "Instead of single fluid block ...", [1.5, 1.5, 1.5]);

            scene.idle(60);

            for (let x of [1, 5]) for (let z of [1, 5]) world.showSection([x, 2, z, x, 3, z], Direction.DOWN);

            scene.idle(20);

            overlay.showOutlineWithText([1, 1, 1, 1, 2, 1], 60)
                .text("... We can also use fluid columns")
                .colored(PonderPalette.BLUE)
                .attachKeyFrame();

            overlay.showOutline(PonderPalette.BLUE, {}, [1, 1, 5, 1, 3, 5], 60);
            overlay.showOutline(PonderPalette.BLUE, {}, [5, 1, 1, 5, 3, 1], 60);
            overlay.showOutline(PonderPalette.BLUE, {}, [5, 1, 5, 5, 3, 5], 60);

            scene.idle(80);

            scene.showControls(20, [3.5, 3, 3.5], PonderPointing.DOWN)
                .rightClick()
                .withItem(TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:scrapped_tinker_metal")).withCount(2));

            scene.idle(10);

            placeInputItem(world, 2);

            doParticles(scene);

            createOutput(world, true);

            world.setBlock([1, 2, 1], Blocks.AIR.defaultBlockState(), false);
            world.setBlock([1, 3, 5], Blocks.AIR.defaultBlockState(), false);
            world.setBlock([5, 3, 1], Blocks.AIR.defaultBlockState(), false);
            world.setBlock([5, 3, 5], Blocks.AIR.defaultBlockState(), false);

            overlay.showOutlineWithText([1, 2, 1, 1, 2, 1], 60)
                .text("The fluids at the top of the columns will be consumed")
                .colored(PonderPalette.RED)
                .attachKeyFrame();

            doParticles(scene);

            createOutput(world);

            world.setBlock([1, 1, 1], Blocks.AIR.defaultBlockState(), false);
            world.setBlock([1, 2, 5], Blocks.AIR.defaultBlockState(), false);
            world.setBlock([5, 2, 1], Blocks.AIR.defaultBlockState(), false);
            world.setBlock([5, 2, 5], Blocks.AIR.defaultBlockState(), false);

            scene.idle(10);

            overlay.showOutlineWithText([1, 1, 1, 1, 1, 1], 60)
                .text("Until some of the columns is empty or items are used up")
                .colored(PonderPalette.RED)
                .attachKeyFrame();

            scene.markAsFinished();
        });
});

})();
