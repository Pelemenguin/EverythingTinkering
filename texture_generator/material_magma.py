from TextureGenerator import *
from _create_settings import *
import PIL.Image

magma = PIL.Image.open("composites/magma.png", "r")

def dynamic(image: PIL.Image.Image):
    # frames = [image.copy() for _ in range(5)]
    result = PIL.Image.new("RGBA", (image.width, image.height*3))
    for y_offset in range(0, image.height*3, image.height):
        result.paste(image, (0, y_offset))
    large = (result.width == 32)
    for y in range(result.height):
        for x in range(result.width):
            if large:
                pixel = magma.getpixel((x//2%16, y//2%48))
            else:
                pixel = magma.getpixel((x%16, y%48))
            original_pixel = result.getpixel((x, y))
            result.putpixel((x, y), tuple([int((pixel[i] + 1) * (original_pixel[i] + 1) / 256 - 1) for i in range(4)]))
    return result
content = """{
    "animation": {
        "frametime": 8,
        "interpolate": true,
        "frames": [
            0,
            1,
            2
        ]
    }
}"""

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/terracotta.png")
generator.add_function(dynamic, "composite", 0)
generator.add_extra_file(lambda i, j: i+".mcmeta", lambda i, j: content)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_magma", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])