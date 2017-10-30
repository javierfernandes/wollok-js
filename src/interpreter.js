import compile from './compiler'

export default (natives) => (...asts) => eval(asts.map(ast => compile(ast, natives)).join(';'))