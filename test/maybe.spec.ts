import { maybe } from '../src/tonad'
import { TestError } from './test.error'

describe('maybe', () => {
  describe('get or undefined', () => {
    it('gets when maybe has value', () => {
      const test = 'Hello'
      expect(maybe(test).getOrUndefined()).toBe(test)
    })

    it('gets undefined when no value present', () => {
      expect(maybe().getOrUndefined()).toBeUndefined()
    })
  })

  describe('falsy values', () => {
    it.each([0, '', false, NaN])('treats %p as a present value', (val) => {
      expect(maybe(val).hasValue()).toBe(true)
      expect(maybe(val).isEmpty()).toBe(false)
      expect(maybe(val).getOrUndefined()).toBe(val)
    })

    it('maps falsy values', () => {
      expect(maybe(0).map(val => val + 1).getOrUndefined()).toBe(1)
    })

    it('filters falsy values', () => {
      expect(maybe(0).filter(val => val === 0).getOrUndefined()).toBe(0)
    })

    it('does not switch when value is falsy', () => {
      expect(maybe('').switchIfEmpty('switched').getOrUndefined()).toBe('')
    })

    it('treats null as empty', () => {
      expect(maybe(null).isEmpty()).toBe(true)
      expect(maybe(null).getOrUndefined()).toBeUndefined()
    })
  })

  describe('map', () => {
    it('maps values', () => {
      expect(maybe('Hello').map(val => val + '1').getOrUndefined()).toBe('Hello1')
    })

    it('doesnt map when no value present', () => {
      const f = jest.fn()
      maybe().map(f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('flatMap', () => {
    it('flatMaps values', () => {
      expect(maybe(maybe('Hello'))
              .flatMap(monad => monad.map(val => val + '2'))
              .getOrUndefined()).toBe('Hello2')
    })

    it('doesnt flapMap when no value present', () => {
      const f = jest.fn()
      maybe().flatMap(f)
      expect(f).not.toHaveBeenCalled()
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
      const test = 'Hello'
      expect(maybe(test).getOrDefault('')).toBe(test)
    })

    it('gets from default value when no value present', () => {
      const answer = '42'
      expect(maybe().getOrDefault(answer)).toBe(answer)
    })
  })

  describe('or else get', () => {
    it('gets value when value present', () => {
      const test = 'Hello'
      const f = jest.fn()
      expect(maybe(test).orElseGet(f)).toBe(test)
      expect(f).not.toHaveBeenCalled()
    })

    it('gets from supplier when no value present', () => {
      const answer = '42'
      expect(maybe().orElseGet(() => answer)).toBe(answer)
    })
  })

  describe('or else throw', () => {
    it('throws when value not present', () => {
      const error = new Error()
      expect(() => maybe().orElseThrow(() => error)).toThrow(error)
    })

    it('doesnt throw when value present', () => {
      expect(() => maybe('some value').orElseThrow(() => new Error())).not.toThrow()
    })

    it('returns value when value present', () => {
      const test = 'Hello'
      expect(maybe(test).orElseThrow(() => new Error())).toBe(test)
    })

    it('returns falsy value when value present', () => {
      expect(maybe(0).orElseThrow(() => new Error())).toBe(0)
    })
  })

  describe('filter', () => {
    it('returns retains value when filter predicate true', () => {
      const test = 'Hello'
      expect(maybe(test)
              .filter(val => val === test)
              .getOrUndefined()).toBe(test)
    })

    it('doesnt invoke filter when no value present', () => {
      const f = jest.fn()
      maybe().filter(f)
      expect(f).not.toHaveBeenCalled()
    })

    it('returns retains value when chained filter predicates true', () => {
      const test = 'Hello'
      expect(maybe(test)
              .filter(val => val === test)
              .filter(() => true)
              .getOrUndefined()).toBe(test)
    })

    it('returns the same monad when filter predicate true', () => {
      const monad = maybe('Hello')
      expect(monad.filter(() => true)).toBe(monad)
    })

    it('returns empty monad when filter predicate false', () => {
      const test = 'Hello'
      expect(maybe(test)
              .filter(val => val !== test)
              .getOrUndefined()).toBeUndefined()
    })
  })

  describe('do if empty', () => {
    it('calls function when empty', () => {
      const notify = jest.fn()
      maybe().doIfEmpty(notify)
      expect(notify).toHaveBeenCalled()
    })

    it('does not call function when not empty', () => {
      const f = jest.fn()
      maybe('test').doIfEmpty(f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('do if present', () => {
    it('calls function when value present', () => {
      const notify = jest.fn()
      maybe('test').doIfPresent(notify)
      expect(notify).toHaveBeenCalled()
    })

    it('does not call function when not empty', () => {
      const f = jest.fn()
      maybe().doIfPresent(f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('do on error', () => {
    it('calls function when error present', () => {
      const notify = jest.fn()
      maybe(new Error()).doOnError(notify)
      expect(notify).toHaveBeenCalled()
    })

    it('does not call function when not error', () => {
      const f = jest.fn()
      maybe('test').doOnError(f)
      expect(f).not.toHaveBeenCalled()
    })

    it('retains value when not error', () => {
      expect(maybe('test').doOnError(() => undefined).getOrUndefined()).toBe('test')
    })

    it('retains error after calling function', () => {
      const error = new Error()
      expect(maybe(error).doOnError(() => undefined).getOrUndefined()).toBe(error)
    })

    it('does not call function when empty', () => {
      const f = jest.fn()
      maybe().doOnError(f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('do on error matching', () => {
    it('calls function when error present and predicate true', () => {
      const notify = jest.fn()
      maybe(new TestError('test')).doOnErrorMatching(err => err instanceof TestError, notify)
      expect(notify).toHaveBeenCalled()
    })

    it('does not call function when error present but predicate false', () => {
      const f = jest.fn()
      maybe(new TestError('test')).doOnErrorMatching(() => false, f)
      expect(f).not.toHaveBeenCalled()
    })

    it('does not call function when not error', () => {
      const f = jest.fn()
      maybe('test').doOnErrorMatching(() => true, f)
      expect(f).not.toHaveBeenCalled()
    })

    it('retains value when not error', () => {
      expect(maybe('test')
              .doOnErrorMatching(() => true, () => undefined)
              .getOrUndefined())
            .toBe('test')
    })

    it('retains error when predicate false', () => {
      const error = new Error()
      expect(maybe(error)
              .doOnErrorMatching(() => false, () => undefined)
              .getOrUndefined())
            .toBe(error)
    })

    it('retains error when predicate true', () => {
      const error = new Error()
      expect(maybe(error)
              .doOnErrorMatching(() => true, () => undefined)
              .getOrUndefined())
            .toBe(error)
    })

    it('does not call function when empty', () => {
      const f = jest.fn()
      maybe().doOnErrorMatching(() => true, f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('on error map', () => {
    it('calls function when error present', () => {
      const test = 'test'
      expect(maybe(new Error())
              .onErrorMap(() => test)
              .getOrUndefined())
            .toBe(test)
    })

    it('does not call function when not error', () => {
      const f = jest.fn()
      maybe('test').onErrorMap(f)
      expect(f).not.toHaveBeenCalled()
    })

    it('retains value when not error', () => {
      expect(maybe('test').onErrorMap(() => 'mapped').getOrUndefined()).toBe('test')
    })

    it('does not call function when empty', () => {
      const f = jest.fn()
      maybe().onErrorMap(f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('on error map matching', () => {
    it('calls function when error present and predicate true', () => {
      const test = 'test'
      expect(maybe(new TestError('error'))
              .onErrorMapMatching(err => err instanceof TestError, () => test)
              .getOrUndefined())
            .toBe(test)
    })

    it('does not map when error present but predicate false', () => {
      const error = new Error()
      expect(maybe(error)
              .onErrorMapMatching(() => false, () => 'test')
              .getOrUndefined())
            .toBe(error)
    })

    it('does not call function when not error', () => {
      const f = jest.fn()
      maybe('test').onErrorMapMatching(() => true, f)
      expect(f).not.toHaveBeenCalled()
    })

    it('retains value when not error', () => {
      expect(maybe('test')
              .onErrorMapMatching(() => true, () => 'mapped')
              .getOrUndefined())
            .toBe('test')
    })

    it('does not call function when empty', () => {
      const f = jest.fn()
      maybe().onErrorMapMatching(() => true, f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('on error flat map', () => {
    it('maps when error present', () => {
      const error = new Error()
      const test = 'test'
      expect(maybe(error)
              .onErrorFlatMap(() => maybe(test))
              .getOrUndefined())
            .toBe(test)
    })

    it('does not call function when not error', () => {
      const f = jest.fn()
      maybe('test').onErrorFlatMap(f)
      expect(f).not.toHaveBeenCalled()
    })

    it('retains value when not error', () => {
      expect(maybe('test')
              .onErrorFlatMap(() => maybe('mapped'))
              .getOrUndefined())
            .toBe('test')
    })

    it('does not call function when empty', () => {
      const f = jest.fn()
      maybe().onErrorFlatMap(f)
      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('on error flat map matching', () => {
    it('calls function when error present and predicate true', () => {
      const test = 'test'
      expect(maybe(new TestError('error'))
              .onErrorFlatMapMatching(err => err instanceof TestError, () => maybe(test))
              .getOrUndefined())
            .toBe(test)
    })

    it('does not map when error present but predicate false', () => {
      const error = new Error()
      expect(maybe(error)
              .onErrorFlatMapMatching(() => false, () => maybe('test'))
              .getOrUndefined())
            .toBe(error)
    })

    it('does not call function when not error', () => {
      const f = jest.fn()
      maybe('test').onErrorFlatMapMatching(() => true, f)
      expect(f).not.toHaveBeenCalled()
    })

    it('retains value when not error', () => {
      expect(maybe('test')
              .onErrorFlatMapMatching(() => true, () => maybe('mapped'))
              .getOrUndefined())
            .toBe('test')
    })

    it('retains error when predicate false', () => {
      const error = new Error()
      expect(maybe(error)
              .onErrorFlatMapMatching(() => false, () => maybe('mapped'))
              .getOrUndefined())
            .toBe(error)
    })

    it('does not call function when empty', () => {
      const f = jest.fn()
      maybe().onErrorFlatMapMatching(() => true, f)
      expect(f).not.toHaveBeenCalled()
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
