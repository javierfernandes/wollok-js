import { Assertion, expect } from 'chai'
import { Class, Closure, Field, Method, Mixin, Package, Parameter, Reference, Singleton, VariableDeclaration } from '../src/model'
import { describe, it } from 'mocha'
import linker, { Path } from '../src/linker'

import { parseFile } from '../src/parser'
import { readFileSync } from 'fs'

const { keys } = Object


const wre = parseFile(readFileSync('src/wre/lang.wlk', 'utf8'), 'wollok')
const link = (...args) => linker(wre, ...args)

//===============================================================================================================================
// TESTS
//===============================================================================================================================

//TODO: Perhaps we should test each link step separately instead of running the whole link process (similar to what we do with parsers)
describe('Wollok linker', () => {

  describe('path linking', () => {
    const environment = link(
      Package('p')(
        Package('q')(
          Class('C')()(
            Method('m')()()
          )
        )
      )
    )

    const p = Path().elements[0]
    const q = p.elements[0]
    const C = q.elements[0]
    const m = C.members[0]

    it('should link each node with its path', () => {
      for (const path of [Path(), p, q, C, m]) {
        expect(path(environment).path.toString()).to.equal(path.toString())
      }
    })

    it('should link each path with its parent', () => {
      expect(environment.path.parent()).to.be.undefined
      expect(p.parent().toString()).to.equal(Path().toString())
      expect(q.parent().toString()).to.equal(p.toString())
      expect(C.parent().toString()).to.equal(q.toString())
      expect(m.parent().toString()).to.equal(C.toString())
    })

  })

  describe('scope linking', () => {

    const wrePaths = environment => {
      const wre = environment.elements.find(_ => _.name === 'wollok')

      return wre.elements.reduce((scope, elem) => ({ ...scope, [elem.name]: elem.path }), { [wre.name]: wre.path })
    }

    it('should link each node with its scope', () => {
      const environment = link(
        Package('p')(
          Class('C')()(),
          Package('q')(
            Mixin('M')()
          )
        )
      )
      const p = Path().elements[0]
      const C = p.elements[0]
      const q = p.elements[1]
      const M = q.elements[0]
      const wre = wrePaths(environment)

      expect(p(environment)).to.have.scope({ ...wre, p })
      expect(C(environment)).to.have.scope({ ...wre, p, C, q })
      expect(q(environment)).to.have.scope({ ...wre, p, C, q })
      expect(M(environment)).to.have.scope({ ...wre, p, C, q, M })
    })

    it('should avoid including non-visible definitions to the scope', () => {
      const environment = link(
        Package('p')(
          Package('q')(
            Class('C')()()
          ),
          Package('r')(
            Mixin('M')()
          )
        )
      )
      const p = Path().elements[0]
      const q = p.elements[0]
      const C = q.elements[0]
      const r = p.elements[1]
      const M = r.elements[0]

      const wre = wrePaths(environment)
      expect(p(environment)).to.have.scope({ ...wre, p })
      expect(q(environment)).to.have.scope({ ...wre, p, q, r })
      expect(C(environment)).to.have.scope({ ...wre, p, q, r, C })
      expect(r(environment)).to.have.scope({ ...wre, p, q, r })
      expect(M(environment)).to.have.scope({ ...wre, p, q, r, M })
    })

    it('should override outer contributions with inner ones', () => {
      const environment = link(
        Package('n')(
          Singleton('n')()(
            Field('n'),
            Method('m1')(Parameter('n'))(Closure(Parameter('n'))(Reference('n'))),
            Method('m2')()(VariableDeclaration('n'), Reference('n')),
          )
        )
      )
      const nPackage = Path().elements[0]
      const nObject = nPackage.elements[0]
      const nField = nObject.members[0]
      const m1 = nObject.members[1]
      const m1Parameter = m1.parameters[0]
      const c = m1.sentences.sentences[0]
      const cnParameter = c.parameters[0]
      const cnReference = c.sentences.sentences[0]
      const m2 = nObject.members[2]
      const nVariable = m2.sentences.sentences[0]
      const nnReference = m2.sentences.sentences[1]
      const wre = wrePaths(environment)

      expect(nPackage(environment)).to.have.scope({ ...wre, n: nPackage })
      expect(nObject(environment)).to.have.scope({ ...wre, n: nObject })
      expect(nField(environment)).to.have.scope({ ...wre, n: nField })
      expect(m1(environment)).to.have.scope({ ...wre, n: nField })
      expect(m1Parameter(environment)).to.have.scope({ ...wre, n: m1Parameter })
      expect(c(environment)).to.have.scope({ ...wre, n: m1Parameter })
      expect(cnParameter(environment)).to.have.scope({ ...wre, n: cnParameter })
      expect(cnReference(environment)).to.have.scope({ ...wre, n: cnParameter })
      expect(m2(environment)).to.have.scope({ ...wre, n: nField })
      expect(nVariable(environment)).to.have.scope({ ...wre, n: nVariable })
      expect(nnReference(environment)).to.have.scope({ ...wre, n: nVariable })
    })
  })

  describe('reference linking', () => {
    it('should add target field to all direct References with path pointing to referenced node', () => {
      const environment = link(
        Package('p')(
          Class('C')()(
            Method('m')(Parameter('a'))(Reference('a'))
          )
        )
      )
      const m = environment.path.elements[0].elements[0].members[0]
      const p = m.parameters[0]
      const r = m.sentences.sentences[0]

      expect(r(environment).target.toString()).to.equal(p.toString())
    })

    it('should add target field to all qualified name References with path pointing to referenced node', () => {
      const environment = link(
        Package('p')(
          Class('C')()(
            Method('m')()(Reference('p.C'))
          )
        )
      )
      const c = environment.path.elements[0].elements[0]
      const r = c.members[0].sentences.sentences[0]

      expect(r(environment).target.toString()).to.equal(c.toString())
    })
  })

})

//===============================================================================================================================
// ASSERTIONS
//===============================================================================================================================

Assertion.addMethod('scope', function (expected) {
  const node = this._obj

  new Assertion(node.scope).to.exist
  new Assertion(keys(node.scope)).to.have.members(keys(expected))
  for (const name in expected) {
    new Assertion({ [name]: node.scope[name].toString() }).to.deep.equal({ [name]: expected[name].toString() })
  }
})