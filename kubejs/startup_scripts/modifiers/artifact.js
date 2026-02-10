/**
 * @fileoverview Artifact ID Displayer | Artifact ID 显示器
 * - - - - -
 * No actual effect, used to display the ID of an Artifact.  
 * 无实际效果，仅用于显示Artifact ID。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    Component
*/

ModifierManager.registerCommonModifier("artifact", "Artifact", {
    onRemoved: (_tool, _modifier) => {
        return Component.translatable("modifier.kubejs.artifact.remove");
    },
    addTooltip: (tool, _modifier, _player, tooltip, _tooltipKey, tooltipFlag) => {
        if (!tooltipFlag.isAdvanced()) return;
        let artifactId = tool.getPersistentData().getString("kubejs:artifact_id");
        if (!artifactId) return;
        tooltip.add(Component.translatable("modifier.kubejs.artifact.tooltip", artifactId).darkGray());
    },
    getPriority: () => -2147483648,
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
