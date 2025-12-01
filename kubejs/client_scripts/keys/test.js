/* eslint-disable */

ClientEvents.tick(event => {
    if (global.KeyMappings.test.consumeClick()) {
        console.info("Pressed");

        let message = global.KubeJSNetworkHelper.createMessage("TestMessage", {value: "Test message"});
        console.info(message.value);
        console.info(message);
        global.KubeJSNetworkHelper.CHANNEL.sendToServer(message);
    }
})
