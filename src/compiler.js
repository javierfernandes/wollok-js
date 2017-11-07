import { Assignment, Block, Catch, Class, Closure, Constructor, Field, If, List, Literal, Method, Mixin, New, Package, Parameter, Program, Reference, Return, Self, Send, Singleton, Super, Throw, Try, VariableDeclaration, match } from './model'

export default (environment, natives) => compileWithNatives(environment, natives)

//TODO: This code sucks. Hopefully it's just temporary...
const compileWithNatives = (environment, natives) => {

  const compileMethodDispatcher = members => ({ name }) =>
    `this['${escape(name)}'] = (function(){
    const implementation$ = (...args) => {
      ${members.filter(({ name: n }) => n === name).map(compile).join(';\n')}
    }
    return implementation$(...arguments)
  }).bind(this)`

  const compile = match({

    [Package]: ({ path, elements }) => `
      ${path.isRoot() ? 'const $environment = ' : ''} {
      ${elements.map(element => `
        get ${escape(element.name)}() { delete this.${escape(element.name)}; return this.${escape(element.name)} = (${compile(element)})}
      `).join(',')}
      }`,

    [Class]: ({ name, superclass, mixins, members }) => {
      const superclassQualifiedName = `${name !== 'Object' ? `$environment.${escapeQualified(superclass.target.qualifiedName(environment))}` : 'Object'}`
      return `
        class ${escape(name)} extends ${mixins.reduce((parent, mixin) => `${escape(mixin)}(${parent})`, superclassQualifiedName)} {
          constructor() {
            let $instance = undefined
            ${members.filter(m => m.type === 'Constructor').map(compile).join(';\n')}
            ${members.filter(m => m.type === 'Field').map(compile).join(';\n')}
            ${members.filter(m => m.type === 'Method').map(compileMethodDispatcher(members)).join(';\n')}
            return $instance
          }
        }
      `
    },

    [Singleton]: ({ name, superclass, mixins, superArguments, members }) => {
      const superclassQualifiedName = `$environment.${escapeQualified(superclass.target.qualifiedName(environment))}`
      return `new class ${escape(name)} extends ${mixins.reduce((parent, mixin) => `${escape(mixin)}(${parent})`, escape(superclassQualifiedName))} {
        constructor(){
          $instance = super(${superArguments.map(compile).join()})
          ${members.filter(m => m.type === 'Field').map(compile).join(';\n')}
          ${members.filter(m => m.type === 'Method').map(compileMethodDispatcher(members)).join(';\n')}
        }
      }`
    },

    [Mixin]: ({ members }) =>
      `($$superclass) => class extends $$superclass {
      constructor() {
        let $instance = undefined
        ${members.filter(m => m.type === 'Constructor').map(compile).join(';\n')}
        ${members.filter(m => m.type === 'Field').map(compile).join(';\n')}
        ${members.filter(m => m.type === 'Method').map(compileMethodDispatcher(members)).join(';\n')}
        return $instance
      }
    }`,

    [Constructor]: ({ parameters, path, baseArguments, lookUpCall, sentences }) => `
    if(arguments.length ${(parameters.length && parameters.slice(-1)[0].varArg) ? '+ 1 >=' : '==='} ${parameters.length}) {
      $instance = ${lookUpCall ? 'super' : `new ${path.parent()(environment).name}`}(${baseArguments.map(compile).join()});
      (function (${parameters.map(compile).join()}){${compile(sentences)}}).call($instance,...arguments)
    }`,

    [Field]: ({ name, value }) => `$instance.${name}=${compile(value)}`,

    [Method]: ({ name, parameters, sentences, native, path }) => {
      const parent = path.parent()(environment)
      //TODO: IMPLEMENT NATIVES
      // if (native && !(natives[parent.name] && natives[parent.name][name])) throw new TypeError(`Missing native implementation for ${parent.name}.${name}(...)`)
      // return `const implementation$$${parameters.length} = ${native
      //   ? `(function ${natives[parent.name][name].toString().slice(natives[parent.name][name].toString().indexOf('('))}).bind(this)`
      //   : `(${parameters.map(compile).join()}) => {${compile(sentences)}}`}
      //   if (args.length ${(parameters.length && parameters.slice(-1)[0].varArg) ? ` >= + ${parameters.length - 1}` : ` === ${parameters.length}`} ) {
      //     return implementation$$${parameters.length} (...args)
      //   }`
      return `const implementation$$${parameters.length} = ${native
        ? '(function (){}).bind(this)'
        : `(${parameters.map(compile).join()}) => {${compile(sentences)}}`}
        if (args.length ${(parameters.length && parameters.slice(-1)[0].varArg) ? ` >= + ${parameters.length - 1}` : ` === ${parameters.length}`} ) {
          return implementation$$${parameters.length} (...args)
        }`
    },

    [VariableDeclaration]: ({ name, writeable, value }) => `${writeable ? 'let' : 'const'} ${name} = ${compile(value)}`,

    [Assignment]: ({ variable, value }) => `${compile(variable)} = ${compile(value)}`,

    [Self]: () => 'this',

    [Reference]: ({ name, target }) => `${target(environment).type === 'Field' ? 'this.' : ''}${escape(name)}`,

    [Send]: ({ target, key, parameters }) => `${compile(target)}["${escape(key)}"](${parameters.map(compile).join()})`,

    [New]: ({ target, parameters }) => `(new (${escapeQualified(target.target.qualifiedName(environment))})(${parameters.map(compile).join()}))`,

    [Super]: ({ parameters }) => `super(${parameters.map(compile).join()})`,

    [If]: ({ condition, thenSentences, elseSentences }) =>
      `(() => { if (${compile(condition)}) {${compile(thenSentences)}} else {${compile(elseSentences)}}})()`,

    [Return]: ({ result }) => `return ${compile(result)}`,

    [Throw]: ({ exception }) => `(() => { throw ${compile(exception)} })()`,

    [Try]: ({ sentences, catches, always }) => `(()=> {
      let $response;
      try {
        $response = (()=>{${compile(sentences)}})()
      }
      catch($error){
        ${always.sentences.length ? `(()=>{${compile(always)}})();` : ''}
        ${catches.map(compile).join(';\n')}
        throw $error
      }
      return ${always.sentences.length ? `(()=>{${compile(always)}})()` : '$response'}
    })()`,

    [Catch]: ({ variable, errorType, handler }) =>
      `if (${errorType ? `$error instanceof ${errorType}` : 'true'} ) {
      return ((${compile(variable)}) => {${compile(handler)}})($error)
    }`,

    [Literal]: ({ value }) => {
      switch (typeof value) {
        case 'number': return `(()=>{
          const $value = new ${value % 1 === 0 ? '$environment.wollok.Integer' : '$environment.wollok.Double'}()
          $value.$inner = ${value}
          return $value
        })()`
        case 'string': return `(()=>{
          const $value = new $environment.wollok.$String()
          $value.$inner = "${value.replace(/"/g, '\\"')}"
          return $value
        })()`
        case 'boolean': return `(()=>{
          const $value = new $environment.wollok.$Boolean()
          $value.$inner = ${value}
          return $value
        })()`
        default: return `${value}`
      }
    },

    [List]: ({ values }) => `(() => {
      const l = new List();
      l.$inner = [ ${values.map(compile).join()} ]
      return l
    })()`,

    [Closure]: ({ parameters, sentences }) => `(() => {
      const c = new Closure();
      c.$inner = function (${parameters.map(compile).join()}) { ${compile(sentences)} }
      return c
    })()`,

    // TODO: tests

    [Program]: ({ name, sentences }) => `function ${escape(name)}(){${compile(sentences)}}`,

    [Block]: ({ sentences }) => {
      const compiledSentences = sentences.map(sentence => `${compile(sentence)};`)
      if (compiledSentences.length && !compiledSentences[compiledSentences.length - 1].startsWith('return')) {
        compiledSentences[compiledSentences.length - 1] = `return ${compiledSentences[compiledSentences.length - 1]}`
      }
      return compiledSentences.join(';\n')
    },

    [Parameter]: ({ name, varArg }) => (varArg ? `...${escape(name)}` : escape(name))
  });

  return `${compile(environment)};$environment`
}

// TODO: Perhaps the name of things should be a separate node, so this can be just a separate pattern
const escape = str => ([
  'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default',
  'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if',
  'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
  'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof',
  'var', 'void', 'volatile', 'while', 'with', 'yield', 'Object', 'Boolean', 'String', 'Set'
].indexOf(str) >= 0 ? `$${str}` : str)

// TODO: Perhaps the qualified name should be a separate node, so this can be just a separate pattern
const escapeQualified = str => str.split('.').map(escape).join('.')