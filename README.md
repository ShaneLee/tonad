# 🦶Tonad

![Circle CI](https://circleci.com/gh/ShaneLee/tonad.svg)

Tonad is a basic Monad library for TypeScript. This enables safer code. Make null-pointers a thing of the past with Tonad.

### Installation

```npm install tonad``` 

### Development

Run ```npm install```

Run ```npm test``` to type-check and test

Run ```npm run lint``` to lint the code

Run ```npm run build``` to compile to `build/main`


### Example code usage

```typescript
import { maybe } from 'tonad'

const value: number | undefined = maybe('example') // create a Monad<string>
  .filter(val => val.length > 3) // filter for strings greater than 3
  .doIfPresent(() => console.log('example is greater than 3')) // side-effect if value exists
  .map(() => 'another example') // map to another string
  .filter(val => val === 'example') // filter - this will make the monad empty
  .doIfEmpty(() => console.log('maybe is empty now')) // this will execute because it's empty
  .flatMap(val => maybe(val.length)) // as maybe is empty this won't execute
  .switchIfEmpty(10) // When empty use this value
  .filter(val => val % 2 == 0) // another filter
  .switchIfEmpty(15) // Won't execute as not empty
  .getOrUndefined() // will return 10
```

```typescript
import { maybe, fromSupplier, Monad } from 'tonad'

function process(requestId: string | undefined): number {
  return maybe(requestId) // create a null-safe Monad<string>
    .doIfEmpty(() => console.log('No request ID provided')) // If there is no ID, log
    .flatMap(id => findNumberOfUsers(id)) // Call API that may return value or error
    .doOnError(err => console.log(`Error finding users: ${err.message}`)) // Log if error thrown
    .onErrorMap(() => 0) // If there is an error, switch to this value
    .getOrDefault(0) // If there is no value, use this value
}

function findNumberOfUsers(id: string): Monad<number | Error> {
  // call to API potentially returning no value or throwing
  return fromSupplier(() => call(id))
}
```

### Behaviour

- A monad is empty only when its value is `null` or `undefined`. Falsy values such as `0`, `''` and `false` are present values.
- Errors are values. `fromSupplier` catches anything the supplier throws and returns a monad holding the `Error` (non-`Error` throws are wrapped in one).
- `map`, `flatMap` and `filter` run on any present value, including an `Error`, so handle errors with `onErrorMap` or `onErrorFlatMap` first.
- The `doOnError*` and `onError*` methods leave the monad unchanged unless it holds an `Error` (and, for the `Matching` variants, the predicate passes).
- `switchIfEmpty` and `or` may change the type: `maybe('a').switchIfEmpty(10)` is a `Monad<string | number>`.
