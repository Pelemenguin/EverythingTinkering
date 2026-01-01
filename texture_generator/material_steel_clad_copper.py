from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import PIL.Image
from _shared import find_min_rect, Palette

palette_iron = Palette.from_argb_string_palette({
    0: "FF000000",
    63: "FF353535",
    102: "FF5E5E5E",
    140: "FF828282",
    178: "FFA8A8A8",
    216: "FFD8D8D8",
    255: "FFFFFFFF"
})

palette_copper = Palette.from_argb_string_palette({
    0: "FF000000",
    63: "FF6D3421",
    102: "FF8A4129",
    140: "FF9C4E31",
    178: "FFC15A36",
    216: "FFE77C56",
    255: "FFFC9982",
})

# def coppering(image: PIL.Image.Image) -> PIL.Image.Image:

    # copied = image.copy()

    # for x in range(image.width):
        # y = image.height - 1
        # while (y > 0 and image.getpixel((x, y))[3] == 0): y -= 1
        # y -= 1
        # if (y < 0): continue
        # _, grey, _, alpha = image.getpixel((x, y))
        # if grey < 102: continue
        # if (image.getpixel((x, y-1))[2] < 140):
            # if x % 4 < 3:
                # continue
        # result: tuple[int, int, int, int]
        # try:
            # result = palette_copper[grey]
        # except KeyError:
            # for k in reversed(palette_copper):
                # if k < grey:
                    # result = palette_copper[k]
                    # break
        # image.putpixel((x, y), result)

    # back_to_iron = True

    # for y in range(image.height):
        # x = image.width - 1
        # while (x > 0 and image.getpixel((x, y))[3] == 0): x -= 1
        # x -= 1
        # if (x < 0): continue
        # r, g, b, alpha = image.getpixel((x, y))
        # if (r != g or g != b): continue
        # if (g < 102): continue
        # left = image.getpixel((x-1, y))
        # if (left[0] == left[1] and left[1] == left[2] and left[1] < 140):
            # if y % 4 < 3:
                # continue
        # result: tuple[int, int, int, int]
        # try:
            # result = palette_copper[g]
        # except KeyError:
            # for k in reversed(palette_copper):
                # if k < g:
                    # result = palette_copper[k]
                    # break
        # image.putpixel((x, y), result)

    # return image

def cladding(image: PIL.Image.Image) -> PIL.Image.Image:

    ((l, t), (r, b)) = find_min_rect(image)
    w = r - l
    h = b - t

    if h > w:
        for x in range(image.width):
            for y in range(t + 3, b - 2):
                image.putpixel((x, y), palette_iron.transform_pixel(image.getpixel((x, y))))
            for y in [*range(0, t+2), *range(b-1, image.height)]:
                image.putpixel((x, y), palette_copper.transform_pixel(image.getpixel((x, y))))
            for y in (t + 2, b - 2):
                if (image.getpixel((x, y))[3] > 0):
                    image.putpixel((x, y), (63, 63, 63, 255))
    else:
        for y in range(image.height):
            for x in range(l + 3, r - 2):
                image.putpixel((x, y), palette_iron.transform_pixel(image.getpixel((x, y))))
            for x in [*range(0, l+2), *range(r-1, image.width)]:
                image.putpixel((x, y), palette_copper.transform_pixel(image.getpixel((x, y))))
            for x in (l + 2, r - 2):
                if (image.getpixel((x, y))[3] > 0):
                    image.putpixel((x, y), (63, 63, 63, 255))

    return image

generator = TextureGenerator(parts)
# generator.add_function(palette_copper.to_transformer(), "recolor", 0)
generator.add_function(cladding, "cladding", 1)
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
