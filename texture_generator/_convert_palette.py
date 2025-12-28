def hex_to_tuple(hex_input):
    a = int(hex_input[0:2], base=16)
    r = int(hex_input[2:4], base=16)
    g = int(hex_input[4:6], base=16)
    b = int(hex_input[6:8], base=16)
    return (r, g, b, a)

def convert_palette(raw):

    processed = {}
    for d in raw:
        processed[d["grey"]] = hex_to_tuple(d["color"])
    
    return processed
    
def convert_palette2(raw):
    processed = {}
    for d in raw:
        processed[d] = hex_to_tuple(raw[d])
    return processed