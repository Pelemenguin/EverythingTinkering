from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF2d1610",
    "grey": 63
  },
  {
    "color": "FF492319",
    "grey": 102
  },
  {
    "color": "FF7f3e2c",
    "grey": 140
  },
  {
    "color": "FF8e4631",
    "grey": 178
  },
  {
    "color": "FFb75a40",
    "grey": 216
  },
  {
    "color": "FFc76245",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_brick", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])