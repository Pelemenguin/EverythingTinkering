const UNCERTAIN_MAX_PROBABILITY = 0.20 // 最大概率
const UNCERTAIN_PROBABILITY_REDUCE = 0.0002 // 每挖掘一格，概率衰减

/**
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {Internal.BlockContainerJS} blockContainer 
 * @param {Internal.Entity} entity 
 * @param {Internal.Level} mclevel 该参数为MC存档，不要与下面的特性等级 `level` 混淆
 * @param {number} level 
 */
function uncertain(item, blockContainer, entity, mclevel, level) {
    let mined_block = 0 // 该工具已挖掘的方块
    try {
        // 试获取 NBT 中储存的挖掘方块数
        mined_block = item.nbt.get("tic_persistent").get("kubejs:uncertain").get("blockMined").asInt
    } catch (e) {
        // 不成功将报错，说明当前该 NBT 标签不存在
        // 在此手动添加一次
        item.nbt.merge({"tic_persistent": {"kubejs:uncertain": {"blockMined": NBT.intTag(0)}}})
    }
    // 概率判定。放在前面是因为若没有判定到就可以直接跳过，避免浪费时间
    if (JavaMath.random() < UNCERTAIN_MAX_PROBABILITY - mined_block * UNCERTAIN_PROBABILITY_REDUCE) {
        let entity_facing = entity.facing.toString()
        /** @type {Internal.BlockContainerJS} */
        let newblock = blockContainer[entity_facing]
        // console.info(newblock.blockState.block.id)
        if (newblock.blockState.block.id == "minecraft:stone") { // 检测新方块是不是stone
            uncertain_work(new ResourceLocation("kubejs", "uncertain_can_duplicate/stone"), newblock, blockContainer)
        } else if (newblock.blockState.block.id == "minecraft:deepslate") { // 深板岩，其余同理
            uncertain_work(new ResourceLocation("kubejs", "uncertain_can_duplicate/deepslate"), newblock, blockContainer)
        }
    }
    item.nbt.get("tic_persistent").get("kubejs:uncertain").putInt("blockMined", mined_block+1)
}

/**
 * @param {Internal.ResourceLocation} tag
 * @param {Internal.BlockContainerJS} newblock
 * @param {Internal.BlockContainerJS} originalBlock
 *
 */
let uncertain_work = function(tag, newblock, originalBlock) {
    if (originalBlock.hasTag(tag)) { // 检测被挖掘的方块是否有标签
        let uncovered = false
        Direction.ALL.forEach(direction => { // 遍历每个方向
            /** @type {Internal.BlockContainerJS} */
            let detecting = newblock[direction] // 方便传字符串
            if (!detecting.blockState.canOcclude()) {
                // console.info(`[Uncertain] ${detecting} is not opaque`)
                uncovered = true // 标记为未覆盖
            }
        })
        if (uncovered) {return}
        newblock.set(originalBlock.blockState.block.id) // 把石头变为矿石
        // console.info('[Uncertain] Placed')
    }
}