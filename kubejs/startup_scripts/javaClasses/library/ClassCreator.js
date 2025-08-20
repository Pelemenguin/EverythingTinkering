// priority: 2000000000

/**
 * @param {string} pack 
 * @param {string} name 
 */
function ClassCreator(pack, name) {
    this.pack = pack;
    this.name = name;
    this.constantPool = [];
}

/**
 * @returns {number[]}
 */
ClassCreator.prototype.generateByteCode = function() {
    return [];
};