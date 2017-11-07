const { assign, keys } = Object

// GENERAL TODOs
// - Handle the posibility of error on the linker (and perhaps think a global approach for the whole pipeline)
// - Update compiler to new Linker
// - Clean re-organize model / transformations
// - Implement validations
// - Refactor code using JS-Extensions
//    - .length              => Array.isEmpty()
//    - slice(-1)[0]         => Array.last()
//    - filter(x => x !== y) => Array.remove()

//===============================================================================================================================
// BEHAVIOUR
//===============================================================================================================================

//TODO: Perhaps these are not necesarily methods on node. Perhaps we could move them out, as independent functions
const nodeBehaviour = {
  is(typeOrCategory) {
    return typeOrCategory.toString().split(',').some(t => this.type === t)
  },

  copy(diff) {
    const clone = { ...this }
    for (const key in diff) {
      clone[key] = diff[key] instanceof Function ? diff[key](clone[key]) : diff[key]
    }
    return clone
  }
}

export const match = cases => assign(model => {
  if (!model.type) throw new TypeError(`Can't match ${model} because it's not a node`) //TODO: !model.is(Node)
  const applicableCase = keys(cases).filter(key => model.is(key))
  if (applicableCase.length < 1) throw new TypeError(`No matching match case for ${model.type} node`)
  return cases[applicableCase[0]](model)
}, cases)

export const node = builder => body => ({ type: builder instanceof Function ? builder.name : builder, ...body, ...nodeBehaviour })

//===============================================================================================================================
// NODES
//===============================================================================================================================

export const Parameter = (name, varArg = false) => node(Parameter)({ name, varArg })

//TODO: Rename all references to this node named "sentences" to something else, like "sentenceBlock" or "body"
export const Block = (...sentences) => node(Block)({ sentences })

//-------------------------------------------------------------------------------------------------------------------------------
// TOP LEVEL
//-------------------------------------------------------------------------------------------------------------------------------

export const Package = (name, ...imports) => (...elements) => node(Package)({ name, imports, elements })

export const Class = (name) => (superclass = name === 'Object' ? undefined : Reference('wollok.Object'), ...mixins) => (...members) => node(Class)({ name, superclass, mixins, members })
export const Mixin = (name) => (...members) => node(Mixin)({ name, members })
export const Singleton = (name = undefined) => (superclass = Reference('wollok.Object'), superArguments = [], ...mixins) => (...members) => node(Singleton)({ name, superclass, superArguments, mixins, members })

export const Program = (name) => (...sentences) => node(Program)({ name, sentences: Block(...sentences) })
export const Test = (description) => (...sentences) => node(Program)({ description, sentences: Block(...sentences) })

//-------------------------------------------------------------------------------------------------------------------------------
// MEMBERS
//-------------------------------------------------------------------------------------------------------------------------------

export const Field = (name, writeable = true, value = Literal(null)) => node(Field)({ name, writeable, value })
export const Method = (name, override = false, native = false) => (...parameters) => (...sentences) => node(Method)({ name, override, native, parameters, sentences: Block(...sentences) })
export const Constructor = (...parameters) => (baseArguments = [], lookUpCall = true) => (...sentences) => node(Constructor)({ parameters, sentences: Block(...sentences), lookUpCall, baseArguments })

//-------------------------------------------------------------------------------------------------------------------------------
// SENTENCES
//-------------------------------------------------------------------------------------------------------------------------------

// TODO: Rename to Variable?
export const VariableDeclaration = (name, writeable = true, value = Literal(null)) => node(VariableDeclaration)({ name, writeable, value })
export const Return = (result) => node(Return)({ result })
export const Assignment = (variable, value) => node(Assignment)({ variable, value })

//-------------------------------------------------------------------------------------------------------------------------------
// EXPRESSIONS
//-------------------------------------------------------------------------------------------------------------------------------

export const Self = () => node(Self)({ })
export const Reference = (name) => node(Reference)({ name })
export const Literal = (value) => node(Literal)({ value })
// TODO: Remove: Replace with New to WRE's List
export const List = (...values) => node(List)({ values })
export const Closure = (...parameters) => (...sentences) => node(Closure)({ parameters, sentences: Block(...sentences) })

// TODO: Rename target to receiver
export const Send = (target, key) => (...parameters) => node(Send)({ target, key, parameters })
export const Super = (...parameters) => node(Super)({ parameters })

// TODO: Rename target to something else
export const New = (target) => (...parameters) => node(New)({ target, parameters })

export const If = (condition) => (...thenSentences) => (...elseSentences) => node(If)({ condition, thenSentences: Block(...thenSentences), elseSentences: Block(...elseSentences) })
export const Throw = (exception) => node(Throw)({ exception })
export const Try = (...sentences) => (...catches) => (...always) => node(Try)({ sentences: Block(...sentences), catches, always: Block(...always) })
export const Catch = (variable, errorType) => (...handler) => node(Catch)({ variable, errorType, handler: Block(...handler) })

//===============================================================================================================================
// CATEGORIES
//===============================================================================================================================

export const Module = [Class, Mixin, Singleton]
export const Runnable = [Program, Test]
export const TopLevel = [Package, ...Module, ...Runnable]
export const Member = [Field, Method, Constructor]
export const Sentence = [VariableDeclaration, Return, Assignment]
export const Expression = [Reference, Self, Literal, List, Closure, Send, Super, New, If, Throw, Try]
export const Node = [...TopLevel, ...Member, ...Sentence, ...Expression, Catch, Parameter, Block]

Node.forEach(builder => { builder.toString = () => builder.name })
