KubeJSFluid.create("molten_sea_alloy", {
    temperature: 1400,
    lightLevel: 15,
    stillTexture: "kubejs:fluid/molten/alloy/sea_alloy/still",
    flowingTexture: "kubejs:fluid/molten/alloy/sea_alloy/flowing",
    presets: [
        new KubeJSFluid.Presets.Hot({
            burnTime: 10,
            damage: 6
        })
    ]
});