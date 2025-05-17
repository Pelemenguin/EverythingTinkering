# import json

# input_file = open("convertion/converted.json", "r")
# raw = json.loads(input_file.read())
# input_file.close()

# def hex_to_tuple(hex_input):
#     a = int(hex_input[0:2], base=16)
#     r = int(hex_input[2:4], base=16)
#     g = int(hex_input[4:6], base=16)
#     b = int(hex_input[6:8], base=16)
#     return (r, g, b, a)

# processed = {}
# for d in raw:
#     processed[d["grey"]] = hex_to_tuple(d["color"])

def convert_palette(raw):

    def hex_to_tuple(hex_input):
        a = int(hex_input[0:2], base=16)
        r = int(hex_input[2:4], base=16)
        g = int(hex_input[4:6], base=16)
        b = int(hex_input[6:8], base=16)
        return (r, g, b, a)

    processed = {}
    for d in raw:
        processed[d["grey"]] = hex_to_tuple(d["color"])
    
    return processed