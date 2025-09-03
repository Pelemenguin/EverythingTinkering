from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image
import PIL.ImageFilter

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF720000",
    "grey": 63
  },
  {
    "color": "FF410500",
    "grey": 102
  },
  {
    "color": "FF410500",
    "grey": 140
  },
  {
    "color": "FF720000",
    "grey": 178
  },
  {
    "color": "FFAA0F01",
    "grey": 216
  },
  {
    "color": "FFFF0000",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

def recolorEdge(image):
    result = image.copy()
    for x in range(result.width):
        for y in range(result.height):
            px = image.getpixel((x, y))
            if px[3] != 0 and (x==0 or y==0 or (result.getpixel((x-1, y))[3] == 0 or result.getpixel((x, y-1))[3] == 0)):
                result.putpixel((x, y), (148, 20, 0, 255))
    return result

generator = TextureGenerator(parts)
generator.add_function(recolorEdge)
generator.add_function(grayscale_colorize_function(processed_palette, True), "recolor", 0)
generator.set_fallback(["rock"])
generator.generate("kubejs_redstone", part_types=["tconstruct:limb", "tconstruct:grip", "tconstruct:repair_kit"])
