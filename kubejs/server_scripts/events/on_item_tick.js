PlayerEvents.tick(event => {
    let player = event.player
    player.inventory.allItems.forEach(item => {
        if (item.nbt != null) {
            process_item(event, item)
        }
    })
})

function process_item(event, item) {
    let modifier_data = item.nbt.get("tic_modifiers")
    if (modifier_data == null) {
        return
    }
    var modifiers = {}
    modifier_data.forEach(modifier => {
        let name = modifier.get("name").asString
        let level = modifier.get("level").asInt
        modifiers[name] = level
    })

    // Incompact
    if ("kubejs:incompact" in modifiers) {
        incompact(item, modifiers["kubejs:incompact"])
    }

    // console.info(modifiers)
}

function incompact(item, level) {
    if (item.nbt.get("tic_broken").asInt == 1) {return}
    let chance = level * 0.2
    if (JavaMath.random() < chance) {
        let durability_loss = level + JavaMath.round(level * 2 * JavaMath.random)
        item.damageValue += durability_loss
    }
}