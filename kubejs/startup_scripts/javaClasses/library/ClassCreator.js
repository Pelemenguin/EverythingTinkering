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
    global: writable
    JavaUtils
    ConstantPoolEntries
    Method
    console
    NativeJavaClass
    startupContext
    topLevelScope
    Utils
    CodeAttribute
*/

/** @type {Internal.Map<string, Internal.Class<?>>} */
global.CreatedClasses;
if (global.CreatedClasses === undefined) global.CreatedClasses = Utils.newMap();

/**
 * @param {string} name 
 */
function ClassCreator(name) {
    this.name = "dev.latvian.mods.rhino." + name;
    this.internalName = this.name.replace(/\./g, '/');
    this.constantPoolCounter = 1;
    /** @type {Method[]} */
    this.methods = [];
    /** @type {[string, {generateByteCode: (classCreator: ClassCreator) => number[]}][]} */
    this.attributes = [];
    /** @type {{name: string, descriptor: string, access: number}[]} */
    this.fields = [];

    this.access = 33; // ACC_PUBILC, ACC_SUPER

    /** @type {[tag: number, {generateByteCode: () => number[]}][]} */
    this.constantPool = [];

    /** @type {?string} */
    this.superClass = "java.lang.Object";

    /** @type {string[]} */
    this.superInterfaces = [];
}

/**
 * @returns {number[]}
 */
ClassCreator.prototype.generateByteCode = function() {
    let thisClass = this.createConstant(7, new ConstantPoolEntries.Class(this.createConstant(1, new ConstantPoolEntries.Utf8(this.name.replace(/\./g, '/')))));
    let superClass = this.createConstant(7, new ConstantPoolEntries.Class(this.createConstant(1, new ConstantPoolEntries.Utf8(this.superClass.replace(/\./g, '/')))));

    let superInterfaces = JavaUtils.ByteBuffer.allocate(2).putShort(0, this.superInterfaces.length).array();
    this.superInterfaces.forEach(superInterface => {
        superInterfaces = superInterfaces.concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.CONSTANT_Class(superInterface)).array());
    });

    let fieldByteCodes = (() => {
        let result = [];
        this.fields.forEach(f => {
            result = result.concat(JavaUtils.ByteBuffer.allocate(8)
                .putShort(0, f.access)
                .putShort(2, this.CONSTANT_Utf8(f.name))
                .putShort(4, this.CONSTANT_Utf8(f.descriptor))
                .putShort(6, 0)
                .array()
            );
        });
        return result;
    })();

    let methodByteCodes = (() => {
        let result = [];
        this.methods.map(m => m.generateByteCode()).forEach(bc => {
            result = result.concat(bc);
        });
        return result;
    })();

    let attributeByteCodes = (() => {
        let result = [];
        this.attributes.forEach(([name, attr]) => {
            let byteCode = attr.generateByteCode(this);
            result = result.concat(
                JavaUtils.ByteBuffer.allocate(6).putShort(0, this.createConstant(1, new ConstantPoolEntries.Utf8(name)))
                    .putInt(2, byteCode.length).array()
            ).concat(byteCode);
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
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.access).array())
        .concat(JavaUtils.ByteBuffer.allocate(4).putShort(0, thisClass).putShort(2, superClass).array())
        .concat(superInterfaces)
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(this.fields.length).array())
        .concat(fieldByteCodes)
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.methods.length).array())
        .concat(methodByteCodes)
        .concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, this.attributes.length).array())
        .concat(attributeByteCodes)
        ;

    let printer = "\n------------------------ BYTE CODE GENERATED ------------------------";
    printer += `\nCLASS MODIFIERS: 0x${this.access.toString(16)}`;
    printer += `\nTHIS CLASS:  #${thisClass}    ${this.name}`;
    printer += `\nSUPER CLASS: #${superClass}    ${this.superClass}`;
    printer += `\nSUPER INTERFACES: (${this.superInterfaces.length} in total)`;
    this.superInterfaces.forEach(superInterface => {
        printer += `\n    ${superInterface}`;
    });
    printer += `\nBYTE CODE: (${result.length} bytes)`;
    result.map(b => (b < 0 ? b + 256 : b).toString(16)).map(s => '0'.repeat(2 - s.length).concat(s)).forEach((s, i) => {
        if (i % 16 == 0) {
            printer += '\n';
        }
        printer += ' ' + s;
    });
    printer += "\nCONSTANT POOL:";
    this.constantPool.forEach((c, i) => printer += `\n    #${i+1}\tTag: ${c[0]}\tContent: ${c[1].toString()}`);
    printer += `\nMETHODS: (${this.methods.length} in total)`;
    this.methods.forEach(m => {
        printer += `\n    ${m.name} ${m.descriptor}`;
    });
    printer += "\n---------------------------------------------------------------------";
    console.info(printer);

    return result;
};

