/**
 * @fileoverview Typings | 类型提示
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

declare namespace Annotation {
    interface FluidPreset {
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
        process: (builder: Internal.FluidBuilder) => Internal.FluidBuilder;
    }
    interface FluidProperties {
        /**
         * - List of used presets.
         * - 使用的预设列表。
         */
        presets: Annotation.FluidPreset[] | undefined;
        /**
         * - Temperature of the fluid.
         * - 流体温度。
         */
        temperature: number | undefined;
        /**
         * - Light level of the fluid block.
         * - 液体方块的亮度。
         */
        lightLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | undefined;
        /**
         * - Texture path of still fluid.
         * - 静止液体的材质路径。
         */
        stillTexture: string | undefined;
        /**
         * - Texture path of flowing fluid.
         * - 流动液体的材质路径。
         */
        flowingTexture: string | undefined;
        /** @todo More properties. */
    }

    namespace FluidPresetExtraData {
        interface Hot {
            /**
             * - The burn time of the entites inside.
             * - 内部实体的燃烧时间。
             */
            burnTime: number;
            /**
             * - The damage received by entites inside.
             * - 内部实体收到的伤害。
             */
            damage: number;
        }
    }

    namespace TinkerFunction {
        type Hook = "addToolStats" | "getBreakSpeed" | "onAfterMeleeHit" | "onBeforeMeleeHit" | "onInventoryTick"
    }
}