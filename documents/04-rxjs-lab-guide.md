# RxJS - Lab Guide

## Step 1: Observable and Observer
```html
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/7.8.2/rxjs.umd.js"></script> -->
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            // an "Observable" represents a sequence of events over time

            // Subscriber function is used to define an Observable
            // When we "subscribe" to an Observable it will initiate an action
            // observer has 3 methods - next(), error() and complete()
            function getDateObservable( interval, repeat = 10 ) {
                return new rxjs.Observable(observer => {
                    let count = 0, id;

                    id = setInterval(() => {
                        count++;
                        observer.next( new Date() );

                        if( count === repeat ) {
                            console.log('completing');
                            observer.complete(); // results in unsubscription
                        }
                    }, interval * 1000);

                    return {
                        unsubscribe() {
                            console.log( 'unsubscribe');
                            clearInterval( id );
                        }
                    };
                });
            }

            class DateObserver {
                next( date ) {
                    console.log( date );
                }

                error( err ) {
                    console.log( err.message );
                }

                complete() {
                    console.log( 'no more events' );
                }
            }

            // subscribe is passed an "observer" object - it should have 3 methods - next, error, complete
            // const subscription = getDateObservable( 3, 7 ).subscribe( new DateObserver() );
            const subscription = getDateObservable( 1, 15 ).subscribe(
                ( date ) => { console.log( date )}, // next
                () => {}, // error
                () => { console.log( 'no more events' ); } // complete
            );

            // setTimeout(() => {
            //     subscription.unsubscribe();
            // }, 10000);
        </script>
    </body>
</html>
```
### Concepts Covered
* **Creating a custom Observable** using the `new Observable()` constructor
* **Emitting values over time** using `setInterval`
* **Observer methods**: `next()`, `error()`, and `complete()`
* **Subscription management** with `unsubscribe()`
* **Passing an observer object vs separate callbacks** to `subscribe()`

### Description:

In this example, we manually create an `Observable` using the constructor `new rxjs.Observable()`. The subscriber function inside defines the logic for emitting values. It uses `setInterval` to emit the current `Date` object every `interval` seconds.

* The observable completes automatically after a given number of emissions (`repeat`), calling `observer.complete()`.
* We see two ways to subscribe:
  1. Passing an **observer object** with `next()`, `error()`, and `complete()` methods.
  2. Passing **separate callbacks** for each handler function.

Unsubscribing clears the interval to prevent memory leaks, and logs `"unsubscribe"` to confirm the teardown.

### Key Takeaways:
* An **Observable represents a stream of values over time**.
* The **subscription initiates the execution**, and cleanup logic can be returned from the subscriber function.
* Observables can emit multiple values, and complete or error out.
* Proper **resource cleanup** is important and handled through `unsubscribe()`.

## Step 2: Observable creation method - `interval()` for an infinite sequence of timed events
```js
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const sequence$ = rxjs.interval( 1000 );

            const subscription = sequence$.subscribe(evt  => {
                console.log( evt );
            });

            setTimeout(() => {
                subscription.unsubscribe();
            }, 5000);
        </script>
    </body>
</html>
```

### Concepts Covered:

* Using **`rxjs.interval()`** to create an Observable that emits sequential integers
* **Subscribing** to an Observable to consume values
* **Unsubscribing** after a set time to stop the emissions

### Description:

In this example, the `interval()` function is used to create a cold Observable (`sequence$`) that emits increasing numbers (0, 1, 2, …) at a **fixed time interval of 1 second**.

* `rxjs.interval(1000)` creates an Observable that emits values starting from `0`, incrementing by 1 every 1000 milliseconds.
* When you **subscribe**, it starts emitting values immediately.
* The subscription is **manually terminated after 5 seconds** using `setTimeout(() => subscription.unsubscribe(), 5000)`.

### Key Takeaways:

* **`interval()`** is a **creation operator** that emits an infinite stream of numbers at fixed intervals.
* The emitted values are useful for polling, animations, timers, etc.
* Always **unsubscribe from long-lived or infinite Observables** to prevent memory leaks or unnecessary processing.

## Step 3: Observable creation method - `of()` for a sequence of immediately and synchronously emitted events

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const sequence$ = rxjs.of( 1, 2, 3 );

            const subscription = sequence$.subscribe({
                next( evt ) {
                    console.log( evt );
                },
                complete() {
                    console.log( 'completed' );
                }
            });
        </script>
    </body>
