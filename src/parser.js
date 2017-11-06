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
// TODO: How about, instead of receiving the grammar rule name we take parse[Expression] or something? Like we do with other match based functions
const parse = (...args) => {
  try { return parser.parse(...args) } catch ({ location: { start, end }, message }) {
    throw new SyntaxError(`[${start.line}:${start.column} - ${end.line}:${end.column}]: ${message}`, undefined, start.line)
  }
}

export default parse

export const parseFile = (fileContent, fileName = '') => {
  const packageNode = parse(fileContent)
  packageNode.name = fileName
  return packageNode
}