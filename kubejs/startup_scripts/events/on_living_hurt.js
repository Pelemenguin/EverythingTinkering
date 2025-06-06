import { whacking } from "../modifiers/whacking";

let getModifiersFromItem = global.getModifiersFromItem

const OFFHAND_ATTACKABLE_MODIFIER = [
    "tconstruct:offhand_attack",
    "tconstruct:dual_wielding"
]

ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", event => {

    console.info(`[LivingHurtEvent] Triggered by ${event.entity}`)
    try {

        if (event.entity.source.actual == null) {return}

        let mainhandItem = event.source.actual.handSlots[0]
        let offhandItem = event.source.actual.handSlots[1]

        if (mainhandItem != null) {
            if (mainhandItem.nbt != null) {
                if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
                    let attacker_weapon_modifiers = getModifiersFromItem(mainhandItem)
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
                console.info(`Item ${offhandItem} is valid for off hand? : ${valid_offhand}`)
                if (valid_offhand) {
                    run_modifiers(event, offhandItem, attacker_weapon_modifiers)
                }
            }
        }
    }
    } catch (e) {
        // console.error("Error occured!")
        // console.error(e)
    }

})

/**
 * 
 * @param {Internal.LivingHurtEvent} event 
 * @param {Internal.ItemStack} item 
 * @param {any} modifiers 
 */
function run_modifiers(event, item, modifiers) {
    if ("kubejs:whacking" in modifiers) {
        whacking(event, item, modifiers["kubejs:whacking"])
    }
}