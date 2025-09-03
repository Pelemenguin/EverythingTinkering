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

// @ts-check

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

    /**
     * @type {[start: number, end: number, handler: number, type: string][]}
     */
    this.exceptions = [];

    /** @type {[name: string, attr: {generateByteCode: (codeAttribute: CodeAttribute, classCreator: ClassCreator) => number[]}][]} */
    this.attributes = [];
};

/**
 * @param {(classCreator: ClassCreator) => number[]} generator
 */
CodeAttribute.prototype.setCustomByteCodeGenerator = function(generator) {
    this.customGenerator = generator;
    return this;
};

/**
 * @param {number} start
 * @param {number} end
 * @param {number} handler
 * @param {string | undefined} type Leave empty to catch all exceptions
 */
CodeAttribute.prototype.addExceptionHandler = function(start, end, handler, type) {
    this.exceptions.push([start, end, handler, type]);
    return this;
};

/**
 * @param {string} name
 * @param {{generateByteCode: (codeAttribute: CodeAttribute, classCreator: ClassCreator) => number[]}} attribute
 */
CodeAttribute.prototype.addAttribute = function(name, attribute) {
    this.attributes.push([name, attribute]);
    return this;
};

/**
 * @param {ClassCreator} classCreator
 */
CodeAttribute.prototype.generateByteCode = function(classCreator) {
    let content = this.customGenerator(classCreator).map(b => b > 127 ? b - 256 : b);
    let length = content.length;

    let exceptionTable = JavaUtils.ByteBuffer.allocate(8 * this.exceptions.length);
    this.exceptions.forEach(e => {
        exceptionTable.putShort(e[0]);
        exceptionTable.putShort(e[1]);
        exceptionTable.putShort(e[2]);
        exceptionTable.putShort(e[3] == undefined ? 0 : classCreator.CONSTANT_Class(e[3]));
    });

    /** @type {number[]} */
    let attributes = [];
    this.attributes.forEach(([name, attr]) => {
        let bc = attr.generateByteCode(this, classCreator);
        let ref = JavaUtils.ByteBuffer.allocate(6).putShort(0, classCreator.CONSTANT_Utf8(name)).putInt(2, bc.length).array();
        attributes = attributes.concat(ref, bc);
    });

    return JavaUtils.ByteBuffer.allocate(8).putShort(0, this.maxStack).putShort(2, this.maxLocals).putInt(4, length).array().concat(content).concat(
        JavaUtils.ByteBuffer.allocate(2).putShort(0, this.exceptions.length).array(),
        exceptionTable.array(),
        JavaUtils.ByteBuffer.allocate(2).putShort(0, this.attributes.length).array(),
        attributes
    );
};
