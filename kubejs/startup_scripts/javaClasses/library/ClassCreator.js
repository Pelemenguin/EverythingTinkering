// priority: 2000000000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Class Creator
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
 * @param {string} name 
 */
function ClassCreator(name) {
    this.name = name;
    this.constantPoolCounter = 1;

    /** @type {[tag: number, {generateByteCode: () => number[]}][]} */
    this.constantPool = [];
}

/**
 * @returns {number[]}
 */
ClassCreator.prototype.generateByteCode = function() {
    let thisClass = this.createConstant(7, new ConstantPoolEntries.Class(this.createConstant(1, new ConstantPoolEntries.Utf8(this.name))));
    let superClass = this.createConstant(7, new ConstantPoolEntries.Class(this.createConstant(1, new ConstantPoolEntries.Utf8("java/lang/Object"))));

    return [-54, -2, -70, -66, 0, 0, 0, 61]
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.constantPoolCounter).array())
        .concat((() => {
            let result = [];
            this.constantPool.map(c => c[1].generateByteCode()).forEach(bc => {
                result = result.concat(bc);
            });
            return result;
        })())
        .concat([0, 33]) // ACC_PUBLIC, ACC_SUPER
        .concat(JavaUtils.ByteBuffer.allocate(4).putShort(0, thisClass).putShort(2, superClass).array())
        .concat([0, 0]) // 0 Interface
        .concat([0, 0]) // 0 Field
        .concat([0, 0]) // 0 Method
        .concat([0, 0]) // 0 Attributes
        ;
};

/**
 * - Push a constant into the Constant Pool, and return the index of this constant.
 * - Directly return the index of the constant if it already exists.
 * - 将一个常量放入常量池，并返回该常量的索引。
 * - 当常量已存在时，直接返回该常量的索引。
 * - - - - -
 * @param {number} tag
 * @param {{generateByteCode: () => number[]}} constant
 * - - - - -
 * @returns {number}
 */
ClassCreator.prototype.createConstant = function(tag, constant) {
    // eslint-disable-next-line no-unused-vars
    let index = this.constantPool.findIndex(([checkTag, obj], _1, _2) => checkTag === tag && Object.keys(obj).every(k => k === 'generateByteCode' || constant[k] === obj[k]));
    if (index !== -1) return index;
    this.constantPool.push([tag, constant]);
    return this.constantPoolCounter ++;
};

/**
 * - Get constant from the Constant Pool at the specific index.
 * - 从常量池获取指定索引的常量。
 * - - - - -
 * @param {number} index 
 * - - - - -
 * @returns {{generateByteCode: () => number[]}}
 */
ClassCreator.prototype.getConstant = function(index) {
    return this.constantPool[index - 1][1];
};