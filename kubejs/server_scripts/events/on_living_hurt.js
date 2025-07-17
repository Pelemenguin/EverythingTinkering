import { whacking } from "../modifiers/whacking";

let getModifiersFromItem = global.getModifiersFromItem

// console.info(LivingHurtEvent)
NativeEvents.onEvent(LivingHurtEvent, event => {
    check_attacker(event)
    check_entity(event)
})

let check_attacker = event => {
    
    // console.info(LivingHurtEvent)
    // console.info(`[LivingHurtEvent] Triggered by ${event.entity}`)
    // console.info(event.source.actual)
    if (event.source.actual == null) {return}

    let mainhandItem = event.source.actual.handSlots[0]
    let offhandItem = event.source.actual.handSlots[1]

    if (mainhandItem != null) {
        if (mainhandItem.nbt != null) {
            if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
                let attacker_weapon_modifiers = getModifiersFromItem(mainhandItem)
                // console.info(event)
                run_modifiers(event, mainhandItem, attacker_weapon_modifiers)
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
                    run_modifiers(event, offhandItem, attacker_weapon_modifiers)
                }
            }
        }
    }
    
}

/**
 * @param {Internal.LivingHurtEvent} event
 */
let check_entity = event => {
    if (event.entity == null) return;
    
    let armors = event.entity.armorSlots;
    armors.forEach(armor => {
        if (armor == null) {
            return;
        }
        console.log(`Armor ID:${armor.id}`)
        console.log(`Armor NBT:${armor.nbt}`)
    });
};



/**
 * 
 * @param {Internal.LivingHurtEvent} event 
 * @param {Internal.ItemStack} item 
 * @param {any} modifiers 
 */
let run_modifiers = function(event, item, modifiers) {
    // console.info(event)
    if ("kubejs:pottery" in modifiers) {
        pottery(event, item, modifiers["kubejs:pottery"])
    }
    
}