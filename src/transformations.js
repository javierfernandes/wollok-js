import { Assignment, Block, Catch, Class, Closure, Constructor, Field, If, List, Method, Module, New, Node, Package, Return, Runnable, Send, Super, Try, VariableDeclaration, match } from './model'

export const addDefaultConstructor = match({
  [Package]: ({ elements }) => Package(...elements.map(addDefaultConstructor)),
  [Class]: (node) => (node.members.some(c => c.is(Constructor)) ? node : node.copy({ members: ms => [Constructor()()(), ...ms] })),
  [Node]: (node) => node
})

// TODO: Test this
export const flatMap = cases => match({
  [Block]: node => match(cases)(node).copy({ sentences: sentences => sentences.map(flatMap(cases)) }),
  [Package]: node => match(cases)(node).copy({ elements: elements => elements.map(flatMap(cases)) }),
  [Module]: node => match(cases)(node).copy({ members: members => members.map(flatMap(cases)) }),
  [Runnable]: node => match(cases)(node).copy({ sentences: flatMap(cases) }),
  [Field]: node => match(cases)(node).copy({ value: flatMap(cases) }),
  [Method]: node => match(cases)(node).copy({ parameters: parameters => parameters.map(flatMap(cases)), sentences: flatMap(cases) }),
  [Constructor]: node => match(cases)(node).copy({ parameters: parameters => parameters.map(flatMap(cases)), sentences: flatMap(cases), baseArguments: baseArguments => baseArguments.map(flatMap(cases)) }),
  [VariableDeclaration]: node => match(cases)(node).copy({ value: flatMap(cases) }),
  [Return]: node => match(cases)(node).copy({ result: flatMap(cases) }),
  [Assignment]: node => match(cases)(node).copy({ variable: flatMap(cases), value: flatMap(cases) }),
  [List]: node => match(cases)(node).copy({ values: values => values.map(flatMap(cases)) }),
  [Closure]: node => match(cases)(node).copy({ parameters: parameters => parameters.map(flatMap(cases)), sentences: flatMap(cases) }),
  [Send]: node => match(cases)(node).copy({ target: flatMap(cases), parameters: parameters => parameters.map(flatMap(cases)) }),
  [Super]: node => match(cases)(node).copy({ parameters: parameters => parameters.map(flatMap(cases)) }),
  [New]: node => match(cases)(node).copy({ parameters: parameters => parameters.map(flatMap(cases)) }),
  [If]: node => match(cases)(node).copy({ condition: flatMap(cases), thenSentences: flatMap(cases), elseSentences: flatMap(cases) }),
  [Try]: node => match(cases)(node).copy({ sentences: flatMap(cases), catches: catches => catches.map(flatMap(cases)), always: always => always.map(flatMap(cases)) }),
  [Catch]: node => match(cases)(node).copy({ variable: flatMap(cases), handler: flatMap(cases) }),
  [Node]: node => match(cases)(node)
})