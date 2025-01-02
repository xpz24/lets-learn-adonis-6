import { configApp, RULES_LIST, IGNORE_LIST, INCLUDE_LIST } from '@adonisjs/eslint-config'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
// import globals from 'globals'
import eslintPluginImportX from 'eslint-plugin-import-x'
import { createOxcImportResolver } from 'eslint-import-resolver-oxc'

const keysToRemove = ['unicorn/no-null']

const customDefaultRules = {
  'unicorn/prevent-abbreviations': [
    'error',
    {
      allowList: {
        env: true,
        ctx: true,
        dbConfig: true,
      },
    },
  ],
  '@typescript-eslint/return-await': ['error', 'always'],
}

const eslintRecommendedRules = extractRules([eslint.configs.recommended])
const unicornRecommendedRules = extractRules([eslintPluginUnicorn.configs['flat/recommended']])
const strictTypeCheckedRules = extractRules(tseslint.configs.strictTypeChecked)
const stylisticTypeCheckedRules = extractRules(tseslint.configs.stylisticTypeChecked)
const eslintPluginImportXRules = eslintPluginImportX.flatConfigs.recommended.rules

const customConfigObject = {
  name: 'Custom Config',
  languageOptions: {
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
    unicornRecommendedRules,
    strictTypeCheckedRules,
    stylisticTypeCheckedRules,
    modifyUnicornKeys(RULES_LIST),
    customDefaultRules,
    eslintPluginImportXRules
  ),
}

const mergedDefaultConfig = deepMerge(...configApp())

// Ensure all the unicorn keys are in the correct format
mergedDefaultConfig.rules = modifyUnicornKeys(mergedDefaultConfig.rules)
delete mergedDefaultConfig.plugins['@unicorn']
mergedDefaultConfig.plugins.unicorn = eslintPluginUnicorn

// Ensure all the plugins merged into a single config
mergedDefaultConfig.plugins = deepMerge(
  mergedDefaultConfig.plugins,
  eslintPluginImportX.flatConfigs.recommended.plugins
)

const mergedConfig = deepMerge(mergedDefaultConfig, customConfigObject)

const resolverNext = {
  'import-x/resolver-next': [createOxcImportResolver()],
}
mergedConfig.settings = resolverNext

// Remove rules if required
mergedConfig.rules = removeRules(mergedConfig.rules, keysToRemove)

// console.dir(mergedConfig.plugins, {depth: 1})
export default [mergedConfig]

// Helper Functions
function extractRules(configObjectsList) {
  const rulesObjects = configObjectsList
    .filter((configObject) => configObject.rules !== undefined)
    .map((configObject) => configObject.rules)
    .reduce((accumulator, object) => ({ ...accumulator, ...object }))

  return rulesObjects
}

function modifyUnicornKeys(unicornRuleObject) {
  return Object.fromEntries(
    Object.entries(unicornRuleObject).map(([key, value]) => {
      if (key.startsWith('@unicorn')) {
        return [key.slice(1), value]
      }
      return [key, value]
    })
  )
}

function removeRules(ruleObject, keysToRemove) {
  if (keysToRemove.length !== 0) {
    return Object.fromEntries(
      Object.entries(ruleObject)
        .map(([key, value]) => {
          if (keysToRemove.includes(key)) {
            return undefined
          }
          return [key, value]
        })
        .filter(Boolean)
    )
  } else {
    return ruleObject
  }
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
