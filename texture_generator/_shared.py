import PIL.Image
import typing

def find_min_rect(image: PIL.Image.Image) -> tuple[tuple[int, int], tuple[int, int]]:
    top = image.height
    bottom = -1
    left = image.width
    right = -1
    for x in range(image.width):
        for y in range(image.height):
            if image.getpixel((x, y))[3] > 0:
                top = min(top, y)
                bottom = max(bottom, y)
                left = min(left, x)
                right = max(right, x)
    return ((left, top), (right, bottom))

class Palette:
    def __init__(self, palette: dict[int, tuple[int, int, int, int]]) -> None:
        self.cached: list[None | tuple[int, int, int, int] | int] = [None] * 256

        for g in palette:
            self.cached[g] = palette[g]

        if self.cached[0] is None: self.cached[0] = (0, 0, 0, 255)

    def transform_pixel(self, pixel: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
        if pixel[3] == 0: return (0, 0, 0, 0)
        if pixel[0] != pixel[1] or pixel[1] != pixel[2]:
            return pixel
        grey = pixel[1]
        value = self.cached[grey]
        if (isinstance(value, tuple)): return value
        if (isinstance(value, int)): return self.cached[value]
        i = grey
        while (i > 0):
            i -= 1
            value = self.cached[i]
            if (isinstance(value, int)):
                for j in range(i + 1, grey + 1):
                    self.cached[j] = value
                return self.cached[value]
            if (isinstance(value, tuple)):
                for j in range(i + 1, grey + 1):
                    self.cached[j] = i
                return value

    def to_transformer(self) -> typing.Callable[[PIL.Image.Image], PIL.Image.Image]:
        """
        Generates a function applying this palette on a whole image.
        Note this transformer will modify the original image.
        """
        def transformer(image: PIL.Image.Image) -> PIL.Image.Image:
            for x in range(image.width):
                for y in range(image.height):
                    image.putpixel((x, y), self.transform_pixel(image.getpixel((x, y))))
            return image
        return transformer

    @staticmethod
    def from_argb_string_palette(palette: dict[int, str]) -> "Palette":
        transformed = {}
        for k in palette:
            s = palette[k]
            transformed[k] = (
                int(s[2:4], 16),
                int(s[4:6], 16),
                int(s[6:8], 16),
                int(s[0:2], 16),
            )
        return Palette(transformed)
