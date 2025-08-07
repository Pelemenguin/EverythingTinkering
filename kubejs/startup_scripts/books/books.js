// priority: 0

/**
 * @fileoverview Books
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    StartupEvents
    TinkerBook
    KubeJSTransformers
*/

StartupEvents.init(() => {
    TinkerBook.MATERIALS_AND_YOU.addTransformer(KubeJSTransformers.MATERIAL_TRANSFORMER);
});