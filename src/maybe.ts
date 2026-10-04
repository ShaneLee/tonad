import { Monad } from './monad'
import { maybe } from './maybe.factory'

const isPresent = <T>(val: T | null | undefined): val is T => val !== undefined && val !== null

export class Maybe<T> implements Monad<T> {

  constructor(private readonly val?: T | null) { }

  public map<U>(f: (t: T) => U): Monad<NonNullable<U>> {
    return isPresent(this.val) ? maybe(f(this.val)) : maybe()
  }

  public flatMap<U>(f: (t: T) => Monad<U>): Monad<U> {
    return isPresent(this.val) ? f(this.val) : maybe()
  }

  public hasValue(): boolean {
    return isPresent(this.val)
  }

  public isEmpty(): boolean {
    return !isPresent(this.val)
  }
  
  public getOrUndefined(): T | undefined {
    return this.val ?? undefined 
  }

  public getOrDefault(t: T): T {
    return this.val ?? t 
  }

  public orElseGet(f: () => T): T {
    return this.val ?? f()
  }

  public orElseThrow(t: () => Error): T {
    if (!isPresent(this.val)) throw t()
    return this.val
  }

  public filter(f: (t: T) => boolean): Monad<T> {
    return isPresent(this.val) && f(this.val) ? maybe(this.val) : maybe()
  }

  public doIfEmpty(f: () => void): Monad<T> {
    if (!isPresent(this.val)) f()
    return this
  }

  public doIfPresent(f: (t: T) => void): Monad<T> {
    if (isPresent(this.val)) f(this.val)
    return this
  }

  public doOnError(f: (e: T & Error) => void): Monad<T> {
    if (isPresent(this.val) && this.val instanceof Error) f(this.val)
    return this
  }

  public doOnErrorMatching(p: (e: T & Error) => boolean, f: (e: T & Error) => void): Monad<T> {
    if (isPresent(this.val) && this.val instanceof Error && p(this.val)) f(this.val)
    return this
  }

  public onErrorMap<U>(f: (e: T & Error) => U): Monad<Exclude<T, Error> | NonNullable<U>> {
    return isPresent(this.val) && this.val instanceof Error
      ? maybe(f(this.val)) : this as unknown as Monad<Exclude<T, Error>>
  }

  public onErrorMapMatching<U>(p: (e: T & Error) => boolean, f: (e: T & Error) => U): Monad<T | NonNullable<U>> {
    return isPresent(this.val) && this.val instanceof Error && p(this.val)
      ? maybe(f(this.val)) : this
  }

  public onErrorFlatMap<U>(f: (e: T & Error) => Monad<U>): Monad<Exclude<T, Error> | U> {
    return isPresent(this.val) && this.val instanceof Error
      ? f(this.val) : this as unknown as Monad<Exclude<T, Error>>
  }

  public onErrorFlatMapMatching<U>(p: (e: T & Error) => boolean, f: (e: T & Error) => Monad<U>): Monad<T | U> {
    return isPresent(this.val) && this.val instanceof Error && p(this.val)
      ? f(this.val) : this
  }

  public switchIfEmpty<U>(u: U): Monad<T | NonNullable<U>> {
    return !isPresent(this.val) ? maybe(u) : this
  }

  public or<U>(f: () => Monad<U>): Monad<T | U> {
    return !isPresent(this.val) ? f() : this
  }
}
