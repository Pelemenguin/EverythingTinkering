/* eslint-disable */

/** @type {typeof Internal.RegisterKeyMappingsEvent | null} */
const $RegisterKeyMappingsEvent = Java.tryLoadClass("net.minecraftforge.client.event.RegisterKeyMappingsEvent")

/** @type {typeof Internal.KeyMapping | null} */
const $KeyMapping = Java.tryLoadClass("net.minecraft.client.KeyMapping");

global.KeyMappings = {};

if ($RegisterKeyMappingsEvent != null) {
    if (global.KeyMappings.Test == undefined) {
        global.KeyMappings.Test = new $KeyMapping(
            "key.kubejs.test",
            71,
            "category.kubejs.keys.test"
        )
    }

    NativeEvents.onEvent($RegisterKeyMappingsEvent, /** @param {Internal.RegisterKeyMappingsEvent} event */ event => {
        event.register(global.KeyMappings.Test)
    });
}


