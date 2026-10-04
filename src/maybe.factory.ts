import { Maybe } from './maybe'
import { Monad } from './monad'

export const maybe = <T>(val?: T | null): Monad<NonNullable<T>> => Maybe.of(val)
export const fromSupplier = <T>(f: () => T): Monad<NonNullable<T> | Error> => {
  try {
    return maybe<T | Error>(f())
  } catch (e) {
    return maybe<T | Error>(e instanceof Error ? e : new Error(String(e)))
  }
}
