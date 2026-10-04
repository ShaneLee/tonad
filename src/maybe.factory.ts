import { Maybe } from '../src/maybe'
import { Monad } from '../src/monad'

export const maybe = <T>(val?: T | null): Monad<NonNullable<T>> =>
  new Maybe(val as NonNullable<T> | null | undefined)
export const fromSupplier = <T>(f: () => T): Monad<NonNullable<T> | Error> => {
  try {
    return maybe<T | Error>(f())
  } catch (e) {
    return maybe<T | Error>(e instanceof Error ? e : new Error(String(e)))
  }
}
