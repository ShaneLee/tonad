import { fromSupplier } from '../src/tonad'

describe('maybe factory', () => {
  describe('from supplier', () => {
    it('gets value when provided from supplier', () => {
      const test: string = 'Hello'
      expect(fromSupplier(() => test).getOrUndefined()).toBe(test)
    })  

    it('has no value when supplier has no value', () => {
      expect(fromSupplier(() => undefined).getOrUndefined()).toBeUndefined()
    })  
  })  
})
