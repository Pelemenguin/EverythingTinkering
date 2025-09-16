from TextureGenerator import *
from _create_settings import *
import PIL.Image

crying_obsidian = PIL.Image.open("composites/crying_obsidian.png")

generator = TextureGenerator(parts)
image = PIL.Image.open("composites/terracotta.png")
generator.add_function(multiply(crying_obsidian), "composite", 0)
generator.set_fallback(["rock"])
generator.generate("kubejs_crying_obsidian", part_types=[
    "tconstruct:armor_plating",
    "tconstruct:plating_helmet",
    "tconstruct:plating_chestplate",
    "tconstruct:plating_leggings",
    "tconstruct:plating_boots",
    "tconstruct:repair_kit",
    "tconstruct:maille",
    "tconstruct:armor_maille"
])
