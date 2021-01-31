export interface Monad<T> {
    map<U>(f: (t: T) => U): Monad<U>
    flatMap<U>(f: (t: T) => Monad<U>): Monad<U>
    filter((t: T) => boolean): Monad<T>
    getOrUndefined(): T | undefined
    getOrDefault(t: T): T
    orElseGet(t: () => T): T
    hasValue(): boolean
}

