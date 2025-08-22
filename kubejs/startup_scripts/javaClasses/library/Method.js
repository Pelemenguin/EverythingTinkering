// priority: 2000000100

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Class Method
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    JavaUtils
    ConstantPoolEntries
*/

/**
 * 
 * @param {string} name 
 * @param {string} descriptor
 * @param {ClassCreator} parent 
 */
const Method = function(name, descriptor, parent) {
    this.name = name;
    this.descriptor = descriptor;
    this.parent = parent;

    this.access = 1;

    /** @type {[string, {generateByteCode: (classCreator: ClassCreator) => number[]}][]} */
    this.attributes = [];
};

Method.prototype.setPublic = function() {
    this.access -= (this.access & 7);
    this.access |= 1;
    return this;
};

Method.prototype.setProtected = function() {
    this.access -= (this.access & 7);
    this.access |= 4;
    return this;
};

Method.prototype.setAbstract = function() {
    this.access |= 0x0400;
    return this;
};

Method.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(8)
        .putShort(0, this.access)
        .putShort(2, this.createConstant(1, new ConstantPoolEntries.Utf8(this.name)))
        .putShort(4, this.createConstant(1, new ConstantPoolEntries.Utf8(this.descriptor)))
        .putShort(6, this.attributes.length)
        .array()
        .concat((() => {
            let result = [];
            this.attributes.forEach(([name, attr]) => {
                let byteCode = attr.generateByteCode(this.parent);
                result = result.concat(
                    JavaUtils.ByteBuffer.allocate(6).putShort(0, this.createConstant(1, new ConstantPoolEntries.Utf8(name)))
                        .putInt(2, byteCode.length).array()
                ).concat(byteCode);
            });
            return result;
        })())
        ;
};

/**
 * 
 * @param {string} name 
 * @param {{generateByteCode: () => number[]}} attr 
 */
Method.prototype.addAttribute = function(name, attr) {
    this.attributes.push([name, attr]);
};

/**
 * @param {number} tag
 * @param {{generateByteCode: () => number[]}} constant
 * - - - - -
 * @returns {number}
 */
Method.prototype.createConstant = function(tag, constant) {
    return this.parent.createConstant(tag, constant);
};