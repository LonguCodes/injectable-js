const tsconfig = require("./tsconfig.json")
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	reporters: ['default', 'jest-junit'],
	moduleNameMapper:pathsToModuleNameMapper(compilerOptions.paths,{prefix: '<rootDir>/'} ),
};
