from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
    {
        "color": "FF000000",
        "grey": 0
    },
    {
        "color": "FF2A4C0D",
        "grey": 63
    },
    {
        "color": "FF3B6318",
        "grey": 102
    },
    {
        "color": "FF47821E",
        "grey": 140
    },
    {
        "color": "FF60A028",
        "grey": 178
    },
    {
        "color": "FF7CCC35",
        "grey": 216
    },
    {
        "color": "FF97F544",
        "grey": 255
    }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["wood"])
generator.generate("kuebjs_sugar_cane", part_types=["tconstruct:handle", "tconstruct:repair_kit"])