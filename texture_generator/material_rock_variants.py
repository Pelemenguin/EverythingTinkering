from _create_settings import *
from TextureGenerator import *
from _convert_palette import *
import json
import PIL.Image

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF41816A",
    "grey": 63
  },
  {
    "color": "FF468974",
    "grey": 102
  },
  {
    "color": "FF5EA496",
    "grey": 140
  },
  {
    "color": "FF79B7AB",
    "grey": 178
  },
  {
    "color": "FF9BCBBF",
    "grey": 216
  },
  {
    "color": "FFBEE2D9",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)
func0 = grayscale_colorize_function(processed_palette)

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF267A4B",
    "grey": 63
  },
  {
    "color": "FF2C8755",
    "grey": 102
  },
  {
    "color": "FF5EA48E",
    "grey": 140
  },
  {
    "color": "FF5EA48E",
    "grey": 178
  },
  {
    "color": "FF9BCBBF",
    "grey": 216
  },
  {
    "color": "FFBEE2D9",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)
func1 = grayscale_colorize_function(processed_palette)

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF596589",
    "grey": 63
  },
  {
    "color": "FF687396",
    "grey": 102
  },
  {
    "color": "FF5E85A4",
    "grey": 140
  },
  {
    "color": "FF79B3B7",
    "grey": 178
  },
  {
    "color": "FF9BCBBF",
    "grey": 216
  },
  {
    "color": "FFBEE2D9",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)
func2 = grayscale_colorize_function(processed_palette)

palette = [
  {
    "color": "FF000000",
    "grey": 0
  },
  {
    "color": "FF467A95",
    "grey": 63
  },
  {
    "color": "FF4E86A3",
    "grey": 102
  },
  {
    "color": "FF5E9EA4",
    "grey": 140
  },
  {
    "color": "FF79B7AB",
    "grey": 178
  },
  {
    "color": "FF9BCBBF",
    "grey": 216
  },
  {
    "color": "FFBEE2D9",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)
func3 = grayscale_colorize_function(processed_palette)

def gen(image):
    frame0 = image.copy()
    frame1 = image.copy()
    frame2 = image.copy()
    frame3 = image.copy()
    
    frame0 = func0(frame0)
    frame1 = func1(frame1)
    frame2 = func2(frame2)
    frame3 = func3(frame3)
    
    y_off = 0
    result = PIL.Image.new("RGBA", (image.width, image.height*4))
    for img in [frame0, frame1, frame2, frame3]:
        result.paste(img, (0, y_off))
        y_off += image.height
    return result

content = '''{
    "animation": {
        "frametime": 300,
        "interpolate": true,
        "frames": [
            0,
            1,
            0,
            2,
            0,
            3,
            0,
            1,
            2,
            1,
            3,
            1,
            0,
            2,
            1,
            2,
            3,
            2,
            0,
            3,
            1,
            3
        ]
    }
}'''

generator = TextureGenerator(parts)
generator.add_function(gen, "recolor", 0)
generator.add_extra_file(lambda i, j: i+".mcmeta", lambda i, j: content)
generator.set_fallback(["rock"])
generator.generate("tconstruct_prismarine", part_types=["tconstruct:arrow_head"])

# print(generator._extra_files)