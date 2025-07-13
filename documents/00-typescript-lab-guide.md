# TypeScript (TS) Lab Guide

## Step 0: Before getting started
__NOTE__:
1. Use `cd` to check the current directory in Windows and `pwd` on Mac OS and Linux.
2. Use `cd myfolder` to switch to a folder called `myfolder` that exists in the current folder
3. Use `cd ..` to switch to the parent folder of the the current folder
4. Use a single dot - `.` to refer to the current folder when specifying paths in command line utilities
5. Command line utilities have many commands. Generally there is a long form and a short-hand for a command. For example, for the npm install command, you can execute it either way
```sh
npm install
```
```sh
npm i
```
6. Command line utilities take options. Generally there is a long form and a short-hand for options. The long form is prefixed with `--` and short-hand with `-`. For example, for the npm install command, you can specify that a package being installed is a development-time dependency, either of these ways
```sh
npm i --save-dev typescript
```
```sh
npm i -D typescript
```
7. Most __command-line commands__ and their __options__ are __case-sensitive__.

## Step 1: Setting up a TS build process

__NOTE__: Unless specified otherwise, run all commands from the project folder.  

__Reference__: - Reference: https://www.typescriptlang.org/

- From the folder of your choice (project folder) run this to create a `package.json`. Every Node JS based project has a `package.json` (be it Angular, React, plain JS, or TS). Node and npm are used to manage the build (with additional tooling), and packages for the application.
```
npm init -y
```
- Install the TS compiler
```
npm i --save-dev typescript
```
- We have TS installed - find the `tsc` compiler in `./node_modules/.bin`
- Create a TS file to get started - `src/01-hello-world.ts`
```ts
let message;

message = "Hello World!";
console.log(message);
```
- To compile single file `src/01-hello-world.ts`, run this from a terminal in the project folder. It creates the compiled JS file in the same folder as the source file. You should see `src/01-hello-world.js` as the output.
```
./node_modules/.bin/tsc ./src/01-hello-world.ts
```
- Execute the file using Node runtime - you should see the output from the JS file that runs
```
node ./src/01-hello-world.js
```
- We set up the TS config file. This is used to provide __options__ to the `tsc` compiler. We could provide options when running the `tsc` command each time, but that would be cumbersome and tedious.
```
./node_modules/.bin/tsc --init
```
- Set up options as mentioned by the instructor - typical ones are shown below
```json
{
    "compilerOptions": {
        "target": "es2016",
        "module": "commonjs",
        "rootDir": "./src",
        "outDir": "./dist",
        "noEmitOnError": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true
    }
    // "include": ["src/**/*"],
}
```
- In the `scripts` section in `package.json`, add this
```
"build": "tsc"
```
- Run the script 
```
npm run build
```
- __NOTE__: Any script in `package.json` is run as `npm run script_name`
- Add a watch script
```
"build:watch": "tsc --watch"
```
- Run the watch script and observe that the source code re-compiles when you edit and save changes in the source code
```
npm run build:watch
```

## Step 2: Understanding script and module mode of compilation
- Create `src/02-primitive-types.ts`
```ts
let message;
```
- The variable conflicts with the `message` variable in `src/01-hello-world.ts` as TS compiler works in `script mode` of compilation, where TS assumes all source code output (JS files) will be included through scripts in an HTML file, leading to global variable conflicts. We usually treat the JS files as modules now, i.e. import them using ES2015 import syntax - here there will be no global scope conflicts (as modules do no create global variables).
- Enable module mode of compilation by including at least 1 import or export statement in each file. We shall henceforth export nothing in each file (or you can export something if you wish), to enable module-mode of compilation.
- In `src/01-hello-world.ts`
```ts
let message;

message = "Hello World!";
console.log(message);

export {};
```
- In `src/02-primitive-types.ts`
```ts
let message;

export {};
```

