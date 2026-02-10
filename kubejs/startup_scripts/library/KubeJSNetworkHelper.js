// priority: 32767

/**
 * @fileoverview Network Helper
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * @author Pelemenguin
 */

/* global
    global: writable
    $NetworkRegistry
    $FriendlyByteBuf
    ClassCreator
    ClassJSUtils
    StartupEvents
    $Optional
    console
*/

global.KubeJSNetworkHelper;

if (global.KubeJSNetworkHelper == undefined) {
    global.KubeJSNetworkHelper = {};

    /** @type {string} */
    global.KubeJSNetworkHelper.PROTOCOL_VERSION = "1";

    /** @type {{[className: string]: typeof any}} */
    global.KubeJSNetworkHelper.REGISTERED_MESSAGES = {};

    /** @type {{[className: string]: number}} */
    global.KubeJSNetworkHelper.MESSAGE_IDS = {};

    /** @type {{[className: string]: Internal.NetworkDirection}} */
    global.KubeJSNetworkHelper.NETWORK_DIRECTIONS = {};
}

/** @type {string} */
global.KubeJSNetworkHelper.PROTOCOL_VERSION;
/** @type {{[className: string]: typeof any}} */
global.KubeJSNetworkHelper.REGISTERED_MESSAGES;
/** @type {{[className: string]: Internal.NetworkDirection}} */
global.KubeJSNetworkHelper.NETWORK_DIRECTIONS;
/** @type {{[className: string]: number}} */
global.KubeJSNetworkHelper.MESSAGE_IDS;

/**
 * Creates a Java class for the new message type, and register it.  
 * 为新的消息类型创建一个Java类，并注册它。
 * - - - - -
 * @param {string} className 
 * The class name of the message class.  
 * 消息类的类名。
 * 
 * @param {number} messageTypeId
 * The id of the message type.
 * Specified manually to avoid depending on script loading order.  
 * 消息类型的ID。
 * 手动指定以避免依赖脚本加载顺序。
 * 
 * @param {{[field: string]: {
 *     className: string,
 *     write: (buf: Internal.FriendlyByteBuf, value: any) => void,
 *     read: (buf: Internal.FriendlyByteBuf) => any
 * }}} dataAndTypes 
 * The fields and their types in the message class.  
 * 消息类中的字段及其类型。
 * 
 * @param {Internal.NetworkDirection} networkDirection 
 * The network direction of this message.  
 * 此消息的网络方向。
 * 
 * @param {(message: any, context: Internal.Supplier<Internal.NetworkEvent$Context>) => void} handle 
 * How to handle this message.  
 * 如何处理此消息。
 * - - - - -
 * @returns {typeof any} 
 * The class created.  
 * 创建的类。
 */
global.KubeJSNetworkHelper.register = (className, messageTypeId, dataAndTypes, networkDirection, handle) => {
    let classCreator = ClassCreator.create(`network.message.${className}`)
        .toPublic();
    
    for (let fieldName in dataAndTypes) {
        classCreator
            .createField(fieldName, dataAndTypes[fieldName].className)
                .toPublic()
                .build();
    }

    // Add a default constructor
    classCreator.defaultConstructor()
        // Then a constructor for decoding
        .createMethod("<init>", [$FriendlyByteBuf], "void")
            .toPublic()
            .code(b => {
                b.loadObject("this")
                    .duplicate()
                    .invokeSpecial("java.lang.Object", "<init>", [], "void")
                    .loadObject("arg0")
                    .invokeJS([ClassJSUtils.getCustomClassName(`network.message.${className}`), $FriendlyByteBuf], "void", (thisObj, /** @type {Internal.FriendlyByteBuf} */ buf) => {
                        for (let fieldName in dataAndTypes) {
                            let type = dataAndTypes[fieldName];
                            thisObj[fieldName] = type.read(buf);
                        }
                    })
                    .returnVoid();
            })
        ;
    
    // Encode method
    classCreator
        .createMethod("encode", [$FriendlyByteBuf], "void")
            .toPublic()
            .codeJSWithThis((thisObj, /** @type {Internal.FriendlyByteBuf} */ buf) => {
                for (let fieldName in dataAndTypes) {
                    let type = dataAndTypes[fieldName];
                    type.write(buf, thisObj[fieldName]);
                }
            })
        ;

    // Handle method
    classCreator
        .createMethod("handle", ["java.util.function.Supplier"], "void")
            .toPublic()
            .codeJSWithThis((thisObj, /** @type {Internal.Supplier<Internal.NetworkEvent$Context>} */ ctx) => {
                handle(thisObj, ctx);
            })
        ;

    // To create a message
    classCreator
        .createMethod("of", ["java.lang.Object"], ClassJSUtils.getCustomClassName(`network.message.${className}`))
            .toPublic()
            .toStatic()
            .codeJS((/** @type {Internal.Map<string, any>} */ map) => {
                let obj = new (ClassJSUtils.loadClass(`network.message.${className}`))();
                for (let fieldName in dataAndTypes) {
                    obj[fieldName] = map[fieldName];
                }
                return obj;
            })
        ;
    
    /** @type {typeof any} */
    let messageClass = classCreator.defineClass();

    // Keep the class in a map
    if (!(className in global.KubeJSNetworkHelper.MESSAGE_IDS)) global.KubeJSNetworkHelper.MESSAGE_IDS[className] = messageTypeId;
    if (!(className in global.KubeJSNetworkHelper.REGISTERED_MESSAGES)) global.KubeJSNetworkHelper.REGISTERED_MESSAGES[className] = messageClass;
    if (!(className in global.KubeJSNetworkHelper.NETWORK_DIRECTIONS)) global.KubeJSNetworkHelper.NETWORK_DIRECTIONS[className] = networkDirection;

    return messageClass;
};

global.KubeJSNetworkHelper.createMessage = (className, object) => {
    let messageClass = global.KubeJSNetworkHelper.REGISTERED_MESSAGES[className];
    if (messageClass == undefined) {
        console.error(`Message class ${className} is not registered.`);
        return null;
    }
    let message = messageClass.of(object);
    return message;
};

/** @type {Internal.SimpleChannel} */
global.KubeJSNetworkHelper.CHANNEL;

if (global.KubeJSNetworkHelper.CHANNEL == undefined) {
    global.KubeJSNetworkHelper.CHANNEL = $NetworkRegistry.newSimpleChannel(
        "kubejs:custom",
        () => global.KubeJSNetworkHelper.PROTOCOL_VERSION,
        (s) => global.KubeJSNetworkHelper.PROTOCOL_VERSION == s,
        (s) => global.KubeJSNetworkHelper.PROTOCOL_VERSION == s
    );
}

StartupEvents.init(() => {
    for (let className in global.KubeJSNetworkHelper.REGISTERED_MESSAGES) {
        let messageClass = global.KubeJSNetworkHelper.REGISTERED_MESSAGES[className];
        console.info(`Registered new message type: ${className}`);
        global.KubeJSNetworkHelper.CHANNEL.registerMessage(
            global.KubeJSNetworkHelper.MESSAGE_IDS[className],
            messageClass,
            (msg, buf) => msg.encode(buf),
            (buf) => new messageClass(buf),
            (msg, ctx) => msg.handle(ctx),
            $Optional.of(global.KubeJSNetworkHelper.NETWORK_DIRECTIONS[className])
        );
    }
});

// eslint-disable-next-line no-unused-vars
const KubeJSNetworkHelper = global.KubeJSNetworkHelper;
