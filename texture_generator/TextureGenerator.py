import typing
import os
import os.path
import PIL.Image

###############
#   Classes   #
###############

class PartPath:
    """A path of a part Texture."""

    def __init__(self, path: str, part_type: str = "unspecified"):
        """Part Path initialization.
        
        :param path: A relative path of image.
        :param part_type: Part's category."""
        self._path: str = path
        self._type: str = part_type
    
    def __repr__(self):
        return f"({repr(self._path)} of {repr(self._type)})"

class TextureGenerator:

    """A texture generator."""

    def __init__(self, parts: list[PartPath]):
        """Texture Generator initialization.
        
        :param parts: A list of Part Paths."""
        self._parts = parts
        self._fallbacks = []
        self._functions: dict[str, tuple[function, int|float]] = {}
        self._childs: list[SubTextureGenerator] = []
        self._filter = lambda i: True
    
    def set_fallback(self, fallbacks: list[str]):
        self._fallbacks = fallbacks
    
    def add_function(self, func, identifier: str=None, priority: int|float = 0):
        """Add a function to the Texture Generator.
        
        :param func: A function. Input an image and return a processed image.
        :param identifier: An identifier for your function.
        :param priority: Priorize your function. Functions of higher priority will be applied first."""
        if identifier != None:
            self._functions[identifier] = (func, priority)
        else:
            self._functions["unnamed_"+str(len(self._functions))] = (func, priority)

    def _get_input_path(self, part_path):
        path_dir = os.path.dirname(part_path)
        for f in self._fallbacks:
            try:
                l = os.path.basename(part_path).split(".")
                l[-2] += f"_{f}"
                part_name = ".".join(l)
            except:
                l = os.path.basename(part_path) + f"_{f}"
                part_name = l
            result = os.path.join(path_dir, part_name)
            if os.path.exists(os.path.join(path_dir, part_name)):
                # print(result)
                return result
        return part_path

    def generate(self, suffix: str, input_path = "resources", output_path = "outputs", part_types: list = None):
        """Generate images.
        
        :param suffix: Suffix for your image.
        :param input_path: Read images from this path according to Part Paths.
        :param output_path: Save images here.
        :param part_types: Part types that will be generated."""

        functions = list(self._functions[k] for k in self._functions)
        functions = sorted(functions, key=lambda i: i[1], reverse=True)

        self._childs = sorted(self._childs, key=lambda i: i._priority, reverse=True)
        
        for part in self._parts:
            if (part_types != None) and (part._type not in part_types):
                print(f"Ignored part {part._path}, for {part._type} is not wanted")
                continue
            this_input_path = os.path.normpath(os.path.join(input_path, part._path))
            this_input_path = self._get_input_path(this_input_path)
            this_output_path = os.path.normpath(os.path.join(output_path, part._path))
            try:
                image = PIL.Image.open(this_input_path).convert("RGBA")
            except:
                print(f"Unparsable input {this_input_path}")
                continue
            for c in self._childs:
                if (c._priority <= 0): break
                image = c.operate(image)
            for f in functions:
                image = f[0](image)
            for c in self._childs:
                if (c._priority > 0): continue
                image = c.operate(image)
            this_dir = os.path.dirname(this_output_path)
            l = (os.path.basename(this_output_path).split("."))
            l[-2] += f"_{suffix}"
            this_name = ".".join(l)
            if not os.path.exists(this_dir):
                os.makedirs(this_dir)
            suffixed_path = os.path.join(this_dir, this_name)
            os.open(suffixed_path, os.O_CREAT)
            image.save(suffixed_path)
            print(f"Part generated {suffixed_path}")
            image.close()