## Step 3: Primitive types
- In `src/02-primitive-types.ts`
```ts
// #1: any type - AVOID IT AS MUCH AS POSSIBLE
// this is 'any' type - we avoid using it - no point of using TS if we stick to using this
let message /*: any*/;

message = "Hello World!!!";
console.log(message);

message = 100;

// #2: string
let greeting: string;
greeting = "Good morning";
// greeting = 100; // error

// #3: boolean
let isPresent: boolean;
isPresent = true;

// #4: number
let total: number;
total = 100;

// #5: null, undefined
// we do not use null type and undefined type on their own
let employee: null;
employee = null;
// employee = { // error
//     name: "John",
//     role: "Frontend dev",
// };

export {};
```
- __TAKEAWAYS__:
    - Avoid `any` type as much as possible. If a variable can actually take any kind of value, then `any` is applicable
    - `null`, `undefined` are usually not used on their own. Their are used usually when defining union types (we shall see union types later).

## Step 4: Type inference
- In `src/03-type-inference.ts`
```ts
// If you hover over the message variable, you will see that TypeScript has inferred the type of the variable as string.
let message = "Hello, World!!!";
```
- __TAKEAWAYS__
    - The data type is inferred if you assign an initial value (i.e. a value at the time of variable declaration).
    - If the inferred type does not suit your requirement, you may mention the type explicitly

## Step 5: Union type
- In `src/04-union-type.ts`
```ts
// import { NS } from "./05-type-alias";

// number | string -> a union type
let chequeAmount: number | string = 1000;
chequeAmount = "One Thousand";
// chequeAmount = true; // Error: Type 'true' is not assignable to type 'string | number'

console.log(chequeAmount);

export {};
```
- __TAKEAWAYS__
    - A union type is necessary when a variable can take values or 2 or more types (the type can even be null, undefined, an object, an array a function etc.)

## Step 6: Type Alias
- In `src/05-type-alias.ts`
```ts
type NS = number | string;

// number | string -> a union type
let chequeAmount: NS = 1000;
chequeAmount = "One Thousand";
// chequeAmount = true; // Error: Type 'true' is not assignable to type 'string | number'

console.log(chequeAmount);

export type { NS };
```
- __TAKEAWAYS__
    - A type alias is a "short and sweet name" for any type - a simple primitive, a union type, a function, an object type etc.

## Step 7: Type literals
- In `src/06-type-literals.ts`
```ts
type Rating = 1 | 2 | 3 | 4 | 5;
```
- __TAKEAWAYS__
    - Values can be used as types! This can be useful to create a more restrictive set of values for a variable, than what a built-in type would.

## Step 8: Array type, type assertion
- In `src/07-array.ts`
```ts
import type { NS } from "./05-type-alias";
// let chequeAmounts : any[] = [];

// #1 - The array can have only numbers, or only string
// #2 - Also an empty array has to be clarified as being a number array or a string array - hence we "assert the type"
//  as number[] -> type assertion, i.e. type casting
let chequeAmounts: number[] | string[] = [] as number[];
chequeAmounts.push(100);
chequeAmounts.push(200);
// chequeAmounts.push("Three hundred");

// #3 - An array with items of mixed type - can be either number of string (can coexist in the array)
let chequeAmounts2: (number | string)[] = [];
chequeAmounts2.push(100);
chequeAmounts2.push(200);
chequeAmounts2.push("Three thousand");

// #3 - any[] - not a good idea usually
let chequeAmounts3: NS[] = [];
chequeAmounts3.push(100);
chequeAmounts3.push(200);
chequeAmounts3.push("Three thousand");
```
- __TAKEAWAYS__
    - Be careful when defining arrays of mixed type - make sure to use parentheses appropriately, or simply use union type to avoid confusion
    - Explore the generics-inspired alternative syntax of `Array<>`. There is no difference between this and what is shown above otherwise.
    - Type assertion in TS is similar to type casting in most languages (but it is simply an information provided to TS compiler on the expected type for the value, and no type casting work is done at runtime like in other languages)

