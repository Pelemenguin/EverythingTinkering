/**
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {Internal.BlockContainerJS} blockContainer 
 * @param {Internal.Entity} entity 
 * @param {number} level 
 */
function uncertain(item, blockContainer, entity, level) {
    let entity_facing = entity.facing.toString()
    let newblock = blockContainer[entity_facing]
}