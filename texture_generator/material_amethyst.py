from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF54398A",
    "grey": 63
  },
  {
    "color": "FF6F4FAB",
    "grey": 102
  },
  {
    "color": "FF8D6ACC",
    "grey": 140
  },
  {
    "color": "FFB38EF3",
    "grey": 178
  },
  {
    "color": "FFCFA0F3",
    "grey": 216
  },
  {
    "color": "FFFECBE6",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

def vertical_recolor(image: PIL.Image.Image):
    for x in (6, 7, 8, 10):
        for y in range(16):
            match (image.getpixel((x, y))):
                case (0, 0, 0, 255): image.putpixel((x, y), (63, 63, 63, 255))
                case (63, 63, 63, 255): image.putpixel((x, y), (102, 102, 102, 255))
                case (102, 102, 102, 255): image.putpixel((x, y), (140, 140, 140, 255))
                case (140, 140, 140, 255): image.putpixel((x, y), (178, 178, 178, 255))
                case (178, 178, 178, 255): image.putpixel((x, y), (216, 216, 216, 255))
                case (216, 216, 216, 255): image.putpixel((x, y), (255, 255, 255, 255))
    return image

generator = TextureGenerator(parts)
generator.add_function(vertical_recolor)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal", "metal"])
generator.generate("kubejs_amethyst", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])
