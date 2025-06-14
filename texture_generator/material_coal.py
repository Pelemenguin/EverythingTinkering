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

# palette = {
    # 0: [(0, 0, 0, 0)],
    # 63: [(35, 31, 24, 255), (19, 17, 13, 255)],
    # 102: [(29, 26, 20, 255)]*8 + [(43, 28, 29, 255)],
    # 140: [(29, 26, 20, 255)]*16 + [(35, 31, 24, 255), (66, 59, 47, 255)],
    # 178: [(29, 26, 20, 255)]*16 + [(43, 38, 29, 255), (35, 31, 24, 255)],
    # 216: [(43, 38, 29, 255)]*16 + [(66, 59, 47, 255), (78, 69, 54, 255)],
    # 255: [(66, 59, 47, 255)]*8 + [(125, 111, 88, 255), (96, 85, 67, 255)]
# }

# @recolor_function
# def charcoalize(input_pixel) -> tuple:
    # processed = sorted(palette, reverse=True)
    # if input_pixel == (0, 0, 0, 0):
        # return (0, 0, 0, 0)
    # try:
        # return transformation[input_pixel[1]]
    # except:
        # for k in processed:
            # if input_pixel[1] >= k:
                # return random.choice(palette[k])
    # return (0, 0, 0, 0)

generator = TextureGenerator(parts)
generator.add_function(multiply(PIL.Image.open("composites/charcoal_generator.png"), 1.2), "recolor", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_coal_charcoal", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])