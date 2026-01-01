from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image

palette_iron = convert_palette2({
    0: "FF000000",
    63: "FF353535",
    102: "FF5E5E5E",
    140: "FF828282",
    178: "FFA8A8A8",
    216: "FFD8D8D8",
    255: "FFFFFFFF"
})

palette_copper = convert_palette2({
    0: "FF000000",
    63: "FF6D3421",
    102: "FF8A4129",
    140: "FF9C4E31",
    178: "FFC15A36",
    216: "FFE77C56",
    255: "FFFC9982",
})

def coppering(image: PIL.Image.Image) -> PIL.Image.Image:

    copied = image.copy()

    for x in range(image.width):
        y = image.height - 1
        while (y > 0 and image.getpixel((x, y))[3] == 0): y -= 1
        y -= 1
        if (y < 0): continue
        _, grey, _, alpha = image.getpixel((x, y))
        if grey < 102: continue
        if (image.getpixel((x, y-1))[2] < 140):
            if x % 4 < 3:
                continue
        result: tuple[int, int, int, int]
        try:
            result = palette_copper[grey]
        except KeyError:
            for k in reversed(palette_copper):
                if k < grey:
                    result = palette_copper[k]
                    break
        image.putpixel((x, y), result)

    back_to_iron = True

    for y in range(image.height):
        x = image.width - 1
        while (x > 0 and image.getpixel((x, y))[3] == 0): x -= 1
        x -= 1
        if (x < 0): continue
        r, g, b, alpha = image.getpixel((x, y))
        if (r != g or g != b): continue
        if (g < 102): continue
        left = image.getpixel((x-1, y))
        if (left[0] == left[1] and left[1] == left[2] and left[1] < 140):
            if y % 4 < 3:
                continue
        result: tuple[int, int, int, int]
        try:
            result = palette_copper[g]
        except KeyError:
            for k in reversed(palette_copper):
                if k < g:
                    result = palette_copper[k]
                    break
        image.putpixel((x, y), result)

    return image

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(palette_iron, True), "recolor", 0)
generator.add_function(coppering, "coppering", 1)
generator.set_fallback(["metal"])
generator.generate("kubejs_steel_clad_copper", part_types=[
    "tconstruct:head",
    "tconstruct:handle",
    "tconstruct:binding",
    "tconstruct:repair_kit",
    "tconstruct:armor_plating",
    "tconstruct:plating_helmet",
    "tconstruct:plating_chestplate",
    "tconstruct:plating_leggings",
    "tconstruct:plating_boots",
    "tconstruct:plating_shield",
    "tconstruct:maille",
    "tconstruct:armor_maille",
    "tconstruct:limb",
    "tconstruct:grip"
])
