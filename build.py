import json
import os
import os.path
import zipfile
import fnmatch
import time
import sys

def build_modpack(args: list[str]):
    curdir = os.path.relpath(os.path.dirname(os.path.realpath(__file__)), os.getcwd())

    modlist_file = open('modlist.json', 'r', encoding="utf-8")
    modlist_content = json.loads(modlist_file.read())
    MODPACK_NAME = modlist_content['info']['name']
    MODPACK_VERSION = modlist_content['version']['modpack']
    MINECRAFT_VERSION = modlist_content['version']['minecraft']
    MODLOADER_VERSION = modlist_content['version']['modloader']
    BUILD_TIME = time.asctime(time.localtime(time.time()))

    LATEST_COMMIT = ''
    try:
        headfile = open('.git/HEAD', 'r')
        ref = headfile.read()
        if ref.startswith("ref:"):
            path = ref[4:].strip()
            latest_commit_file = open('.git/'+path, 'r')
            LATEST_COMMIT = latest_commit_file.read().strip()
            latest_commit_file.close()
        else:
            LATEST_COMMIT = ref
        headfile.close()
    except:
        LATEST_COMMIT = 'Unknown'

    print("Build begin:")
    print(f" - Modpack name: {MODPACK_NAME}")
    print(f" - Modpack version: {MODPACK_VERSION if MODPACK_VERSION else "Build Version"}")
    print(f" - Mod loader version: {MODLOADER_VERSION}")
    if not MODLOADER_VERSION: print(f" - Latest commit: {LATEST_COMMIT}")
    print()

    # version = MODPACK_VERSION if MODPACK_VERSION else (
    #     f"Build Version. Build time: {BUILD_TIME}" if LATEST_COMMIT == "Unknown"
    #     else f"Build Version. Latest commit: {LATEST_COMMIT}"
    # )
    version = MODPACK_VERSION if MODPACK_VERSION else "Build version"
    manifest = {
    "manifestType": "minecraftModpack",
    "manifestVersion": 1,
    "name": f"{MODPACK_NAME}",
    "version": f"{version}",
    "author": "Pelemenguin",
    "overrides": "overrides",
    "minecraft": {
        "version": f"{MINECRAFT_VERSION}",
        "modLoaders": [{
             "id": f"{MODLOADER_VERSION}",
             "primary": True
        }]
    },
    "files": []
}

    mods = modlist_content['mods']
    modlist_file.close()

    read = 0
    for m in mods:
        manifest["files"].append({
        "projectID": m['curse_id']['project'],
        "fileID": m['curse_id']['file'],
        "required": True
    })
        read += 1
        percent = read/len(mods)
        print(f"Creating manifest.json --------- [{'#'*round(percent*20): <20}] {read}/{len(mods)} {percent:.2%}", end="\r")
    print()

    manifest_json = json.dumps(manifest, indent=4)
# print(manifest_json)

    modlist_html = ""
    modlist_html += "<ul>\n"
    read = 0
    for m in mods:
        modlist_html += f"    <li><a href=\"{m['url']}\">{m['name']} by {m['author']}</a></li>\n"
        read += 1
        percent = read/len(mods)
        print(f"Creating modlist.html ---------- [{'#'*round(percent*20): <20}] {read}/{len(mods)} {percent:.2%}", end="\r")
    modlist_html += "</ul>"
    print()

    output = zipfile.ZipFile(f"{MODPACK_NAME} {"v"+MODPACK_VERSION if MODPACK_VERSION else "[Build]"}.zip", "w")
    output.writestr("manifest.json", manifest_json)
    output.writestr("modlist.html", modlist_html)

    if not MODPACK_VERSION:
        output.writestr("README.md", f"""当前版本是构建版本，并非发布版，可能出现问题。
最新提交：{LATEST_COMMIT if LATEST_COMMIT != 'Unknown' else "未找到 Git 仓库，未知"}
构建时间：{BUILD_TIME}

This is a build version, not a release. Problems may be encountered.
Latest commit: {LATEST_COMMIT if LATEST_COMMIT != 'Unknown' else "No Git repository found. Unknown."}
Build time: {BUILD_TIME}""")

    zipping = []
    zipping.extend(os.walk(os.path.join(curdir, "kubejs")))
    zipping.extend(os.walk(os.path.join(curdir, "config")))
    zipping.extend(os.walk(os.path.join(curdir, "LICENSES")))

# Exclude files here
    excluding = [
    "./kubejs/probe/*",   # Generated ProbeJS data
    "./kubejs/README.txt"   # KubeJS's README file
]

    total = len(zipping)
    compressed = 0

    for root, dirs, files in zipping:
    # print(root, dirs, files)
        compressed += 1
        for f in files:
            file_path = os.path.join(root, f)
        # print(file_path)
            skipping = False
            for ex in excluding:
                if fnmatch.fnmatch(file_path, ex):
                    skipping = True
                    break
            if skipping: continue
        # if any(fnmatch.fnmatch(file_path, ex) for ex in excluding): continue
            arcname = os.path.join("overrides", os.path.relpath(file_path, os.getcwd()))
            output.write(file_path, arcname)
            percent = compressed/total
            print(f"Compressing folders ------------ [{'#'*round(percent*20): <20}] {compressed}/{total} {percent:.2%}", end=f"\r")
    print("\a")

    output.close()

def help_build(args: list[str]):
    if len(args) == 0:
        print()
        print("Available tasks:")
        print("build | Build the modpack zip files")
        print("help  | Show this help menu")
        print()
        print("Use `python build.py <task>` to run a task.")
        print("Use `python build.py help <command>` to see detailed help for a specific command.")
    else:
        task = args[0]
        match task:
            case "help":
                print("Usage:")
                print("    help")
                print("    help <task>")
                print()
                print("To see the usage of a task")
            case "build":
                print("Usage:")
                print("    build")
                print()
                print("Build the modpack zip file.")
            case _:
                print(f"No such task: {task}")
                help_build([])

if __name__ == '__main__':
    args = sys.argv[1:]
    task = ""
    if len(args) == 0:
        task = "help"
    else:
        task = args[0]
    
    match task:
        case "help":
            help_build(args[1:])
        case "build":
            build_modpack(args[1:])
        case _:
            print(f"No such task: {task}")
            print()
            help_build([])
