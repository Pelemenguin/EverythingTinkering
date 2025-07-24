// import { getModifiersFromItem } from "../../startup_scripts/globals";
import { relaying } from "../modifiers/relaying"
// import { glass_shard } from "../modifiers/glass_shard"
import { igniting_trigger } from "../modifiers/igniting"

let getModifiersFromItem = global.getModifiersFromItem

EntityEvents.hurt(event => {
    checkAttackerModifier(event) // Check and run attacker's modifiers
})

/**
 * 
 * @param {Internal.LivingEntityHurtEventJS} event 
 */
function checkAttackerModifier (event) {
    if (event.source.actual == null) {return}

    let mainhandItem = event.source.actual.handSlots[0];
    if (mainhandItem != null) {
        if (mainhandItem.nbt != null) {
            if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
                let attacker_weapon_modifiers = getModifiersFromItem(mainhandItem)
                run_modifiers_on_entity_hurt(event, mainhandItem, attacker_weapon_modifiers)
            }
        }
    }

    let offhandItem = event.source.actual.handSlots[1]
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
                    run_modifiers_on_entity_hurt(event, offhandItem, attacker_weapon_modifiers)
                }
            }
        }
    }
}

/**
 * 
 * @param {Internal.LivingEntityHurtEventJS} event 
 * @param {Internal.ItemStack} item 
 * @param {*} attacker_weapon_modifiers 
 */
let run_modifiers_on_entity_hurt = function(event, item, attacker_weapon_modifiers) {

    // Relaying
    if ("kubejs:relaying" in attacker_weapon_modifiers) {
        relaying(event, attacker_weapon_modifiers["kubejs:relaying"])
    }

    // Glass Shard
    if ("kubejs:glass_shard" in attacker_weapon_modifiers) {
        // glass_shard(event, item, attacker_weapon_modifiers["kubejs:glass_shard"])
    }

    // Igniting
    if ("kubejs:igniting" in attacker_weapon_modifiers) {
        igniting_trigger(item, event.entity, attacker_weapon_modifiers["kubejs:igniting"])
    }

}