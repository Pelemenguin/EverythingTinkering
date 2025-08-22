// priority: 2000000100

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Code Attribute
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
*/

/**
 * @param {number} maxStack
 * @param {number} maxLocals
 */
const CodeAttribute = function(maxStack, maxLocals) {
    this.maxStack = maxStack;
    this.maxLocals = maxLocals;
    // this.generator = byteCodeGenerator;
    /** @type {?(classCreator: ClassCreator) => number[]} */
    this.customGenerator = () => [0xb1];
};

/**
 * @param {(classCreator: ClassCreator) => number[]} generator
 */
CodeAttribute.prototype.setCustomByteCodeGenerator = function(generator) {
    this.customGenerator = generator;
    return this;
};

/**
 * @param {ClassCreator} classCreator
 */
CodeAttribute.prototype.generateByteCode = function(classCreator) {
    let content = this.customGenerator(classCreator).map(b => b > 127 ? b - 256 : b);
    let length = content.length;

    return JavaUtils.ByteBuffer.allocate(8).putShort(0, this.maxStack).putShort(2, this.maxLocals).putInt(4, length).array().concat(content).concat(
        JavaUtils.ByteBuffer.allocate(2).putShort(0, 0).array(),
        JavaUtils.ByteBuffer.allocate(2).putShort(0, 0).array()
    );
};