## Step 9: Object type
- In `src/08-object.ts`
```ts
// #1: Object type with optional and readonly properties
// #2: Defining an object type using a type alias or an interface makes the type reusable
type Person = {
    name: string;
    readonly age: number;
    spouse?: string;
};

let john: Person;

// age is readonly and after john is assigned, it cannot be changed
john = {
    name: "John",
    age: 32,
    spouse: "Jane",
};

// error - age is readonly
// john.age++;
// john.age = 40;

let jane: Person = {
    name: "Jane",
    age: 28,
};
```
- __TAKEAWAYS__
    - Syntax for providing an object's type is similar to the Object literal syntax used to define objects
    - Usually a type literal, or interface (we see later) is used to define an object type - this makes the type reusable
    - readonly and optional properties are supported
    - __Self-exploration__ - What is __Excess property checking__ and how does it prevent bugs when assigning object literals to objects of a specified type.
    ```ts
    // #2: Excess property check kicks in when assigning an object literal to a variable of an object type
    let x = {
        name: 'Papa John',
        age: 64,
        children: ['John' ]
    };

    let papaJohn : Person = x;

    // error - excess property check done
    // let mamaJohn : Person = {
    //     name: 'Mama John',
    //     age: 60,
    //     children: ['John' ]
    // }
    ```

## Step 10: Function type
- In `src/09-function.ts` - there are 2 syntaxes for declaring a function's type
- __Syntax 1__: Type Syntax for a function when defining, i.e. creating it (function can be defined using any valid JS syntax - function declaration, as expression including arrow function). The return type is inferred in this case.
```ts
// The return value type is inferred
function add(x: number | string, y: number | string) /*: number*/ {
    let numX, numY;

    if (typeof x === "string") {
        numX = +x;
    } else {
        numX = x;
    }

    if (typeof y === "string") {
        numY = +y;
    } else {
        numY = y;
    }

    return numX + numY;
}

const subtract = ( x : number, y : number ) /*: number*/ => x - y;

```
- __Syntax 2__: Type syntax for a function that can be applied either when defining it (using __expression syntax only__), or simply referring to the function (assigning the function another variable, like in the case of callback function etc.). The return type is explicitly provided in this case.
```ts
type BinaryFunction = (a: number, b: number) => number;
const subtract: BinaryFunction = (x, y) => x - y;
const multiply: BinaryFunction = (x, y) => x * y;

// when we have higher order functions, expression syntax (syntax 2) is useful
function ajax(url: string, callback: (response: string) => void) {
    // do something
}

ajax("https://api.example.com", (response) => {
    console.log(response);
    // return "ok";
});
```
- __TAKEAWAYS__
    - Functions can be typed using 2 syntaxes
        - Syntax 1 can be used with any way of defining functions in JS. but it is not reusable, nor can it be used to type function references.
        - Syntax 2 can be used only with function expression syntax of defining functions. It is reusable for functions with similar signatures, and can be used to typing function references.
    - __Self exploration__: Apart from this functions can be typed using an interface, and can also have overloads. Explore it.

## Step 11: Interface for object type and enforcing a contract in a class
- Interfaces as a concept exist in TS, and not in JS. They do no emit any code (no equivalent JS is generated).
- Interfaces can be used to type objects (instead of type literals), and used to enforce contracts (ensure a public methods and properties for a class).
- In `src/10-interface.ts`
- Interface for typing objects
```ts
interface IPerson {
    name: string;
    age: number;
    spouse?: string;
    celebrateBirthday: (inc: number) => void;
}

// #1: to give the data type for an object
const john: IPerson = {
    name: "John Doe",
    age: 32,
    spouse: "Jane Doe", // even if we remove this, it's ok
    celebrateBirthday: function (inc: number) {
        this.age += inc;
        // return this.age; // is ok
    },
};
```
- __NOTE__: Even type aliases can define methods using similar syntax.
- Interface for "enforcing contracts", i.e. a public facing API in a class
```ts
// fields must be initialized when defining them, or provided values in the constructor
class Person implements IPerson {
    name: string;
    age: number;
    spouse?: string = "";

    constructor(name: string, age: number, spouse?: string) {
        this.name = name;
        this.age = age;
        this.spouse = spouse;
    }

    celebrateBirthday(inc: number) {
        this.age += inc;
    }
}

const jane: Person = new Person("Jane Doe", 32, "John Doe");

export {
    IPerson as default, // main export (only 1 per file)
    Person, // named export
};
```
- __TAKEAWAYS__
    - Interface can be used to type objects, and also enforce a public facing API for classes
    - They support optional and readonly property/method.
    - Interface can define property and method types
    - You can use type and interface interchangeably to define an object's type. However interfaces help define hierachies of types (by interface extension), and also support __declaration merging__.
    - __Self-exploration__: Interfaces support __declaration merging__ - this helps us add to the properties and methods of an existing interface, and is mostly helpful when working with interfaces define in libraries, and which we want to customize.
    - By convention we name the interface starting with the letter `I`.

