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
    Class
    console
    ConstantPoolEntries
*/

/** @type {Internal.Class<Internal.MethodHandles>} */
let MethodHandles = Class.forName("java.lang.invoke.MethodHandles");

/** @type {Internal.MethodHandles$Lookup} */
let lookup = MethodHandles.getMethod("lookup", []).invoke(null, []);

/** @type {Internal.Class<Test>} */
let TestClass = lookup.defineClass([
    -54, -2, -70, -66, 0, 0, 0, 61, 0, 15, 10, 0, 2, 0, 3, 7, 0, 4, 12, 0, 5, 0, 6, 1, 0, 16, 106, 97, 118, 97, 47, 108, 97, 110, 103, 47, 79, 98, 106, 101, 99, 
    116, 1, 0, 6, 60, 105, 110, 105, 116, 62, 1, 0, 3, 40, 41, 86, 7, 0, 8, 1, 0, 27, 100, 101, 118, 47, 108, 97, 116, 118, 105, 97, 110, 47, 109, 111, 100, 115, 
    47, 114, 104, 105, 110, 111, 47, 84, 101, 115, 116, 1, 0, 4, 67, 111, 100, 101, 1, 0, 15, 76, 105, 110, 101, 78, 117, 109, 98, 101, 114, 84, 97, 98, 108, 101, 1, 0, 3, 103, 101, 116, 1, 0, 3, 40, 41, 73, 1, 0, 10, 83, 111, 117, 114, 99, 101, 70, 105, 108, 101, 1, 0, 9, 84, 101, 115, 116, 46, 106, 97, 118, 97, 0, 33, 0, 7, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1, 0, 5, 0, 6, 0, 1, 0, 9, 0, 0, 0, 29, 0, 1, 0, 1, 0, 0, 0, 5, 42, -73, 0, 1, -79, 0, 0, 0, 1, 0, 10, 0, 0, 0, 6, 0, 1, 0, 0, 0, 3, 0, 9, 0, 11, 0, 12, 0, 1, 0, 9, 0, 0, 0, 26, 0, 1, 0, 0, 0, 0, 0, 2, 4, -84, 0, 0, 0, 1, 0, 10, 0, 0, 0, 6, 0, 1, 0, 0, 0, 6, 0, 1, 0, 13, 0, 0, 0, 
    2, 0, 14
]);

console.info(TestClass.getMethod('get', []).invoke(null, []));

console.info((new ConstantPoolEntries.Integer(2147483647)).generateByteCode());