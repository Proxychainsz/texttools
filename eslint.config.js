export default [
	{
		env: {
			browser: true,
			es2021: true,
		},

		extends: ['airbnb-base', 'prettier'],
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			semi: 'error',
			'prefer-const': 'error',
			'no-unused-vars': 'off',
			'no-control-regex': 'off',
			'no-undef': 'off',
			'newline-per-chained-call': { ignoreChainWithDepth: 4 },
		},
	},
];
