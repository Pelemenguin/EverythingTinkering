import typing
import os
import os.path
import PIL.Image
import PIL.ImageCms
import PIL.ImageDraw
import PIL.ImageDraw2
import PIL.ImageFile
import PIL.ImageFilter
import PIL.ImageMath
import PIL.ImageMorph
import PIL.ImageOps
import PIL.ImageTransform
import PIL.PSDraw

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
        self._childs = []
    
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
            l = os.path.basename(part_path).split(".")
            l[-2] += f"_{f}"
            part_name = ".".join(l)
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
        
        for part in self._parts:
            if (part_types != None) and (part._type not in part_types):
                continue
            this_input_path = os.path.normpath(os.path.join(input_path, part._path))
            this_input_path = self._get_input_path(this_input_path)
            this_output_path = os.path.normpath(os.path.join(output_path, part._path))
            image = PIL.Image.open(this_input_path).convert("RGBA")
            for f in functions:
                image = f[0](image)
            this_dir = os.path.dirname(this_output_path)
            l = (os.path.basename(this_output_path).split("."))
            l[-2] += f"_{suffix}"
            this_name = ".".join(l)
            if not os.path.exists(this_dir):
                os.makedirs(this_dir)
            suffixed_path = os.path.join(this_dir, this_name)
            os.open(suffixed_path, os.O_CREAT)
            image.save(suffixed_path)
            image.close()

#################################
#   Image operation functions   #
#################################

def recolor_function(transformation):
    """Generates a function that recolors an image.
    
    :param transformation: A `function` or a `dict`. Accepts a `tuple` and returns another one."""
    def result(image: PIL.Image.Image):
        data = image.load()
        for y in range(image.height):
            for x in range(image.width):
                if isinstance(transformation, dict):
                    try:
                        data[x,y] = transformation[data[x,y]]
                    except:
                        data[x,y] = (0, 0, 0, 0)
                else:
                    data[x,y] = transformation(data[x,y])
        return image
    return result

def grayscale_colorize_function(transformation: dict[int, tuple[int, int, int, int]]):
    """Generates a function that colorize a grayscale image.
    
    :param transformation: A `dict`. Keys are gray value. Values are pixels."""
    def transformer(input_pixel):
        processed = sorted(transformation)
        if input_pixel == (0, 0, 0, 0):
            return (0, 0, 0, 0)
        try:
            return transformation[input_pixel[1]]
        except:
            for k in processed:
                if input_pixel[1] >= k:
                    return transformation[k]
        return (0, 0, 0, 0)
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
                image.putpixel((x,y), tuple(original))
        return image
    return result