</html>
```
### Description:
This example uses `of(1, 2, 3)` to create a **cold Observable** that emits the values `1`, `2`, and `3` **synchronously**, then completes. The observer logs each value and the completion message.

### Key Takeaway:
`of()` emits values **in sequence** and completes immediately — useful for static or demo data.

## Step 4: Observable creation method - `fromEvent()` for a sequence of events based off of events fired by DOM nodes
`fromEvent()` is `** used to create an Observable from DOM events. `fromEvent()` listens for `mousemove` on the element. Each event logs cursor coordinates. When the cursor enters the red "forbidden" area (top-left 40×40px), the Observable is unsubscribed to stop further tracking.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                margin: 0;
            }

            #my-element {
                position: relative;
                box-sizing: border-box;
                width: 100%;
                height: 100vh;
                border: 1px solid crimson;
            }

            #forbidden {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 40px;
                height: 40px;
                background-color: crimson;
            }
        </style>
    </head>
    <body>
        <div id="my-element">
            <div id="forbidden"></div>
        </div>

        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const el = document.getElementById('my-element');
            const mouseMoves$ = rxjs.fromEvent(el, 'mousemove');

            const subscription = mouseMoves$.subscribe(evt => {
                console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);

                if (evt.clientX < 40 && evt.clientY < 40) {
                    subscription.unsubscribe();
                }
            });
        </script>
    </body>
</html>
```

## Step 5: Making HTTP Requests with `ajax()`
We perform an HTTP GET request to fetch user data using `ajax()`. It logs the response on success and uses a custom error handler to distinguish between client-side and network errors.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const apiData$ = rxjs.ajax.ajax(`https://jsonplaceholder.typicode.com/users?username=Bret`);

            function handleError( error ) {
                console.log( error.status, error.message );

                if( error.status >= 400 ) {
                    console.log( 'client side error' );
                } else {
                    console.log( 'network issue' );
                }
            }

            apiData$.subscribe({
                next( res ) {
                    console.log( res.status, res.response );
                },
                error: handleError
            });
        </script>
    </body>
</html>
```

## Step 6: Sequential Execution with `concat()`
`concat()` is used to run Observables __sequentially__. Emissions from the second Observable start only after the first completes. Two date-emitting Observables are created with different intervals. `concat()` combines them into a single Observable that runs `observable1$` first, then `observable2$` only after the first completes. Used for **order-preserving execution** of multiple streams.

```html
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            function getDateObservable( interval, obsId, repeat = 10 ) {
                return new rxjs.Observable(observer => {
                    let count = 0, id;

                    id = setInterval(() => {
                        count++;
                        observer.next( obsId + ' ' + new Date() );

                        if( count === repeat ) {
                            observer.complete();
                        }
                    }, interval * 1000);

                    return {
                        unsubscribe() {
                            clearInterval( id );
                        }
                    };
                });
            }

            class DateObserver {
                next( date ) {
                    console.log( date );
                }

                error() {

                }

                complete() {
                    console.log( 'no more events' );
                }
            }

            const observable1$ = getDateObservable( 2, 'observable1$', 7 );
            const observable2$ = getDateObservable( 1, 'observable2$', 7 );

            const concatenatedObservable$ = rxjs.concat( observable1$, observable2$ );

            concatenatedObservable$.subscribe( new DateObserver() );
        </script>
    </body>
</html>
```

## Step 7: Parallel Emissions with `merge()`
Multiple Observables are combined using **`merge()`**. Emissions from all sources are **interleaved** based on their timing. Observables run **concurrently**, not sequentially (unlike `concat()`). This example merges two time-based Observables (`observable1$` and `observable2$`) into a single stream. Both start immediately and emit values in parallel. Useful for handling multiple real-time sources simultaneously.

```html
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            function getDateObservable( interval, obsId, repeat = 10 ) {
                return new rxjs.Observable(observer => {
                    let count = 0, id;

                    id = setInterval(() => {
                        count++;
                        observer.next( obsId + ' ' + new Date() );

                        if( count === repeat ) {
                            observer.complete(); // results in unsubscription
                        }
                    }, interval * 1000);

                    return {
                        unsubscribe() {
                            console.log( 'unsubscribe' );
                            clearInterval( id );
                        }
                    };
                });
            }

            class DateObserver {
                next( date ) {
                    console.log( date );
                }

                error() {

                }

                complete() {
                    console.log( 'no more events' );
                }
            }

            const observable1$ = getDateObservable( 2, 'observable1$', 7 );
            const observable2$ = getDateObservable( 1, 'observable2$', 7 );

            const mergedObservable$ = rxjs.merge( observable1$, observable2$ );

            mergedObservable$.subscribe( new DateObserver() );
        </script>
    </body>
</html>
```

## Step 8: Limiting Emissions with `take()`
_ We can use **`take(n)`** to limit the number of emissions from a source Observable. It auto-completes after `n` values are emitted. This example uses `take(3)` to emit only the **first 3 values** from the source Observable. After emitting `1, 2, 3`, it completes automatically. Ideal for sampling or truncating streams.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const of = rxjs.of;
            const take = rxjs.operators.take;

            const sequence$ = of( 1, 2, 3, 4, 5, 6, 7, 8 );
            const evenSequence$ = take( 3 )( sequence$ );

            const subscription = evenSequence$.subscribe({
                next( evt ) {
                    console.log( evt );
                },
                complete() {
                    console.log( 'completed' );
                }
            });
        </script>
    </body>
</html>
```

