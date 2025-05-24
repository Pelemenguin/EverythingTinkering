from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import random

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

palette = [
    {
        "color": "FF000000",
        "grey": 0
    },
    {
        "color": "FF1E1013",
        "grey": 63
    },
    {
        "color": "FF30181C",
        "grey": 102
    },
    {
        "color": "FF3E1E24",
        "grey": 140
    },
    {
        "color": "FF49242A",
        "grey": 178
    },
    {
        "color": "FF46262C",
        "grey": 216
    },
    {
        "color": "FF552E34",
        "grey": 255
    }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)

transformer: dict = {
    (62, 30, 36, 255): (55, 25, 32, 255),
    (70, 38, 44, 255): (75, 42, 46, 255)
}
def randomize(pixel: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    random.seed(-2285806386160528611)
    if random.random() < 0.28:
        try: return transformer[pixel]
        except: return pixel
    return pixel

generator.add_function(recolor_function(randomize), "randomize", -1)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_brick_nether", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])