/**
 * @param {Internal.MethodHandles$Lookup} lookup 
 * @returns {typeof any}
 */
ClassCreator.prototype.defineHiddenClass = function(lookup) {
    if (global.CreatedClasses.containsKey(this.name)) {
        console.info(`\n    Class creation rejected: ${this.name.split('.').pop()} has been created before.`);
        return new NativeJavaClass(startupContext, topLevelScope, global.CreatedClasses.get(this.name));
    }

    let bc = this.generateByteCode();

    let clazz = lookup.defineHiddenClass(bc, true).lookupClass();
    let result = new NativeJavaClass(startupContext, topLevelScope, clazz);

    global.CreatedClasses.put(this.name, clazz);

    return result;
};

/**
 * @param {Internal.MethodHandles$Lookup} lookup
 * @returns {typeof any}
 */
ClassCreator.prototype.defineClass = function(lookup) {
    if (global.CreatedClasses.containsKey(this.name)) {
        console.info(`\n    Class creation rejected: ${this.name.split('.').pop()} has been created before.`);
        return new NativeJavaClass(startupContext, topLevelScope, global.CreatedClasses.get(this.name));
    }

    let bc = this.generateByteCode();

    let clazz = lookup.defineClass(bc);
    let result = new NativeJavaClass(startupContext, topLevelScope, clazz);

    global.CreatedClasses.put(this.name, clazz);

    return result;
};

/**
 * 生成一个默认的构造器方法，
 * 若需指定父类，则必须要在生成该方法之前设置。
 * 请确保父类有公开的无参数构造器，
 * 生成构造器方法时我们不会检测。
 * - - - - -
 * Generate a default constructor method.
 * If you want to set super class, do so before calling this method.
 * Please ensure that the super class has a constructor with no arguments.
 * We do not detect that when generating constructors.
 */
ClassCreator.prototype.createDefaultConstructor = function() {
    let references = JavaUtils.ByteBuffer.allocate(2).putShort(0, this.CONSTANT_Methodref(this.superClass.replace(/\./g, '/'), "<init>", "()V")).array();

    this.addMethod('<init>', '()V', method => {
        method.setPublic().addAttribute('Code', new CodeAttribute(1, 1).setCustomByteCodeGenerator(() => [
            0x2a, // aload_0
            0xb7, // invokespecial: `superClass`.<init>()V
            references[0], references[1],
            0xb1, // return
        ]));
    });

    return this;
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
 * - Add a superinterface.
 * - 添加一个父接口。
 * - - - - -
 * @param {string} superinterface
 * - - - - -
 * @returns {this}
 */
ClassCreator.prototype.implements = function(superinterface) {
    let intfname = superinterface.replace(/\./g, '/');
    if (this.superInterfaces.indexOf(intfname) >= 0) return this;
    this.superInterfaces.push(intfname);
    return this;
};

/**
 * - Mark the class as an interface.
 * - 将类标记为接口。
 * - - - - -
 * @returns {this}
 */
ClassCreator.prototype.setIsInterface = function() {
    this.access |= 0x0200;
    this.access |= 0x0400;
    this.access -= (this.access & 0x0020);
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
 * - Add an attribute.
 * - 添加一个属性。
 * - - - - -
 * @param {string} name
 * @param {{generateByteCode: (classCreator: ClassCreator) => number[]}} attribute
 * - - - - -
 * @returns {this}
 */
ClassCreator.prototype.addAttribute = function(name, attribute) {
    this.attributes.push([name, attribute]);
    return this;
};

/**
 * - Add a field.
 * - 添加一个字段。
 * - - - - -
 * @param {string} name
 * @param {string} descriptor
 * @param {number} access
 */
ClassCreator.prototype.addField = function(name, descriptor, access) {
    this.fields.push({
        name: name,
        descriptor: descriptor,
        access: access
    });
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

/**
 * @param {string} className 
 * @param {string} fieldName 
 * @param {string} fieldDescriptor 
 * @returns {number}
 */
ClassCreator.prototype.CONSTANT_Fieldref = function(className, fieldName, fieldDescriptor) {
    return this.createConstant(9, new ConstantPoolEntries.Fieldref(this.CONSTANT_Class(className), this.CONSTANT_NameAndType(fieldName, fieldDescriptor)));
};

/**
 * @param {string} className 
 * @param {string} methodName 
 * @param {string} methodDescriptor 
 * @returns {number}
 */
ClassCreator.prototype.CONSTANT_InterfaceMethodref = function(className, methodName, methodDescriptor) {
    return this.createConstant(11, new ConstantPoolEntries.InterfaceMethodref(this.CONSTANT_Class(className), this.CONSTANT_NameAndType(methodName, methodDescriptor)));
};