## Step 9: Filtering Stream Values with `filter()`
We use **`filter()`** to allow only values matching a condition. It enables selective emission based on a predicate. This example filters the source stream to emit only **even numbers**. `filter(x => x % 2 === 0)` ensures values like `2, 4, 6, 8` are passed through. Commonly used to reduce noise in data streams.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const of = rxjs.of;
            const filter = rxjs.operators.filter;

            const sequence$ = of( 1, 2, 3, 4, 5, 6, 7, 8 );
            const evenSequence$ = filter( x => x % 2 === 0 )( sequence$ );

            const subscription = evenSequence$.subscribe({
                next( evt ) {
                    console.log( evt );
                },
                complete() {
                    console.log( 'completed' );
                }
            });
        </script>
    </body>
</html>
```

## Step 10: Transforming Values with `map()`
We use **`map()`** to transform each emitted value by applying a function to modify stream data. This example multiplies each value in the stream by 2 using `map(x => 2 * x)`, converting `1, 2, 3, ...` into `2, 4, 6, ...`. `map()` is a key operator for transforming data in RxJS streams.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            // EXERCISE: Explore use of tap() to log values before and after an event is emitted
            const of = rxjs.of;
            const map = rxjs.operators.map;

            const sequence$ = of( 1, 2, 3, 4, 5, 6, 7, 8 );
            const evenSequence$ = map( x => 2 * x )( sequence$ );

            const subscription = evenSequence$.subscribe({
                next( evt ) {
                    console.log( evt );
                },
                complete() {
                    console.log( 'completed' );
                }
            });
        </script>
    </body>
</html>
```

## Step 11: Handling Errors with `catchError()`

### Concepts Covered:

* Throwing errors inside a `map()` operator
* Using **`catchError()`** for custom error handling or fallback streams
* Recovering from or transforming stream errors

- This example demonstrates how to handle errors in a pipeline:
    * The first stream throws an error on encountering an **odd number**, and `catchError()` rethrows a custom error.
    * The second stream throws on **even numbers**, but `catchError()` recovers by returning a fallback Observable.  

Useful for **graceful degradation**, fallback data, or error logging.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const of = rxjs.of;
            const map = rxjs.operators.map;
            const catchError = rxjs.operators.catchError;

            const sequenceEvens$ = of( 2, 4, 6, 7, 8 );

            const noOddsSequence$ = map( x => {
                if( x % 2 === 1 ) {
                    throw new Error( 'Invalid number' );
                }

                return x;
            })( sequenceEvens$ );

            const noOddsSequenceWithErrorHandling$ = catchError( error => {
                if( error.message === 'Invalid number' ) {
                    throw new Error( 'Odd number encountered' );
                }
            })( noOddsSequence$ );

            const subscription1 = noOddsSequenceWithErrorHandling$.subscribe({
                next( evt ) {
                    console.log( evt );
                },
                complete() {
                    console.info( 'completed noOddsSequence' );
                },
                error( error ) {
                    console.error( 'error : ' + error.message );
                }
            });

            const sequenceOdds$ = of( 1, 3, 5, 6, 7 );

            const noEvensSequence$ = map( x => {
                if( x % 2 === 0 ) {
                    throw new Error( 'Invalid number' );
                }

                return x;
            })( sequenceOdds$ );

            const noEvensSequenceWithErrorHandling$ = catchError( error => {
                if( error.message === 'Invalid number' ) {
                    return of( 7, 5, 3, 1 );
                }
            })( noEvensSequence$ );

            const subscription2 = noEvensSequenceWithErrorHandling$.subscribe({
                next( evt ) {
                    console.log( evt );
                },
                complete() {
                    console.info( 'completed noEvensSequence' );
                },
                error( error ) {
                    console.error( error.message );
                }
            });
        </script>
    </body>
</html>
```

## Step 12: Sequential Mapping with `concatMap()`

### Concepts Covered:

* Use of **`concatMap()`** — a **higher-order mapping operator**
* Queues emissions from the outer Observable and processes them **one at a time**
* Returns an **inner Observable** for each outer value

### Description:

This example uses `concatMap()` to map each value from `x$` to a new inner Observable `y$`. Each `x` waits until its corresponding inner `y$` completes before the next `x` is processed.

* The function inside `concatMap()` returns a new **Observable**, not a value — this is key to how it operates.
* `concatMap()` **queues** these inner Observables and subscribes to them **sequentially**.

This ensures **order is preserved**, unlike `mergeMap()` which runs all inner Observables concurrently.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const interval = rxjs.interval;
            const take = rxjs.operators.take;
            const map = rxjs.operators.map;
            const concatMap = rxjs.operators.concatMap;

            const x$ = take( 3 )( interval( 1000 ) );
            const y$ = take( 3 )( interval( 1000 ) );

            const xy$ = concatMap( x => {
                console.log('x = ' + x );
                // return map( y => `(${x}, ${y})` )( y$ );
                return y$;
            })( x$ );
            xy$.subscribe( xy => console.log( xy ) );
        </script>
    </body>
</html>
```

