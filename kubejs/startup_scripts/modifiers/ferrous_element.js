/**
 * @fileoverview The Ferrous Elements | 铁系元素
 * - - - - -
 * Add max durability and repair effeciency when iron or cobaly exists in the tool.  
 * 当工具中存在铁或钴时，增加最大耐久度和修复效率。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    ToolStats
*/

ModifierManager.registerCommonModifier("ferrous_element", "FerrousElementModifier", {
    addToolStats: (context, _modifier, builder) => {
        context.getMaterials().forEach(material => {
            if (material.getId().toString() == "tconstruct:iron") {
                ToolStats.DURABILITY.percent(builder, 0.08);
            } else if (material.getId().toString() == "tconstruct:cobalt") {
                ToolStats.DURABILITY.percent(builder, 0.15);
            }
        });
    },
    getRepairFactor: (tool, _entry, factor) => {
        let multiplier = 1;
        tool.getMaterials().forEach(material => {
            if (material.getId().toString() == "tconstruct:iron") {
                multiplier += 0.08;
            } else if (material.getId().toString() == "tconstruct:cobalt") {
                multiplier += 0.15;
            }
        });
        return factor * multiplier;
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
