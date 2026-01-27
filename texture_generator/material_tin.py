from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
from _shared import Palette

palette_tin: Palette = Palette.from_argb_string_palette({
    0: "FF314F6F",
    63: "FF476F81",
    102: "FF517C88",
    140: "FF88A2A7",
    178: "FF90AFAC",
    216: "FFA1C6C2",
    255: "FFBFD8DD"
})

generator = TextureGenerator(parts)
generator.add_function(palette_tin.to_transformer(), "recolor", 0)
generator.set_fallback(["metal"])
generator.generate("kubejs_tin", part_types=[
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
