from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF2b3635",
    "grey": 63
  },
  {
    "color": "FF4a5451",
    "grey": 102
  },
  {
    "color": "FF5e6963",
    "grey": 140
  },
  {
    "color": "FF829789",
    "grey": 178
  },
  {
    "color": "FFa9afa1",
    "grey": 216
  },
  {
    "color": "FFe6e6db",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["rock"])
generator.generate("kubejs_andesite_alloy", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])