import { Package } from './model'

const merge = (rootPackage, isolatedPackage) => {
  const context = rootPackage.elements.find(e => e.is(Package) && e.name === isolatedPackage.name)
  return context
    ? rootPackage.copy({ elements: [...rootPackage.elements.filter(e => e !== context), merge(context, isolatedPackage)] })
    : rootPackage.copy({ elements: [...rootPackage.elements, isolatedPackage] })
}

export default (...packages) => {
  const environment = packages.reduce(merge, Package('')())
  return environment
}