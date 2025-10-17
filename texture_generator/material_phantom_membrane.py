from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
    {
        "color": "FF000000",
        "grey": 0
    },
    {
        "color": "FF6F516C",
        "grey": 63
    },
    {
        "color": "FF826D72",
        "grey": 102
    },
    {
        "color": "FF958C79",
        "grey": 140
    },
    {
        "color": "FFC3B9A1",
        "grey": 178
    },
    {
        "color": "FFDCD9C0",
        "grey": 216
    },
    {
        "color": "FFEAE9E3",
        "grey": 255
    }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_phantom_membrane", part_types=["tconstruct:maille", "tconstruct:armor_maille"])
