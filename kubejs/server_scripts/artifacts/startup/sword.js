// priority: 1000

let StartupSwordToolStack = ToolStack.createTool(
    Item.getItem("tconstruct:sword"),
    TiCToolDefinitions.SWORD,
    MaterialNBT.builder()
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "oak"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "dark_oak"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "rock"), "stone"))
        .build()
)
StartupSwordToolStack.addModifier(ModifierId.tryBuild("kubejs", "welcome"), 1)
/** @exports */
var StartupSword = StartupSwordToolStack.createStack()
    .withName(Component.translate("item.kubejs.artifact.startup.sword.name"))
    .withLore([
        Component.translate("item.kubejs.artifact.startup.sword.lore")
    ])