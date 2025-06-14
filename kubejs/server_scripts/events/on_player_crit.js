let getModifiersFromItem = global.getModifiersFromItem

NativeEvents.onEvent(CriticalHitEvent, event => {
    let player = event.getEntity()
    let mainhandItem = player.handSlots[0]
    let offhandItem = player.handSlots[1]

    if (mainhandItem != null) {
        if (mainhandItem.nbt != null) {
            if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
                let attacker_weapon_modifiers = getModifiersFromItem(mainhandItem)
                // console.info(event)
                run_modifiers_on_crit(event, mainhandItem, attacker_weapon_modifiers)
            }
        }
    }

    if (offhandItem != null) {
        if (offhandItem.nbt != null) {
            if (offhandItem.nbt.get("tic_broken").asInt != 1) {
                let valid_offhand = false
                let attacker_weapon_modifiers = getModifiersFromItem(offhandItem)
                Object.keys(attacker_weapon_modifiers).forEach(element => {
                    if (OFFHAND_ATTACKABLE_MODIFIER.indexOf(element) >= 0) {
                        valid_offhand = true
                    }
                });
                // console.info(`Item ${offhandItem} is valid for off hand? : ${valid_offhand}`)
                if (valid_offhand) {
                    run_modifiers_on_crit(event, offhandItem, attacker_weapon_modifiers)
                }
            }
        }
    }
})

let run_modifiers_on_crit = function(event, item, modifiers) {
    
    // console.info(event)
    let isCritical = (event.getOldDamageModifier() >= 1.5)
    // Whacking
    if ("kubejs:whacking" in modifiers) {
        whacking(event, isCritical, modifiers["kubejs:whacking"])
    }
    
}