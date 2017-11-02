import { Assignment, Block, Catch, Closure, Constructor, Field, If, List, Method, Module, New, Node, Package, Reference, Return, Runnable, Send, Super, Try, VariableDeclaration, match } from './model'

import { flatMap } from './transformations'

const { isNaN } = Number

//===============================================================================================================================
// PATH
//===============================================================================================================================

export const Path = (...steps) => new Proxy(root => steps.reduce((prev, step) => prev[step], root), {
  get: function(target, property) {
    if (property === 'parent') return () => (steps.length ? Path(...(isNaN(Number(steps.slice(-1)[0])) ? steps.slice(0, -1) : steps.slice(0, -2))) : undefined)
    if (property === 'isRoot') return () => steps.length === 0
    if (property === 'toString') return () => ['~', ...steps].join('/')
    return Path(...steps, property)
  }
})

//===============================================================================================================================
// LINKER
//===============================================================================================================================

export default (...packages) => {
  const environment = packages.reduce(mergeInto, Package('')())

  //TODO: Manejar casos de error
  return [
    linkPath(),
    linkScope,
    linkReferences
  ].reduce((env, step) => step(env), environment)
}

//-------------------------------------------------------------------------------------------------------------------------------
// ENVIRONMENT MERGING
//-------------------------------------------------------------------------------------------------------------------------------

const mergeInto = (rootPackage, isolatedPackage) => {
  const alphabetically = (a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  }

  if (rootPackage.name === isolatedPackage.name) return isolatedPackage.elements.reduce(mergeInto, rootPackage)

  const alreadyPresent = rootPackage.elements.find(elem => elem.is(Package) && elem.name === isolatedPackage.name)
  return alreadyPresent
    ? rootPackage.copy({ elements: [
      ...rootPackage.elements.filter(elem => elem !== alreadyPresent),
      isolatedPackage.elements.reduce(mergeInto, alreadyPresent)
    ].sort(alphabetically) })
    : rootPackage.copy({ elements: [...rootPackage.elements, isolatedPackage].sort(alphabetically) })
}

//-------------------------------------------------------------------------------------------------------------------------------
// PATH LINKING
//-------------------------------------------------------------------------------------------------------------------------------

const linkPath = (pathToNode = Path()) => {
  const linkAllPaths = selector => node => selector(node).map((child, index) => linkPath(selector(pathToNode)[index])(child))
  const path = () => pathToNode

  return match({
    [Package]: node => node.copy({ path, imports: linkAllPaths(_ => _.elements)(node), elements: linkAllPaths(_ => _.elements)(node) }),
    [Block]: node => node.copy({ path, sentences: linkAllPaths(_ => _.sentences)(node) }),
    [Module]: node => node.copy({ path, members: linkAllPaths(_ => _.members)(node) }),
    [Runnable]: node => node.copy({ path, sentences: linkPath(pathToNode.sentences) }),
    [Field]: node => node.copy({ path, value: linkPath(pathToNode.value) }),
    [Method]: node => node.copy({ path, parameters: linkAllPaths(_ => _.parameters)(node), sentences: linkPath(pathToNode.sentences) }),
    [Constructor]: node => node.copy({ path, parameters: linkAllPaths(_ => _.parameters)(node), sentences: linkPath(pathToNode.sentences), baseArguments: linkAllPaths(_ => _.baseArguments)(node) }),
    [VariableDeclaration]: node => node.copy({ path, value: linkPath(pathToNode.value) }),
    [Return]: node => node.copy({ path, result: linkPath(pathToNode.result) }),
    [Assignment]: node => node.copy({ path, variable: linkPath(pathToNode.variable), value: linkPath(pathToNode.value) }),
    [List]: node => node.copy({ path, values: linkAllPaths(_ => _.values)(node) }),
    [Closure]: node => node.copy({ path, parameters: linkAllPaths(_ => _.parameters)(node), sentences: linkPath(pathToNode.sentences) }),
    [Send]: node => node.copy({ path, target: linkPath(pathToNode.target), parameters: linkAllPaths(_ => _.parameters)(node) }),
    [Super]: node => node.copy({ path, parameters: linkAllPaths(_ => _.parameters)(node) }),
    [New]: node => node.copy({ path, parameters: linkAllPaths(_ => _.parameters)(node) }),
    [If]: node => node.copy({ path, condition: linkPath(pathToNode.condition), thenSentences: linkPath(pathToNode.thenSentences), elseSentences: linkPath(pathToNode.elseSentences) }),
    [Try]: node => node.copy({ path, sentences: linkPath(pathToNode.sentences), catches: linkAllPaths(_ => _.catches)(node), always: linkAllPaths(_ => _.always)(node) }),
    [Catch]: node => node.copy({ path, variable: linkPath(pathToNode.variable), handler: linkPath(pathToNode.handler) }),
    [Node]: node => node.copy({ path })
  })
}

//-------------------------------------------------------------------------------------------------------------------------------
// SCOPE LINKING
//-------------------------------------------------------------------------------------------------------------------------------

const linkScope = environment => {
  const addToScope = selector => node => selector(node).reduce((scope, elem) => (
    { ...scope, [elem.name]: elem.path }
  ), {})

  const importedItems = environment => importRef => (importRef.name.split('.').slice(-1)[0] === '*'
    ? importRef.path.parent()(environment).elements
    : importRef)

  const scopeWithin = environment => path => {
    const scopeContributions = match({
      [Package]: addToScope(_ => [..._.elements, ..._.imports.reduce((a, i) => [...a, ...importedItems(environment)(i)])]),
      [Module]: addToScope(_ => _.members.filter(m => m.is(Field))),
      [[Method, Closure]]: addToScope(_ => _.parameters),
      [Block]: addToScope(_ => _.sentences.filter(s => s.is(VariableDeclaration))),
      [Node]: () => {}
    })(path(environment))

    return path.isRoot() ? scopeContributions : { ...scopeWithin(environment)(path.parent()), ...scopeContributions }
  }

  return flatMap({
    //TODO: Perhaps we should use a node Root or Environment instead of Package, so we don't have to check?
    [Package]: node => (node.path.isRoot() ? node : node.copy({ scope: scopeWithin(environment)(node.path.parent()) })),
    [Node]: node => node.copy({ scope: scopeWithin(environment)(node.path.parent()) })
  })(environment)
}

//-------------------------------------------------------------------------------------------------------------------------------
// REFERENCE LINKING
//-------------------------------------------------------------------------------------------------------------------------------

const linkReferences = flatMap({
  //TODO: This should be done recursively over each section of the name separated by '.'
  [Reference]: node => node.copy({ target: () => node.scope[node.name] }),
  [Node]: node => node
})