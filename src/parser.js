import { generate } from 'pegjs'
import path from 'path'
import { readFileSync } from 'fs'

let parser = null

try {
  const grammar = readFileSync(path.resolve('src/grammar.pegjs'), 'utf8')
  const ruleNames = grammar.match(/^[\w_]+ +=/gm).map(ruleName => ruleName.slice(0, -2).trim())

  parser = generate(grammar, { allowedStartRules: ruleNames })
} catch (error) {
  const grammar = 'grammar.js'
  parser = require(`./${grammar}`)
}

export default parser.parse

export const parseFile = (fileContent, fileName = '') => {
  const packageNode = parser.parse
  packageNode.name = fileName
  return packageNode
}