## Step 13: Concurrent Mapping with `mergeMap()`

### Concepts Covered:

* Use of **`mergeMap()`**, a **higher-order mapping operator**
* Maps each value from the outer Observable (`x$`) to an **inner Observable (`y$`)**
* All inner Observables are **subscribed to concurrently** (no queuing)

### Description:

This example emits values from `x$`, and for each `x`, maps it to `y$` using `mergeMap()`. Each `y$` runs **immediately and in parallel**, without waiting for others to complete.

* The function passed to `mergeMap()` **returns an Observable**, not a direct value.
* Emitted results are combined as `{ x, y }` objects.

Ideal when inner Observables can run **simultaneously**, such as parallel API calls or events.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const interval = rxjs.interval;
            const take = rxjs.operators.take;
            const map = rxjs.operators.map;
            const mergeMap = rxjs.operators.mergeMap;

            const x$ = take( 3 )( interval( 1000 ) );
            const y$ = take( 3 )( interval( 1000 ) );

            const xy$ = mergeMap( x => map( y => ( { x, y } ) )( y$ ) )( x$ );
            xy$.subscribe( xy => console.log( xy ) );
        </script>
    </body>
</html>
```

## Step 14: Motivation for Using `pipe()` to Compose Operators

### Concepts Covered:

* Function composition with and without `pipe()`
* Reusability and readability through `pipe()`
* `pipe()` as a clean way to sequence RxJS operators

---

### Description:

The **first example** shows nested calls:

```ts
map(...)(filter(...)(obs$))
```

While functional, it quickly becomes unreadable with more operators.

```html
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const of = rxjs.of;
            const filter = rxjs.operators.filter;
            const map = rxjs.operators.map;

            const obs$ = of( 1, 2, 3, 4, 5, 6, 7 );

            map( x => x * x )( filter( x => x % 2 !== 0 )( obs$ ) ).subscribe( x => console.log( x ) );
        </script>
    </body>
</html>
```

The **second example** uses **`pipe()`** to compose both **regular functions** (like `double`, `square`) and **RxJS operators**, resulting in:

```ts
obs$.pipe(
  filter(...),
  map(...)
)
```

This approach:

* Improves **readability**
* Enables defining **reusable operator chains** (like `squareOfOdds`)
* Mirrors how RxJS handles operator composition internally

```html
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const of = rxjs.of;
            const filter = rxjs.operators.filter;
            const map = rxjs.operators.map;

            const pipe = rxjs.pipe;

            const double = x => x + x;
            const square = x => x * x;

            const doubleAndSquare = pipe( double, square );
            console.log( doubleAndSquare( 3 ) ); // 36

            const obs$ = of( 1, 2, 3, 4, 5, 6, 7 );

            // a recipe using rxjs operators
            const squareOfOdds = pipe(
                filter( x => x % 2 !== 0 ),
                map( x => x * x )
            );

            squareOfOdds( obs$ ).subscribe( x => console.log( x ) );
        </script>
    </body>
</html>
```

### Takeaway:

Using `pipe()` makes complex stream transformations **clearer**, **more maintainable**, and **easier to reuse**.


## Step 15: Handling HTTP Errors with `retry()` and `catchError()`

### Concepts Covered:

* Making HTTP requests using **`ajax()`**
* Automatically retrying failed requests with **`retry()`**
* Catching and transforming errors using **`catchError()`**
* Composing logic cleanly with **`pipe()`**

### Description:

This example defines a function `getUsersWithName(name)` that:

1. Sends a GET request using `ajax()`
2. **Retries up to 3 times** if the request fails
3. Maps the successful response to the `response` body
4. **Catches errors** using `catchError()` and throws a wrapped error with a custom message

On failure, it distinguishes **client-side errors** (status ≥ 400) from **network issues**, and reports a generic error while preserving the original error.

### Takeaway:

`retry()` and `catchError()` are essential tools for making HTTP requests resilient and user-friendly. Composing them in a `pipe()` ensures clean and declarative error-handling logic.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const ajax = rxjs.ajax.ajax;

            const retry = rxjs.operators.retry;
            const catchError = rxjs.operators.catchError;
            const map = rxjs.operators.map;

            function getUsersWithName( name ) {
                return ajax( `https://jsonplaceholder.typicode.com/users?username=${name}` ).pipe(
                    retry( 3 ),
                    map( res => res.response ),
                    catchError( handleError )
                );
            }

            function handleError( error ) {
                console.log( error );

                if( error.status >= 400 ) {
                    console.log( 'client side error' );
                } else {
                    console.log( 'network issue' );
                }

                const wrapperError = new Error( 'Something went wrong when fetching data from the server' );
                wrapperError.originalError = error;
                throw wrapperError;
            }

            getUsersWithName( 'Bret' ).subscribe(
                users => console.log( users ),
                err => console.log( err.message )
            );
        </script>
    </body>
