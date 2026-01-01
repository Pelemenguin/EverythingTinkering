import sys
import os
import os.path
import PIL
import PIL.Image

WIDTH = 256
HEIGHT = 256

# Objects
OBJECTS = [
    # Pickaxe
    {
        "__offset__": (0, 0),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/pickaxe/head": (0, 0),
        "item/tool/pickaxe/binding": (0, 0)
    },
    {
        "__offset__": (0, 16),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/pickaxe/head_broken": (0, 0),
        "item/tool/pickaxe/binding": (0, 0),
    },

    # Mattock
    {
        "__offset__": (16, 0),
        "item/tool/mattock/axe": (0, 0),
        "item/tool/mattock/pick": (0, 0),
        "item/tool/pickaxe/handle": (0, 0),
    },
    {
        "__offset__": (16, 16),
        "item/tool/mattock/axe_broken": (0, 0),
        "item/tool/mattock/pick_broken": (0, 0),
        "item/tool/pickaxe/handle": (0, 0),
    },

    # Pickadze
    {
        "__offset__": (32, 0),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/pickadze/pick": (0, 0),
        "item/tool/pickadze/adze": (0, 0),
    },
    {
        "__offset__": (32, 16),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/pickadze/pick_broken": (0, 0),
        "item/tool/pickadze/adze": (0, 0),
    },

    # Hand Axe
    {
        "__offset__": (48, 0),
        "item/tool/hand_axe/head": (0, 0),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/hand_axe/binding": (0, 0),
    },
    {
        "__offset__": (48, 16),
        "item/tool/hand_axe/head_broken": (0, 0),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/hand_axe/binding": (0, 0),
    },

    # Kama
    {
        "__offset__": (64, 0),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/kama/head": (0, 0),
        "item/tool/kama/binding": (0, 0),
    },
    {
        "__offset__": (64, 16),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/kama/head_broken": (0, 0),
        "item/tool/kama/binding": (0, 0),
    },

    # Dagger
    {
        "__offset__": (80, 0),
        "item/tool/dagger/blade": (0, 0),
        "item/tool/dagger/crossguard": (0, 0),
    },
    {
        "__offset__": (80, 16),
        "item/tool/dagger/blade_broken": (0, 0),
        "item/tool/dagger/crossguard": (0, 0),
    },

    # Sword
    {
        "__offset__": (96, 0),
        "item/tool/sword/handle": (0, 0),
        "item/tool/sword/blade": (0, 0),
        "item/tool/sword/guard": (0, 0),
    },
    {
        "__offset__": (96, 16),
        "item/tool/sword/handle": (0, 0),
        "item/tool/sword/blade_broken": (0, 0),
        "item/tool/sword/guard": (0, 0),
    },

    # Sledge Hammer
    {
        "__offset__": (112, 0),
        "item/tool/sledge_hammer/handle": (0, 0),
        "item/tool/sledge_hammer/head": (0, 0),
        "item/tool/sledge_hammer/back": (0, 0),
        "item/tool/sledge_hammer/front": (0, 0),
    },
    {
        "__offset__": (112, 16),
        "item/tool/sledge_hammer/handle": (0, 0),
        "item/tool/sledge_hammer/head_broken": (0, 0),
        "item/tool/sledge_hammer/back_broken": (0, 0),
        "item/tool/sledge_hammer/front_broken": (0, 0),
    },

    # Vein Hammer
    {
        "__offset__": (128, 0),
        "item/tool/vein_hammer/handle": (0, 0),
        "item/tool/vein_hammer/head": (0, 0),
        "item/tool/vein_hammer/grip": (0, 0),
        "item/tool/vein_hammer/front": (0, 0),
    },
    {
        "__offset__": (128, 16),
        "item/tool/vein_hammer/handle": (0, 0),
        "item/tool/vein_hammer/head_broken": (0, 0),
        "item/tool/vein_hammer/grip": (0, 0),
        "item/tool/vein_hammer/front_broken": (0, 0),
    },

    # Excavator
    {
        "__offset__": (144, 0),
        "item/tool/excavator/handle": (0, 0),
        "item/tool/excavator/head": (0, 0),
        "item/tool/excavator/grip": (0, 0),
        "item/tool/excavator/binding": (0, 0),
    },
    {
        "__offset__": (144, 16),
        "item/tool/excavator/handle": (0, 0),
        "item/tool/excavator/head_broken": (0, 0),
        "item/tool/excavator/grip": (0, 0),
        "item/tool/excavator/binding": (0, 0),
    },

    # Broad Axe
    {
        "__offset__": (160, 0),
        "item/tool/broad_axe/handle": (0, 0),
        "item/tool/broad_axe/blade": (0, 0),
        "item/tool/broad_axe/back": (0, 0),
        "item/tool/broad_axe/binding": (0, 0),
    },
    {
        "__offset__": (160, 16),
        "item/tool/broad_axe/handle": (0, 0),
        "item/tool/broad_axe/blade_broken": (0, 0),
        "item/tool/broad_axe/back_broken": (0, 0),
        "item/tool/broad_axe/binding": (0, 0),
    },

    # Scythe
    {
        "__offset__": (176, 0),
        "item/tool/scythe/accessory": (0, 0),
        "item/tool/scythe/handle": (0, 0),
        "item/tool/scythe/head_broken": (0, 0),
        "item/tool/scythe/binding": (0, 0),
    },
    {
        "__offset__": (176, 16),
        "item/tool/scythe/accessory": (0, 0),
        "item/tool/scythe/handle": (0, 0),
        "item/tool/scythe/head_broken": (0, 0),
        "item/tool/scythe/binding": (0, 0),
    },

    # Cleaver
    {
        "__offset__": (192, 0),
        "item/tool/cleaver/handle": (0, 0),
        "item/tool/cleaver/head": (0, 0),
        "item/tool/cleaver/shield": (0, 0),
        "item/tool/cleaver/guard": (0, 0),
    },
    {
        "__offset__": (192, 16),
        "item/tool/cleaver/handle": (0, 0),
        "item/tool/cleaver/head_broken": (0, 0),
        "item/tool/cleaver/shield_broken": (0, 0),
        "item/tool/cleaver/guard": (0, 0),
    },

    # Crossbow
    {
        "__offset__": (0, 32),
        "item/tool/crossbow/limb": (0, 0),
        "item/tool/crossbow/body": (0, 0),
        "item/tool/crossbow/bowstring": (0, 0)
    },
    {
        "__offset__": (0, 48),
        "item/tool/crossbow/limb": (0, 0),
        "item/tool/crossbow/body": (0, 0),
        "item/tool/crossbow/bowstring_broken": (0, 0)
    },

    # Fishing Rod
    {
        "__offset__": (16, 32),
        "item/tool/fishing_rod/rod": (0, 0),
        "item/tool/fishing_rod/string": (0, 0),
        "item/tool/fishing_rod/hook": (0, 0),
    },
    {
        "__offset__": (16, 48),
        "item/tool/fishing_rod/rod": (0, 0),
        "item/tool/fishing_rod/string_broken": (0, 0),
        "item/tool/fishing_rod/hook_broken": (0, 0),
    },

    # Longbow
    {
        "__offset__": (32, 32),
        "item/tool/longbow/limb_bottom": (0, 0),
        "item/tool/longbow/limb_top": (0, 0),
        "item/tool/longbow/bowstring": (0, 0),
        "item/tool/longbow/grip": (0, 0),
    },
    {
        "__offset__": (32, 48),
        "item/tool/longbow/limb_bottom": (0, 0),
        "item/tool/longbow/limb_top": (0, 0),
        "item/tool/longbow/bowstring_broken": (0, 0),
        "item/tool/longbow/grip": (0, 0),
    },

    # Javelin
    {
        "__offset__": (48, 32),
        "item/tool/javelin/handle": (0, 0),
        "item/tool/javelin/grip": (0, 0),
        "item/tool/javelin/head": (0, 0),
        "item/tool/javelin/guard": (0, 0),
    },
    {
        "__offset__": (48, 48),
        "item/tool/javelin/handle": (0, 0),
        "item/tool/javelin/grip": (0, 0),
        "item/tool/javelin/head_broken": (0, 0),
        "item/tool/javelin/guard": (0, 0),
    },

    # Melting Pan
    {
        "__offset__": (80, 32),
        "item/tool/melting_pan/handle": (0, 0),
        "item/tool/melting_pan/head": (0, 0),
    },
    {
        "__offset__": (80, 48),
        "item/tool/melting_pan/handle": (0, 0),
        "item/tool/melting_pan/head_broken": (0, 0),
    },

    # War Pick
    {
        "__offset__": (96, 32),
        "item/tool/war_pick/body": (0, 0),
        "item/tool/war_pick/bowstring": (0, 0),
        "item/tool/war_pick/limb": (0, 0),
    },
    {
        "__offset__": (96, 48),
        "item/tool/war_pick/body": (0, 0),
        "item/tool/war_pick/bowstring_broken": (0, 0),
        "item/tool/war_pick/limb": (0, 0),
    },

    # Battlesign
    {
        "__offset__": (112, 32),
        "item/tool/battlesign/head": (0, 0),
        "item/tool/battlesign/handle": (0, 0),
    },
    {
        "__offset__": (112, 48),
        "item/tool/battlesign/head_broken": (0, 0),
        "item/tool/battlesign/handle": (0, 0),
    },

    # Swasher
    {
        "__offset__": (128, 32),
        "item/tool/swasher/handle": (0, 0),
        "item/tool/swasher/blade": (0, 0),
        "item/tool/swasher/barrel": (0, 0),
    },
    {
        "__offset__": (128, 48),
        "item/tool/swasher/handle": (0, 0),
        "item/tool/swasher/blade_broken": (0, 0),
        "item/tool/swasher/barrel": (0, 0),
    },

    # Minotaur Axe
    {
        "__offset__": (144, 32),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/minotaur_axe/front": (0, 0),
        "item/tool/minotaur_axe/back": (0, 0),
    },
    {
        "__offset__": (144, 48),
        "item/tool/pickaxe/handle": (0, 0),
        "item/tool/minotaur_axe/front_broken": (0, 0),
        "item/tool/minotaur_axe/back": (0, 0),
    },

    # Plate Helmet
    {
        "__offset__": (0, 64),
        "item/tool/armor/plate/helmet/plating": (0, 0),
        "item/tool/armor/plate/helmet/maille": (0, 0),
    },
    {
        "__offset__": (0, 80),
        "item/tool/armor/plate/helmet/plating_broken": (0, 0),
        "item/tool/armor/plate/helmet/maille_broken": (0, 0),
    },

    # Plate Chestplate
    {
        "__offset__": (16, 64),
        "item/tool/armor/plate/chestplate/plating": (0, 0),
        "item/tool/armor/plate/chestplate/maille": (0, 0),
    },
    {
        "__offset__": (16, 80),
        "item/tool/armor/plate/chestplate/plating_broken": (0, 0),
        "item/tool/armor/plate/chestplate/maille_broken": (0, 0),
    },

    # Plate Leggings
    {
        "__offset__": (32, 64),
        "item/tool/armor/plate/leggings/plating": (0, 0),
        "item/tool/armor/plate/leggings/maille": (0, 0),
    },
    {
        "__offset__": (32, 80),
        "item/tool/armor/plate/leggings/plating_broken": (0, 0),
        "item/tool/armor/plate/leggings/maille_broken": (0, 0),
    },

    # Plate Boots
    {
        "__offset__": (48, 64),
        "item/tool/armor/plate/boots/plating": (0, 0),
        "item/tool/armor/plate/boots/maille": (0, 0),
    },
    {
        "__offset__": (48, 80),
        "item/tool/armor/plate/boots/plating_broken": (0, 0),
        "item/tool/armor/plate/boots/maille_broken": (0, 0),
    },

    # Plate Shield
    {
        "__offset__": (64, 64),
        "item/tool/armor/plate/shield/core": (0, 0),
        "item/tool/armor/plate/shield/plating": (0, 0),
    },
    {
        "__offset__": (64, 80),
        "item/tool/armor/plate/shield/core_broken": (0, 0),
        "item/tool/armor/plate/shield/plating_broken": (0, 0),
    },

    # Arrow
    {
        "__offset__": (96, 64),
        "item/tool/ammo/arrow_head": (0, 0),
        "item/tool/ammo/arrow_shaft": (0, 0),
        "item/tool/ammo/arrow_feather": (0, 0),
    },

    # Shuriken
    {
        "__offset__": (112, 64),
        "item/tool/ammo/shuriken_bottom": (0, 0),
        "item/tool/ammo/shuriken_top": (0, 0),
    },

    # Throwing Axe
    {
        "__offset__": (112, 80),
        "item/tool/ammo/axe_head": (0, 0),
        "item/tool/ammo/arrow_shaft": (0, 0),
    },

    # Parts

    # Pick Head
    {
        "__offset__": (0, 96),
        "item/tool/pickaxe/head": (-2, 1),
    },
    # Hammer Head
    {
        "__offset__": (16, 96),
        "item/tool/sledge_hammer/head": (-3, 3),
    },
    # Small Axe Head
    {
        "__offset__": (32, 96),
        "item/tool/hand_axe/head": (-2, 3),
    },
    # Broad Axe Head
    {
        "__offset__": (48, 96),
        "item/tool/broad_axe/blade": (0, 3)
    },
    # Small Blade
    {
        "__offset__": (64, 96),
        "item/tool/parts/small_blade": (0, 0),
    },
    # Broad Blade
    {
        "__offset__": (80, 96),
        "item/tool/cleaver/head": (-1, 1)
    },
    # Adze Head
    {
        "__offset__": (96, 96),
        "item/tool/pickadze/adze": (-5, 1),
    },
    # Large Plate
    {
        "__offset__": (112, 96),
        "item/tool/parts/large_plate": (0, 0),
    },
    # Tool Binding
    {
        "__offset__": (0, 112),
        "item/tool/parts/tool_binding": (0, 0),
    },
    # Tough Binding
    {
        "__offset__": (16, 112),
        "item/tool/parts/tough_binding": (0, 0),
    },
    # Tool Handle
    {
        "__offset__": (32, 112),
        "item/tool/parts/tool_handle": (0, 0),
    },
    # Tough Handle
    {
        "__offset__": (48, 112),
        "item/tool/parts/tough_handle": (0, 0),
    },
    # Bow Limb
    {
        "__offset__": (80, 112),
        "item/tool/longbow/limb_bottom": (5, -2),
    },
    # Bow Grip
    {
        "__offset__": (96, 112),
        "item/tool/crossbow/body": (-2, -2),
    },
    # Bowstring
    {
        "__offset__": (112, 112),
        "item/tool/parts/bowstring": (0, 0),
    },
    # Maille
    {
        "__offset__": (144, 96),
        "item/tool/parts/maille": (0, 0),
    },
    # Shield Core
    {
        "__offset__": (144, 112),
        "item/tool/armor/plate/shield/core": (0, 0),
    },
    # Helmet Plating
    {
        "__offset__": (160, 96),
        "item/tool/armor/plate/helmet/plating": (0, 2),
    },
    # Chestplate Plating
    {
        "__offset__": (160, 112),
        "item/tool/armor/plate/chestplate/plating": (0, 0),
    },
    # Leggings Plating
    {
        "__offset__": (176, 96),
        "item/tool/armor/plate/leggings/plating": (0, 1),
    },
    # Boots Plating
    {
        "__offset__": (176, 112),
        "item/tool/armor/plate/boots/plating": (0, 0),
    },
    # Arrow Head
    {
        "__offset__": (160, 64),
        "item/tool/ammo/arrow_head": (-4, 3),
    },
    # Arrow Shaft
    {
        "__offset__": (144, 80),
        "item/tool/ammo/arrow_shaft": (1, -1),
    },
    # Fletching
    {
        "__offset__": (160, 80),
        "item/tool/ammo/arrow_feather": (4, -5),
    },
    # Repair Kit
    {
        "__offset__": (144, 64),
        "item/tool/parts/repair_kit": (0, 0),
    },

]

