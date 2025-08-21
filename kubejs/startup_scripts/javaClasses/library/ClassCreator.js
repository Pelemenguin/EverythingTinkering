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
    Method
    console
    NativeJavaClass
    startupContext
    topLevelScope
*/

/**
 * @param {string} name 
 */
function ClassCreator(name) {
    this.name = name;
    this.constantPoolCounter = 1;
    /** @type {Method[]} */
    this.methods = [];

    /** @type {[tag: number, {generateByteCode: () => number[]}][]} */
    this.constantPool = [];

    /** @type {?string} */
    this.superClass = "java/lang/Object";
}

/**
 * @returns {number[]}
 */
ClassCreator.prototype.generateByteCode = function() {
    let thisClass = this.createConstant(7, new ConstantPoolEntries.Class(this.createConstant(1, new ConstantPoolEntries.Utf8(this.name.replace('.', '/')))));
    let superClass = this.createConstant(7, new ConstantPoolEntries.Class(this.createConstant(1, new ConstantPoolEntries.Utf8(this.superClass.replace('.', '/')))));

    let methodByteCodes = (() => {
        let result = [];
        this.methods.map(m => m.generateByteCode()).forEach(bc => {
            result = result.concat(bc);
        });
        return result;
    })();
    
    let constantPool = (() => {
        let result = [];
        this.constantPool.map(c => c[1].generateByteCode()).forEach(bc => {
            result = result.concat(bc);
        });
        return result;
    })();

    let result = [-54, -2, -70, -66, 0, 0, 0, 61]
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.constantPoolCounter).array())
        .concat(constantPool)
        .concat([0, 33]) // ACC_PUBLIC, ACC_SUPER
        .concat(JavaUtils.ByteBuffer.allocate(4).putShort(0, thisClass).putShort(2, superClass).array())
        .concat([0, 0]) // 0 Interface
        .concat([0, 0]) // 0 Field
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.methods.length).array())
        .concat(methodByteCodes)
        .concat([0, 0]) // 0 Attributes
        ;

    let printer = "\n------------------------ BYTE CODE GENERATED ------------------------";
    printer += `\nTHIS CLASS:  #${thisClass}    ${this.name}`;
    printer += `\nSUPER CLASS: #${superClass}    ${this.superClass}`;
    printer += "\nBYTE CODE:";
    result.map(b => (b < 0 ? b + 256 : b).toString(16)).map(s => '0'.repeat(2 - s.length).concat(s)).forEach((s, i) => {
        if (i % 16 == 0) {
            printer += '\n';
        }
        printer += ' ' + s;
    });
    printer += "\nCONSTANT POOL:";
    this.constantPool.forEach((c, i) => printer += `\n    #${i+1}\tTag: ${c[0]}\tContent: ${c[1].toString()}`);
    printer += `\n\nMETHODS: (total ${this.methods.length})`;
    this.methods.forEach(m => {
        printer += `\n    ${m.name} ${m.descriptor}`;
    });
    printer += "\n---------------------------------------------------------------------";
    console.info(printer);

    return result;
};

/**
 * @param {Internal.MethodHandles$Lookup} lookup 
 */
ClassCreator.prototype.defineHiddenClass = function(lookup) {
    let bc = this.generateByteCode();

    let clazz = lookup.defineHiddenClass(bc, true);
    return new NativeJavaClass(startupContext, topLevelScope, clazz);
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
    if (index != -1) {
        console.debug(`Constant pushment rejected (to class ${this.name}) for the same constant found at #${index + 1} : ${tag}, ${constant}`);
        return index + 1;
    }
    this.constantPool.push([tag, constant]);
    console.debug(`New constant pushed to class ${this.name}: ${tag}, ${constant}`);
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

/**
 * - Set the super class.
 * - 设置父类。
 * - - - - -
 * @param {string} superClass 
 * - - - - -
 * @returns {this}
 */
ClassCreator.prototype.extends = function(superClass) {
    this.superClass = superClass;
    return this;
};

/**
 * - Add a method.
 * - 添加一个方法。
 * - - - - -
 * @param {string} name
 * @param {string} descriptor
 * @param {(method: Method) => void} method
 * - - - - -
 * @returns {this}
 */
ClassCreator.prototype.addMethod = function(name, descriptor, method) {
    let rawMethod = new Method(name, descriptor, this);
    method(rawMethod);
    this.methods.push(rawMethod);
    return this;
};

/**
 * @param {string} str 
 * @returns {number}
 */
ClassCreator.prototype.CONSTANT_Utf8 = function(str) {
    return this.createConstant(1, new ConstantPoolEntries.Utf8(str));
};

/**
 * 
 * @param {string} name 
 * @param {string} type 
 * @returns {number}
 */
ClassCreator.prototype.CONSTANT_NameAndType = function(name, type) {
    return this.createConstant(12, new ConstantPoolEntries.NameAndType(
        this.CONSTANT_Utf8(name),
        this.CONSTANT_Utf8(type)
    ));
};

/**
 * @param {string} name 
 * @returns 
 */
ClassCreator.prototype.CONSTANT_Class = function(name) {
    return this.createConstant(7, new ConstantPoolEntries.Class(this.CONSTANT_Utf8(name)));
};

/**
 * @param {string} className 
 * @param {string} methodName 
 * @param {string} methodDescriptor 
 * @returns {number}
 */
ClassCreator.prototype.CONSTANT_Methodref = function(className, methodName, methodDescriptor) {
    return this.createConstant(10, new ConstantPoolEntries.Methodref(this.CONSTANT_Class(className), this.CONSTANT_NameAndType(methodName, methodDescriptor)));
};