/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {Internal.Player} player 
 * @param {int} level 
 */
function papercutting(item, player, level) {
    const direction = getRelativeDirection(entity, attacker);
    if (direction === 'front') {
        applyFrontThornsEffect(entity, attacker, event.amount);// 正面荆棘
    } else {
        event.amount *= 1.2;// 背面增加20%伤害
    }
    function getRelativeDirection(player, attacker) {//获取位置
    const playerYaw = player.yRot;
    const dx = attacker.x - player.x;
    const dz = attacker.z - player.z;
    const angleToAttacker = Math.atan2(dz, dx) * (180 / Math.PI);
    }

    function applyFrontThornsEffect(player, attacker, damageAmount) {//荆棘

    const reflectedDamage = damageAmount * (0.3 + Math.random() * 0.2);
    attacker.hurt('thorns', reflectedDamage);
    }
}