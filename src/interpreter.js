import compile from './compiler'

export default natives => environment => {
  const js = compile(environment, natives)
  return eval(js)
}