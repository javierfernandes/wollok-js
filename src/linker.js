import { Assignment, Block, Catch, Class, Closure, Constructor, Field, If, List, Method, Mixin, Module, New, Node, Package, Reference, Return, Runnable, Send, Singleton, Super, Throw, Try, VariableDeclaration, match } from './model'
import { addDefaultConstructor, flatMap } from './transformations'

const { isNaN } = Number

//===============================================================================================================================
// PATH
//===============================================================================================================================

export const Path = (...steps) => new Proxy(root => steps.reduce((prev, step) => prev[step], root), {
  get: function(target, property, self) {
    if (property === 'parent') return () => (steps.length ? Path(...(isNaN(Number(steps.slice(-1)[0])) ? steps.slice(0, -1) : steps.slice(0, -2))) : undefined)
    if (property === 'isRoot') return () => steps.length === 0
    if (property === 'toString') return () => ['~', ...steps].join('/')
    if (property === 'qualifiedName') {
      return environment => self.isRoot() ? '' : `${self.parent().isRoot() ? '' : `${self.parent().qualifiedName(environment)}.`}${self(environment).name}`
    }
    return Path(...steps, property)
  }
})

//===============================================================================================================================
// LINKER
//===============================================================================================================================

//TODO: Overload to receive a current-environment for incremental building.
export default (...packages) => {
  const environment = packages.reduce(mergeInto, Package('')())

  // TODO: Perhaps Txs like addDefaultConstructor should not be done here. Are there any more?
  const completedEnvironment = addDefaultConstructor(environment)

  //TODO: Manejar casos de error
  return [
    linkPath(),
    linkScope,
    linkReferences
  ].reduce((env, step) => step(env), completedEnvironment)
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
    [Class]: node => node.copy({ path, members: linkAllPaths(_ => _.members)(node), superclass: n => n && linkPath(pathToNode.superclass)(n), mixins: linkAllPaths(_ => _.mixins)(node) }),
    [Mixin]: node => node.copy({ path, members: linkAllPaths(_ => _.members)(node) }),
    [Singleton]: node => node.copy({ path, members: linkAllPaths(_ => _.members)(node), superclass: linkPath(pathToNode.superclass), mixins: linkAllPaths(_ => _.mixins)(node), superArguments: linkAllPaths(_ => _.superArguments)(node) }),
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
    [New]: node => node.copy({ path, target: linkPath(pathToNode.target), parameters: linkAllPaths(_ => _.parameters)(node) }),
    [Throw]: node => node.copy({ path, exception: linkPath(pathToNode.exception) }),
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
      [Package]: node => {
        const wre = environment.elements.find(_ => _.name === 'wollok')
        return addToScope(_ => [
          ...wre ? wre.elements : [],
          ..._.elements,
          ..._.imports.reduce((a, i) => [...a, ...importedItems(environment)(i)])
        ])(node)
      },
      [Module]: addToScope(_ => _.members.filter(m => m.is(Field))),
      [[Constructor, Method, Closure]]: addToScope(_ => _.parameters),
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

const linkReferences = environment => flatMap({
  [Reference]: node => node.copy({
    target: () => {
      const steps = node.name.split('.')
      //TODO: Add QualifiedName node to avoid the if?
      const target = steps.length > 1
        ? steps.reduce((target, name) => target(environment).elements.find(_ => _.name === name).path, Path())
        : node.scope[node.name]
      if (!target || !target(environment)) throw new ReferenceError(`Reference ${node.name} is not in scope`)
      return target
    }
  }),
  [Node]: node => node
})(environment)