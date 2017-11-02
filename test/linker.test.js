import { Class, Method, Package } from '../src/model'
import { describe, it } from 'mocha'

import { expect } from 'chai'
import link from '../src/linker'

describe('Wollok linker', () => {
  describe('path', () => {
    it('should keep returning paths', () => {
      const node = Package('a')()
      const environment = link(node)

      expect(environment.path).to.be.a('function')
      expect(environment.path(environment)).to.deep.equal(environment)
      expect(environment.elements[0].path(environment)).to.deep.equal(environment.elements[0])
    })

    it('should link paths on all levels', () => {
      const m = Method('m')()()
      const c = Class('X')()(m)
      const b = Package('b')(c)
      const a = Package('a')(b)
      const environment = link(a)
      expect(environment.path(environment)).to.deep.equal(environment)
      expect(environment.elements[0].path(environment)).to.deep.equal(environment.elements[0])
      expect(environment.elements[0].elements[0].path(environment)).to.deep.equal(environment.elements[0].elements[0])
      expect(environment.elements[0].elements[0].elements[0].path(environment)).to.deep.equal(environment.elements[0].elements[0].elements[0])
      expect(environment.elements[0].elements[0].elements[0].members[0].path(environment)).to.deep.equal(environment.elements[0].elements[0].elements[0].members[0])
    })
  })
})