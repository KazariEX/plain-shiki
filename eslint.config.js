import antfu from "@antfu/eslint-config";
import zin from "@zinkawaii/eslint-config";

export default antfu({
    jsonc: false,
    markdown: false,
    yaml: false,
    stylistic: {
        quotes: "double",
        semi: true,
        indent: 4
    },
    rules: {
        ...zin.standard,
        ...zin.recommended,
        ...zin.stylistic,
        ...zin.vue,
        ...zin.patch,
        "antfu/no-top-level-await": "off",
        "no-multi-assign": "off",
        "unicorn/prefer-dom-node-text-content": "off"
    }
});