module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "parser": "babel-eslint",
    "globals": {

    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "no-console": ["error", {
            "allow": ["warn", "error", "info"]
        }]
    }
};
