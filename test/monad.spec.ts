import { Monad } from '../src/monad'
import { Maybe } from '../src/maybe'
import { maybe } from '../src/maybe.factory'

describe('maybe', () => {
  describe('get or undefined', () => {
    it('gets when maybe has value', () => {
      const test: string = 'Hello'
      expect(maybe(test).getOrUndefined()).toBe(test)
    })  

    it('gets undefined when no value present', () => {
      expect(maybe().getOrUndefined()).toBeUndefined()
    })  
  })  

  describe('map', () => {
    it('maps values', () => {
      expect(maybe('Hello').map(val => val + '1').getOrUndefined()).toBe('Hello1')
    })  

    it('doesnt map when no value present', () => {
      maybe().map(val => fail())
    })  
  })  

  describe('flatMap', () => {
    it('flatMaps values', () => {
      expect(maybe(maybe('Hello'))
              .flatMap(monad => monad.map(val => val + '2'))
              .getOrUndefined()).toBe('Hello2')
    })  

    it('doesnt flapMap when no value present', () => {
      maybe().flatMap(monad => fail())
    })  
  })  


  describe('has value', () => {
    it('has value', () => {
      expect(maybe('test').hasValue()).toBeTruthy()
    })  

    it('doesnt have value', () => {
      expect(maybe().hasValue()).toBeFalsy()
    })  
  })  

  describe('get or default', () => {
    it('gets value when value present', () => {
      const test: string = 'Hello'
      expect(maybe(test).getOrDefault()).toBe(test)
    })  

    it('gets from default value when no value present', () => {
      const answer: string = '42'
      expect(maybe().getOrDefault(answer)).toBe(answer)
    })  
  })  

  describe('or else get', () => {
    it('gets value when value present', () => {
      const test: string = 'Hello'
      expect(maybe(test).orElseGet(() => fail())).toBe(test)
    })  

    it('gets from supplier when no value present', () => {
      const answer: string = '42'
      expect(maybe().orElseGet(() => answer)).toBe(answer)
    })  
  })  

  describe('filter', () => {
    it('returns retains value when filter predicate false', () => {
      const test: string = 'Hello'
      expect(maybe(test)
              .filter(val => val === test)
              .getOrUndefined()).toBe(test)
    })  

    it('returns retains value when chained filter predicates false', () => {
      const test: string = 'Hello'
      expect(maybe(test)
              .filter(val => val === test)
              .filter(val => false)
              .getOrUndefined()).toBe(test)
    })  

    it('returns empty monad when filter predicate true', () => {
      const test: string = 'Hello'
      expect(maybe(test)
              .filter(val => val !== test)
              .getOrUndefined()).toBeUndefined()
    })  
  })  

  describe('from supplier', () => {
    it('gets value when provided from supplier', () => {
      const test: string = 'Hello'
      expect(Maybe.fromSupplier(() => test).getOrUndefined()).toBe(test)
    })  

    it('has no value when supplier has no value', () => {
      expect(Maybe.fromSupplier(() => undefined).getOrUndefined()).toBeUndefined()
    })  
  })  
})
