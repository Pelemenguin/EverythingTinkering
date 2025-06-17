from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF41816A",
    "grey": 63
  },
  {
    "color": "FF468974",
    "grey": 102
  },
  {
    "color": "FF5EA496",
    "grey": 140
  },
  {
    "color": "FF79B7AB",
    "grey": 178
  },
  {
    "color": "FF9BCBBF",
    "grey": 216
  },
  {
    "color": "FFBEE2D9",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["rock"])
generator.generate("tconstruct_rock_prismarine", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])