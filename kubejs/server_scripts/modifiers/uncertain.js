/**
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {Internal.BlockContainerJS} blockContainer 
 * @param {Internal.Entity} entity 
 * @param {Internal.Level} mclevel 该参数为MC存档，不要与下面的特性等级 `level` 混淆
 * @param {number} level 
 */
function uncertain(item, blockContainer, entity, mclevel, level) {
    let entity_facing = entity.facing.toString()
    /** @type {Internal.BlockContainerJS} */
    let newblock = blockContainer[entity_facing]
    if (newblock.blockState.block.id == "minecraft:stone") { // 检测新方块是不是stone
        if (blockContainer.hasTag(new ResourceLocation("kubejs", "uncertain_can_duplicate/stone"))) { // 检测被挖掘的方块是否有标签
            let uncovered = false
            Direction.ALL.forEach(direction => { // 遍历每个方向
                /** @type {Internal.BlockContainerJS} */
                let detecting = newblock[direction] // 方便传字符串
                if (!detecting.blockState.canOcclude()) {
                    console.info(`[Uncertain] ${detecting} is not opaque`)
                    uncovered = true // 标记为未覆盖
                }
            })
            if (uncovered) {return}
            // newblock.blockState = blockContainer.blockState // 把石头变为矿石
            // mclevel.setBlockAndUpdate(newblock.getPos, blockContainer.getBlockState())
            // newblock.setBlockState(blockContainer.getBlockState())
            newblock.set(blockContainer.blockState.block.id)
            console.info('[Uncertain] Placed')
        }
    }
}