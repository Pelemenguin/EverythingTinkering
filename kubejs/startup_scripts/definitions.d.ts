/**
 * @fileoverview Typings | 类型提示
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/**
 * - An interface used for annotations.
 * - 用于注释的接口。
 */
declare namespace Annotation {
    declare interface FluidPreset {
        /**
         * - Process a fluid builder.
         * - 处理一个流体 Builder。
         * - - - - -
         * @inheritdoc
         * - - - - -
         * @param builder 
         * - Input fluid builder.
         * - 输入的流体 Builder。
         * - - - - -
         * @returns
         * - Processed fluid buidler.
         * - 处理后的流体 Builder.
         */
        abstract process: (builder: !Internal.FluidBuilder) => !Internal.FluidBuilder;
    }
    declare interface FluidProperties {
        /**
         * - List of used presets.
         * - 使用的预设列表。
         */
        static presets: ?Annotation.FluidPreset[];
        /**
         * - Temperature of the fluid.
         * - 流体温度。
         */
        static temperature: ?numder;
        /**
         * - Light level of the fluid block.
         * - 液体方块的亮度。
         */
        static lightLevel: ?(0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15);
        /** @todo More properties. */
    }

    declare namespace FluidPresetExtraData {
        declare interface Hot {
            /**
             * - The burn time of the entites inside.
             * - 内部实体的燃烧时间。
             */
            static burnTime: !number;
            /**
             * - The damage received by entites inside.
             * - 内部实体收到的伤害。
             */
            static damage: !number;
        }
    }
}