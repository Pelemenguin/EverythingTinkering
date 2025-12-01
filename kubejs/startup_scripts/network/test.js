/* eslint-disable */

// const TEST_CHANNEL_PROTOCOL_VERSION = "1";

// global.NetworkChannel = {};

// global.NetworkChannel.testChannel = $NetworkRegistry.newSimpleChannel(
//     "kubejs:test",
//     () => TEST_CHANNEL_PROTOCOL_VERSION,
//     (s) => TEST_CHANNEL_PROTOCOL_VERSION == s,
//     (s) => TEST_CHANNEL_PROTOCOL_VERSION == s
// );

// /** @type {typeof any} */
// const TestMessageClass = ClassCreator.create("network.message.TestMessage")
//     .toPublic()
//         .createField("value", "java.lang.String")
//             .toPublic()
//             .build()
//         .createMethod("<init>", [$FriendlyByteBuf], "void")
//             .toPublic()
//             .code(b => b
//                 .loadObject("this")
//                 .duplicate()
//                 .invokeSpecial("java.lang.Object", "<init>", [], "void")
//                 .loadObject("arg0")
//                 .invokeJS([ClassJSUtils.getCustomClassName("network.message.TestMessage"), $FriendlyByteBuf], "void", (thisObj, /** @type {Internal.FriendlyByteBuf} */ buf) => {
//                     thisObj.value = buf.readUtf();
//                 })
//                 .returnVoid()
//             )
//         .createMethod("<init>", ["java.lang.String", "java.lang.Object"], "void")
//             // Second parameter is unused, but necessary to avoid ambiguity with the other constructor
//             .toPublic()
//             .code(b => b
//                 .loadObject("this")
//                 .duplicate()
//                 .invokeSpecial("java.lang.Object", "<init>", [], "void")
//                 .loadObject("arg0")
//                 .invokeJS([ClassJSUtils.getCustomClassName("network.message.TestMessage"), "java.lang.String"], "void", (thisObj, /** @type {string} */ value) => {
//                     thisObj.value = value;
//                 })
//                 .returnVoid()
//             )
//         .createMethod("encode", [$FriendlyByteBuf], "void")
//             .toPublic()
//             .codeJSWithThis((thisObj, /** @type {Internal.FriendlyByteBuf} */ buf) => {
//                 buf.writeUtf(thisObj.value);
//             })
//         .createMethod("handle", ["java.util.function.Supplier"], "void")
//             .toPublic()
//             .codeJSWithThis((thisObj, /** @type {Internal.Supplier<Internal.NetworkEvent$Context>} */ ctx) => {
//                 console.info(ctx.get().getDirection());
//                 ctx.get().setPacketHandled(true);
//             })
//     .defineClass();

// StartupEvents.init(event => {

//     let id = 1;

//     global.NetworkChannel.testChannel.registerMessage(
//         id ++,
//         TestMessageClass,
//         (msg, buf) => msg.encode(buf),
//         (buf) => new TestMessageClass(buf),
//         (msg, ctx) => msg.handle(ctx),
//         $Optional.of($NetworkDirection.PLAY_TO_SERVER)
//     )

// });

let TestMessage = KubeJSNetworkHelper.register("TestMessage", {
    "value": {
        className: "java.lang.String",
        write: (buf, value) => buf.writeUtf(value),
        read: (buf) => {let result = buf.readUtf(); console.info(result); return result}
    }
}, $NetworkDirection.PLAY_TO_SERVER, (thisObj, ctx) => {
    console.info("Received a message: " + thisObj.value);
    ctx.get().setPacketHandled(true)
});

console.info(TestMessage);

KubeJSKeybindHelper.register("test", 72);
