TConJSEvents.modifierRegistry(event => {
    event.createNew("kubejs:antifatigue", modifier => {
        modifier.onInventoryTick(
            /**
             * 
             * @param {Internal.IToolStackView} arg0 
             * @param {number} arg1 
             * @param {Internal.Level} arg2 
             * @param {Internal.LivingEntity} arg3 
             * @param {number} arg4 
             * @param {boolean} arg5 
             * @param {boolean} arg6 
             * @param {Internal.ItemStack} arg7 
             */
            (view, lvl, level, entity, slot, inMainHand, inAvailableSlot, itemStack) => {
                // if (!entity.hasEffect) {
                //     return;
                // }
                // let effectLevel = entity.getEffect("minecraft:mining_fatigue");
                // console.info(`[Antifatigue] Effect level: ${effectLevel}`);
                // console.info(`[Antifatigue] Tool level: ${lvl}`);
                // if (effectLevel < lvl) {
                //     entity.removeEffect("minecraft:mining_fatigue");
                // }
                console.info(`[Antifatigue] Ticked. Time ${Utils.systemTime}`)
            }
        );
    });
});