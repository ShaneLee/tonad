# Tonad



Tonad is a basic Monad library for TypeScript. This enables safer code. Make null-pointers a thing of the past with Tonad.

### Installation

```npm install tonad``` 

### Development

Run ```npm install```

Run ```npm test``` to test

Run ```npm lint``` to lint the code


### Example code usage

```typescript
import { maybe } from 'tonad'

const value: number = maybe('example') // create a Monad<string>
	.filter(val => val.length > 3) // filter for strings greater than 3
	.doIfPresent(val => console.log('example is greater than 3')) // side-effect if value exists
	.map(val => 'another example') // map to another string
	.filter(val => val === 'example') // filter - this will make the monad empty
	.doIfEmpty(() => console.log('maybe is empty now')) // this will execute because it's empty
	.flatMap(val => Maybe(new Object())) // as maybe is empty this won't execute
	.switchIfEmpty(10) // When empty use this value - note it's a different type to the original
  .filter(val => val % 2 == 0) // another filter
	.switchIfEmpty(15) // Won't execute as not empty
	.getOrUndefined() // will return 10 hence value being of type number
```



```typescript
import { maybe, fromSupplier, Monad } from 'tonad'

public process(requestID: string | undefined): void {
  maybe(requestId) // create a null-safe monad
  	.flatMap(val => findNumberOfUsers()) // Call API that may return value or error
    .doIfEmpty(() => console.log('No request ID provided')) // If nothing is returned, log
		.doOnError(err => console.log(`Error processing error: ${err}`)) // Log if error thrown
		.onErrorMap(err => 0) // If there is an error, switch to this value
		.switchIfEmpty(0) // If there is no value, switch to this value
}

private findNumberOfUsers(): Monad<number> {
  // call to API potentially returning no value
  return fromSupplier(() => call())
}
```