</html>
```

## Step 16: Chaining Dependent HTTP Calls with `switchMap()`

### Concepts Covered:

* Making **chained HTTP requests** using `ajax()`
* Using **`switchMap()`** to flatten and switch to new inner Observables
* **Retrying** failed requests and **catching errors**
* Mapping final results with `map()`

### Description:

This example defines `getCommentsForFirstUserWithName(name)`, which performs three dependent HTTP requests:

1. Fetches the user by username.
2. Uses `switchMap()` to get that user's posts.
3. Uses another `switchMap()` to get comments for the first post.
4. Maps the response to extract the comments.
5. Retries the initial request up to 3 times if needed.
6. Handles all errors via `catchError()`.

Each `switchMap()` ensures that if a new emission comes in, the previous inner request (if still pending) is **cancelled**, making this ideal for **cancelable, sequential fetches**.

### Takeaway:

Use `switchMap()` for **nested, dependent HTTP requests** where only the latest result matters. This pattern avoids deeply nested subscriptions and keeps error handling centralized and clean.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const ajax = rxjs.ajax.ajax;

            const retry = rxjs.operators.retry;
            const catchError = rxjs.operators.catchError;
            const map = rxjs.operators.map;

            const mergeMap = rxjs.operators.mergeMap;
            const concatMap = rxjs.operators.concatMap;
            const switchMap = rxjs.operators.switchMap;

            function getCommentsForFirstUserWithName( name ) {
                return ajax( `https://jsonplaceholder.typicode.com/users?username=${name}` ).pipe(
                    retry( 3 ),
                    switchMap( res => ajax( `https://jsonplaceholder.typicode.com/users/${res.response[0].id}/posts` ) ),
                    switchMap( res => ajax( `https://jsonplaceholder.typicode.com/comments?postId=${res.response[0].id}` ) ),
                    map( res => res.response ),
                    catchError( handleError )
                );
            }

            function handleError( error ) {
                console.log( error );

                if( error.status >= 400 ) {
                    console.log( 'client side error' );
                } else {
                    console.log( 'network issue' );
                }

                const wrapperError = new Error( 'Something went wrong when fetching data from the server' );
                wrapperError.originalError = error;
                throw wrapperError;
            }

            getCommentsForFirstUserWithName( 'Samantha' ).subscribe(
                comments => console.log( comments ),
                err => console.log( err.message )
            );
        </script>
    </body>
</html>
```

## Step 17: Parallel API Calls with `forkJoin()`

### Concepts Covered:

* Executing **parallel HTTP requests** using **`forkJoin()`**
* Reusing a function that returns an Observable (`getCommentsForFirstUserWithName`)
* Handling **multiple inner streams** and combining their final results
* Preserving retry and error handling for each stream individually

### Description:

This example defines two functions:

* `getCommentsForFirstUserWithName(name)` performs a **chain of dependent API calls** (user → posts → comments).
* `getCommentsForFirstUsersWithNames(...names)` maps each name to its respective Observable and uses **`forkJoin()`** to execute all in **parallel**.

Once all requests complete, `forkJoin()` emits an array of results (`commentsLists`). If any Observable errors, the entire result errors out (handled by `catchError` within each Observable).

### Takeaway:

Use `forkJoin()` to run **multiple observables concurrently** and collect **all results once every stream completes**. Ideal for **batch requests** or **independent parallel fetches** that should resolve together.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const ajax = rxjs.ajax.ajax;

            const retry = rxjs.operators.retry;
            const catchError = rxjs.operators.catchError;
            const map = rxjs.operators.map;

            const switchMap = rxjs.operators.switchMap;
            const forkJoin = rxjs.forkJoin;

            function getCommentsForFirstUserWithName( name ) {
                return ajax( `https://jsonplaceholder.typicode.com/users?username=${name}` ).pipe(
                    retry( 3 ),
                    switchMap( res => ajax( `https://jsonplaceholder.typicode.com/users/${res.response[0].id}/posts` ) ),
                    switchMap( res => ajax( `https://jsonplaceholder.typicode.com/comments?postId=${res.response[0].id}` ) ),
                    map( res => res.response ),
                    catchError( handleError )
                );
            }

            function getCommentsForFirstUsersWithNames( ...names ) {
                const comments$Array = names.map( getCommentsForFirstUserWithName );
                return forkJoin( comments$Array );
            }

            function handleError( error ) {
                console.log( error );

                if( error.status >= 400 ) {
                    console.log( 'client side error' );
                } else {
                    console.log( 'network issue' );
                }

                // if you want to terminate the request throw a custom error
                // const wrapperError = new Error( 'Something went wrong when fetching data from the server' );
                // wrapperError.originalError = error;
                // throw wrapperError;

                // if you want to recover from an error pass a recovery Observable
                return of([]);
            }

            getCommentsForFirstUsersWithNames( 'Bret', 'Samantha' ).subscribe(
                commentsLists => console.log( commentsLists ),
                err => console.log( err.message )
            );
        </script>
    </body>
