# Texture Generator

This folder is for Everything Tinkering's texture generation.
Tinker's Construct's texture generator is too simple,
so I used Python's PIL lib to generate custom textures.

## How to use?

1. Download Tinker's Construct 3, of which the version matches the modpack's TiC version.
    (That is, you can directly use the TiC3 in your `mods` folder. )
2. Create a folder here named `resources`.
3. Extract these folders:

    - `/assets/tconstruct/textures/item`
    - `/assets/tconstruct/textures/fluid`
    - `/assets/tconstruct/textures/tinker_armor`

    And place them under `resources` folder.
4. Run all `suffix_xxx.py`.
5. Run any `material_xxx.py` you need.

## `Preview.py`

You may want to render a preview for all textures for a certain material.
You can run `Preview.py` after you've generated part textures of some material.

### `Preview.py <material_id>`

Creates a part texture preview.

Example:
    - `python Preview.py tconstruct:amethyst`
        - Generate part texture preview for the `tconstruct:amethyst` material.

### `scaled:<int>`

Scale the preview.

Example:
    - `python Preview.py tconstruct:amethyst scaled:4`
        - Generate preview and scale it by 4.
