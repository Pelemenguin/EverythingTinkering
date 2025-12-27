from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import random

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF052463",
    "grey": 63
  },
  {
    "color": "FF1A3D8F",
    "grey": 102
  },
  {
    "color": "FF12408B",
    "grey": 140
  },
  {
    "color": "FF345EC3",
    "grey": 178
  },
  {
    "color": "FF5A82E2",
    "grey": 216
  },
  {
    "color": "FF7497EA",
    "grey": 255
  }
]

palette_golden = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF752802",
    "grey": 63
  },
  {
    "color": "FFB26411",
    "grey": 102
  },
  {
    "color": "FFE9B115",
    "grey": 140
  },
  {
    "color": "FFFAD64A",
    "grey": 178
  },
  {
    "color": "FFFDF55F",
    "grey": 216
  },
  {
    "color": "FFFFFDE0",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)
golden_palette = convert_palette(palette_golden)

def getPoint(p1: tuple[int|float, int|float], p2: tuple[int|float, int|float], t: float) -> tuple[float, float]:
    return (p1[0] * t + p2[0] * (1-t), p1[1] * t + p2[1] * (1-t))

def draw_curve(image: PIL.Image.Image, lu: tuple[int, int], rd: tuple[int, int], start: tuple[int, int] | None = None, end: tuple[int, int] | None = None, seed: int = None) -> bool:
    random.seed(seed if seed is not None else hash((lu, rd)))

    c1: tuple[int, int] = (random.randint(lu[0], rd[0]), random.randint(lu[1], rd[1]))
    c2: tuple[int, int] = (random.randint(lu[0], rd[0]), random.randint(lu[1], rd[1]))

    begin = start if start is not None else lu
    finish = end if end is not None else rd

    applicated = 0

    for step in range(0, 41):
        t: float = step / 40
    
        p1: tuple[float, float] = getPoint(begin, c1, t)
        p2: tuple[float, float] = getPoint(c1, c2, t)
        p3: tuple[float, float] = getPoint(c2, finish, t)
    
        q1: tuple[float, float] = getPoint(p1, p2, t)
        q2: tuple[float, float] = getPoint(p2, p3, t)
    
        r: tuple[float, float] = getPoint(q1, q2, t)
        point: tuple[int, int] = (round(r[0]), round(r[1]))

        pixel = image.getpixel(point)
        if (pixel[3] <= 0): continue
        if (pixel[0] != pixel[1] or pixel[1] != pixel[2]): continue

        grey: int = pixel[2]
        color: tuple[int, int, int, int]
        try:
            color = golden_palette[grey]
        except:
            for g in golden_palette:
                if g > grey:
                    color = golden_palette[g]
                    break

        image.putpixel(point, color)
        applicated += 1

    return applicated / 40 >= 0.1 or applicated >= (rd[0] - lu[0]) * (rd[1] - lu[1]) * 0.1

def golden_strip(image: PIL.Image.Image) -> PIL.Image.Image:
    leftmost: int = 127
    rightmost: int = 0
    upmost: int = 127
    downmost: int = 0

    for x in range(image.width):
        for y in range(image.height):
            if (image.getpixel((x,y))[3] != 0):
                leftmost = min(x, leftmost)
                rightmost = max(x, rightmost)
                upmost = min(y, upmost)
                downmost = max(y, downmost)

    print(f"({leftmost}, {upmost}) -> ({rightmost}, {downmost})")

    effective = draw_curve(image, (leftmost, upmost), (rightmost, downmost))

    if effective: return image

    seed = hash((leftmost, upmost, rightmost, downmost))
    attempts: int = 0
    while attempts < 3 and not effective:
        seed = hash((seed, attempts))
        effective = draw_curve(image, (leftmost, upmost), (rightmost, downmost),
            (leftmost, random.randint((upmost + downmost) // 2, downmost)), (rightmost, random.randint((upmost + downmost) // 2, downmost)), seed
        )
        attempts += 1

    return image

generator = TextureGenerator(parts)
generator.add_function(golden_strip, "golden", 1)
generator.add_function(grayscale_colorize_function(processed_palette, True), "recolor", 0)
generator.set_fallback(["rock"])
generator.generate("kubejs_lapis_lazuli", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])