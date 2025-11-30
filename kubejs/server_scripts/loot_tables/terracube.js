// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Terracube Loot Table
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    LootJS
    LootEntry
    NBT
    $LootContextParams
*/

LootJS.modifiers(event => {
    /** @type {Internal.OrderedCompoundTag} */
    let requireSizeTag = NBT.compoundTag();
    requireSizeTag.putInt("Size", 3);

    event.addLootTableModifier("tconstruct:entities/terracube")

        // Drops summmoner item of Icy Terracube when killed by freezing damage

        .pool(pool => {
            pool.matchDamageSource(s => s.is("minecraft:is_freezing"))["addCondition(com.almostreliable.lootjs.core.ILootCondition)"](context => {
                    let entity = context.getParamOrNull($LootContextParams.THIS_ENTITY);
                    return entity != null && entity.getNbt().getInt("Size") >= 3;
                })
                .addLoot(LootEntry.of("kubejs:frozen_terracube_core"))
            ;
        })
    ;
});
