from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/dirt.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/sand.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_sand", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/red_sand.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_red_sand", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/gravel.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_gravel", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/coarse_dirt.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_coarse_dirt", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/rooted_dirt.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_rooted_dirt", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/mud.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_mud", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/clay.png")
generator.add_function(multiply(image, 1.2), "composite", 0)
generator.set_fallback(["nonmetal"])
generator.generate("kubejs_soil_clay", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit"
])