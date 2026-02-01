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

Ponder.registry(event => {
    event.create("kubejs:fluid_infusion_core")
        .scene("fluid_infusion_core", "Fluid Infusion Core", "kubejs:fluid_infusion_core", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
            /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
            let world = scene.getWorld();            

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

            scene.text(60, "... Then four buckets of liquid along the diagonal", [2.5, 1.5, 2.5])
                .attachKeyFrame();

            scene.idle(80);

            scene.text(60, "These fluids can be at most four diagonals away from the core ...", [0.5, 1.5, 0.5])
                .attachKeyFrame();

            scene.idle(20);

            for (let x of [2, 4]) for (let y of [2, 4]) world.hideSection([x, 1, y, x, 1, y], Direction.UP);
            for (let x of [1, 5]) for (let y of [1, 5]) world.showSection([x, 1, y, x, 1, y], Direction.DOWN);

            scene.idle(20);

            for (let x of [1, 5]) for (let y of [1, 5]) world.hideSection([x, 1, y, x, 1, y], Direction.UP);
            for (let x of [0, 6]) for (let y of [0, 6]) world.showSection([x, 1, y, x, 1, y], Direction.DOWN);

            scene.idle(20);

            for (let x of [0, 6]) for (let y of [0, 6]) world.hideSection([x, 1, y, x, 1, y], Direction.UP);
            for (let x of [1, 5]) for (let y of [1, 5]) world.showSection([x, 1, y, x, 1, y], Direction.DOWN);

            scene.idle(20);

            scene.text(60, "... But not allowed to be blocked by solid blocks", [2.5, 1.5, 2.5])
                .colored(PonderPalette.RED)
                .attachKeyFrame();

            world.setBlock([2, 1, 2], Block.getBlock("create:andesite_casing").defaultBlockState(), false);
            world.showSection([2, 1, 2, 2, 1, 2], Direction.DOWN);

            scene.idle(80);

            scene.text(60, "Place the item to be processed onto the Depot ...", [3.5, 2.5, 3.5])
                .attachKeyFrame();

            world.hideSection([2, 1, 2, 2, 1, 2], Direction.UP);

            scene.idle(60);

            scene.showControls(20, [3.5, 2.5, 3.5], PonderPointing.RIGHT)
                .rightClick()
                .withItem(TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:nickel")));

            scene.idle(10);

            world.modifyBlockEntityNBT([3, 2, 3], $DepotBlockEntity, tag => {
                tag.put("HeldItem", NBT.compoundTag({
                    Item: TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:nickel")).serializeNBT(),
                    Pos: NBT.floatTag(0)
                }));
            });

            scene.text(60, "... Then the recipe is started if liquids match the recipe", [3.5, 2.5, 3.5])
                .attachKeyFrame();

            const DIRECTIONS = [
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ];
            
            for (let i = 0; i < 60; i += 5) {
                let horizontal = (60 - i) / 60;
                let vertical = -3 * horizontal * horizontal + horizontal * 1.5 + 1.5;
                horizontal *= 2;

                for (let [dx, dz] of DIRECTIONS) {
                    scene.getParticles().block(20, Blocks.WATER.defaultBlockState(), [3.5, 2.5, 3.5]);
                    scene.getParticles().block(20, Blocks.WATER.defaultBlockState(), [3.5 + dx * horizontal, 1.5 + vertical, 3.5 + dz * horizontal]);
                }

                scene.idle(5);
            }
            
            world.modifyBlockEntityNBT([3, 2, 3], $DepotBlockEntity, tag => {
                tag.remove("HeldItem");
            });

            world.createItemEntity([3.5, 3, 3.5], [0, 0.2, 0], TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse("kubejs:tin")));

            for (let x of [1, 5]) for (let z of [1, 5]) world.setBlock([x, 1, z], Blocks.AIR.defaultBlockState(), false);

            scene.idle(20);

            scene.markAsFinished();
        });
});
