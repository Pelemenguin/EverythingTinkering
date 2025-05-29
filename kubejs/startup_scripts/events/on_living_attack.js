// ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingAttackEvent", event => {

//     console.info(`[LivingAttackEvent] Triggered by ${event.entity}`)
    
//     if (event.source.actual == null) {return}

//     try {
//         let mainhandItem = (event.source.actual.handSlots[0])
//         let offhandItem = (event.source.actual.handSlots[1])

//         if (mainhandItem.nbt != null) {
//             if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
//                 let attacker_weapon_modifier_data = mainhandItem.nbt.get("tic_modifiers")
//                 var attacker_weapon_modifiers = {}
//                 attacker_weapon_modifier_data.forEach(modifier => {
//                     let name = modifier.get("name").asString
//                     let level = modifier.get("level").asInt
//                     attacker_weapon_modifiers[name] = level
//                 })

//                 run_modifiers(event, mainhandItem, attacker_weapon_modifiers)
//             }
//         }

//         if (offhandItem.nbt != null) {
//             if (offhandItem.nbt.get("tic_broken").asInt != 1) {
//                 let attacker_offhand_weapon_modifier_data = offhandItem.nbt.get("tic_modifiers")
//                 let attacker_offhand_weapon_modifiers = {}
//                 let valid_offhand = false
//                 attacker_offhand_weapon_modifier_data.forEach(modifier => {
//                     let name = modifier.get("name").asString
//                     let level = modifier.get("level").asInt
//                     attacker_offhand_weapon_modifiers[name] = level
//                     if (OFFHAND_ATTACKABLE_MODIFIER.indexOf(name) != -1) {
//                         valid_offhand = true
//                     }
//                 })
//                 console.info(valid_offhand)
//                 if (valid_offhand) {
//                     run_modifiers(event, offhandItem, attacker_offhand_weapon_modifiers)
//                 }
//             }
//         }
//     } catch (e) {
//         console.error("Error occured!")
//         console.error(e)
//     }

// })

// /**
//  * 
//  * @param {Internal.LivingAttackEvent} event 
//  * @param {Internal.ItemStack} item 
//  * @param {*} modifiers 
//  */
// function run_modifiers(event, item, modifiers) {
    
// }

