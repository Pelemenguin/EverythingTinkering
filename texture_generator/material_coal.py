from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF101015",
    "grey": 63
  },
  {
    "color": "FF1C1C1E",
    "grey": 102
  },
  {
    "color": "FF1F1721",
    "grey": 140
  },
  {
    "color": "FF252525",
    "grey": 178
  },
  {
    "color": "FF323232",
    "grey": 216
  },
  {
    "color": "FF393E46",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_coal", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])