</html>
```

## Step 18: Debounced Search with `fromEvent()`, `debounceTime()` and `switchMap()`

### Concepts Covered:

* Capturing user input as a stream using **`fromEvent()`**
* Reducing noisy emissions using **`debounceTime()`**
* Cancelling stale HTTP requests with **`switchMap()`**
* Tapping into the stream with **`tap()`** for side-effects (e.g., logging)

### Description:

This example demonstrates how to build a **type-ahead search box**:

1. `fromEvent()` listens for input events.
2. `map()` extracts the search term.
3. `debounceTime(500)` waits until 500ms of inactivity before proceeding.
4. `switchMap()` makes the AJAX request — **cancelling any prior request** if a new one starts.
5. `tap()` logs each keystroke without affecting the stream.

The final subscription simulates an action like showing suggestions.

### Takeaway:

This pattern is ideal for search boxes — **efficient**, **responsive**, and **avoids race conditions** by ensuring only the latest query triggers a request.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <input type="search" id="search" />
        Making an ajax call with <span id="input"></span>

        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            // import { fromEvent } from 'rxjs';
            const fromEvent = rxjs.fromEvent;
            const debounceTime = rxjs.operators.debounceTime;
            const switchMap = rxjs.operators.switchMap;
            const map = rxjs.operators.map;
            const tap = rxjs.operators.tap;
            const ajax = rxjs.ajax.ajax;

            const searchBox = document.getElementById('search');

            // NOTE: switchMap() cancels the previous HTTP request if a new one starts before the previous finishes
            const searchInputAfterWait$ = fromEvent(searchBox, 'input').pipe(
                map(event => event.target.value),
                tap(event => console.log(event)),
                debounceTime(500),
                switchMap((event) => {
                    return ajax.getJSON(`http://dummysearch.com/api/search?q=${event}`);
                })
            );

            searchInputAfterWait$.subscribe(
                ( event ) => {
                    const value = event.target.value;
                    console.log( `we made an ajax call now to fetch the suggestions for ${value}` );
                }
            );
        </script>
    </body>
</html>
```

## Step 19: Multicasting with Subject

### Concepts Covered:

* Creating a `Subject`, which is both an **Observable** and an **Observer**
* Using a `Subject` to **multicast** values to multiple subscribers
* Forwarding emissions from a source Observable using `subject.subscribe()` pattern

#### Description:

This example shows how a `Subject` bridges a unicast `Observable` (`nums$`) to **multiple subscribers**:

1. `nums$` emits `1, 2, 3` to the subject.
2. `numsSubject` acts as an Observer — it receives these values.
3. At the same time, it's an Observable — both `subscription1` and `subscription2` receive **all values**.

Without the `Subject`, each subscription to `nums$` would run **independently**. But the `Subject` shares the values to all subscribers **simultaneously**.

#### Takeaway:

Use `Subject` to convert **cold Observables into hot**, enabling **multicasting** — where multiple subscribers share a single execution path.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            // A Subject is both an Observable and an Observer
            const nums$ = new rxjs.Observable(observer => {
                observer.next( 1 );
                observer.next( 2 );
                observer.next( 3 );
            });

            const numsSubject = new rxjs.Subject();

            const subscription1 = numsSubject.subscribe(evt => {
                console.log(`[1] ${evt}`);
            });

            const subscription2 = numsSubject.subscribe(evt => {
                console.log(`[2] ${evt}`);
            });

            const subscription = nums$.subscribe( numsSubject );
        </script>
    </body>
</html>
```

## Step 20: Hot Observables and Multicasting with `fromEvent()`

### Concepts Covered:

* **`fromEvent()` creates a hot observable**
* Hot observables **emit events regardless of subscriptions**
* No need for `Subject` to multicast from hot sources like DOM events
* Multiple subscribers can independently receive the same event stream

### Description:

This example uses `fromEvent()` to track mouse movements over an element:

* It directly subscribes **twice** to the same `mouseMove$` stream.
* Each subscription reacts independently to mouse events.
* There's a suggestion to use a `Subject`, but it’s **not required here**.

Why?

* `fromEvent()` wraps an **external event source (like DOM events)**.
* Such events **exist independently** of the Observable — making `mouseMove$` **hot**.
* Since it's hot, it **naturally supports multicasting** — unlike cold Observables (`interval()`, `of()`), which need a `Subject` to share emissions.

### Takeaway:

