from _create_settings import *
from TextureGenerator import *
from _shared import Palette
import random

andesite_alloy_palette = Palette.from_argb_string_palette({
    0: "FF000000",
    63: "FF2b3635",
    102: "FF4a5451",
    140: "FF5e6963",
    178: "FF829789",
    216: "FFa9afa1",
    255: "FFe6e6db"
})

gold_palette = Palette.from_argb_string_palette({
    0: "FF000000",
    63: "FF752802",
    102: "FFB26411",
    140: "FFE9B115",
    178: "FFFAD64A",
    216: "FFFDF55F",
    255: "FFFFFDE0"
})

glass_palette = Palette.from_argb_string_palette({
    0: "FF000000",
    63: "FF7BAEB7",
    102: "FFA8D0D9",
    140: "00000000",
    216: "00000000",
    255: "FFD0EAE9"
})

def inner_pixels(image: PIL.Image.Image) -> dict[int, list[int]]:

    results: dict[int, list[int]] = {}

    width, height = image.size

    for y in range(2, height - 2):
        results[y] = []
        for x in range(2, width - 2):
            pixel = image.getpixel((x, y))
            if pixel[3] > 0: # type: ignore

                is_edge: bool = False
                
                for (dx, dy) in (
                                        (0, 2),
                              (-1, 1),  (0, 1),  (1, 1),
                    (-2, -0), (-1, 0),           (1, 0), (2, 0),
                              (-1, -1), (0, -1), (1, -1),
                                        (0, -2)
                ):
                    nx = x + dx
                    ny = y + dy
                    if nx < 0 or nx >= width or ny < 0 or ny >= height:
                        continue
                    neighbor_pixel = image.getpixel((nx, ny))
                    if neighbor_pixel[3] == 0: # type: ignore
                        is_edge = True
                        break

                if not is_edge:
                    results[y].append(x)

    return results

def draw_spring(image: PIL.Image.Image, inner: dict[int, list[int]]) -> PIL.Image.Image:

    random.seed(hash(str(inner.keys())))

    for y in inner:
        x_list = inner[y]
        if (len(x_list) == 0): continue
        border = len(x_list) * 3 // 4
        border = border + random.randint(-2, 2)
        border = max(1, min(len(x_list) - 1, border))

        left_border = len(x_list) // 4
        left_border = left_border + random.randint(-2, 2)
        left_border = max(1, min(len(x_list) - 1, left_border))
        if y%2 == 0:
            # Light strips
            for x in x_list[:left_border]:
                image.putpixel((x, y), gold_palette.transform_pixel((178, 178, 178, 255)))
            for x in x_list[left_border:border]:
                image.putpixel((x, y), gold_palette.transform_pixel((216, 216, 216, 255)))
            for x in x_list[border:]:
                image.putpixel((x, y), gold_palette.transform_pixel((255, 255, 255, 255)))
        else:
            # Dark strips
            for x in x_list[:left_border]:
                image.putpixel((x, y), gold_palette.transform_pixel((102, 102, 102, 255)))
            for x in x_list[left_border:border]:
                image.putpixel((x, y), gold_palette.transform_pixel((140, 140, 140, 255)))
            for x in x_list[border:]:
                image.putpixel((x, y), gold_palette.transform_pixel((178, 178, 178, 255)))

    return image

def draw_glass(image: PIL.Image.Image, inner: dict[int, list[int]]) -> PIL.Image.Image:

    result = PIL.Image.new("RGBA", image.size)

    for y in inner:
        x_list = inner[y]
        if (len(x_list) == 0): continue

        for x in x_list:
            if (x-y)%8 <= 1:
                result.putpixel((x, y), glass_palette.transform_pixel((102, 102, 102, 255))) # type: ignore

    return result

def process(image: PIL.Image.Image) -> PIL.Image.Image:

    inner = inner_pixels(image)

    base = andesite_alloy_palette.to_transformer()(image.copy())
    base = draw_spring(base, inner)

    overlay = draw_glass(image.copy(), inner)

    base.alpha_composite(overlay.convert("RGBA"))

    return base

generator = TextureGenerator(parts)
generator.add_function(process, "process", 1)
generator.set_fallback(["rock"])
generator.generate("kubejs_mainspring", "resources", "outputs", [
    "tconstruct:head",
    "tconstruct:repair_kit"
])
