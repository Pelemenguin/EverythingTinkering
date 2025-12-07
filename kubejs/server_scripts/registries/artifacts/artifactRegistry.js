// priority: 10000

/**
 * @fileoverview Artifact Register | Artifact 注册
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

/** Known bug: When using artifacts in the loot tables,
 *             before any reloads, they can not display correctly when first open chest.
 */

/* global
    global: writable
    console
    MaterialId
    MaterialVariant
    ToolStack
    Utils
    Component
    MaterialNBT
    ModifierId
    LootEntry
*/

/** @typedef {Artifact | ArtifactGroup} Annotation.ArtifactOrGroup */

/**
 * - Artifact.
 * - Artifact。
 * - - - - -
 * @param {string} id -
 * - Id of the artifact. No `kubejs:` prefix.
 * - 该 Artifact 的 ID。无 `kubejs:` 前缀。
 * @param {Internal.Item} item -
 * - The item of the artifact.
 * - 该 Artifact 的物品。
 * @param {Internal.ToolDefinition_} definition -
 * - A tool definition.
 * - 工具定义。 
 * @param {string[]} materials -
 * - Materials of the tool.
 * - 工具材料列表。
 * - - - - -
 * @class
 */
function Artifact(id, item, definition, materials) {
    this.id = id;
    this.item = item;
    this.definition = definition;
    this.initialized = false;
    this.translationId = id;
    /** @type {Internal.Component | null} */
    this.name = null;
    /** @type {Internal.Component | null} */
    this.lore = null;
    /** @type {Internal.Component[]} */
    this.extraTooltips = [];

    /** @type {Internal.MaterialVariant_[]} */
    this.materials = materials.map(rawString => {
        let rawMaterialId = MaterialId.parse(rawString);
        return MaterialVariant["of(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](rawMaterialId);
    });
    /** @type {Internal.Map<Internal.ModifierId, number>} */
    this.modifiers = Utils.newMap();
}

/**
 * - Add a modifier to the artifact.
 * - 为 Artifact 添加 Modifier.
 * - - - - -
 * @param {string} modifier
 * - Modifier Id.
 * - 特性 ID。
 * @param {number} level
 * - Modifier level.
 * - 特性等级。
 */
Artifact.prototype.addModifier = function(modifier, level) {
    let modifierId = ModifierId.tryParse(modifier);
    this.modifiers.put(modifierId, level);
};

/** @returns {string} @private */
Artifact.prototype.getTranslationId = function() {
    /** @type {Annotation.ArtifactOrGroup} */
    let cur = this;
    /** @type {string[]} */
    let stack = [this.id];
    while (true) {
        console.info(cur.toString());
        cur = cur.parent;
        if (cur == null) break;
        stack.push(cur.id);
    }
    let name = "";
    for (let i = stack.length - 1; i >= 0; i--) {
        name = name.concat('.' + stack.pop());
    }
    return name;
};

/**
 * - Get the name of the artifact.
 * - 获取 Artifact 的名称。
 * - - - - -
 * @returns {Internal.Component}
 */
Artifact.prototype.getName = function() {
    return Component.translatable(`item.kubejs.${this.translationId}.name`);
};

/**
 * - Get the lore of the artifact.
 * - 获取 Artifact 的详细信息。
 * - - - - -
 * @returns {Internal.Component}
 */
Artifact.prototype.getLore = function() {
    return Component.translatable(`item.kubejs.${this.translationId}.lore`);
};

/**
 * - Add one line of extra tooltip to the artifact.
 * - 向 Artifact 添加一行工具提示
 */
Artifact.prototype.addTooltip = function(component) {
    this.extraTooltips.push(component);
};

Artifact.prototype.init = function() {
    this.name = this.getName();
    this.lore = this.getLore();
    this.initialized = true;
};

Artifact.prototype.reset = function() {
    this.initialized = false;
};

/**
 * - Create an instance Item Stack of the artifact.
 * - 创建 Artifact 的物品堆叠实例。
 * - - - - -
 * @param {number} count
 * - The count of the item stack.
 * - 物品堆叠的数量。
 * - - - - -
 * @returns {Internal.ItemStack}
 */
Artifact.prototype.createStack = function(count) {
    let materialNbt = MaterialNBT.builder();
    this.materials.forEach(material => {
        materialNbt["add(slimeknights.tconstruct.library.materials.definition.MaterialVariant)"](material);
    });
    let stack = ToolStack.createTool(
        this.item,
        this.definition,
        materialNbt.build()
    );
    this.modifiers.forEach((id, level) => {
        stack.addModifier(id, level);
    });
    let result;
    if (count == undefined) {
        result = stack.createStack();
    } else {
        result = stack.createStack(count);
    }
    if (!this.initialized) this.init();
    ToolStack.ensureInitialized(result, this.definition);
    result = result.withName(this.name);
    result = result.withLore([this.lore].concat(this.extraTooltips));
    return result;
};

/**
 * - Create a loot entry of the artifact.
 * - 创建一个该 Artifact 的战利品表条目。
 * - - - - -
 * @param {number} count -
 * - Item count.
 * - 物品数量
 * - - - - -
 * @returns {Internal.LootEntry}
 */
Artifact.prototype.createLootEntry = function(count) {
    let stack = this.createStack();
    let item = stack.getItem();
    let nbt = stack.getNbt();
    let result = LootEntry.of(item, count);
    result.addNBT(nbt);
    return result;
};

Artifact.prototype.toString = function() {
    return `${this.id}[${this.materials.toString()}]{${this.modifiers.toString()}}`;
};

// ---------- Artifact Group ---------- //

/**
 * - A group of artifacts.
 * - Artifact 组。
 * @param {string} id -
 * - ID of the artifact group.
 * - Artifact 组的 ID.
 * - - - - -
 * @class
 * @extends Artifact
 */
function ArtifactGroup(id) {
    this.id = id;
    /** @type {Internal.Map<string, Annotation.ArtifactOrGroup>} */
    this.children = Utils.newMap();
    this.translationId = id;
}

/**
 * @param {string} id
 * @returns {Annotation.ArtifactOrGroup}
 */
ArtifactGroup.prototype.get = function(id) {
    return this.children.getOrDefault(id, null);
};

/**
 * - Create an artifact.
 * - 创建一个 Artifact.
 * - - - - -
 * @param {string} id -
 * - Id of the artifact.
 * - 该 Artifact 的 ID。
 * @param {Internal.ToolDefinition_} definition -
 * - A tool definition.
 * - 工具定义。 
 * @param {string[]} materials -
 * - Materials of the tool.
 * - 工具材料列表。
 * - - - - -
 * @returns {Artifact}
 */
ArtifactGroup.prototype.createArtifact = function(id, item, definition, materials) {
    let registered = new Artifact(id, item, definition, materials);
    registered.translationId = this.translationId + '.' + id;
    this.children.put(id, registered);
    console.info(`[Artifact] Registered new artifact "${id}", type ${definition.getId().toString()}, materials: [${materials}]`);
    return registered;
};

/**
 * - Get an artifact (or group) from a name path.
 * - 通过命名路径获取一个 Artifact （或组）。
 * - - - - -
 * @example
 * ```javascript
 * let group = global.Artifacts.createArtifactGroup("group_a");
 * let subgroup = group.createArtifactGroup("group_b");
 * let example_artifact = subgroup.createArtifact("artifact", ...);
 * 
 * global.Artifacts.getRecursive("group_a.group_b.artifact") // example_artifact
 * global.Artifacts.getRecursive("group_a.group_b") // subgroup
 * ```
 * - - - - -
 * @param {string} namepath
 * - - - - -
 * @returns {?Annotation.ArtifactOrGroup} 
 */
ArtifactGroup.prototype.getRecursive = function(namepath) {
    let indexOfDot = namepath.indexOf('.');
    if (indexOfDot == -1) {
        return this.get(namepath);
    }
    let first = namepath.substring(0, indexOfDot);
    let sub = this.get(first);
    if (sub instanceof ArtifactGroup) {
        return sub.getRecursive(namepath.substring(indexOfDot + 1));
    } else {
        return null;
    }
};

/**
 * - Create an artifact group.
 * - 创建一个 Artifact 组。
 * - - - - -
 * @param {string} id -
 * - Id of the artiface group.
 * - 该 Artifact 组的 ID。
 */
ArtifactGroup.prototype.createArtifactGroup = function(id) {
    let registered = new ArtifactGroup(id);
    registered.translationId = this.translationId + '.' + id;
    this.children.put(id, registered);
    console.info(`[Artifact] Registered new artifact group "${id}"`);
    return registered;
};

ArtifactGroup.prototype.toString = function() {
    return `${this.id}${this.children.entrySet().map(a => a.value.toString()).toString()}`;
};

/**
 * - Stores all registered artifacts.
 * - 储存所有已注册的 Artifact。
 * - - - - -
 * @type {ArtifactGroup}
 */
global.Artifacts = new ArtifactGroup('artifact');