// import { getModifiersFromItem } from "../../startup_scripts/globals";
import { relaying } from "../modifiers/relaying"
import { glass_shard } from "../modifiers/glass_shard"

let getModifiersFromItem = global.getModifiersFromItem

const OFFHAND_ATTACKABLE_MODIFIER = [
    "tconstruct:offhand_attack",
    "tconstruct:dual_wielding"
]

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
                run_modifiers(event, mainhandItem, attacker_weapon_modifiers)
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
                    run_modifiers(event, offhandItem, attacker_weapon_modifiers)
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
function run_modifiers(event, item, attacker_weapon_modifiers) {

    // Relaying
    if ("kubejs:relaying" in attacker_weapon_modifiers) {
        relaying(event, attacker_weapon_modifiers["kubejs:relaying"])
    }

    // Glass Shard
    if ("kubejs:glass_shard" in attacker_weapon_modifiers) {
        glass_shard(event, item, attacker_weapon_modifiers["kubejs:glass_shard"])
    }

    // Igniting
    if ("kubejs:igniting" in attacker_weapon_modifiers) {
        igniting_trigger(item, event.entity, attacker_weapon_modifiers["kubejs:igniting"])
    }

}

const IGNITING_FIRE_PERCENTAGE_PER_LEVEL = 0.25

/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {Internal.LivingEntity} target 
 * @param {int} level 
 */
function igniting_trigger(item, target, level) {

    // Get or set fire time
    console.info("[Igniting] Triggered!")
    /** @type {Internal.CompoundTag} */
    let persistent_data = NBT.compoundTag()
    try {
        persistent_data = item.nbt.get("tic_persistent")
    } catch (e) {}
    if (!persistent_data.contains("kubejs:igniting")) {
        persistent_data.put("kubejs:igniting", NBT.compoundTag())
    }
    /** @type {Internal.CompoundTag} */
    let trait_tag = persistent_data.get("kubejs:igniting")
    let fire_time = target.getRemainingFireTicks()
    if (!trait_tag.contains("fire")) {
        trait_tag.putInt("fire", 0)
        console.info(`[Igniting] "fire" tag does not exist. Created.`)
    }
    let tool_fire_time = trait_tag.get("fire")
    console.info(`[Igniting] Tool's fire time is ${tool_fire_time}`)
    console.info(`[Igniting] Target's fire time is ${fire_time}`)
    if (tool_fire_time > fire_time) {
        let applied_time = tool_fire_time * IGNITING_FIRE_PERCENTAGE_PER_LEVEL * level
        console.info(`[Igniting] Set target's fire time to ${applied_time}`)
        target.remainingFireTicks = JavaMath.round(applied_time)
        target.playSound("entity.generic.burn")
    } else {
        console.info(`[Igniting] Set tool's fire time to ${fire_time}`)
        trait_tag.putInt("fire", fire_time)
        target.playSound("entity.generic.burn")
    }

}