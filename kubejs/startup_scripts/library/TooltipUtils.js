// priority: 65536

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Tooltip Utils
 * @author Pelemenguin
 */

/* global
    Component
*/

// eslint-disable-next-line no-unused-vars
const TooltipUtils = {

    /**
     * Returns a component that displays some value in percentage.
     * 返回显示以百分比显示某个值的文本组件。
     * - - - - -
     * @param {number} value                 The value to display. Not in percentage.
     *                                       要显示的数值。不是百分比。
     * 
     * @param {net.minecraft.network.chat.Component} component The component used for displaying, usually the modifier's name. Not to include percentage display here.
     *                                       用于显示的组件，通常是特性的名称。不要在这里包含百分比显示。
     * 
     * @param {number} [base = 0]            The base value. For example, when `base` is `1`, a `value` of `1.2` displays as `+20%`. Default value is `0`  
     *                                       基准值。例如，当 `base` 为 `1` 时，`value` 为 `1.2` 显示为 `+20%`。默认值为`0`。
     * 
     * @returns {net.minecraft.network.chat.Component}         The result component
     *                                       结果组件
     * - - - - -
     * ### Example | 示例
     * 
     * Usage | 用法
     * ```javascript
     * TooltipUtils.PercentageTooltip(1, Component.literal("Text"));
     * ```
     * 
     * Result | 结果
     * > Text +100%
     */
    PercentageTooltip: (value, component, base) => {
        let displayValue = (base === undefined ? value : value - base) * 100;
        return Component.literal(`${displayValue >= 0 ? "+" : "-"}${displayValue.toFixed(0)}% ${component.getString()}`).setStyle(component.style);
    }

};