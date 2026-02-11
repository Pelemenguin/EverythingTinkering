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
    AABB
    TinkerToolParts
    $MaterialVariantId
*/

(() => {

Ponder.registry(event => {
    event.create(IngredientHelper.or([
        "tconstruct:seared_melter",
        "tconstruct:seared_heater"
    ])).scene("melting_items_using_seared_melter", "Melting Items using Seared Melter", "kubejs:smeltery/melting_items", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
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

        scene.idle(20);

        world.modifyBlockEntityNBT([2, 1, 2, 2, 1, 2], tag => {
            let itemTag = tag.getCompound("item");
            itemTag.putString("id", "minecraft:coal");
            itemTag.putByte("Count", 1);
        });

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
                        time: NBT.intTag(10),
                        slot: NBT.byteTag(0),
                        required: NBT.intTag(600)
                    }),
                    NBT.compoundTag({
                        temp: NBT.intTag(800),
                        id: NBT.stringTag("minecraft:iron_ingot"),
                        Count: NBT.byteTag(1),
                        time: NBT.intTag(10),
                        slot: NBT.byteTag(1),
                        required: NBT.intTag(600)
                    }),
                    NBT.compoundTag({
                        temp: NBT.intTag(800),
                        id: NBT.stringTag("minecraft:iron_ingot"),
                        Count: NBT.byteTag(1),
                        time: NBT.intTag(10),
                        slot: NBT.byteTag(2),
                        required: NBT.intTag(600)
                    })
                ]));
            tag.putInt("fuel", 60);
            tag.putInt("rate", 8);
        });
        world.modifyBlocks([2, 1, 2, 2, 2, 2], (bp) => bp.with("active", "true"), false);
        particles.simple(100, "minecraft:flame", [2.5, 1.5, 2])
            .delta([0.2, 0.4, 0]);
        particles.simple(100, "minecraft:flame", [2.5, 2.125, 2])
            .delta([0.2, 0.2, 0]);

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
    });

    event.create(IngredientHelper.or([
        "tconstruct:seared_melter",
        "tconstruct:seared_fuel_tank",
        "tconstruct:seared_fuel_gauge",
        "tconstruct:seared_ingot_tank",
        "tconstruct:seared_ingot_gauge"
    ])).scene("melting_items_using_liquid_fuel", "Melting Items using Liquid Fuel", "kubejs:smeltery/melting_items", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
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
            .delta([0.2, 0.2, 0]);

        scene.idle(100);

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

    event.create(IngredientHelper.or([
        "tconstruct:seared_melter",
        "tconstruct:seared_faucet",
        "tconstruct:scorched_faucet"
    ])).scene("moving_fluid_using_faucets", "Moving Fluid using Faucets", "kubejs:smeltery/using_faucets", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {
            /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
            let world = scene.getWorld();
        /** @type {Internal.PonderSceneBuilder$PonderOverlayInstructions} */
        let overlay = scene.getOverlay();

        scene.showBasePlate();
        world.showSection([2, 1, 2, 2, 2, 2], Direction.DOWN);

        overlay.showText(60)
            .text("Now we have Molten Iron in the Seared Melter")
            .pointAt([2.5, 2.5, 2.5]);

        scene.idle(80);

        world.showSection([1, 2, 2, 1, 2, 2], Direction.NORTH);

        scene.idle(20);

        // overlay.showOutlineWithText([1.625, 2.25, 2.25, 2, 2.625, 2.75], 60)
        //     .text("Seared Faucets can be used to move fluid")
        //     .colored(PonderPalette.OUTPUT)
        //     .attachKeyFrame();
        overlay.showText(60)
            .text("Seared Faucets can be used to move fluid")
            .colored(PonderPalette.OUTPUT)
            .attachKeyFrame()
            .pointAt([1.8125, 2.4375, 2.5]);
        overlay.chaseBoundingBoxOutline(PonderPalette.OUTPUT, {}, AABB.of(1.625, 2.25, 2.25, 2, 2.625, 2.75), 60);

        scene.idle(80);

        world.showSection([1, 1, 2, 1, 1, 2], Direction.NORTH);

        scene.idle(20);

        overlay.chaseBoundingBoxOutline(PonderPalette.OUTPUT, {}, AABB.of(1.625, 2.25, 2.25, 2, 2.625, 2.75), 10);
        overlay.showControls([1.625, 2.4375, 2.75], PonderPointing.LEFT, 40)
            .rightClick();

        scene.addLazyKeyframe();

        scene.idle(20);

        world.modifyBlockEntityNBT([2, 2, 2, 2, 2, 2], tag => {
            let tankTag = tag.getCompound("tank");
            tankTag.putInt("Amount", 180);
            tag.put("tank", tankTag);
        });
        world.modifyBlockEntityNBT([1, 2, 2, 1, 2, 2], tag => {
            let renderFluidTag = tag.getCompound("render_fluid");
            renderFluidTag.putString("FluidName", "tconstruct:molten_iron");
            renderFluidTag.putInt("Amount", 90);
            tag.put("render_fluid", renderFluidTag);
            let drainedTag = tag.getCompound("drained");
            drainedTag.putString("FluidName", "tconstruct:molten_iron");
            drainedTag.putInt("Amount", 90);
            tag.put("drained", drainedTag);
            tag.putByte("state", 1);
        });

        // 10mB per tick
        for (let i = 10; i <= 90; i += 10) {
            let j = i;
            scene.idle(1);
            world.modifyBlockEntityNBT([1, 2, 2, 1, 2, 2], tag => {
                let renderFluidTag = tag.getCompound("render_fluid");
                renderFluidTag.putInt("Amount", 90);
                tag.put("render_fluid", renderFluidTag);
                let drainedTag = tag.getCompound("drained");
                drainedTag.putInt("Amount", 90 - j);
                tag.put("drained", drainedTag);
            });
            world.modifyBlockEntityNBT([1, 1, 2, 1, 1, 2], tag => {
                let tankTag = tag.getCompound("tank");
                tankTag.putString("filter", "tconstruct:molten_iron");
                tankTag.putInt("capacity", 90);
                let fluidTag = tankTag.getCompound("fluid");
                fluidTag.putString("FluidName", "tconstruct:molten_iron");
                fluidTag.putInt("Amount", j);
                tankTag.put("fluid", fluidTag);
                tag.put("tank", tankTag);

                tag.putString("recipe", "tconstruct:smeltery/casting/metal/iron/ingot_gold_cast");
                tag.putInt("timer", 0);
            });
        }
        world.modifyBlockEntityNBT([1, 2, 2, 1, 2, 2], tag => {
            tag.remove("render_fluid");
            tag.remove("drained");
            tag.putByte("state", 0);
        });

        scene.idle(60);

        world.modifyBlockEntityNBT([1, 1, 2, 1, 1, 2], tag => {
            tag.remove("recipe");
            tag.remove("timer");
            let tankTag = tag.getCompound("tank");
            tankTag.remove("filter");
            tankTag.remove("fluid");
            tankTag.putInt("capacity", 0);
            let itemTag = tag.getList("Items", 10);
            /** @type {Internal.CompoundTag} */
            let newItem = NBT.compoundTag();
            newItem.putString("id", "minecraft:iron_ingot");
            newItem.putByte("Count", 1);
            newItem.putByte("Slot", 1);
            itemTag.add(newItem);
            tag.put("Items", itemTag);
        });

        scene.idle(20);

        overlay.showControls([1, 1.5, 3], PonderPointing.LEFT, 40)
            .withItem("minecraft:iron_ingot");

        scene.idle(60);

        scene.markAsFinished();
    });

    event.create(IngredientHelper.or([
        "tconstruct:seared_table",
        "tconstruct:seared_basin",
    ])).scene("casting", "Casting", "kubejs:smeltery/casting", (/** @type {Internal.PonderSceneBuilder} */ scene, _util) => {

        scene.configureBasePlate(0, 0, 5);

        /** @type {Internal.PonderSceneBuilder$PonderWorldInstructions} */
        let world = scene.getWorld();
        /** @type {Internal.PonderSceneBuilder$PonderOverlayInstructions} */
        let overlay = scene.getOverlay();

        scene.showBasePlate();

        world.showSection([1, 1, 2, 1, 1, 2], Direction.DOWN);
        world.showSection([3, 1, 2, 3, 1, 2], Direction.DOWN);
        world.showSection([5, 0, 2, 5, 0, 2], Direction.DOWN);

        scene.idle(20);

        overlay.showOutline(PonderPalette.OUTPUT, {}, [1, 1, 2, 1, 1, 2], 60);
        overlay.showOutline(PonderPalette.OUTPUT, {}, [3, 1, 2, 3, 1, 2], 60);

        overlay.showText(60)
            .text("Seared Tables and Basins can be used for casting")
            .pointAt([1.5, 1.5, 2.5])
            .colored(PonderPalette.OUTPUT)
            .attachKeyFrame();

        scene.idle(80);

        world.showSection([2, 1, 2, 2, 1, 2], Direction.DOWN);
        world.showSection([0, 1, 3, 5, 3, 4], Direction.DOWN);

        scene.idle(20);

        overlay.showText(60)
            .text("Fluids can be input from any direction")
            .pointAt([2.5, 1.5, 2.5])
            .attachKeyFrame();

        world.modifyBlockEntityNBT([4, 1, 4], tag => {
            let tankTag = tag.getCompound("TankContent");
            tankTag.putString("FluidName", "tconstruct:molten_iron");
            tankTag.putInt("Amount", 24000);
            tag.put("TankContent", tankTag);
        });

        scene.idle(80);
        overlay.showControls([3.5, 2.5, 2.5], PonderPointing.DOWN, 60)
            .withItem("minecraft:iron_bars");
        scene.addLazyKeyframe();

        scene.idle(20);
        overlay.showOutlineWithText([1, 1, 2, 1, 1, 2], 60)
            .text("Some recipes take a long time to complete ...")
            .pointAt([1.5, 2, 2.5])
            .colored(PonderPalette.RED)
            .attachKeyFrame();
        world.hideSection([4, 1, 4, 4, 3, 4], Direction.SOUTH);

        scene.idle(20);
        world.modifyBlockEntityNBT([4, 1, 4], tag => {
            let tankTag = tag.getCompound("TankContent");
            tankTag.putString("FluidName", "minecraft:empty");
            tankTag.putInt("Amount", 0);
            tag.put("TankContent", tankTag);
        });
        world.showSection([4, 1, 4, 4, 3, 4], Direction.NORTH);

        scene.idle(20);
        world.hideSection([3, 1, 2, 3, 1, 2], Direction.UP);

        scene.idle(20);
        scene.addInstruction(ponderScene => {
            let tableBlockEntity = ponderScene.getWorld().getBlockEntity([3, 1, 2]);
            tableBlockEntity.reset();
        });
        world.showSection([3, 1, 2, 3, 1, 2], Direction.DOWN);

        scene.idle(40);
        overlay.showOutlineWithText([3, 1, 2, 3, 1, 2], 60)
            .text("... While some recipes require a cast")
            .pointAt([3.5, 2, 2.5])
            .colored(PonderPalette.OUTPUT)
            .attachKeyFrame();

        scene.idle(40);
        overlay.showControls([3.5, 2.5, 2.5], PonderPointing.DOWN, 40)
            .rightClick()
            .withItem("tconstruct:pick_head_cast");
        scene.addLazyKeyframe();

        scene.idle(20);
        world.modifyBlockEntityNBT([3, 1, 2], tag => {
            let itemsTag = tag.getList("Items", 10);
            /** @type {Internal.CompoundTag} */
            let newItem = NBT.compoundTag();
            newItem.putString("id", "tconstruct:pick_head_cast");
            newItem.putByte("Count", 1);
            newItem.putByte("Slot", 0);
            itemsTag.add(newItem);
            tag.put("items", itemsTag);
        });

        scene.idle(40);
        world.modifyBlockEntityNBT([4, 1, 4], tag => {
            let tankTag = tag.getCompound("TankContent");
            tankTag.putString("FluidName", "tconstruct:molten_copper");
            tankTag.putInt("Amount", 24000);
            tag.put("TankContent", tankTag);
        });
        
        scene.idle(160);
        overlay.showControls([3.5, 2.5, 2.5], PonderPointing.DOWN, 40)
            .withItem(TinkerToolParts.pickHead.getOrNull().withMaterialForDisplay($MaterialVariantId.parse("tconstruct:copper")));

        scene.markAsFinished();
    });
});

})();
