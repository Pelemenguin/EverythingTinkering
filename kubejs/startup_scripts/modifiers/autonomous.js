/**
 * @fileoverview Autonomous | 自主
 * - - - - -
 * After attack, the tool can do autonomous damage to nearby entities.  
 * 攻击后，工具可以对附近的实体造成自主伤害。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    AABB
    ToolStats
    Utils
    ParticleTypes
*/

(() => {

// Seed required
const AUTONOMOUS_RANDOM = Utils.newRandom(Math.random() * 2147483647);

ModifierManager.registerCommonModifier("autonomous", "AutonomousModifier", {
    afterMeleeHit: (tool, _modifier, _context) => {
        // Tag "kubejs:autonomous" stands for the duration (in ticks) that the tool can do autonomous damage.
        tool.getPersistentData().putInt("kubejs:autonomous", 100);
    },
    onInventoryTick: (tool, _modifier, world, holder, _itemSlot, _isSelected, _isCorrectSlot, _stack) => {
        if (world.isClientSide()) return;

        let autonomousDuration = tool.getPersistentData().getInt("kubejs:autonomous");
        if (autonomousDuration <= 0) return;

        tool.getPersistentData().putInt("kubejs:autonomous", autonomousDuration - 1);

        let attackSpeed = tool.getStats().get(ToolStats.ATTACK_SPEED);
        let seperation = Math.max(20, Math.floor(40 / attackSpeed));

        // Let's do attack once per second
        if (autonomousDuration % seperation != 0) return;

        let holderPos = holder.position();

        let attackRange;
        try {
            attackRange = holder.getReachDistance();
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            attackRange = 3.0;
        }

        let entities = world.getEntitiesWithin(AABB.of(
            holderPos.x() - attackRange,
            holderPos.y() - attackRange,
            holderPos.z() - attackRange,
            holderPos.x() + attackRange,
            holderPos.y() + attackRange,
            holderPos.z() + attackRange
        ));

        for (let entity of entities) {
            if (entity.equals(holder)) continue;
            if (!entity.isAlive()) continue;
            if (!entity.isAttackable()) continue;

            /** @type {number} */
            let attackDamage = tool.getStats().get(ToolStats.ATTACK_DAMAGE);

            let entityCopy = entity;
            world.getServer().scheduleInTicks(AUTONOMOUS_RANDOM.nextInt(0, 10), () => {
                entityCopy.attack(holder.isPlayer() ? holder.damageSources().playerAttack(holder) : holder.damageSources().mobAttack(holder), attackDamage);
                world.spawnParticles(ParticleTypes.SWEEP_ATTACK, false, entityCopy.getX(), entityCopy.getY() + entityCopy.getEyeHeight(), entityCopy.getZ(), 0, 0, 0, 1, 0);
            });
        }
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});

})();
