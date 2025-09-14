from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image

palette = [
    {
        "color": "FF394318",
        "grey": 0
    },
    {
        "color": "FF415011",
        "grey": 63
    },
    {
        "color": "FF5C8332",
        "grey": 102
    },
    {
        "color": "FF5E7025",
        "grey": 140
    },
    {
        "color": "FF5C8332",
        "grey": 178
    },
    {
        "color": "FF5C8332",
        "grey": 216
    },
    {
        "color": "FF59AB30",
        "grey": 255
    }
]

processed_palette = convert_palette(palette)

def middle(image: PIL.Image.Image):
    for i in range(16):
        x = i
        y = 15 - i
        pixel = image.getpixel((x, y))
        if pixel[3] == 0: continue
        result = None
        match (pixel[0]):
            case 63:  result = (0, 0, 0, 255)
            case 102: result = (63, 63, 63, 255)
            case 140: result = (102, 102, 102, 255)
            case 178: result = (140, 140, 140, 255)
            case 216: result = (178, 178, 178, 255)
            case 255: result = (216, 216, 216, 255)
        image.putpixel((x, y), result)
    return image

generator = TextureGenerator(parts)
# generator.add_function(middle)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["primitive"])
generator.generate("kubejs_kelp", part_types=["tconstruct:binding"])
