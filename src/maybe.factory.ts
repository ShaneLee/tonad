import { Maybe } from '../src/maybe'
import { Monad } from '../src/monad'

export const maybe = <T>(val?: T): Monad<T> => new Maybe<T>(val)
export const fromSupplier = <T>(f: () => T): Monad<T | Error> => {
  try {
    return maybe<T | Error>(f())
  } catch (e) {
    return maybe<T | Error>(e instanceof Error ? e : new Error(String(e)))
  }
}
