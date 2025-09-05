from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

generator = TextureGenerator(parts)
generator.set_fallback(["wood"])
generator.generate("nonmetal", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"], output_path="outputs")
generator.generate("nonmetal", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"], output_path="resources")

# with open("resources/item/tool/parts/large_plate.png", "rb")  as original:
    # with open("resources/item/tool/parts/large_plate_nonmetal.png", "wb") as modifying:
        # modifying.write(original.read())

# with open("resources/item/tool/parts/large_plate.png", "rb")  as original:
    # with open("outputs/item/tool/parts/large_plate_nonmetal.png", "wb") as modifying:
        # modifying.write(original.read())

modify_list = {
    "item/tool/parts/large_plate_nonmetal.png": "item/tool/parts/large_plate.png",
    "item/tool/battlesign/head_nonmetal.png": "item/tool/battlesign/head.png",
    "item/tool/battlesign/head_broken_nonmetal.png": "item/tool/battlesign/head_broken.png"
}

for i in modify_list:
    with open(f"resources/{modify_list[i]}", "rb") as original:
        b = original.read()
        with open(f"resources/{i}", "wb") as modifying:
            modifying.write(b)
        with open(f"outputs/{i}", "wb") as modifying:
            modifying.write(b)