from TextureGenerator import *
import json

settings_file = open("_generator_settings.json", "r")
settings = json.loads(settings_file.read())
parts = []
# for k in settings:
#     v = settings[k]
#     for i in v:
#         parts.append(PartPath(i, k))
for part in settings:
    k = part["stat_type"]
    v = part["path"].split(':')[-1] + ".png"
    # print(k, v)
    parts.append(PartPath(v, k))
settings_file.close()