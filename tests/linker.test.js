import { describe, it } from 'mocha'

import { Package } from '../dist/model'
import { expect } from 'chai'
import link from '../dist/linker'

describe('Wollok linker', () => {
  it('should merge unrelated asts', () => {
    const a = Package('a')(Package('c')())
    const b = Package('b')()
    const expected = Package('')(Package('a')(Package('c')()), Package('b')())
    expect(link(a, b)).to.deep.equal(expected)
  })

  it('should merge related asts', () => {
    const a = Package('a')(Package('b')())
    const b = Package('b')(Package('c')())
    const expected = Package('')(Package('a')(Package('b')(Package('c')())))
    expect(link(a, b)).to.deep.equal(expected)
  })

  it('should merge root asts', () => {
    const a = Package('')(Package('a')())
    const b = Package('')(Package('b')())
    const expected = Package('')(Package('a')(), Package('b')())
    expect(link(a, b)).to.deep.equal(expected)
  })
})