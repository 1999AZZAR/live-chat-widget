import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import nodePlugin from 'eslint-plugin-node';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.browser,
				...globals.serviceworker,
			},
		},
		plugins: {
			prettier: prettierPlugin,
			node: nodePlugin,
		},
		rules: {
			...prettier.rules,
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					trailingComma: 'es5',
					useTabs: true,
					tabWidth: 2,
					semi: true,
					printWidth: 100,
				},
			],
			'no-unused-vars': 'warn',
			'no-console': 'off',
		},
	},
];
