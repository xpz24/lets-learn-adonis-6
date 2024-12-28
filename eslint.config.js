import { configApp, RULES_LIST, IGNORE_LIST, INCLUDE_LIST } from '@adonisjs/eslint-config'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

const keysToRemove = ['unicorn/expiring-todo-comments']
const customDefaultRules = {
  '@unicorn/prevent-abbreviations': [
    'error',
    {
      allowList: {
        env: true,
        ctx: true
      },
    },
  ],
  '@typescript-eslint/return-await': ['error', 'always'],
}

const eslintRecommendedRules = extractRules([eslint.configs.recommended])
const unicornRecommendedRules = extractRules([eslintPluginUnicorn.configs['flat/recommended']])
const strictTypeCheckedRules = extractRules(tseslint.configs.strictTypeChecked)
const stylisticTypeCheckedRules = extractRules(tseslint.configs.stylisticTypeChecked)

const customConfigObject =
  {
    name: 'Custom Config',
    languageOptions: {
      /*  globals: {
        ...globals.builtin,
        ...globals.nodeBuiltin,
        ...globals.browser,
        ...globals.node,
      }, */
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: [...INCLUDE_LIST, '**/*.tsx', '**/*.mts', '**/*.cts'],
    ignores: [...IGNORE_LIST],
    rules: deepMerge(
    eslintRecommendedRules,
    modifyUnicornKeys(unicornRecommendedRules, keysToRemove),
    strictTypeCheckedRules,
    stylisticTypeCheckedRules,
    modifyUnicornKeys(RULES_LIST),
    customDefaultRules,
    )
  }

function extractRules(configObjectsList) {
  const rulesObjects = configObjectsList
    .filter((configObject) => configObject.rules !== undefined)
    .map((configObject) => configObject.rules)
    .reduce((accumulator, object) => ({ ...accumulator, ...object }))

  return rulesObjects
}

function modifyUnicornKeys(unicornRuleObject, keysToRemove = undefined) {
  return Object.fromEntries(
    Object.entries(unicornRuleObject)
      .map(([key, value]) => {
        if (keysToRemove && keysToRemove.includes(key)) {
          return undefined
        }
        if (key.startsWith('unicorn')) {
          return [`@${key}`, value]
        }
        return [key, value]
      })
      .filter(Boolean)
  )
}

function deepMerge(...objects) {
  return objects.reduce((mergedObject, currentObject) => {
    for (const [key, value] of Object.entries(currentObject)) {
      mergedObject[key] =
        value &&
        typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Object]' &&
        mergedObject[key] &&
        typeof mergedObject[key] === 'object' &&
        Object.prototype.toString.call(mergedObject[key]) === '[object Object]'
          ? deepMerge(mergedObject[key], value)
          : value
    }
    return mergedObject
  }, {})
}

const mergedDefaultConfig = deepMerge(...configApp())
mergedDefaultConfig.rules = modifyUnicornKeys(mergedDefaultConfig.rules)

const mergedConfig = deepMerge(mergedDefaultConfig, customConfigObject)

export default [mergedConfig]
