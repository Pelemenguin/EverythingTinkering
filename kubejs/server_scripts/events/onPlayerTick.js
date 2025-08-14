// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    PlayerEvents
    Client
*/

PlayerEvents.tick(event => {
    let fireTime = 0;
    let damage = 0;
    try {
        let player = Client.player;
        event.getLevel().getBlockStates(player.getBoundingBox()).forEach(block => {
                if (block.getBlock().getId() in global.FluidData.HotFluidData) {
                    let {burnTime: curFireTime, damage: curDamage} = global.FluidData.HotFluidData[block.getBlock().getId()];
                    fireTime = Math.max(fireTime, curFireTime);
                    damage = Math.max(damage, curDamage);
                }
        });
    // eslint-disable-next-line no-unused-vars
    } catch (e) {return;}
    if (damage > 0) {
        event.getPlayer().attack(event.getPlayer().damageSources().lava(), damage);
    }
    if (fireTime > event.getPlayer().getRemainingFireTicks() && fireTime > 0) {
        event.getPlayer().setRemainingFireTicks(fireTime);
    }
});