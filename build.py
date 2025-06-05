MODPACK_NAME = "Everything Tinkering"
# Leave `MODPACK_VERSION` empty if this is a build version.
# If you are not developer, you should leave this empty.
# Changing this variable will not change the fact whether it is a build version or not.
# But this can affect the version showed in game and disable the build version warning.
MODPACK_VERSION = ""
MODLOADER_VERSION = "neoforge-1.20.1-47.1.5"

# --------------------

import json
import re
import os
import os.path
import zipfile
import fnmatch
import time
import urllib.request

curdir = os.path.relpath(os.path.dirname(os.path.realpath(__file__)), os.getcwd())

manifest = {
    "manifestType": "minecraftModpack",
    "manifestVersion": 1,
    "name": f"{MODPACK_NAME}",
    "version": f"{MODPACK_VERSION if MODPACK_VERSION else f"Build Version. Build time: {time.asctime(time.localtime(time.time()))}"}",
    "author": "Pelemenguin",
    "overrides": "overrides",
    "minecraft": {
        "version": "1.20.1",
        "modLoaders": [{
             "id": f"{MODLOADER_VERSION}",
             "primary": True
        }]
    },
    "files": []
}

modlist_file = open('modlist.md', 'r')
mods = re.findall(r'- \[(.*)\]\((.*)\) by (.*)\n<!-- (.*):(.*) -->', modlist_file.read(), flags=re.M)
modlist_file.close()

tconstruct_file_id = 0
read = 0
for m in mods:
    manifest["files"].append({
        "projectID": int(m[3]),
        "fileID": int(m[4]),
        "required": True
    })
    read += 1
    print(f"Creating manifest.json: {read}/{len(mods)} {read/len(mods):.2%}", end="\r")
print()

manifest_json = json.dumps(manifest, indent=4)
# print(manifest_json)

modlist_html = ""
modlist_html += "<ul>\n"
for m in mods:
    modlist_html += f"    <li><a href=\"{m[1]}\">{m[0]} by {m[2]}</a></li>\n"
modlist_html += "</ul>"
# print(modlist_html)

output = zipfile.ZipFile(f"{MODPACK_NAME} {"v"+MODPACK_VERSION if MODPACK_VERSION else "[Build]"}.zip", "w")
output.writestr("manifest.json", manifest_json)
output.writestr("modlist.html", modlist_html)

if not MODPACK_VERSION:
    output.writestr("README.md", "当前版本是构建版本，并非发布版，因此可能含有未完成代码。\n\nThis version is built from `build.py`. This means the current file is not a release. Thus, it may contain incomplete codes.")

zipping = []
zipping.extend(os.walk(os.path.join(curdir, "kubejs")))
zipping.extend(os.walk(os.path.join(curdir, "config")))

# Exclude files here
excluding = []

total = len(zipping)
compressed = 0

for root, dirs, files in zipping:
    # print(root, dirs, files)
    compressed += 1
    for f in files:
        file_path = os.path.join(root, f)
        if any(fnmatch.fnmatch(file_path, ex) for ex in excluding): continue
        arcname = os.path.join("overrides", os.path.relpath(file_path, os.getcwd()))
        output.write(file_path, arcname)
    print(f"Compressing files: {compressed}/{total} {(compressed/total):.2%}", end="\r")

output.close()