class SubTextureGenerator(TextureGenerator):

    """A SubTextureGenerator object."""

    def __init__(self, parent: TextureGenerator, filter = (lambda i:True), priority: int = 0):
        """Create a SubTextureGenerator object.
        When using this to generate textures, it first take corresponding pixels in parent TextureGenerator out, then operate the texture.
        So it may write pixels to parent TextureGenerator where is not in its filter.
        
        :param parent: A `TextureGenerator` object.
        :param filter: To decide which pixels should be added in SubTextureGenerator.
        Should be a function that accept a (x, y) pair.
        :param priority: Priority of the generator. Generators will be executed before parent Generator if this is greater than 0."""
        super().__init__(parent._parts)
        parent._childs.append(self)
        self._functions = parent._functions.copy()
        self.filter = filter
        self._priority = priority
    
    def operate(self, image: PIL.Image.Image) -> PIL.Image.Image:
        """Operate a texture.
        
        :param image: The input image."""
        filtered = image.copy()
        for y in range(image.height):
            for x in range(image.width):
                if not self.filter((x,y)):
                    filtered.putpixel((x,y), (0, 0, 0, 0))
        
        functions = list(self._functions[k] for k in self._functions)
        functions = sorted(functions, key=lambda i: i[1], reverse=True)

        for f in functions:
            # print(functions)
            filtered = f[0](filtered)
        
        result = image.copy()
        for y in range(image.height):
            for x in range(image.width):
                if filtered.getpixel((x,y))[3] != 0:
                    result.putpixel((x,y), filtered.getpixel((x,y)))
        # return filtered
        return result

#################################
#   Image operation functions   #
#################################

def recolor_function(transformation):
    """Generates a function that recolors an image.
    
    :param transformation: A `function` or a `dict`. Accepts a `tuple` and returns another one."""
    def result(image: PIL.Image.Image):
        copied = image.copy()
        data = copied.load()
        for y in range(image.height):
            for x in range(image.width):
                if isinstance(transformation, dict):
                    try:
                        data[x,y] = transformation[data[x,y]]
                    except:
                        data[x,y] = (0, 0, 0, 0)
                else:
                    data[x,y] = transformation(data[x,y])
        return copied
    return result

def grayscale_colorize_function(transformation: dict[int, tuple[int, int, int, int]], strict: bool = False):
    """Generates a function that colorize a grayscale image.
    
    :param transformation: A `dict`. Keys are gray value. Values are pixels.
    :param strict: If set to True, non-gray pixels will be ignored. This parameter is defaultly False"""
    def transformer(input_pixel):
        processed = sorted(transformation, reverse=True)
        if input_pixel == (0, 0, 0, 0):
            return (0, 0, 0, 0)
        try:
            return transformation[input_pixel[1]]
        except:
            for k in processed:
                if input_pixel[1] >= k:
                    return transformation[k]
        return (0, 0, 0, 0)
    if strict:
        def strict(input_pixel):
            if not (input_pixel[0] == input_pixel[1] == input_pixel[2]):
                return input_pixel
            else:
                return transformer(input_pixel)
        return recolor_function(strict)
    else:
        return recolor_function(transformer)

def multiply(im: PIL.Image.Image, scale: float = 1.5):
    """Generates a function that multiplies a image over the original one.
    
    :param im: image to composite over this one.
    :param scale: Scale `im` first."""
    def result(image: PIL.Image.Image):
        alpha_image = image.getchannel("A")
        # sized_im = im.resize(alpha_image.size, PIL.Image.Resampling.NEAREST)
        # sized_im.putalpha(alpha_image)
        # for y in range(alpha_image.height):
        #     for x in range(alpha_image.width):
        #         current = alpha_image.getpixel((x,y))
        #         current *= alpha
        #         current //= 255
        #         alpha_image.putpixel((x,y), current)
        # print(alpha_image.size)
        # print(im.size)
        # image.putalpha(alpha_image)
        # sized_im.add(image, dest, source)
        copied = image.copy()
        for y in range(image.height):
            for x in range(image.width):
                original = list(image.getpixel((x,y)))
                new = list(im.getpixel((x%im.width,y%im.height)))
                for i in range(len(original)):
                    original[i] /= 255
                    original[i] *= new[i] * scale
                    original[i] = int(original[i])
                    if original[i] >= 256:
                        original[i] = 255
                copied.putpixel((x,y), tuple(original))
        return copied
    return result