## Step 12: Interface extension
- A new interface can be created by extending an existing interface
- In `src/11-interface-inheritance.ts`
```ts
// default export outside braces, default export can be imported using any name
// named export inside braces
import IHuman, { Person as Human } from "./09-interface";

interface IEmployee extends IHuman {
    role: string;
    department: string;

    promote: (newRole: string) => void;
}

const john: IEmployee = {
    // IHuman properties
    name: "John",
    age: 30,
    spouse: "Jane Doe",

    // IEmployee properties
    role: "Software Engineer",
    department: "Engineering",

    // methods
    // IHuman-specific
    celebrateBirthday: function () {
        this.age++;
    },

    // IEmpoyee-specific
    promote: function (newRole: string) {
        this.role = newRole;
    },
};

export {};
```
- __TAKEAWAYS__
    - The new interface adds new properties and methods to the existing (base) interface
    - Objects typed using the new interface must thus have properties and methods from both interfaces

## Step 13: Class
- In `src/12-class.ts`
```ts
import IPerson from "./09-interface";

// by default access modifier is public
// private, protected, public (default) - 3 access modifiers in TS
class Person implements IPerson {
    // defining data member explicitly is not required in TS
    // name: string;
    // age: number;
    // spouse?: string = "";
    // private children: string[] = [];

    // define and initialize data members in the constructor
    constructor(
        public readonly name: string,
        public age: number,
        private children: string[] = [],
        public spouse?: string
    ) {
        // you don't have to assign the data member
        // this.name = name;
        // this.age = age;
        // this.spouse = spouse;
    }

    celebrateBirthday(inc: number) {
        this.age += inc;
    }

    addChildren(child: string) {
        this.children.push(child);
    }
}

class Employee extends Person {
    employeeId: number;

    constructor(
        name: string,
        age: number,
        children: string[] = [],
        employeeId: number,
        spouse?: string
    ) {
        super(name, age, children, spouse);

        this.employeeId = employeeId;
    }
}

// const john: Person = new Person("John Doe", 32, [ "Janette Doe"], "Jane Doe");
const john: Person = new Person("John Doe", 32, undefined, "Jane Doe");
// john.children.push("Jim Doe");
john.addChildren("Jim Doe");

// john.name = "Jonathan Doe"; // error: cannot assign to 'name' because it is a read-only property

export {};
```
- __TAKEAWAYS__
    - by default access modifier for property/method is public
    - access modifier can be public, protected or private (with usual OOPS connotation)
    - defining data member explicitly is not required in TS (actually this comes from JS)
    - properties can be readonly, optional
    - properties must be initialized at the time of declaration, or inside the constructor
    - access modifier can be given along with the constructor argument - this way we can omit the property declaration and assignment inside the constructor
    - `super(...)` is used to call the base class constructor within the derived class, and `super.method(...)` is used to call a base class method within derived class method (actually this comes from JS)

## Step 14: Motivation for Generics
- In `src/13-generics-motivation.ts`
```ts
interface DetailedPrice {
    base: number;
    gst: number;
}

interface DetailedName {
    manufacturer: string;
    model: string;
}

interface IProduct {
    name: string;
    price: number;
}

interface IProductDetailedName {
    name: DetailedName;
    price: number;
}

interface IProductDetailedPrice {
    name: string;
    price: DetailedPrice;
}

interface IProductDetailedNameDetailedPrice {
    name: DetailedName;
    price: DetailedPrice;
}

const pen: IProduct = {
    name: "Pen",
    price: 50,
};

const pencil: IProductDetailedName = {
    name: {
        manufacturer: "Faber Castell",
        model: "HB",
    },
    price: 10,
};

export {};
```

