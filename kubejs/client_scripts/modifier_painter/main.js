/**
 * A `Modifier Icon` class.
 * 
 * @param {str} path path of the base texture. No `.png` suffix.
 */
function ModifierIcon(path) {
    /** @type {str} */
    this.base = path + ".png"
    console.info(this.base)
}

/**
 * 
 * @param {string} id The id of the painter. Usually the id of the modifier.
 * @param {ModifierIcon} icon A `ModifierIcon` object.
 */
function ModifierPainter(id, icon) {

    /** @type {string}                 */ this.id = id
    /** @type {ModifierIcon}           */ this.icon = icon
    /** @type {str}                    */ this.title = `modifier.${this.id.replace(":", ".")}`
    /** @type {ModifierPainterExtra[]} */ this.extras = []
    /** @type {number}                 */ this.width = 96
    /** @type {number}                 */ this.x_shift = 0
    /** @type {number}                 */ this.y_shift = 0
    
    /**
     * Get the height of the painter.
     * 
     * @returns {number}
     */
    this.getHeight = function () {
        
    }

    /**
     * Add an extra object to paint.
     * 
     * @param {ModifierPainterExtra} object 
     */
    this.addExtra = function (object) {
        this.extra.push(object)
    }

    /**
     * Get the object that can be paint.
     * 
     * @param {number} x_shift Given x shift.
     * @param {number} y_shift Given y shift.
     * @returns {Object}
     * 
     */
    this.getPainterObject = function () {
        let window = Client.window
        let icon_object = {
            type: "rectangle",
            x: this.x_shift,
            y: this.y_shift,
            w: 32,
            h: 32,
            texture: this.icon.base
        }
        let title_object = {
            x: -(Painter.screenWidthUnit - this.width) + this.x_shift,
            y: this.y_shift,
            w: 64,
            type: "text",
            alignX: "right",
            alignY: "top",
            text: text
        }
        let result = {}
        result[`modifier_painter.icon:${this.id.replace(":", ".")}`] = icon_object
        result[`modifier_painter.title:${this.id.replace(":", ".")}`] = title_object
        this.extras.forEach(extra => {
            result[`modifier_painter.extra.${extra.type}:${this.id.replace(":", ".")}`] = extra.object
        })
        return result
    }

}

/**
 * Create an extra object to paint.
 * Base class, should be implemented by subclasses.
 * 
 * @param {string} type 
 * @param {Object} object 
 */
function ModifierPainterExtra(type, object) {
    /** @type {string} */ this.type = type
    /** @type {Object} */ this.object = object
}

let test = new ModifierPainter("kubejs:igniting", new ModifierIcon("kubejs:textures/gui/modifiers/igniting"))
console.info(test.getPainterObject())

PlayerEvents.tick(event => {
    event.player.paint(test.getPainterObject())
})
console.info()

/**
 * 
 * @exports
 * @param {ModifierPainter[]} painter 
 * @param {Internal.player} player 
 */
function draw(painters, player) {

}