Hot observables like `fromEvent()` don't need a `Subject` for multicasting. Multiple subscribers can safely consume the same event stream **simultaneously**.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                margin: 0;
            }

            #my-element {
                position: relative;
                box-sizing: border-box;
                width: 100%;
                height: 100vh;
                border: 1px solid crimson;
            }

            #forbidden-1 {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 40px;
                height: 40px;
                background-color: rgba( 220, 20, 60, 0.75 );
                z-index: 100;
            }

            #forbidden-2 {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100px;
                height: 100px;
                background-color: rgba( 0, 0, 128, 0.75 );
                z-index: 10
            }
        </style>
    </head>
    <body>
        <div id="my-element">
            <div id="forbidden-1"></div>
            <div id="forbidden-2"></div>
        </div>

        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            // fromEvent() creates a "Hot observable" -> hot observables suppport multi-casting, and hence Subject is not needed for multicasting the events of such Observables
            // When the events of an Observable are generated outside of the Observable generation method (here, fromEvent), the Observable is a "Hot Observable"
            // NOTE: interval() and of() produce "Cold observables" - these requires Subject for multi-casting
            const el = document.getElementById('my-element');
            const mouseMove$ = rxjs.fromEvent(el, 'mousemove');

            const mouseMoveSubject = new rxjs.Subject();

            // EXERCISE: Substitute mouseMoveSubject with mouseMove$ in the following 2 subscriptions and comment the last line - it will still work!
            const subscription1 = mouseMove$.subscribe(evt => {
                console.log(`[1] Coords: ${evt.clientX} X ${evt.clientY}`);

                if (evt.clientX < 40 && evt.clientY < 40) {
                    subscription1.unsubscribe();
                }
            });

            const subscription2 = mouseMove$.subscribe(evt => {
                console.log(`[2] Coords: ${evt.clientX} X ${evt.clientY}`);

                if (evt.clientX < 100 && evt.clientY < 100) {
                    subscription2.unsubscribe();
                }
            });

            // EXERCISE: Comment this line - it will still work!
            // const subscription = mouseMove$.subscribe( mouseMoveSubject );
        </script>
    </body>
</html>
```

## Step 21: Difference Between `Subject` and `BehaviorSubject`

### Concepts Covered:

* Understanding the **key difference** between `Subject` and `BehaviorSubject`
* Subscribing **after emissions start**
* Use of `interval()` with Subjects to simulate a ticking counter
* Multicasting and late subscriber behavior

### Description:

* `counterSubject` subscribes to an interval that emits every 10 seconds.
* **Subscriber 1** subscribes immediately and receives emissions as they happen.
* **Subscriber 2** subscribes **after 15 seconds** — it **misses earlier emissions** and only receives new ones going forward.

This is because a `Subject` **does not store** the last emitted value — it only pushes future values to new subscribers.

- Let us now understand `BehaviorSubject`.
    * Same setup, but substitute `Subject` with `BehaviorSubject`.
    * When **Subscriber 2** subscribes after 15 seconds, it **immediately receives the latest value** emitted before it joined.

This is because a `BehaviorSubject` **remembers the most recent value** and sends it to **new subscribers immediately** upon subscription.

### Summary: Subject vs BehaviorSubject

| Feature                  | `Subject`            | `BehaviorSubject`              |
| ------------------------ | -------------------- | ------------------------------ |
| Remembers last value?    | ❌ No                 | ✅ Yes                          |
| Emits value on late sub? | ❌ Only future values | ✅ Immediately emits last value |
| Requires initial value?  | ❌ No                 | ✅ Yes (must provide one)       |

> __EXERCISE__: In the BehaviorSubject example, we did not provide an **initial value**. But you can like so. Try it.

```js
const counterSubject = new rxjs.BehaviorSubject(0); // Should provide a default
```

### Takeaway:
Use `BehaviorSubject` when you want **new subscribers to immediately receive the current/latest value** — commonly used in **state management scenarios**. Use `Subject` when you only want to multicast **new events**.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script src="rxjs-7.8.2.umd.js"></script>

        <script>
            const counter$ = rxjs.interval( 10000 );

            const counterSubject = new rxjs.Subject();

            const subscription1 = counterSubject.subscribe(evt => {
                console.log(`[1] ${evt}`);
            });

            const subscription = counter$.subscribe( counterSubject );

            setTimeout(() => {
                const subscription2 = counterSubject.subscribe(evt => {
                    console.log(`[2] ${evt}`);
                });
            }, 15000);
        </script>
    </body>
</html>
```

## Step 22: Multicasting
- __Multicasting__ in RxJS refers to the ability to **share a single execution of an Observable among multiple subscribers**, so that all subscribers receive the same emitted values **without re-triggering** the source observable.

### Without Multicasting (Unicast – Default Behavior)
- By default, RxJS Observables are **unicast**. This means:
    * Each subscriber gets a **new, independent execution** of the source.
    * Think of this like everyone getting their own copy of a recorded video.

#### Example (Unicast)

```ts
const obs$ = new Observable(observer => {
  console.log('Source executed');
  observer.next(Math.random());
});

obs$.subscribe(value => console.log('Subscriber 1:', value));
obs$.subscribe(value => console.log('Subscriber 2:', value));
```

**Output:**
```
Source executed
Subscriber 1: 0.123
Source executed
Subscriber 2: 0.456
```

