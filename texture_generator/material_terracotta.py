from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image

generator = TextureGenerator(parts)
image = PIL.Image.open("terracotta.png")
generator.add_function(multiply(image, 1.3), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_terracotta", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])