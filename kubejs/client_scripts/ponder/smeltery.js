/**
 * @fileoverview Smeltery Ponder Scenes | 冶炼相关思索场景
 * @author Pelemenguin
 */

/* global
    Ponder
    Direction
    PonderPalette
    PonderPointing
    NBT
    Block
    IngredientHelper
*/

(() => {

Ponder.registry(event => {
    event.create(IngredientHelper.or([
        "tconstruct:seared_melter",
        "tconstruct:seared_heater"
    ]))
        .scene("melting_items_using_seared_melter", "Melting Items using Seared Melter", "kubejs:smeltery/melting_items", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
            /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
            let world = scene.getWorld();
            /** @type {Internal.PonderSceneBuilder$PonderOverlayInstructions} */
            let overlay = scene.getOverlay();
            let particles = scene.getParticles();

            scene.showBasePlate();

            scene.idle(20);

            world.showSection([2, 2, 2, 2, 2, 2], Direction.DOWN);
            overlay.showText(40)
                .text("This is a Seared Melter")
                .colored(PonderPalette.WHITE)
                .pointAt([2.5, 3, 2.5])
                .attachKeyFrame();

            scene.idle(60);

            world.showSection([2, 1, 2, 2, 1, 2], Direction.NORTH);
            overlay.showText(50)
                .text("Place a Seared Heater below it to provide heat")
                .colored(PonderPalette.WHITE)
                .pointAt([2.5, 1, 2.5])
                .attachKeyFrame();

            scene.idle(80);

            scene.showControls(40, [3, 1.5, 2], PonderPointing.RIGHT)
                .withItem("minecraft:coal");
            overlay.showText(60)
                .text("Add fuel to the Seared Heater")
                .colored(PonderPalette.WHITE)
                .pointAt([2.5, 1, 2.5])
                .attachKeyFrame();

            scene.idle(80);
            overlay.showText(60)
                .text("Then add items into the Seared Melter")
                .colored(PonderPalette.WHITE)
                .pointAt([2.5, 3, 2.5])
                .attachKeyFrame();

            scene.idle(40);
            scene.showControls(20, [2.5, 3, 2.5], PonderPointing.DOWN)
                .withItem("minecraft:iron_ingot");

            scene.idle(20);
            world.modifyBlockEntityNBT([2, 2, 2, 2, 2, 2], (tag) => {
                tag.getCompound("inventory")
                    .put("items", NBT.listTag([
                        NBT.compoundTag({
                            temp: NBT.intTag(800),
                            id: NBT.stringTag("minecraft:iron_ingot"),
                            Count: NBT.byteTag(1),
                            time: NBT.intTag(0),
                            slot: NBT.byteTag(0),
                            required: NBT.intTag(600)
                        }),
                        NBT.compoundTag({
                            temp: NBT.intTag(800),
                            id: NBT.stringTag("minecraft:iron_ingot"),
                            Count: NBT.byteTag(1),
                            time: NBT.intTag(0),
                            slot: NBT.byteTag(1),
                            required: NBT.intTag(600)
                        }),
                        NBT.compoundTag({
                            temp: NBT.intTag(800),
                            id: NBT.stringTag("minecraft:iron_ingot"),
                            Count: NBT.byteTag(1),
                            time: NBT.intTag(0),
                            slot: NBT.byteTag(2),
                            required: NBT.intTag(600)
                        })
                    ]));
            });
            world.modifyBlocks([2, 1, 2, 2, 2, 2], (bp) => bp.with("active", "true"), false);
            particles.simple(100, "minecraft:flame", [2.5, 1.5, 2])
                .density(1)
                .delta([0.2, 0.4, 0.2]);
            particles.simple(100, "minecraft:flame", [2.5, 2.125, 2])
                .density(1)
                .delta([0.2, 0.2, 0.2]);

            scene.idle(20);
            overlay.showText(60)
                .text("At most 3 items can be smelted at the same time")
                .colored(PonderPalette.WHITE)
                .pointAt([2.5, 3, 2.5])
                .attachKeyFrame();

            scene.idle(80);

            world.modifyBlockEntityNBT([2, 2, 2, 2, 2, 2], (tag) => {
                tag.getCompound("inventory").remove("items");
                tag.getCompound("tank").putString("FluidName", "tconstruct:molten_iron");
                tag.getCompound("tank").putInt("Amount", 270);
            });
            world.modifyBlocks([2, 1, 2, 2, 2, 2], (bp) => bp.with("active", "false"), false);

            scene.idle(20);
            overlay.showText(60)
                .text("270mB of Molten Iron (3 Ingots)")
                .colored(PonderPalette.RED)
                .pointAt([2.5, 3, 2.5])
                .attachKeyFrame();
            scene.showControls(60, [2.5, 3, 2.5], PonderPointing.DOWN)
                .withItem("tconstruct:molten_iron_bucket");

            scene.idle(80);

            scene.markAsFinished();
        })
    ;

    event.create(IngredientHelper.or([
        "tconstruct:seared_melter",
        "tconstruct:seared_fuel_tank",
        "tconstruct:seared_fuel_gauge",
        "tconstruct:seared_ingot_tank",
        "tconstruct:seared_ingot_gauge"
    ]))
        .scene("melting_items_using_liquid_fuel", "Melting Items using Liquid Fuel", "kubejs:smeltery/melting_items", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
            /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
            let world = scene.getWorld();
            /** @type {Internal.PonderSceneBuilder$PonderOverlayInstructions} */
            let overlay = scene.getOverlay();
            let particles = scene.getParticles();

            scene.showBasePlate();

            world.showSection([2, 1, 2, 2, 2, 2], Direction.DOWN);

            scene.idle(20);

            overlay.showText(60)
                .text("Instead of a Seared Heater ...")
                .pointAt([2.5, 1.5, 2.5])
                .attachKeyFrame();

            scene.idle(40);

            world.hideSection([2, 1, 2, 2, 1, 2], Direction.NORTH);

            scene.idle(20);

            world.setBlock([2, 1, 2], Block.getBlock("tconstruct:seared_fuel_gauge").defaultBlockState(), false);
            world.showSection([2, 1, 2, 2, 1, 2], Direction.NORTH);

            scene.idle(20);

            overlay.showText(60)
                .text("... We can also use a Seared Fuel Gauge ...")
                .pointAt([2.5, 1.5, 2.5])
                .attachKeyFrame();

            scene.idle(40);

            world.hideSection([2, 1, 2, 2, 1, 2], Direction.NORTH);

            scene.idle(20);

            world.setBlock([2, 1, 2], Block.getBlock("tconstruct:seared_fuel_tank").defaultBlockState(), false);
            world.showSection([2, 1, 2, 2, 1, 2], Direction.NORTH);

            scene.idle(20);

            overlay.showText(60)
                .text("... Or a Seared Fuel Tank to provide heat")
                .pointAt([2.5, 1.5, 2.5])
                .attachKeyFrame();

            scene.idle(80);

            overlay.showText(60)
                .text("Tanks accept liquid fuels like Lava")
                .pointAt([2.5, 1.5, 2.5])
                .attachKeyFrame();

            scene.idle(40);

            scene.showControls(20, [3, 1.5, 2], PonderPointing.RIGHT)
                .rightClick()
                .withItem("minecraft:lava_bucket");

            scene.idle(20);
            world.modifyBlockEntityNBT([2, 1, 2, 2, 1, 2], (tag) => {
                let tankTag = tag.getCompound("tank");
                tankTag.putString("FluidName", "minecraft:lava");
                tankTag.putInt("Amount", 1000);
                tag.put("tank", tankTag);
            });

            scene.idle(20);

            scene.showControls(20, [2.5, 3, 2.5], PonderPointing.DOWN)
                .withItem("minecraft:iron_ingot");

            scene.idle(20);
            world.modifyBlockEntityNBT([2, 2, 2, 2, 2, 2], (tag) => {
                tag.getCompound("inventory")
                    .put("items", NBT.listTag([
                        NBT.compoundTag({
                            temp: NBT.intTag(800),
                            id: NBT.stringTag("minecraft:iron_ingot"),
                            Count: NBT.byteTag(1),
                            time: NBT.intTag(0),
                            slot: NBT.byteTag(0),
                            required: NBT.intTag(600)
                        }),
                        NBT.compoundTag({
                            temp: NBT.intTag(800),
                            id: NBT.stringTag("minecraft:iron_ingot"),
                            Count: NBT.byteTag(1),
                            time: NBT.intTag(0),
                            slot: NBT.byteTag(1),
                            required: NBT.intTag(600)
                        }),
                        NBT.compoundTag({
                            temp: NBT.intTag(800),
                            id: NBT.stringTag("minecraft:iron_ingot"),
                            Count: NBT.byteTag(1),
                            time: NBT.intTag(0),
                            slot: NBT.byteTag(2),
                            required: NBT.intTag(600)
                        })
                    ]));
            });
            world.modifyBlocks([2, 1, 2, 2, 2, 2], (bp) => bp.with("active", "true"), false);
            particles.simple(100, "minecraft:flame", [2.5, 2.125, 2])
                .density(1)
                .delta([0.2, 0.2, 0.2]);

            scene.idle(120);

            world.modifyBlockEntityNBT([2, 2, 2, 2, 2, 2], (tag) => {
                tag.getCompound("inventory").remove("items");
                tag.getCompound("tank").putString("FluidName", "tconstruct:molten_iron");
                tag.getCompound("tank").putInt("Amount", 270);
            });
            world.modifyBlocks([2, 2, 2, 2, 2, 2], (bp) => bp.with("active", "false"), false);
            world.modifyBlockEntityNBT([2, 1, 2, 2, 1, 2], (tag) => {
                let tankTag = tag.getCompound("tank");
                tankTag.putInt("Amount", 950);
                tag.put("tank", tankTag);
            });

            scene.idle(20);
            scene.showControls(60, [2.5, 3, 2.5], PonderPointing.DOWN)
                .withItem("tconstruct:molten_iron_bucket");

            scene.idle(80);

            scene.markAsFinished();
        });
});

})();