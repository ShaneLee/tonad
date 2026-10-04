import { fromSupplier } from '../src/tonad'

describe('maybe factory', () => {
  describe('from supplier', () => {
    it('gets value when provided from supplier', () => {
      const test = 'Hello'
      expect(fromSupplier(() => test).getOrUndefined()).toBe(test)
    })

    it('has no value when supplier has no value', () => {
      expect(fromSupplier(() => undefined).getOrUndefined()).toBeUndefined()
    })

    it('captures error thrown by supplier', () => {
      const error = new Error('boom')
      expect(fromSupplier(() => { throw error }).getOrUndefined()).toBe(error)
    })

    it('wraps non-error thrown by supplier in an error', () => {
      const result = fromSupplier(() => { throw 'boom' }).getOrUndefined()
      expect(result).toBeInstanceOf(Error)
      expect((result as Error).message).toBe('boom')
    })

    it('allows thrown error to be handled', () => {
      const notify = jest.fn()
      expect(fromSupplier<number>(() => { throw new Error('boom') })
              .doOnError(notify)
              .onErrorMap(() => 0)
              .getOrUndefined())
            .toBe(0)
      expect(notify).toHaveBeenCalled()
    })
  })
})
