import antfu from "@antfu/eslint-config";
import zin from "@zinkawaii/eslint-config";

export default antfu({
    markdown: false,
    rules: {
        ...zin.standard,
        ...zin.recommended,
        ...zin.stylistic,
        ...zin.vue,
        ...zin.patch,
        "unicorn/prefer-dom-node-text-content": "off"
    }
});