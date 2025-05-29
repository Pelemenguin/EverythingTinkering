import { whacking } from "../modifiers/whacking";

const OFFHAND_ATTACKABLE_MODIFIER = [
    "tconstruct:offhand_attack",
    "tconstruct:dual_wielding"
]

ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", event => {

    console.info(`[LivingHurtEvent] Triggered by ${event.entity}`)
    try {

        if (event.entity.source.actual == null) {return}

        let mainhandItem = (event.source.actual.handSlots[0])
        let offhandItem = (event.source.actual.handSlots[1])

        if (mainhandItem.nbt != null) {
            if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
                let attacker_weapon_modifier_data = mainhandItem.nbt.get("tic_modifiers")
                var attacker_weapon_modifiers = {}
                attacker_weapon_modifier_data.forEach(modifier => {
                    let name = modifier.get("name").asString
                    let level = modifier.get("level").asInt
                    attacker_weapon_modifiers[name] = level
                })

                run_modifiers(event, mainhandItem, attacker_weapon_modifiers)
            }
        }

        if (offhandItem.nbt != null) {
        if (offhandItem.nbt.get("tic_broken").asInt != 1) {
            let attacker_offhand_weapon_modifier_data = offhandItem.nbt.get("tic_modifiers")
            let attacker_offhand_weapon_modifiers = {}
            let valid_offhand = false
            attacker_offhand_weapon_modifier_data.forEach(modifier => {
                let name = modifier.get("name").asString
                let level = modifier.get("level").asInt
                attacker_offhand_weapon_modifiers[name] = level
                if (OFFHAND_ATTACKABLE_MODIFIER.indexOf(name) != -1) {
                    valid_offhand = true
                }
            })
            console.info(valid_offhand)
            if (valid_offhand) {
                run_modifiers(event, offhandItem, attacker_offhand_weapon_modifiers)
            }
        }
    }
    } catch (e) {
        console.error("Error occured!")
        console.error(e)
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