from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/terracotta.png")
generator.add_function(multiply(image, 1.3), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_terracotta", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

colors = ["white", "orange", "magenta", "light_blue", "yellow", "lime", 
          "pink", "gray", "light_gray", "cyan", "purple", "blue", 
          "brown", "green", "red", "black"]

for c in colors:
    generator = TextureGenerator(parts)
    image = PIL.Image.open(f"composites/{c}_terracotta.png")
    generator.add_function(multiply(image, 1.3), "composite", 0)
    generator.set_fallback(["nonmetal"])
    generator.generate(f"kubejs_terracotta_{c}", part_types=[
        "tconstruct:head",
        "tconstruct:handle",
        "tconstruct:binding",
        "tconstruct:repair_kit"
    ])

for c in colors:
    generator = TextureGenerator(parts)
    image = PIL.Image.open(f"composites/{c}_glazed_terracotta.png").convert("RGBA")
    generator.add_function(multiply(image, 1.1), "composite", 0)
    generator.set_fallback(["nonmetal"])
    generator.generate(f"kubejs_terracotta_{c}_glazed", part_types=[
        "tconstruct:head",
        "tconstruct:handle",
        "tconstruct:binding",
        "tconstruct:repair_kit"
    ])