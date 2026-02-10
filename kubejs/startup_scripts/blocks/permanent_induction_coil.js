/**
 * @fileoverview Induction Coil | 感应线圈
 * @author Pelemenguin
 */

/* global
    global: writable
    StartupEvents
    NBT
    AABB
    Vec3d
*/

/** @type {Internal.BlockEntityCallback_} */
global.BlockFunctions.InductionCoil;

(() => {

const PERMANENT_INDUCTION_COIL_ID = "kubejs:permanent_induction_coil";

global.BlockFunctions.InductionCoil = (be) => {
    let blockDown = be.getBlock().getDown();
    if (blockDown.getBlockState().getBlock().getId() === PERMANENT_INDUCTION_COIL_ID) {
        // Fun fact: KubeJS stores custom be's data in a "data" compound tag
        //           but "getEntityData()" returns the whole persistent data tag
        be.data.putInt("Strength", blockDown.getEntityData().getCompound("data").getInt("Strength") + 1);

        let offset = blockDown.getEntityData().getCompound("data").getFloat("Offset");
        be.data.putFloat("Offset", offset <= -7.5 ? 0.5 : offset - 0.5);
    } else {
        be.data.putInt("Strength", 1);
        be.data.putFloat("Offset", 0.5);
    }
    if (be.data.getFloat("Offset" <= -7.5) || be.getBlock().getUp().getBlockState().getBlock().getId() != PERMANENT_INDUCTION_COIL_ID) {
        // This is where it actually works

        // We produce a magnetic field, anticlockwise when looking from top to bottom
        // Select the entities that are not onGround nearby

        let entities = be.getLevel().getEntitiesWithin(AABB.of(
            be.getBlock().getX() - be.data.getInt("Strength"),
            be.getBlock().getY() + 1,
            be.getBlock().getZ() - be.data.getInt("Strength"),
            be.getBlock().getX() + be.data.getInt("Strength") + 1,
            be.getBlock().getY() + 2 * be.data.getFloat("Offset") - 1,
            be.getBlock().getZ() + be.data.getInt("Strength") + 1
        ));

        // Accelerate entities

        entities.forEach(entity => {
            if (entity.isPlayer() && entity.isCreative() && entity.getAbilities().flying) return;

            let friction_multiplier = entity.onGround() ? 1 : entity.getBlockStateOn().getBlock().getSpeedFactor() * 0.2;

            let relativePos = entity.position().subtract(new Vec3d(
                be.getBlock().getX() + 0.5,
                be.getBlock().getY() + 0.5 + be.data.getFloat("Offset"),
                be.getBlock().getZ() + 0.5
            ));
            let distanceSqr = relativePos.horizontalDistanceSqr();
            if (distanceSqr <= 0) return;
            let strength = be.data.getInt("Strength") * 0.1;
            let magneticInduction = new Vec3d(
                -relativePos.z(),
                0,
                relativePos.x()
            ).normalize().scale(2 * strength * friction_multiplier / (distanceSqr / entity.getBoundingBox().getSize()));

            // VALIDATE! My game has crashed for Infinite speed multiple times :(
            for (let i of [
                magneticInduction.x(),
                magneticInduction.y(),
                magneticInduction.z()
            ]) {
                if (!isFinite(i) || isNaN(i) || i > 100 || i < -100) {
                    return;
                }
            }

            entity.addDeltaMovement(magneticInduction);
        });
    }
};

StartupEvents.registry("minecraft:block", event => {
    event.create(PERMANENT_INDUCTION_COIL_ID)
        .lightLevel(15)
        .blockEntity(be => {
            be.initialData(NBT.compoundTag({
                Strength: NBT.intTag(1),
                Offset: NBT.floatTag(0.5) // In case of coils with different strength
            }));
            be.tick(1, 0, be => global.BlockFunctions.InductionCoil(be));
        })
        .requiresTool()
        .item(item => {
            item.rarity("uncommon");
        })
    ;
});

})();
