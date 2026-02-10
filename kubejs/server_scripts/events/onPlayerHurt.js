/**
 * @author Pelemenguin
 */

/* global
    global: writable
    NativeEvents
    LivingHurtEvent
    NBT
*/

NativeEvents.onEvent(LivingHurtEvent, /** @param {Internal.LivingHurtEvent} event */ event => {
    const KubeJSAiHelper = global.Entities.KubeJSAiHelper;

    const amount = event.getAmount();
    const player = event.getEntity();
    if (!player.isPlayer()) return;

    const playerData = player.getForgePersistentData();

    /** @type {Internal.CompoundTag[]} */
    const challengingBosses = playerData.getList("kubejs:challenging_bosses", 10).toArray();

    const allEntities = player.getLevel().getEntities();
    const toWriteBack = challengingBosses.filter(data => {
        // Get the boss from the world first
        const bossUUID = data.getUUID("UUID");
        const bossEntity = allEntities.filter(e => e.getUuid().equals(bossUUID))[0];

        if (bossEntity == undefined) return false;
        if (!bossEntity.isAlive()) return false;
        if (!KubeJSAiHelper.isTargetOf(player, bossEntity)) return false;

        // Increase DamageTaken field
        KubeJSAiHelper.sendDamageTakenToBoss(bossEntity, player.getUuid(), amount);

        return true;
    });

    // Write back
    playerData.put("kubejs:challenging_bosses", NBT.listTag(toWriteBack));
});
