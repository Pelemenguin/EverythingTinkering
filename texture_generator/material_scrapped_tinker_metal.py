from _create_settings import *
from TextureGenerator import *
from _convert_palette import convert_palette2
from _shared import Palette

palette = Palette.from_argb_string_palette({
    0: "FF48352B",
    63: "FF5C4539",
    102: "FF824513",
    140: "FFB56D48",
    178: "FFD59364",
    216: "FFDE9D75",
    234: "FFFFD3B0",
    255: "FFFFD3B0"
    # 255: "FFFFEDC9"
})

def strip(image: PIL.Image.Image) -> PIL.Image.Image:

    for x in range(image.width):
        for y in range(0, image.height):
            r, grey, b, a = image.getpixel((x, y)) # type: ignore
            if a == 0: continue
            if (r != grey or grey != b): continue
            if y%2 == 1 and grey >= 234: image.putpixel((x, y), (255, 237, 201, 255))
            elif y%2 == 0 and 234 > grey >= 216 : image.putpixel((x, y), (0xFF, 0xD3, 0xB0, 255)) #FFD3B0
            elif y%3 == 0 and 63 < grey <= 140: image.putpixel((x, y), (0x82, 0x45, 0x13, 255))

    return image

generator = TextureGenerator(parts)
generator.add_function(palette.to_transformer(), "recolor", 0)
generator.add_function(strip, "strip", 1)
generator.set_fallback([])
generator.generate("kubejs_scrapped_tinker_metal", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit",
    "tconstruct:limb",
    "tconstruct:grip",
    "tconstruct:armor_plating",
    "tconstruct:plating_helmet",
    "tconstruct:plating_chestplate",
    "tconstruct:plating_leggings",
    "tconstruct:plating_boots",
    "tconstruct:plating_shield"
])

generator.set_fallback(["metal"])
generator.generate("kubejs_scrapped_tinker_metal", part_types=[
    "tconstruct:maille",
    "tconstruct:armor_maille"
])

def animate(image: PIL.Image.Image) -> PIL.Image.Image:

    for x in range(image.width):
        for y in range(image.height):
            _, g, _, a = image.getpixel((x, y)) # type: ignore
            g: int
            a: int
            match g:
                case 63:
                    image.putpixel((x, y), (20, 152, 151, 255))
                case 102:
                    image.putpixel((x, y), (69, 234, 214, 255))

    return image

generator = TextureGenerator(parts)
generator.set_fallback([])
generator.add_function(palette.to_transformer(), "recolor", 0)
generator.add_function(strip, "strip", 1)
generator.add_function(animate, "animate", 2)
generator.generate("kubejs_animated_tinker_metal", "resources", part_types=[
    "tconstruct:head",
    "tconstruct:repair_kit",
])
