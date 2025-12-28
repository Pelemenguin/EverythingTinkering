from _create_settings import *
from TextureGenerator import *
from _convert_palette import convert_palette2

palettes = {
    "oak": {
        0: "FF000000",
        63: "FF4C3B20",
        102: "FF594426",
        140: "FF67502C",
        178: "FF7E6237",
        216: "FF967441",
        234: "FFAF8F55",
        255: "FFB8945F"
    },
    "spruce": {
        0: "FF000000",
        63: "FF3A2815",
        102: "FF47301A",
        140: "FF553A1F",
        178: "FF5A4424",
        216: "FF614B2E",
        234: "FF7A5A34",
        255: "FF82613A"
    },
    "birch": {
        0: "FF000000",
        63: "FF7F704F",
        102: "FF8C7B56",
        140: "FF9E8B61",
        178: "FFA59467",
        216: "FFAE9F76",
        234: "FFC8B77A",
        255: "FFD7C185"
    },
    "jungle": {
        0: "FF000000",
        63: "FF4C3323",
        102: "FF593C29",
        140: "FF68462F",
        178: "FF785437",
        216: "FF976A44",
        234: "FFAA7954",
        255: "FFB88764"
    },
    "acacia": {
        0: "FF000000",
        63: "FF703A21",
        102: "FF7A3F24",
        140: "FF884728",
        178: "FF8F4C2A",
        216: "FF99502B",
        234: "FFAD5D32",
        255: "FFBA6337"
    },
    "dark_oak": {
        0: "FF000000",
        63: "FF160E06",
        102: "FF1E1309",
        140: "FF291A0C",
        178: "FF301E0E",
        216: "FF3A2411",
        234: "FF492F17",
        255: "FF4F3218"
    },
    "mangrove": {
        0: "FF000000",
        63: "FF471617",
        102: "FF51191B",
        140: "FF5D1C1E",
        178: "FF642423",
        216: "FF6F2A2D",
        234: "FF773934",
        255: "FF7F4234"
    },
    "cherry": {
        0: "FF000000",
        63: "FFCD8580",
        102: "FFDD9D97",
        140: "FFE1A8A1",
        178: "FFE6B3AD",
        216: "FFE7BAB4",
        234: "FFE7C2BB",
        255: "FFE7CAC5"
    }
}

for woodvar in palettes:
    palette = palettes[woodvar]

    processed_palette = convert_palette2(palette)

    generator = TextureGenerator(parts)
    generator.add_function(grayscale_colorize_function(processed_palette), "recolor", 0)
    generator.set_fallback(["wood", "stick", "primitive"])
    generator.generate("tconstruct_wood_" + woodvar, part_types=[
        "tconstruct:head",
        "tconstruct:handle",
        "tconstruct:binding",
        "tconstruct:repair_kit",
        "tconstruct:limb",
        "tconstruct:grip",
        "tconstruct:shield_core",
        "tconstruct:wood",
        "tconstruct:arrow_shaft"
    ])
