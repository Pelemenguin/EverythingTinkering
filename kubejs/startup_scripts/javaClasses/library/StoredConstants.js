// priority: 2000000001

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Constant Pool Entries
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
 * @typedef {new (...args) => {
 *     generateByteCode: () => number[]
 * }} Annotation.JavaClass.ConstantPoolEntry
 * - - - - -
 * @type {{
 *     Utf8: typeof CONSTANT_Utf8,
 *     Integer: typeof CONSTANT_Integer,
 *     Float: typeof CONSTANT_Float,
 *     Long: typeof CONSTANT_Long,
 *     Double: typeof CONSTANT_Double,
 *     Class: typeof CONSTANT_Class,
 *     String: typeof CONSTANT_String,
 *     Fieldref: typeof CONSTANT_Fieldref,
 *     Methodref: typeof CONSTANT_Methodref,
 *     InterfaceMethodref: typeof CONSTANT_InterfaceMethodref,
 *     NameAndType: typeof CONSTANT_NameAndType,
 *     MethodHandle: typeof CONSTANT_MethodHandle,
 *     MethodType: typeof CONSTANT_MethodType,
 *     Dynamic: typeof CONSTANT_Dynamic,
 *     InvokeDynamic: typeof CONSTANT_InvokeDynamic,
 *     Module: typeof CONSTANT_Module,
 *     Package: typeof CONSTANT_Package
 * }}
 */
const ConstantPoolEntries = {};

/**
 * @param {string} content 
 */
let CONSTANT_Utf8 = function(content) {
    this.content = content;
    /** @readonly @constant */
    this.length = content.length;
};

/** @returns {number[]} */
CONSTANT_Utf8.prototype.generateByteCode = function() {
    let boas = new JavaUtils.ByteArrayOutputStream();
    let dos = new JavaUtils.DataOutputStream(boas);

    dos.writeByte(1);
    dos.writeUTF(this.content);
    dos.close();

    return boas.toByteArray();
};

/**
 * @param {number} value 
 */
let CONSTANT_Integer = function(value) {
    this.value = value;
};

CONSTANT_Integer.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 3).putInt(1, this.value).array();
};

/**
 * @param {number} value
 */
let CONSTANT_Float = function(value) {
    this.value = value;
};

CONSTANT_Float.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 4).putFloat(1, this.value).array();
};

/**
 * @param {number} value 
 */
let CONSTANT_Long = function(value) {
    this.value = value;
};

CONSTANT_Long.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(9)["put(int,byte)"](0, 5).putLong(1, this.value).array();
};

/**
 * @param {number} value 
 */
let CONSTANT_Double = function(value) {
    this.value = value;
};

CONSTANT_Double.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(9)["put(int,byte)"](0, 6).putDouble(1, this.value).array();
};

/**
 * @param {number} nameRef
 */
let CONSTANT_Class = function(nameRef) {
    this.nameRef = nameRef;
};

CONSTANT_Class.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(3)["put(int,byte)"](0, 7).putShort(1, this.nameRef).array();
};

/**
 * @param {number} stringRef 
 */
let CONSTANT_String = function(stringRef) {
    this.stringRef = stringRef;
};

CONSTANT_String.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(3)["put(int,byte)"](0, 8).putShort(1, this.stringRef).array();
};

/**
 * @param {number} classIndex 
 * @param {number} nameAndTypeIndex 
 */
let CONSTANT_Fieldref = function(classIndex, nameAndTypeIndex) {
    this.classIndex = classIndex;
    this.nameAndTypeIndex - nameAndTypeIndex;
};

CONSTANT_Fieldref.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 9).putShort(1, this.classIndex).putShort(3, this.nameAndTypeIndex).array();
};

/**
 * @param {number} classIndex 
 * @param {number} nameAndTypeIndex 
 */
let CONSTANT_Methodref = function(classIndex, nameAndTypeIndex) {
    this.classIndex = classIndex;
    this.nameAndTypeIndex - nameAndTypeIndex;
};

CONSTANT_Methodref.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 10).putShort(1, this.classIndex).putShort(3, this.nameAndTypeIndex).array();
};

/**
 * @param {number} classIndex 
 * @param {number} nameAndTypeIndex 
 */
let CONSTANT_InterfaceMethodref = function(classIndex, nameAndTypeIndex) {
    this.classIndex = classIndex;
    this.nameAndTypeIndex - nameAndTypeIndex;
};

