// priority: 1000

/** @exports */
var StartupPickaxeToolStack = ToolStack.createTool(
    Item.getItem("tconstruct:pickaxe"),
    TiCToolDefinitions.PICKAXE,
    MaterialNBT.builder()
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "spruce"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "spruce"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "birch"))
        .build()
)
StartupPickaxeToolStack.addModifier(ModifierId.tryBuild("kubejs", "welcome"), 1)
var StartupPickaxe = StartupPickaxeToolStack.createStack()
    .withName(Component.translate("item.kubejs.artifact.startup.pickaxe.name"))
    .withLore([
        Component.translate("item.kubejs.artifact.startup.pickaxe.lore")
    ])
ToolStack.ensureInitialized(StartupPickaxe)
// console.info(StartupPickaxe)