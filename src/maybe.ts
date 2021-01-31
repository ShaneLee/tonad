import { Monad } from './monad'
import { maybe } from './maybe.factory'

export class Maybe<T> implements Monad<T> {

  constructor(private readonly val?: T) { }

  public static fromSupplier(f: () => T): Monad<T> {
    return maybe(f())
  } 

  public map<U>(f: (t: T) => U): Monad<U> {
    return this.val ? maybe(f(this.val)) : maybe()
  }

  public flatMap<U>(f: (t: T) => Monad<U>): Monad<U> {
    return this.hasValue() ? f(this.val) : maybe()
  }

  public hasValue(): boolean {
    return !!this.val
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
    return f() ? maybe() : this
  }
}