## Step 15: Defining Products types using Generics (Generic type)
- In `src/14-generic-type.ts`
```ts
interface DetailedPrice {
    base: number;
    gst: number;
}

interface DetailedName {
    manufacturer: string;
    model: string;
}

// NameType, PriceType are placeholders for actual data types - they are called generic type parameters
// Generic interfaces are not concrete interfaces, they are templates for concrete interfaces
// NameType = string, PriceType = number are default values for generic type parameters
interface IProduct<NameType = string, PriceType = number> {
    name: NameType;
    price: PriceType;
}

// interface IProduct {
//     name: string;
//     price: number;
// }

// interface IProductDetailedName {
//     name: DetailedName;
//     price: number;
// }

// interface IProductDetailedPrice {
//     name: string;
//     price: DetailedPrice;
// }

// interface IProductDetailedNameDetailedPrice {
//     name: DetailedName;
//     price: DetailedPrice;
// }

// const pen: IProduct<string, number> = {
const pen: IProduct = {
    name: "Pen",
    price: 50,
};

const pencil: IProduct<DetailedName, number> = {
    name: {
        manufacturer: "Faber Castell",
        model: "HB",
    },
    price: 10,
};

const appleIPhone15: IProduct<DetailedName, DetailedPrice> = {
    name: {
        manufacturer: "Apple",
        model: "iPhone 15",
    },
    price: {
        base: 60000,
        gst: 15000,
    },
};

export {};
```

## Step 16: Generic function
- In `15-generic-function.ts`
```ts
type MapCallback<T, U> = (item: T) => U;

// function add<T>() {

// }

const map = <T, U>(arr: T[], callback: MapCallback<T, U>) => {
    const result: U[] = [];

    for (let i = 0; i < arr.length; ++i) {
        const square = callback(arr[i]);
        result.push(square);
    }

    return result;
};

let arr = [1, 2, 3, 4, 5, 6];

const squaresArr = map(arr, (num) => num * num);

console.log(squaresArr);

const months = ["January", "February", "March", "April", "May", "June"];

// -> [7, 8, 5, 5, 3, 4]
const monthLengths = map(months, (m) => m.length);
console.log(monthLengths);
```

## Step 17: Type Narrowing
Type narrowing in TypeScript refers to refining a **wider type** (like `string | number`) to a **more specific one** within a specific block of code using type guards — like `typeof`, `in`, or `instanceof`.

### Why do we need type narrowing?
Because TypeScript needs to **know exactly what type you're working with** to allow access to properties or methods that are specific to that type.

---

### Example: Type Narrowing with `typeof`

```ts
function printLengthOrFixed(value: string | number) {
  if (typeof value === 'string') {
    // Here, TypeScript knows 'value' is a strin
    console.log(`String length: ${value.length}`);
  } else {
    // Here, TypeScript knows 'value' is a number
    console.log(`Fixed number: ${value.toFixed(2)}`);g
  }
}
```

#### Breakdown:
- `value` starts as `string | number`.
- Inside the `if` block, `typeof value === 'string'` narrows the type to `string`.
- In the `else`, it's implicitly narrowed to `number`.

---

### More Narrowing Techniques
1. `in` keyword — good for checking property presence.
2. `instanceof` — for class-based narrowing.
3. Custom type guards.

---

### Bonus: Custom Type Guard

```ts
type Dog = { kind: 'dog'; bark: () => void };
type Cat = { kind: 'cat'; meow: () => void };
type Animal = Dog | Cat;

function isDog(animal: Animal): animal is Dog {
  return animal.kind === 'dog';
}

function speak(animal: Animal) {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows this is a Dog now
  } else {
    animal.meow(); // So this must be a Cat
  }
}
```
- When the function `isDog` returns `true`, TypeScript narrows the type of `animal` to `Dog`

---

## Step 18: Discriminated union

```ts
type Dog = { kind: 'dog'; bark: () => void };
type Cat = { kind: 'cat'; meow: () => void };
type Animal = Dog | Cat;
```

- `Animal` is a discrimintaed union (also called a **tagged union**)
    - You have a **union type**: `Animal = Dog | Cat`.
    - Both types (`Dog` and `Cat`) share a **common discriminant property**: `kind`.
    - The `kind` property has a **unique literal value** in each type (`'dog'` or `'cat'`).

