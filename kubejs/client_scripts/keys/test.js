/* eslint-disable */

ClientEvents.tick(event => {
    if (global.KeyMappings.Test.consumeClick()) {
        console.info("Pressed");

        const TestMessage = ClassJSUtils.loadClass("network.message.TestMessage");
        global.NetworkChannel.testChannel.sendToServer(new TestMessage("This is a message", null));
    }
})
