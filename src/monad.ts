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
     * Return true if this Monad has a value
     */
    hasValue(): boolean

    /**
     * Perform a side-effect if this Monad doesn't 
     * contain a value
     * @param f the consumer function to apply
     */
    doIfEmpty(f: () => void): Monad<T>
 
    /**
     * Perform a side-effect if this Monad contains 
     * a value
     * @param f the consumer function apply 
     */
    doIfPresent(f: (t: T) => void): Monad<T>
}
