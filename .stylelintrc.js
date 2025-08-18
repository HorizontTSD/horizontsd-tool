module.exports = {
    extends: ["stylelint-config-standard"],
    rules: {
        // Отключаем строгие правила для разработки
        "no-descending-specificity": null,
        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: ["v-deep", "v-global", "v-slotted"],
            },
        ],

        // Правила для CSS переменных
        "custom-property-pattern": null,

        // Отключаем проблемные правила
        "block-no-empty": null,
        "no-empty-source": null,
    },
    ignoreFiles: ["node_modules/**/*", "dist/**/*", "build/**/*"],
}
