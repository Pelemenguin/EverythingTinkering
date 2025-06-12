// priority: 1000

let StartupHandAxeToolStack = ToolStack.createTool(
    Item.getItem("tconstruct:hand_axe"),
    TiCToolDefinitions.HAND_AXE,
    MaterialNBT.builder()
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "oak"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "spruce"))
        .add(MaterialVariant.of(MaterialId.tryBuild("tconstruct", "wood"), "birch"))
        .build()
)
StartupHandAxeToolStack.addModifier(ModifierId.tryBuild("kubejs", "welcome"), 1)
/** @exports */
var StartupHandAxe = StartupHandAxeToolStack.createStack()
    .withName(Component.translate("item.kubejs.artifact.startup.hand_axe.name"))
    .withLore([
        Component.translate("item.kubejs.artifact.startup.hand_axe.lore")
    ])