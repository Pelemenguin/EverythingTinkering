/**
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {Internal.BlockContainerJS} blockContainer 
 * @param {Internal.Entity} entity 
 * @param {number} level 
 */
function uncertain(item, blockContainer, entity, level) {
    let entity_facing = entity.facing.toString()
    /** @type {Internal.BlockContainerJS} */
    let newblock = blockContainer[entity_facing]
    if (newblock.blockState.block.id == "minecraft:stone") { // 检测新方块是不是stone
        if (blockContainer.hasTag(new ResourceLocation("kubejs", "uncertain_can_duplicate/stone"))) { // 检测被挖掘的方块是否有标签
            // Direction.ALL.forEach(direction => { // 遍历每个方向
            //     /** @type {Internal.BlockContainerJS} */
            //     let detecting = newblock[direction] // 方便传字符串
            //     if (detecting.blockState.block.)
            // })
            newblock.blockState = blockContainer.blockState // 把石头变为矿石
        }
    }
}