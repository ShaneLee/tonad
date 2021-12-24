import { maybe } from '../src/tonad'
import { TestError } from './test.error'

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

  describe('is empty', () => {
    it('doesnt have value', () => {
      expect(maybe().isEmpty()).toBeTruthy()
    }) 

    it('has value', () => {
      expect(maybe('test').isEmpty()).toBeFalsy()
    }) 
  }) 

  describe('get or default', () => {
    it('gets value when value present', () => {
      const test: string = 'Hello'
      expect(maybe(test).getOrDefault('')).toBe(test)
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

  describe('or else throw', () => {
    it('throws when value not present', () => {
      try {
        const error = new Error()
        expect(maybe().orElseThrow(() => error)).toThrow(error)
      } catch (e) { }
    })  

    it('doesnt throw when value not present', () => {
      try {
        maybe().orElseThrow(() => new Error())
      } catch (e) { }
    })  
  })  

  describe('filter', () => {
    it('returns retains value when filter predicate true', () => {
      const test: string = 'Hello'
      expect(maybe(test)
              .filter(val => val === test)
              .getOrUndefined()).toBe(test)
    })  

    it('doesnt invoke filter when no value present', () => {
      maybe().filter(val => fail())
    })  

    it('returns retains value when chained filter predicates true', () => {
      const test: string = 'Hello'
      expect(maybe(test)
              .filter(val => val === test)
              .filter(val => true)
              .getOrUndefined()).toBe(test)
    })  

    it('returns empty monad when filter predicate false', () => {
      const test: string = 'Hello'
      expect(maybe(test)
              .filter(val => val !== test)
              .getOrUndefined()).toBeUndefined()
    })  
  })  

  describe('do if empty', () => {
    it('calls function when empty', () => {
      const notify = jasmine.createSpy().and.callFake(() => false)
      maybe().doIfEmpty(notify)
      expect(notify).toHaveBeenCalled()
    })  

    it('does not call function when not empty', () => {
      maybe('test').doIfEmpty(() => fail())
    })  
  })  

  describe('do if present', () => {
    it('calls function when value present', () => {
      const notify = jasmine.createSpy().and.callFake(() => false)
      maybe('test').doIfPresent(notify)
      expect(notify).toHaveBeenCalled()
    })  

    it('does not call function when not empty', () => {
      maybe().doIfPresent(() => fail())
    })  
  })  

  describe('do on error', () => {
    it('calls function when error present', () => {
      try {
        const notify = jasmine.createSpy().and.callFake(() => false)
        maybe(new Error()).doOnError(notify)
        expect(notify).toHaveBeenCalled()
      } catch (e) { }
    })  

    it('does not call function when not error', () => {
      maybe('test').doOnError(() => fail())
    })  

    it('does not call function when empty', () => {
      maybe().doOnError(() => fail())
    })  
  })  

  describe('do on error matching', () => {
    it('calls function when error present and predicate true', () => {
      try {
        const notify = jasmine.createSpy().and.callFake(() => false)
        maybe(new TestError('test')).doOnErrorMatching(err => err instanceof TestError, notify)
        expect(notify).toHaveBeenCalled()
      } catch (e) { }
    })  

    it('does not call function when error present but predicate false', () => {
      maybe(new TestError('test')).doOnErrorMatching(err => false, val => fail())
    })  

    it('does not call function when not error', () => {
      maybe('test').doOnErrorMatching(err => true, val => fail())
    })  

    it('does not call function when empty', () => {
      maybe().doOnErrorMatching(err => true, val => fail())
    })  
  })  

  describe('on error map', () => {
    it('calls function when error present', () => {
      const test = 'test'
      expect(maybe(new Error())
              .onErrorMap(val => test)
              .getOrUndefined())
            .toBe(test)
    })  

    it('does not call function when not error', () => {
      maybe('test').onErrorMap(val => fail())
    })  

    it('does not call function when empty', () => {
      maybe().onErrorMap(val => fail())
    })  
  })  

  describe('on error map matching', () => {
    it('calls function when error present and predicate true', () => {
      const test = 'test'
      expect(maybe(new TestError('error'))
              .onErrorMapMatching(err => err instanceof TestError, val => test)
              .getOrUndefined())
            .toBe(test)
    })  

    it('does not map when error present but predicate false', () => {
      const error = new Error()
      expect(maybe(error)
              .onErrorMapMatching(err => false, val => 'test')
              .getOrUndefined())
            .toBe(error)
    })  

    it('does not call function when not error', () => {
      maybe('test').onErrorMapMatching(err => true, val => fail())
    })  

    it('does not call function when empty', () => {
      maybe().onErrorMapMatching(err => true, val => fail())
    })  
  })  

  describe('on error flat map', () => {
    it('maps when error present', () => {
      const error = new Error()
      const test = 'test'
      expect(maybe(error)
              .onErrorFlatMap(val => maybe(test))
              .getOrUndefined())
            .toBe(test)
    })  

    it('does not call function when not error', () => {
      maybe('test').onErrorFlatMap(val => fail())
    })  

    it('does not call function when empty', () => {
      maybe().onErrorFlatMap(val => fail())
    })  
  })  

  describe('on error flat map matching', () => {
    it('calls function when error present and predicate true', () => {
      try {
        const test = 'test'
        expect(maybe(new TestError('error'))
                .onErrorFlatMapMatching(err => err instanceof TestError, val => test)
                .getOrUndefined())
              .toBe(test)
      } catch (e) { }
    })  

    it('does not map when error present but predicate false', () => {
      try { 
        const error = new Error()
        expect(maybe(error)
                .onErrorFlatMapMatching(err => false, val => 'test')
                .getOrUndefined())
              .toBe(error)
      } catch (e) { }
    })  

    it('does not call function when not error', () => {
      maybe('test').onErrorFlatMapMatching(err => true, val => fail())
    })  

    it('does not call function when empty', () => {
      maybe().onErrorFlatMapMatching(err => true, val => fail())
    })  
  })  

  describe('switch if empty', () => {
    it('switches to alternative monad when no value present', () => {
      const test = 'test'
      expect(maybe()
              .switchIfEmpty(test)
              .getOrUndefined())
            .toBe(test)
    })  

    it('does not switch when value present', () => {
      const test = 'test'
      expect(maybe(test)
              .switchIfEmpty('switched')
              .getOrUndefined())
            .toBe(test)
    })
  })

  describe('or', () => {
    it('switches to the alternative monad when no value present', () => {
      const test = 'test'
      expect(maybe()
              .or(() => maybe(test))
              .getOrUndefined())
            .toBe(test)
    })

    it('does not switch when value present', () => {
      const test = 'test'
      expect(maybe(test)
              .or(() => maybe(test))
              .getOrUndefined())
            .toBe(test)
    })
  })  
})
