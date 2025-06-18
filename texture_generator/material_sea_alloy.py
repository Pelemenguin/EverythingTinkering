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
    "color": "FF53887B",
    "grey": 63
  },
  {
    "color": "FF5A8C7F",
    "grey": 102
  },
  {
    "color": "FF00FF00",
    "grey": 140
  },
  {
    "color": "FF00FF00",
    "grey": 178
  },
  {
    "color": "FF00FF00",
    "grey": 216
  },
  {
    "color": "FF00FF00",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

sea_lantern = PIL.Image.open("composites/sea_lantern.png", 'r')
def dynamic(image):
    # frames = [image.copy() for _ in range(5)]
    result = PIL.Image.new("RGBA", (image.width, image.height*5))
    for y_offset in range(0, image.height*5, image.height):
        result.paste(image, (0, y_offset))
    large = (result.width == 32)
    for y in range(result.height):
        for x in range(result.width):
            if result.getpixel((x, y)) == (0, 255, 0, 255):
                if large:
                    result.putpixel((x, y), sea_lantern.getpixel((x//2%16, y//2%80)))
                else:
                    result.putpixel((x, y), sea_lantern.getpixel((x%16, y%80)))
    return result
content = """{
    "animation": {
        "frametime": 5
    }
}"""
generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.add_function(dynamic, "dynamic", -1)
generator.add_extra_file(lambda i, j: i+".mcmeta", lambda i, j: content)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_sea_alloy", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])