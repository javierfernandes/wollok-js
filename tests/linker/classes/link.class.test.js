import { expect } from 'chai'
import { expectNoLinkageError, expectUnresolvedVariable, expectScopeHasNames } from '../link-expects'
import { link } from '../../../src/linker/linker'
import { queryNodeByType } from '../../../src/visitors/visiting'
import { New, Class } from '../../../src/model'
import parse from '../../../src/parser'

describe('Class linkage', () => {

  it('File scope includes the classes', () => {
    expectScopeHasNames(link(parse(`
      class A {}
      class B {}
      class C {}
    `)), ['A', 'B', 'C'])
  })

  it('File scope includes the mixins, classes, and objects', () => {
    expectScopeHasNames(link(parse(`
      class A {}
      mixin M {}
      object c {}
    `)), ['A', 'M', 'c'])
  })

  describe('New', () => {

    it('gets linked to a class in the same file (declared BEFORE)', () => {
      const node = expectNoLinkageError(`
        class Bird {}
        class BirdFactory {
          method create() {
            return new Bird()
          }
        }
      `)
      const Bird = queryNodeByType(node, Class.name, c => c.name === 'Bird')[0]
      const niu = queryNodeByType(node, New.name)[0]
      expect(niu.link).to.deep.equal(Bird)
    })

    it('throws an error if the referenced class does NOT exist', () => {
      expectUnresolvedVariable('Bird', `
        class BirdFactory {
          method create() {
            return new Bird()
          }
        }
      `)
    })

    // TODO: finally I reached the point where the stack based linking 
    //   is not enough (or the deep-first approach)
    it('gets linked to a class in the same file (declared AFTER)', () => {
      expectNoLinkageError(`
        class BirdFactory {
          method create() {
            return new Bird()
          }
        }
        class Bird {}
      `)
    })

  })

  describe('Super (inherits)', () => {

    it('gets linked to a class in the same file (declared BEFORE)', () => {
      const node = expectNoLinkageError(`
        class Father { }
        class Son inherits Father { }
      `)
      const Father = queryNodeByType(node, Class.name, c => c.name === 'Father')[0]
      const Son = queryNodeByType(node, Class.name, s => s.name === 'Son')[0]
      expect(Son.link).to.deep.equal(Father)
    })
    it('throws an error if the referenced class does NOT exist', () => {
      expectUnresolvedVariable('Father', `
        class Son inherits Father { }
      `, 'blah')
    })

    it('gets linked to a class in the same file (declared AFTER)', () => {
      expectNoLinkageError(`
        class Son inherits Father { }
        class Father { }
      `)
    })

  })


})