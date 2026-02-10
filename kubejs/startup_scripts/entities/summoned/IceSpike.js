/**
 * @fileoverview Ice Spike
 * @author Pelemenguin
 */

/* global
    global: writable
    StartupEvents
    KubeJSDamageSources
    ParticleTypes
    $BlockParticleOption
    Blocks
    console
*/

global.Entities.AiFunctions.IceSpike = {
    /**
     * @param {Internal.Entity} entity 
     */
    tick: (entity) => {
        if (entity.getLevel().isClientSide()) return;
        if (entity.age < 30) {
            entity.getLevel().spawnParticles(new $BlockParticleOption(ParticleTypes.BLOCK, Blocks.PACKED_ICE.defaultBlockState()), false, entity.getX(), entity.getY(), entity.getZ(), 0.1, 0, 0.1, 1, 1);
        } else if (entity.age == 30) {
            /** @type {DamageSource} */
            let damageSource = null;
            let persistent = entity.getForgePersistentData();
            let owner;
            if (persistent != null && persistent.contains("kubejs:ice_spike_owner")) {
                let uuid = persistent.getUUID("kubejs:ice_spike_owner");
                if (uuid != null) {
                    owner = entity.getLevel().getEntities().toArray().find((/** @type {Internal.Entity} */ entity) => entity.getUuid().equals(uuid));
                    if (owner != null) {
                        damageSource = KubeJSDamageSources.iceSpike(entity.getLevel(), entity, owner);
                    }
                }
            }
            if (damageSource == null) damageSource = KubeJSDamageSources.iceSpike(entity.getLevel(), entity);

            entity.getLevel().getEntitiesWithin(entity.getBoundingBox().expandTowards(0, 1, 0)).forEach(e => {
                if (!e.isAttackable()) return;
                if (owner != undefined && e.equals(owner)) return;
                if (e.attack(damageSource, 4)) {
                    const ticksFrozen = e.getTicksFrozen();
                    if (ticksFrozen <= 300) e.setTicksFrozen(ticksFrozen + 200);
                }
            });

            entity.getLevel().spawnParticles(ParticleTypes.SNOWFLAKE, false, entity.getX(), entity.getY() + 1.5, entity.getZ(), 0, 0, 0, 10, 0.1);
        } else if (entity.age >= 40) {
            entity.discard();
        }
    },
    /**
     * @param {Internal.BaseEntityBuilder$AnimationEventJS<Internal.BaseEntityJS>} context 
     */
    animationTick: (context) => {
        if (context.getEntity().age < 25) {
            context.thenPlayAndHold("animation.ice_spike.appear");
        } else {
            context.thenPlay("animation.ice_spike.attack");
        }
        return true;
    },
    /**
     * @param {Internal.Entity} iceSpike
     * @param {Internal.Entity} owner
     */
    setOwner: (iceSpike, owner) => {
        iceSpike.getForgePersistentData().putUUID("kubejs:ice_spike_owner", owner.getUuid());
    },
    /**
     * Summons an Ice Spike entity at the given position.
     * If current position is in air, this method will look for the highest surface below at the same X,Z.
     * The created entity is returned. `null` is returned when no suitable surface is found.  
     * 在给定的位置召唤一个冰刺实体。
     * 如果当前位置在空中，此方法将寻找同一X,Z下方的最高表面。
     * 创建的实体将被返回。当没有找到合适的表面时返回`null`。
     * - - - - -
     * @param {Internal.Level} world
     * The world to create the entity in.  
     * 用于创建实体的世界。
     * @param {BlockPos} targetPos
     * The target position to summon the entity at.  
     * 用于召唤实体的目标位置。
     * @param {Internal.Entity | undefined} owner
     * The owner of the Ice Spike. Can be emitted or `undefined` if you do not want to set an owner.  
     * 冰刺的召唤者。如果不想设置召唤者，可以省略或使用`undefined`。
     * @returns {Internal.Entity | null}
     * The created entity. `null` if cannot find a suitable surface.  
     * 创建的实体。如果找不到合适的表面则返回`null`。
     */
    createIceSpikeAt: (world, targetPos, owner) => {
        let minY = world.getMinBuildHeight();
        let pos = targetPos;
        let block = world.getBlock(pos);
        let surface = -Infinity;
        let lastSurface = block.getBlockState().getCollisionShape(world.getChunkSource().getLevel(), pos.offset(0, 1, 0)).max("y");
        for (;;) {
            surface = block.getBlockState().getCollisionShape(world.getChunkSource().getLevel(), pos).max("y");
            block = block.getDown();
            pos = pos.offset(0, -1, 0);
            if (block.getY() < minY) return null;
            if (surface > 0 && lastSurface <= 0) break;
            lastSurface = surface;
        }
        let created = world.createEntity("kubejs:ice_spike");
        created.setPos(block.getPos().getCenter().add(0, surface + 0.5, 0));
        if (owner != undefined) global.Entities.AiFunctions.IceSpike.setOwner(created, owner);
        world.addFreshEntity(created);
        return created;
    }
};

StartupEvents.registry("minecraft:entity_type", event => {
    event.create("kubejs:ice_spike", "entityjs:nonliving")
        .sized(0.5, 0.5)
        .tick(entity => global.Entities.AiFunctions.IceSpike.tick(entity))
        .addAnimationController("attackController", 0, context => {
            try {
                return global.Entities.AiFunctions.IceSpike.animationTick(context);
            } catch (e) {
                console.error(`Exception occured while ticking Ice Spike animation! ${e}`);
                return false;
            }
        })
    ;
});