---

### How TypeScript uses it

TypeScript can now **automatically narrow** the union based on the `kind` field, without needing a custom type guard:

```ts
function speak(animal: Animal) {
  if (animal.kind === 'dog') {
    animal.bark(); // inferred as Dog
  } else {
    animal.meow(); // inferred as Cat
  }
}
```

TypeScript looks at `animal.kind` and uses it to figure out which branch of the union you're in.

---

### So... do we need `isDog()` then?

Not strictly! In this case, **no** — because TypeScript can already narrow based on the `kind` field.

BUT… a custom guard like `isDog()` can still be useful if:
- You want to **encapsulate** the logic (especially if it gets complex).
- You want to **reuse** the check across multiple places.
- You are working with more complex unions or partial objects where `kind` isn't guaranteed to exist.

### Step 19: Utility types

### Base Interface

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}
```

---

### `Omit<T, K>` – remove keys

```ts
type UserWithoutEmail = Omit<User, 'email'>;

// Result:
// {
//   id: number;
//   name: string;
// }
```

---

### `Partial<T>` – make all keys optional

```ts
type PartialUser = Partial<User>;

// Result:
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }
```

---

### `Pick<T, K>` – choose specific keys

```ts
type UserContact = Pick<User, 'name' | 'email'>;

// Result:
// {
//   name: string;
//   email?: string;
// }
```

---

### `Required<T>` – make all optional keys required

```ts
type CompleteUser = Required<User>;

// Result:
// {
//   id: number;
//   name: string;
//   email: string; // now required!
// }
```

---

### Composing utility types
__Example__: Partial<Pick<T, K>> – make only some fields optional

```ts
type OptionalNameAndEmail = Partial<Pick<User, 'name' | 'email'>>;

// Result:
// {
//   name?: string;
//   email?: string;
// }
```


### `Record<K, T>` – build an object with specific keys and value types

```ts
type Role = 'admin' | 'guest';

type RolePermissions = Record<Role, boolean>;

// Result:
// {
//   admin: boolean;
//   guest: boolean;
// }
```

---

## Step 20: Mapped Types

The `Record` from the previous step is an example of a built-in __Mapped type__. So are __Partial__, __Required__ etc.

```ts
type Domain = 'www.google.com' | 'www.medium.com' | 'www.facebook.com';
    
// Step 1: Define a generic mapped type, called MyRecord, that accepts the types for keys and values as parameters - make sure to restrict the key type using "keyof any".
// type Key = keyof any; <=> type Key = string | number | symbol; (i.e. Any valid JavaScript object key type)
// Note: All values of this generic type will be of a single type (which is passed as a parameter)
// We have implemented the built in "Record" type
type MyRecord<T extends keyof any, U> = {
    [key in T]: U
}

// Step 2: Define DNSEntries using MyRecord, and create dnsEntries object
let dnsEntries : MyRecord<Domain, string> = {
    'www.google.com': '123.456.789.012',
    'www.facebook.com': '234.456',
    'www.medium.com': '345'
};
```

### A powerful example
- Base Interface

```ts
interface User {
  id: number;
  name: string;
  email: string;
}
```

---

#### Mapped Type: Getters and Setters

```ts
type Accessors<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};
```

#### Example Usage

```ts
type UserAccessors = Accessors<User>;

/* Resulting type:

type UserAccessors = {
  getId: () => number;
  getName: () => string;
  getEmail: () => string;
  setId: (value: number) => void;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
}
*/
```

## Step 21: Conditional Types

— Pick type based on a condition

```ts
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

---

### Realistic Example: Extract only function properties

- It extracts the keys of a type where the value is a function
```ts
type OnlyFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
```

```ts
interface Mixed {
  id: number;
  name: string;
  greet(): void;
  update(data: string): boolean;
}

type FunctionKeys = OnlyFunctions<Mixed>; 
// 'greet' | 'update'
```

### Use `Pick` with it:

```ts
type FunctionOnlyProps = Pick<Mixed, OnlyFunctions<Mixed>>;

// Result:
{
  greet(): void;
  update(data: string): boolean;
}
```

---
