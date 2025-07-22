KubeJSFluid.create("molten_sea_alloy", {
    temperature: 1400,
    lightLevel: 15,
    presets: [
        new KubeJSFluid.Presets.Hot({
            burnTime: 10,
            damage: 6
        })
    ]
});