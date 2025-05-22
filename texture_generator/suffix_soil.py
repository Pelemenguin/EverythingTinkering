from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

generator = TextureGenerator(parts)
generator.set_fallback(["rock"])
generator.generate("nonmetal", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"], output_path="outputs")