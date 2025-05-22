from _create_settings import *
from TextureGenerator import *
from _convert_palette import *

palette = [
  {
    "color": "00000000",
    "grey": 0
  },
  {
    "color": "FF8BC1CD",
    "grey": 63
  },
  {
    "color": "FFA8D0D9",
    "grey": 102
  },
  {
    "color": "00000000",
    "grey": 140
  },
  {
    "color": "00000000",
    "grey": 216
  },
  {
    "color": "FFD0EAE9",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

def get_palette(color: str): return [
  {
    "color": f"66{color}",
    "grey": 0
  },
  {
    "color": f"A3{color}",
    "grey": 63
  },
  {
    "color": f"9B{color}",
    "grey": 102
  },
  {
    "color": f"66{color}",
    "grey": 140
  },
  {
    "color": f"66{color}",
    "grey": 216
  },
  {
    "color": f"66{color}",
    "grey": 255
  }
]

processed_palette = convert_palette(get_palette("FFFFFF"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_white_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("D87F33"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_orange_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("B24CD8"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_magenta_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("6699D8"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_light_blue_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("E5E533"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_yellow_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("7FCC19"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_lime_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("F27FA5"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_pink_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("4C4C4C"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_gray_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("999999"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_light_gray_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("4C7F99"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_cyan_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("7F3FB2"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_purple_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("334CB2"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_blue_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("664C33"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_brown_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("667F33"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_green_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("993333"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_red_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

processed_palette = convert_palette(get_palette("191919"))

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_black_stained", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

palette = [
  {
    "color": "00000000",
    "grey": 0
  },
  {
    "color": "FF383433",
    "grey": 63
  },
  {
    "color": "FF625b57",
    "grey": 102
  },
  {
    "color": "00000000",
    "grey": 140
  },
  {
    "color": "00000000",
    "grey": 216
  },
  {
    "color": "FF3f3c39",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_seared", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])

palette = [
  {
    "color": "00000000",
    "grey": 0
  },
  {
    "color": "FF241d19",
    "grey": 63
  },
  {
    "color": "FF53453c",
    "grey": 102
  },
  {
    "color": "00000000",
    "grey": 140
  },
  {
    "color": "00000000",
    "grey": 216
  },
  {
    "color": "FF66554a",
    "grey": 255
  }
]

processed_palette = convert_palette(palette)

generator = TextureGenerator(parts)
generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
generator.set_fallback(["crystal"])
generator.generate("tconstruct_glass_scorched", part_types=["tconstruct:head", "tconstruct:handle", "tconstruct:binding", "tconstruct:repair_kit"])
