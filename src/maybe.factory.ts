import { Maybe } from '../src/maybe'
import { Monad } from '../src/monad'

export const maybe = <T>(val?: T): Monad<T> => new Maybe<T>(val)
export const fromSupplier = <T>(f: () => T): Monad<T> => maybe(f())
