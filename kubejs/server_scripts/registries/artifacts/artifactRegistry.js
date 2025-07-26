// priority: 10000

/**
 * @fileoverview Artifact Register | Artifact 注册
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
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
*/

/**
 * - An interface for artifact creation.
 * - 用于创造 Artifact 的接口。
 * - - - - -
 * @class
 * @interface
 */
const ArtifactRegisterer = function () {};

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
ArtifactRegisterer.createArtifact = (id, definition, materials) => {
    let registered = new Artifact(id, definition, materials);
    global.Artifacts.put(id, registered);
    console.info(`[Artifact] Registered new artifact "${id}", type ${definition.getId().toString()}, materials: [${materials}]`);
    return registered;
};

/**
 * - Create an artifact group.
 * - 创建一个 Artifact 组。
 * - - - - -
 * @param {string} id -
 * - Id of the artiface group.
 * - 该 Artifact 组的 ID。
 */
ArtifactRegisterer.createArtifactGroup = (id) => {
    let registered = new ArtifactGroup(id);
    global.Artifacts.put(id, registered);
    console.info(`[Artifact] Registered new artifact group "${id}"`);
    return registered;
};

/** @typedef {Artifact | ArtifactGroup} Annotation.ArtifactOrGroup */

/**
 * - Stores all registered artifacts.
 * - 储存所有已注册的 Artifact。
 * - - - - -
 * @type {Internal.Map<string, Annotation.ArtifactOrGroup>}
 */
global.Artifacts = Utils.newMap();

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
    /** @type {ArtifactGroup | null} */
    this.parent = null;
    this.id = id;
    this.item = item;
    this.definition = definition;
    this.initialized = false;
    /** @type {Internal.Component | null} */
    this.name = null;
    /** @type {Internal.Component | null} */
    this.lore = null;

    /** @type {Internal.MaterialVariant_[]} */
    this.materials = materials.map(rawString => {
        let variantSpliterIndex = rawString.indexOf('#');
        let rawMaterialString = "";
        /** @type {string | null} */
        let variantString = null;
        if (variantSpliterIndex == -1) rawMaterialString = rawString;
        else {
            rawMaterialString = rawString.substring(0, variantSpliterIndex);
            variantString = rawString.substring(variantSpliterIndex+1);
        }
        let rawMaterialId = MaterialId["tryParse(java.lang.String)"](rawMaterialString);
        if (variantString == null) {
            return MaterialVariant["of(slimeknights.tconstruct.library.materials.definition.MaterialId)"](rawMaterialId);
        } else {
            return MaterialVariant["of(slimeknights.tconstruct.library.materials.definition.MaterialId,java.lang.String)"](rawMaterialId, variantString);
        }
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

/** @returns {string} */
Artifact.prototype.getTranslationId = function() {
    /** @type {Annotation.ArtifactOrGroup} */
    let cur = this;
    /** @type {string[]} */
    let stack = [];
    while (true) {
        cur = cur.parent;
        if (cur == null) break;
        stack.push(cur.id);
    }
    let name = this.id;
    for (let i = stack.length - 1; i >= 0; i--) {
        name.concat('.'+stack[i]);
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
    return Component.translatable(`item.kubejs.artifact.${this.getTranslationId()}.name`);
};

/**
 * - Get the lore of the artifact.
 * - 获取 Artifact 的详细信息。
 * - - - - -
 * @returns {Internal.Component}
 */
Artifact.prototype.getLore = function() {
    return Component.translatable(`item.kubejs.artifact.${this.getTranslationId()}.lore`);
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
 * @returns {Internal.ItemStack}
 */
Artifact.prototype.createStack = function() {
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
    let result = stack.createStack();
    if (!this.initialized) this.init();
    result.withName(this.name);
    result.withLore(this.lore);
    ToolStack.ensureInitialized(result, this.definition);
    return result;
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
    /** @type {ArtifactGroup | null} */
    this.parent = null;
    this.id = id;
    /** @type {Internal.Map<string, Artifact>} */
    this.children = Utils.newMap();
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
    registered.parent = this;
    this.children.put(id, registered);
    console.info(`[Artifact] Registered new artifact "${id}", type ${definition.getId().toString()}, materials: [${materials}]`);
    return registered;
};

/**
 * - Create an artifact group.
 * - 创建一个 Artifact 组。
 * - - - - -
 * @param {string} id -
 * - Id of the artiface group.
 * - 该 Artifact 组的 ID。
 */
ArtifactRegisterer.createArtifactGroup = function(id) {
    let registered = new ArtifactGroup(id);
    registered.parent = this;
    this.children.put(id, registered);
    console.info(`[Artifact] Registered new artifact group "${id}"`);
    return registered;
};

/**
 * - Create an artifact group.
 * - 创建一个 Artifact 组。
 * - - - - -
 * @param {string} id -
 * - Id of the artiface group.
 * - 该 Artifact 组的 ID。
 */
ArtifactRegisterer.createArtifactGroup = (id) => {
    let registered = new ArtifactGroup(id);
    registered.parent = this;
    global.Artifacts[id] = registered;
    console.info(`[Artifact] Registered new artifact group "${id}"`);
    return registered;
};