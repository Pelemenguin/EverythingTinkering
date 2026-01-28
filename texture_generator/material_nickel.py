from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
from _shared import Palette

palette_nickel: Palette = Palette.from_argb_string_palette({
    0: "FF000000",
    63: "FF734C3B",
    102: "FF866444",
    140: "FFA28960",
    178: "FFB0A075",
    216: "FFC7B784",
    255: "FFF9F5AB"
})

generator = TextureGenerator(parts)
generator.add_function(palette_nickel.to_transformer(), "recolor", 0)
generator.set_fallback(["metal"])
generator.generate("kubejs_nickel", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit",
    "tconstruct:armor_plating",
    "tconstruct:plating_helmet",
    "tconstruct:plating_chestplate",
    "tconstruct:plating_leggings",
    "tconstruct:plating_boots",
    "tconstruct:plating_shield",
    "tconstruct:maille",
    "tconstruct:armor_maille",
    "tconstruct:limb",
    "tconstruct:grip"
])
