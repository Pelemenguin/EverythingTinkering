// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Fibrous | 纤维
 * - - - - -
 * Chance to cancel durability consumption when facing is near the X axis.
 * 朝向接近X轴时概率不消耗耐久。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
*/

/**
 * - Controls min cosine value allowed to block durability consumption.  
 * - 控制阻止耐久消耗的最小余弦值。
 */
let FIBROUS_MIN_COSINE = 0.5;

/**
 * - Controls max probability to block durability consumption.
 * - 控制阻止耐久消耗的最大概率。
 */
let FIBROUS_MAX_PROBABILITY = 0.25;

// eslint-disable-next-line no-unused-vars
let FIBROUS = ModifierManager.registerCommonModifier("fibrous", "FibrousModifier", {
    onDamageTool: (tool, modifier, amount, holder/*, stack*/) => {
        if (holder == null) return;
        let cosine = holder.getViewVector(1).normalize().dot([1, 0, 0]);
        let probability = (Math.abs(cosine) - FIBROUS_MIN_COSINE) / FIBROUS_MIN_COSINE * FIBROUS_MAX_PROBABILITY;
        if (Math.random() < probability) {
            return 0;
        }
        return amount;
    }
});