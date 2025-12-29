import json
import os
import os.path
import zipfile
import fnmatch
import time
import sys
import tomllib

def build_modpack(args: list[str]):
    options = {
        "build_version": "Unknown"
    }

    args_index = 0
    while (args_index < len(args)):
        match (args[args_index]):
            case "--build-version":
                args_index += 1
                try:
                    options["build_version"] = args[args_index]
                except:
                    print("An argument is required after '--build-version'")
                    return
            case unknown:
                print(f"Unknown option: {args[args_index]}")
                help_build(["build"])
                return
        args_index += 1

    curdir = os.path.relpath(os.path.dirname(os.path.realpath(__file__)), os.getcwd())

    modlist_file = open('modlist.json', 'r', encoding="utf-8")
    modlist_content = json.loads(modlist_file.read())
    MODPACK_NAME = modlist_content['info']['name']
    MODPACK_VERSION = modlist_content['version']['modpack']
    MINECRAFT_VERSION = modlist_content['version']['minecraft']
    MODLOADER_VERSION = modlist_content['version']['modloader']
    BUILD_TIME = time.asctime(time.localtime(time.time()))

    LATEST_COMMIT = options["build_version"]

    print("Build begin:")
    print(f" - Modpack name: {MODPACK_NAME}")
    print(f" - Modpack version: {MODPACK_VERSION if MODPACK_VERSION else "Build Version"}")
    print(f" - Mod loader version: {MODLOADER_VERSION}")
    if not MODPACK_VERSION: print(f" - Latest commit: {LATEST_COMMIT}")
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
        if "tags" not in m or "DeveloperOnly" not in m["tags"]:
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

    output = zipfile.ZipFile(f"{MODPACK_NAME} {"v"+MODPACK_VERSION if MODPACK_VERSION else f"[Build]{" "+LATEST_COMMIT if LATEST_COMMIT != "Unknown" else ""}"}.zip", "w")
    output.writestr("manifest.json", manifest_json)
    output.writestr("modlist.html", modlist_html)

    if not MODPACK_VERSION:
        output.writestr("README.md", f"""当前版本是构建版本，并非发布版，可能出现问题。
最新提交：{LATEST_COMMIT}
构建时间：{BUILD_TIME}

This is a build version, not a release. Problems may be encountered.
Latest commit: {LATEST_COMMIT}
Build time: {BUILD_TIME}""")

    zipping = []
    zipping.extend(os.walk(os.path.join(curdir, "kubejs")))
    zipping.extend(os.walk(os.path.join(curdir, "config\\ftbquests")))
    # zipping.extend(os.walk(os.path.join(curdir, "config")))
    zipping.extend(os.walk(os.path.join(curdir, "LICENSES")))

    # Exclude files here
    excluding = [
        "./kubejs/probe/*",                 # Generated ProbeJS data
        "./kubejs/README.txt",              # KubeJS's README file
        "./kubejs/startup_scripts/docs.js", # File for ProbeJS Doc gen
        "./kubejs/definitions.d.ts",        # For developers, not necessary in modpacks
        "./kubejs/config/*",                # KubeJS Config
        "./kubejs/jsconfig.json",           # JSConfig
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

def check_mods(args: list[str]):
    try:
        detected_mods: dict[str, str] = {}
        listed_mods: dict[str, str] = {}
        mods = os.listdir('mods')
        for m in mods:
            if not m.endswith('.jar'):
                continue
            modfile = zipfile.ZipFile('mods/'+m, 'r')
            try:
                toml_file = modfile.read('META-INF/mods.toml')
                modinfo = tomllib.loads(toml_file.decode())
                for i in modinfo['mods']:
                    modid = i['modId']
                    modversion = i['version']
                    detected_mods[modid] = [modversion]
            except:
                print(f"Cannot read mod info from {m}. Possibly not a mod.")
            finally:
                modfile.close()
        modlist_file = open('modlist.json', 'r')
        modlist = json.loads(modlist_file.read())
        for m in modlist['mods']:
            listed_mods[m['mod_id']] = m['version']
        missings = 0
        mismatched = 0
        extra = 0
        for k in listed_mods:
            v = listed_mods[k]
            if not k in detected_mods:
                print(f"Missing      | {k} is missing. Required version: {v}")
                missings += 1
            elif detected_mods[k][0] == v: ...
            else:
                print(f"Mismatched   | Installed {k} is of version {detected_mods[k][0]}, required {v}")
                mismatched += 1
            try:
                del detected_mods[k]
            except KeyError:
                ...
        for k in detected_mods:
            v = detected_mods[k]
            print(f"Not required | Installed extra mod {k} of version {v}")
            extra += 1
        print()
        print(f"Missing mods    | {missings}")
        print(f"Mismatched mods | {mismatched}")
        print(f"Extra mods      | {extra}")

        if missings == mismatched == extra == 0:
            print("All of you mods are up-to-date.")
    except Exception as e:
        try: modlist_file.close()
        except: ...
        raise

def gen_markdown(args: list[str]):
    TAG_DESCRIPTIONS = {
        "developerOnly": "This mod is only installed when developing. Not included in the modpack."
    }

    modlistMarkdown = open('modlist.md', 'w')
    modlistJson = open('modlist.json', 'r')

    modlist = json.loads(modlistJson.read())

    modlistMarkdown.write("# Mod list\n")
    modlistMarkdown.write("\n")
    modlistMarkdown.write("<!-- Generated from `build.py` -->\n")

    for modinfo in modlist['mods']:
        modlistMarkdown.write(f"- [{modinfo['name']}]({modinfo['url']}) *{modinfo['version']}* by {modinfo['author']}\n")
        try:
            tags = modinfo['tags']
            for t in tags:
                modlistMarkdown.write(f"  - {TAG_DESCRIPTIONS['developerOnly']}\n")
        except: ...

    modlistMarkdown.close()
    modlistJson.close()

def help_build(args: list[str]):
    if len(args) == 0:
        print()
        print("Available tasks:")
        print("build       | Build the modpack zip files")
        print("check       | Check if mods are of correct versions")
        print("help        | Show this help menu")
        print("gen-modlist | Gen a `modlist.md`")
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
                print("To see the usage of a task.")
            case "build":
                print("Usage:")
                print("    build [options]")
                print()
                print("Build the modpack zip file.")
                print()
                print("Options:")
                print("    --build-version <commit-hash> | Record last commit in the modpack's README")
            case "check":
                print("Usage:")
                print("    check")
                print()
                print("Check if mods are of correct versions.")
                print("This task is for developers to check if their mods are up-to-date with other developers.")
                print("Normal players do not to check this.")
            case "gen-modlist":
                print("Usage:")
                print("    gen-modlist")
                print()
                print("Gen a `modlist.md`")
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
        case "check":
            check_mods(args[1:])
        case "gen-modlist":
            gen_markdown(args[1:])
        case _:
            print(f"No such task: {task}")
            print()
            help_build([])
