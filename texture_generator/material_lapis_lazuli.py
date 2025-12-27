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

random.seed("lapis")
def golden_strip(image: PIL.Image.Image) -> PIL.Image.Image:
    random.seed("lapis" + str(image.tobytes()))
    for _ in range(4):
        controls = [(random.randint(-4, 4)*image.width, random.randint(-8, 8)*image.height) for _ in range(2)]
        # controls = [(0, 8), (4, 12)]
        copied = image.copy()
        # for p in controls:
            # copied.putpixel(p, (255, 0, 0, 255))
        processed = sorted(golden_palette, reverse=True)
        p = 0
        while p <= 1:
            q1 = (p*controls[0][0], p*controls[0][1])
            q2 = (p*controls[1][0]+(1-p)*controls[0][0], p*controls[1][1]+(1-p)*controls[0][1])
            # q3 = (p*controls[2][0]+(1-p)*controls[1][0], p*controls[2][0]+(1-p)*controls[1][1])
            q3 = (p*15+(1-p)*controls[1][0], p*15+(1-p)*controls[1][1])
            r1 = (p*q2[0]-(1-p)*(q1[0]), p*q2[1]-(1-p)*(q1[1]))
            r2 = (p*q3[0]-(1-p)*(q2[0]), p*q3[1]-(1-p)*(q2[1]))
            # r3 = (p*q4[0]-(1-p)*(q3[0]), p*q4[1]-(1-p)*(q3[1]))
            cur = (p*r2[0]-(1-p)*(r1[0]), p*r2[1]-(1-p)*(r1[1]))
            # s2 = (p*r3[0]-(1-p)*(r2[0]), p*r3[1]-(1-p)*(r2[1]))
            # cur = (p*s2[0]-(1-p)*(s1[0]), p*s2[1]-(1-p)*(s1[1]))
            p += 0.001
            # if not (0<=cur[0]<=15 and 0<=cur[1]<=15):
                # continue
            # print(cur)
            cur = (round(cur[0])%image.width, round(cur[1])%image.height)
            # print(cur)
            if copied.getpixel(cur) == (0, 0, 0, 0):
                continue
            try:
                copied.putpixel(cur, golden_palette[image.getpixel(cur)[1]])
                # copied.putpixel((cur[0], cur[1]+1 if cur[1]<=14 else cur), tuple(int(0.5*i) for i in golden_palette[image.getpixel(cur)[1]]))
            except:
                for k in processed:
                    if copied.getpixel(cur)[1] >= k:
                        copied.putpixel(cur, golden_palette[k])
    return copied

generator = TextureGenerator(parts)
generator.add_function(golden_strip, "golden", 1)
generator.add_function(grayscale_colorize_function(processed_palette, True), "recolor", 0)
generator.set_fallback(["rock"])
generator.generate("kubejs_lapis_lazuli", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])