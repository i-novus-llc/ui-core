const { peerDependencies } = require('./package.json')

module.exports = {
    "root": true,
    "extends": [
        "@i-novus/eslint-config/react"
    ],
    "rules": {
        "import/no-unresolved": ["error", { ignore: Object.keys(peerDependencies) }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "jsx-a11y/control-has-associated-label": "off",
//        "arrow-parens": ["error", "always"],
//        "react/default-props-match-prop-types": ["off"],
       "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsFor": ["state", "acc", "out"] }]
    }
}
