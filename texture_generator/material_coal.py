import random

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

random.seed(1928615854)

# palette1 = [
#   {
#     "color": "FF000000",
#     "grey": 0
#   },
#   {
#     "color": "FF13110D",
#     "grey": 63
#   },
#   {
#     "color": "FF1D1A14",
#     "grey": 102
#   },
#   {
#     "color": "FF1D1A14",
#     "grey": 140
#   },
#   {
#     "color": "FF1D1A14",
#     "grey": 178
#   },
#   {
#     "color": "FF231F18",
#     "grey": 216
#   },
#   {
#     "color": "FF2B261D",
#     "grey": 255
#   }
# ]

# palette2 = [
#   {
#     "color": "FF000000",
#     "grey": 0
#   },
#   {
#     "color": "FF1D1A14",
#     "grey": 63
#   },
#   {
#     "color": "FF312B22",
#     "grey": 102
#   },
#   {
#     "color": "FF423B2F",
#     "grey": 140
#   },
#   {
#     "color": "FF423B2F",
#     "grey": 178
#   },
#   {
#     "color": "FF605543",
#     "grey": 216
#   },
#   {
#     "color": "FF7D6F58",
#     "grey": 255
#   }
# ]

# processed_palette1 = convert_palette(palette1)
# processed_palette2 = convert_palette(palette2)

# generator = TextureGenerator(parts)
# subgenerator = SubTextureGenerator(generator, (lambda i: random.random() < 0.0625), 10)
# subgenerator.add_function(grayscale_colorize_function(processed_palette2, True), "subrecolor", 0)
# generator.add_function(grayscale_colorize_function(processed_palette1, True), "recolor", 0)
# generator.set_fallback(["nonmetal"])
# generator.generate("kubejs_coal_charcoal", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

# print()

# generator = TextureGenerator(parts)

# def charcoalize