CONSTANT_InterfaceMethodref.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 11).putShort(1, this.classIndex).putShort(3, this.nameAndTypeIndex).array();
};

/**
 * @param {number} nameIndex 
 * @param {number} descriptorIndex 
 */
let CONSTANT_NameAndType = function(nameIndex, descriptorIndex) {
    this.nameIndex = nameIndex;
    this.descriptorIndex = descriptorIndex;
};

CONSTANT_NameAndType.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 12).putShort(1, this.nameIndex).putShort(3, this.descriptorIndex).array();
};

/**
 * @param {number} refKind
 * @param {number} refIndex
 */
let CONSTANT_MethodHandle = function(refKind, refIndex) {
    this.refKind = refKind;
    this.refIndex = refIndex;
};

CONSTANT_MethodHandle.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(4)["put(int,byte)"](0, 15)["put(int,byte)"](1, this.refKind).putShort(2, this.refIndex).array();
};

/**
 * @param {number} descriptorIndex 
 */
let CONSTANT_MethodType = function(descriptorIndex) {
    this.descriptorIndex = descriptorIndex;
};

CONSTANT_MethodType.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(3)["put(int,byte)"](0, 16).putShort(1, this.descriptorIndex).array();
};

/**
 * @param {number} bootstrapMethodAttrIndex 
 * @param {number} nameAndTypeIndex 
 */
let CONSTANT_Dynamic = function(bootstrapMethodAttrIndex, nameAndTypeIndex) {
    this.bootstrapMethodAttrIndex = bootstrapMethodAttrIndex;
    this.nameAndTypeIndex = nameAndTypeIndex;
};

CONSTANT_Dynamic.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 17).putShort(1, this.bootstrapMethodAttrIndex).putShort(3, this.nameAndTypeIndex).array();
};

/**
 * @param {number} bootstrapMethodAttrIndex 
 * @param {number} nameAndTypeIndex 
 */
let CONSTANT_InvokeDynamic = function(bootstrapMethodAttrIndex, nameAndTypeIndex) {
    this.bootstrapMethodAttrIndex = bootstrapMethodAttrIndex;
    this.nameAndTypeIndex = nameAndTypeIndex;
};

CONSTANT_InvokeDynamic.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(5)["put(int,byte)"](0, 18).putShort(1, this.bootstrapMethodAttrIndex).putShort(3, this.nameAndTypeIndex).array();
};

/**
 * @param {number} nameIndex
 */
let CONSTANT_Module = function(nameIndex) {
    this.nameIndex = nameIndex;
};

CONSTANT_Module.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(3)["put(int,byte)"](0, 19).putShort(1, this.nameIndex).array();
};

/**
 * @param {number} nameIndex
 */
let CONSTANT_Package = function(nameIndex) {
    this.nameIndex = nameIndex;
};

CONSTANT_Package.prototype.generateByteCode = function() {
    return JavaUtils.ByteBuffer.allocate(3)["put(int,byte)"](0, 20).putShort(1, this.nameIndex).array();
};

ConstantPoolEntries.Utf8 = CONSTANT_Utf8;
ConstantPoolEntries.Integer = CONSTANT_Integer;
ConstantPoolEntries.Float = CONSTANT_Float;
ConstantPoolEntries.Long = CONSTANT_Long;
ConstantPoolEntries.Double = CONSTANT_Double;
ConstantPoolEntries.Class = CONSTANT_Class;
ConstantPoolEntries.String = CONSTANT_String;
ConstantPoolEntries.Fieldref = CONSTANT_Fieldref;
ConstantPoolEntries.Methodref = CONSTANT_Methodref;
ConstantPoolEntries.InterfaceMethodref = CONSTANT_InterfaceMethodref;
ConstantPoolEntries.NameAndType = CONSTANT_NameAndType;
ConstantPoolEntries.MethodHandle = CONSTANT_MethodHandle;
ConstantPoolEntries.MethodType = CONSTANT_MethodType;
ConstantPoolEntries.Dynamic = CONSTANT_Dynamic;
ConstantPoolEntries.InvokeDynamic = CONSTANT_InvokeDynamic;
ConstantPoolEntries.Module = CONSTANT_Module;
ConstantPoolEntries.Package = CONSTANT_Package;