Both subscribers trigger the observable separately — two executions, different results.

### With Multicasting

- Multicasting shares a single source among all subscribers:
    * All subscribers receive the **same** value.
    * Think of this like watching a **live broadcast** — one stream shared with many viewers.

#### Example (Multicasting with `share()`)

```ts
import { Observable, share } from 'rxjs';

const obs$ = new Observable(observer => {
  console.log('Source executed');
  observer.next(Math.random());
}).pipe(
  share()
);

obs$.subscribe(value => console.log('Subscriber 1:', value));
obs$.subscribe(value => console.log('Subscriber 2:', value));
```

**Output:**

```
Source executed
Subscriber 1: 0.789
Subscriber 2: 0.789
```

Only one execution — both subscribers get the same value.

### Operators That Enable Multicasting

* `share()` — commonly used for simple multicasting
* `shareReplay(n)` — multicast and replay last `n` values to late subscribers
* `publish()` / `multicast()` — advanced and lower-level (require a subject)


### Real-World Use Case

Multicasting is critical when:

* Making **HTTP requests** (which should only be made once)
* Subscribing to **WebSocket streams**
* Preventing redundant side-effects

```ts
this.http.get('/api/data').pipe(share());
```

Without `share()`, multiple subscriptions will cause multiple HTTP requests.

## Step 23: Scheduler
In **RxJS**, a **scheduler** is a powerful mechanism that controls **when** and **where** (on what execution context or "thread") tasks like subscriptions, emissions, and notifications happen.
- A **scheduler** in RxJS is an abstraction for:
    * **Controlling execution timing** (now, later, periodically)
    * **Controlling execution context** (e.g., sync, async, animation frame, microtask, etc.)
In short: **Schedulers let you control time and concurrency in RxJS**.

### Common RxJS Schedulers

| Scheduler                 | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `queueScheduler`          | Synchronous execution using a queue                   |
| `asapScheduler`           | Executes tasks in microtask queue (after current job) |
| `asyncScheduler`          | Executes tasks asynchronously using `setTimeout()`    |
| `animationFrameScheduler` | Sync with browser's animation frame                   |

### Example: `asyncScheduler`

```ts
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

console.log('Before');

of(1, 2, 3)
  .pipe(observeOn(asyncScheduler))  // Delay emission to next macrotask
  .subscribe(value => console.log('Emitted:', value));

console.log('After');
```

**Output:**

```
Before
After
Emitted: 1
Emitted: 2
Emitted: 3
```

- __NOTE__: Without `.pipe(observeOn(asyncScheduler))`, it would emit before `After` - remove the line and check.

### Practical Use Case in Angular: Preventing UI Freezing with `asyncScheduler`

Imagine a component loading **thousands of records** from a backend and mapping them before rendering:

```ts
from(hugeDataArray)
  .pipe(
    observeOn(asyncScheduler),
    map(processHeavy)
  )
  .subscribe(result => renderToDOM(result));
```

This offloads processing to **asynchronous chunks**, keeping the UI **responsive** by letting Angular’s change detection and rendering happen between chunks.

### Where You Might Use a Scheduler

* **Debounced input + async updates** (e.g., in forms)
* **Breaking up long-running computations** into tasks (e.g., rendering lots of DOM nodes)
* **Avoiding blocking UI** by scheduling work to the event loop
* **Custom animations** with `animationFrameScheduler`

## Step 24: Creating custom operators
- **RxJS** allows you to encapsulate and reuse logic applied to streams. You create custom operators using the `lift` method (advanced) or, more commonly and cleanly, using the **higher-order function pattern** (a function returning an `OperatorFunction`) like so
```ts
function customOperator<T, R>(...args): OperatorFunction<T, R> {
    return (source: Observable<T>) => {
        return source.pipe(
                // built-in operators go here (map, filter, etc.)
        );
    };
}
```

### **Example 1: Custom Filter for Minimum Value**

```ts
function filterMin(min: number): OperatorFunction<number, number> {
    return (source: Observable<number>) => {
        return source.pipe(
            map(val => Number(val)), // ensure number
            filter(val => val >= min)
        );
    };
}
```

**Usage:**

```ts
of(10, 20, 30)
    .pipe(filterMin(20))
    .subscribe(x => console.log(x));
```

### **Example 2: Custom Debug Operator (like tap with a label)**

```ts
import { tap } from 'rxjs/operators';

function debug<T>(label: string): OperatorFunction<T, T> {
    return (source: Observable<T>) => {
        return source.pipe(
            tap(value => console.log(`${label}:`, value))
        );
    };
}
```

**Usage:**

```ts
of(10, 20, 30)
    .pipe(debug('Value'))
    .subscribe(x => console.log(x));
```

### **Best Practices**

* Use generics (`<T, R>`) to make it type-safe.
* Compose using existing RxJS operators (`map`, `filter`, `tap`, etc.).
* Avoid `lift` unless doing very advanced interop or internal library work.
