from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF878787",
    "grey": 63
  },
  {
    "color": "FFAEAEAE",
    "grey": 102
  },
  {
    "color": "FFC1C1C1",
    "grey": 140
  },
  {
    "color": "FFE9EAEB",
    "grey": 178
  },
  {
    "color": "FFFCFCF2",
    "grey": 216
  },
  {
    "color": "FFFCFCF2",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_paper", part_types=["tconstruct:maille", "tconstruct:armor_maille"])
