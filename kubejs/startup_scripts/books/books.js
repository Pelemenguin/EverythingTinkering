// priority: 0

/**
 * @fileoverview Books
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    StartupEvents
    TinkerBook
    KubeJSTransformers
*/

StartupEvents.init(() => {
    TinkerBook.MATERIALS_AND_YOU.addTransformer(KubeJSTransformers.MATERIAL_TRANSFORMER);
});