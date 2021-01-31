import { Maybe } from '../src/maybe'

export const maybe = <T>(val?: T): Maybe<T> => new Maybe<T>(val)
