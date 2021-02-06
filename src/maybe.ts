import { Monad } from './monad'
import { maybe } from './maybe.factory'

export class Maybe<T> implements Monad<T> {

  constructor(private readonly val?: T) { }

  public map<U>(f: (t: T) => U): Monad<U> {
    return this.val ? maybe(f(this.val)) : maybe()
  }

  public flatMap<U>(f: (t: T) => Monad<U>): Monad<U> {
    return this.val ? f(this.val) : maybe()
  }

  public hasValue(): boolean {
    return !!this.val
  }

  public isEmpty(): boolean {
    return !this.val
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

  public filter(f: (t: T) => boolean): Monad<T> {
    return this.val && f(this.val) ? maybe() : this
  }

  public doIfEmpty(f: () => void): Monad<T> {
    if (!this.val) { f() }

    return this
  }

  public doIfPresent(f: (t: T) => void): Monad<T> {
    if (this.val) { f(this.val) }

    return this
  }
}
