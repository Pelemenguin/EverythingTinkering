// priority: 1000

let StartupPickaxeToolStack = ToolStack.createTool(
    Item.getItem("tconstruct:pickaxe"),
    TiCToolDefinitions.PICKAXE,
    MaterialNBT.builder()
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "rock"), "stone"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "spruce"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "birch"))
        .build()
)
StartupPickaxeToolStack.addModifier(ModifierId.tryBuild("kubejs", "welcome"), 1)
/** @exports */
var StartupPickaxe = StartupPickaxeToolStack.createStack()
    .withName(Component.translate("item.kubejs.artifact.startup.pickaxe.name"))
    .withLore([
        Component.translate("item.kubejs.artifact.startup.pickaxe.lore")
    ])
ToolStack.ensureInitialized(StartupPickaxe)