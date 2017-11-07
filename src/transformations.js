import { Assignment, Block, Catch, Class, Closure, Constructor, Field, If, List, Method, Mixin, New, Node, Package, Return, Runnable, Send, Singleton, Super, Throw, Try, VariableDeclaration, match } from './model'

// TODO: This file should probably be unified with the rest of model behavior

// TODO: Test this
//TODO: flatMap is not the right name for this. But what is?
export const flatMap = cases => match({
  [Block]: node => match(cases)(node).copy({ sentences: sentences => sentences.map(flatMap(cases)) }),
  [Package]: node => match(cases)(node).copy({ elements: elements => elements.map(flatMap(cases)) }),
  [Class]: node => match(cases)(node).copy({ members: members => members.map(flatMap(cases)), superclass: sc => sc && flatMap(cases)(sc), mixins: mixins => mixins.map(flatMap(cases)) }),
  [Mixin]: node => match(cases)(node).copy({ members: members => members.map(flatMap(cases)) }),
  [Singleton]: node => match(cases)(node).copy({ members: members => members.map(flatMap(cases)), superclass: flatMap(cases), mixins: mixins => mixins.map(flatMap(cases)), superArguments: superArguments => superArguments.map(flatMap(cases)) }),
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
  [New]: node => match(cases)(node).copy({ target: flatMap(cases), parameters: parameters => parameters.map(flatMap(cases)) }),
  [Throw]: node => match(cases)(node).copy({ exception: flatMap(cases) }),
  [If]: node => match(cases)(node).copy({ condition: flatMap(cases), thenSentences: flatMap(cases), elseSentences: flatMap(cases) }),
  [Try]: node => match(cases)(node).copy({ sentences: flatMap(cases), catches: catches => catches.map(flatMap(cases)), always: flatMap(cases) }),
  [Catch]: node => match(cases)(node).copy({ variable: flatMap(cases), errorType: t => t && flatMap(cases)(t), handler: flatMap(cases) }),
  [Node]: node => match(cases)(node)
})

export const addDefaultConstructor = flatMap({
  [Class]: node => node.members.some(_ => _.is(Constructor)) ? node : node.copy({ members: ms => [...ms, Constructor()()()] }),
  [Node]: node => node
})