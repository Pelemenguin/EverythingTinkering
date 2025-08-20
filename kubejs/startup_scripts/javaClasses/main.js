// priority: 65536

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Java classes creator
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    console
    ClassCreator
    CodeAttribute
    JavaUtils
*/

let testClassCreator = (new ClassCreator("dev/latvian/mods/rhino/TestClass"))
    .extends("slimeknights/tconstruct/library/modifiers/Modifier")
    .addMethod('<init>', '()V', method => {
        method.setPublic().addAttribute('Code', new CodeAttribute(1, 1, () => [
            0x2a, // aload_0
            0xb7 -256, // invokespecial
        ].concat(JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("slimeknights/tconstruct/library/modifiers/Modifier", "<init>", "()V")).array()).concat([
            0xb1 -256, // return
        ])));
    });

let TestClass = testClassCreator.createClass(JavaUtils.MethodHandles.lookup());

// let TestClassInstance = TestClass.getConstructor([]).newInstance([]);
// console.info(TestClass.getMethod("getPriority", []).invoke(TestClassInstance, []));

console.info((new TestClass()).getPriority());