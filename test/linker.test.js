import { Assertion, expect } from 'chai'
import { Class, Closure, Field, Method, Mixin, Package, Parameter, Reference, Singleton, VariableDeclaration } from '../src/model'
import { describe, it } from 'mocha'
import link, { Path } from '../src/linker'

const { keys } = Object

//===============================================================================================================================
// TESTS
//===============================================================================================================================

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

      expect(p(environment)).to.have.scope({ p })
      expect(C(environment)).to.have.scope({ p, C, q })
      expect(q(environment)).to.have.scope({ p, C, q })
      expect(M(environment)).to.have.scope({ p, C, q, M })
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

      expect(p(environment)).to.have.scope({ p })
      expect(q(environment)).to.have.scope({ p, q, r })
      expect(C(environment)).to.have.scope({ p, q, r, C })
      expect(r(environment)).to.have.scope({ p, q, r })
      expect(M(environment)).to.have.scope({ p, q, r, M })
    })

    it('should override outer contributions with inner ones', () => {
      const environment = link(
        Package('x')(
          Singleton('x')()(
            Field('x'),
            Method('m')(Parameter('x'))(Closure(Parameter('x'))(Reference('x'))),
            Method('n')()(VariableDeclaration('x'), Reference('x')),
          )
        )
      )
      const xPackage = Path().elements[0]
      const xObject = xPackage.elements[0]
      const xField = xObject.members[0]
      const m = xObject.members[1]
      const xParameter = m.parameters[0]
      const c = m.sentences.sentences[0]
      const cxParameter = c.parameters[0]
      const cxReference = c.sentences.sentences[0]
      const n = xObject.members[2]
      const xVariable = n.sentences.sentences[0]
      const nxReference = n.sentences.sentences[1]

      expect(xPackage(environment)).to.have.scope({ x: xPackage })
      expect(xObject(environment)).to.have.scope({ x: xObject })
      expect(xField(environment)).to.have.scope({ x: xField })
      expect(m(environment)).to.have.scope({ x: xField })
      expect(xParameter(environment)).to.have.scope({ x: xParameter })
      expect(c(environment)).to.have.scope({ x: xParameter })
      expect(cxParameter(environment)).to.have.scope({ x: cxParameter })
      expect(cxReference(environment)).to.have.scope({ x: cxParameter })
      expect(n(environment)).to.have.scope({ x: xField })
      expect(xVariable(environment)).to.have.scope({ x: xVariable })
      expect(nxReference(environment)).to.have.scope({ x: xVariable })
    })
  })

  describe('reference linking', () => {
    //TODO!
  })

})

//===============================================================================================================================
// ASSERTIONS
//===============================================================================================================================

Assertion.addMethod('scope', function (expected) {
  const node = this._obj

  new Assertion(node.scope).to.exist
  new Assertion(keys(node.scope)).to.deep.equal(keys(expected))
  for (const name in expected) {
    new Assertion({ [name]: node.scope[name].toString() }).to.deep.equal({ [name]: expected[name].toString() })
  }
})