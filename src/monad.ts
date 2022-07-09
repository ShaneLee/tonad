export interface Monad<T> {

    /**
     * Transform the value of this monad into 
     * a new value from the given function.
     * Does nothing if Monad has no value
     * @param f the mapping function
     */
    map<U>(f: (t: T) => U): Monad<U>

    /**
     * If this Monad contains a value, apply
     * the given Monad-bearing function flattening 
     * the result into a single Monad containing the
     * value of the Monad resulting from the function
     * @param f the function resulting in a Monad
     */
    flatMap<U>(f: (t: T) => Monad<U>): Monad<U>

    /**
     * If a value is present in this Monad, apply
     * the given predicate function to the value in 
     * this Monad. If the predicate function evaluates
     * to true then the resulting Monad will retain the
     * value of the original Monad. Else an empty
     * Monad will be returned  
     * @param f the predicate function
     */
    filter(f: (t: T) => boolean): Monad<T>

    /**
     * If this Monad has a value, return it; 
     * else return undefined
     */
    getOrUndefined(): T | undefined

    /**
     * If this Monad has a value, return it;
     * else return the non-null value provided 
     * as an argument to this method
     * @param t the default value
     */
    getOrDefault(t: T): T

    /**
     * If this Monad doesn't have a value, invoke
     * the given supplier and return it's value
     * @param t the supplier function
     */
    orElseGet(t: () => T): T

    /**
     * If this Monad doesn't have a value,
     * invoke the given supplier and throw the 
     * error it provides
     * @param t the supplier function
     */
    orElseThrow(t: () => Error): void

    /**
     * Return true if this Monad has a value
     */
    hasValue(): boolean

    /**
     * Return true if this Monad is Empty
     */
    isEmpty(): boolean

    /**
     * Perform a side-effect if this Monad doesn't 
     * contain a value
     * @param f the function to apply
     */
    doIfEmpty(f: () => void): Monad<T>
 
    /**
     * Perform a side-effect if this Monad contains 
     * a value
     * @param f the consumer function apply 
     */
    doIfPresent(f: (t: T) => void): Monad<T>

    /**
     * Perform a side-effect if this Monad contains 
     * an Error
     * @param f the error consumer 
     */
    doOnError(f: (t: T) => void): Monad<T>

    /**
     * Perform a side-effect if this Monad contains
     * an Error which matches the given predicate function
     * @param p the predicate function
     * @param f the error consumer
     */
    doOnErrorMatching(p: (t: T) => boolean, f: (t: T) => void): Monad<T>

    /**
     * Map to an alternative value if this Monad contains an 
     * error, otherwise retain this Monad
     * @param f the mapping function providing the alternative
     * value
     */
    onErrorMap<U>(f: (t: T) => U): Monad<U>

    /**
     * Map to an alternative value if this Monad contains an 
     * error and it matches the given predicate function, 
     * otherwise retain this Monad
     * @param p the predicate function
     * @param f the mapping function providing the alternative
     * value
     */
    onErrorMapMatching<U>(p: (t: T) => boolean, f: (t: T) => U): Monad<U>

    /**
     * Map to an alternative Monad if this Monad contains an
     * error, otherwise retain this Monad
     * @param f the mapping function providing the alternative
     * Monad
     */
    onErrorFlatMap<U>(f: (t: T) => Monad<U>): Monad<U>

    /**
     * Map to an alternative Monad if this Monad contains an 
     * error and it matches the given predicate function,
     * otherwise retain this Monad
     * @param p the predicate function
     * @param f the mapping function providing the alternative
     * Monad
     */
    onErrorFlatMapMatching<U>(p: (t: T) => boolean, f: (t: T) => Monad<U>): Monad<U>

    /**
     * Switch to an alternative value if the this Monad is empty
     * otherwise retain this value
     * @param u the value to provide to a new Monad
     */
    switchIfEmpty<U>(u: U): Monad<U>

    /**
     * Switch to an alternative Monad if the this Monad is empty
     * @param f the supplier of the alternative Monad
     */
    or<U>(f: () => Monad<U>): Monad<U>
}
