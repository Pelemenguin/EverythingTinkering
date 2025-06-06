/// <override global />
declare const global: {
    "toolParts": [Internal.Item],
    "getMantleColor": function(string): typeof Internal.TextColor,
    "jeiRuntime": Internal.JeiRuntime,
    "getModifiersFromItem": Function
};