OVERLAYS = [
    # Swasher Tank
    {
        "__offset__": (128, 32),
        "item/tool/swasher/modifiers/tconstruct_tank": (0, 0),
    },
    {
        "__offset__": (128, 48),
        "item/tool/swasher/modifiers/tconstruct_tank": (0, 0),
    },
]

if (len(sys.argv) <= 1):
    print("Please specify a material to create preview")
    exit()

print(f"Preview Material: {sys.argv[1]}")

suffix = sys.argv[1].replace(":", "_")

preview = PIL.Image.new("RGBA", (WIDTH, HEIGHT))

# Background

for x in range(WIDTH):
    for y in range(HEIGHT):
        preview.putpixel((x, y), (255, 255, 255, 255) if (x//4+y//4)%2 == 0 else (216, 216, 216, 255))
        
for d in OBJECTS:
    for k in d:
        if (k == "__offset__"): continue
        rc = d[k]
        offset = d["__offset__"]
        coordinate = (rc[0] + offset[0], rc[1] + offset[1])
        path = f"./outputs/{k}_{suffix}.png"
        if not os.path.isfile(path):
            path = f"./resources/{k}_{suffix}.png"
        if not os.path.isfile(path):
            print(f"{path} not found, using fallback")
            path = f"./resources/{k}_tconstruct_unknown.png"
        image = PIL.Image.open(path, "r")
        preview.alpha_composite(image.copy(), coordinate)
        image.close()

for d in OVERLAYS:
    for k in d:
        if (k == "__offset__"): continue
        rc = d[k]
        offset = d["__offset__"]
        coordinate = (rc[0] + offset[0], rc[1] + offset[1])
        path = f"resources/{k}.png"
        image = PIL.Image.open(path, "r")
        preview.alpha_composite(image.copy(), coordinate)
        image.close()

# Create folder
os.makedirs("previews", exist_ok=True)

preview.save(f"previews/{suffix}.png")
