import getopt
import sys
import json

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