# Get Started

## What is AiScript?

**AiScript** is a programming language that runs on JavaScript. It allows you to extend function implementations on the host side and safely execute user-created scripts in a sandboxed environment.

This document assumes a certain level of programming knowledge. Therefore, it focuses on AiScript's syntax and specifications without explaining general programming concepts.

Reference: [Syntax Reference](../references/syntax.md)

## Hello, World!

In AiScript, you write a "Hello, World!" program as follows:

```aiscript playground=true
print("Hello, world!")
```

`print(~)` is a function call. You write the function name before the parentheses and the arguments inside the parentheses. If there are multiple arguments, separate them with commas. Details about functions will be explained later.

`"~"` is a string literal. Anything enclosed in double quotes is treated as a string.

Additionally, `print(~)` has a shorthand notation, which can be written as:

```aiscript playground
<: "Hello, world!"
```

## Comments

Comments in AiScript start with `//`. They do not affect the program's behavior.

```aiscript
// this is a comment
```

For multi-line comments, enclose them with `/*` and `*/`:

```aiscript
/*
this is a multi-line comment
*/
```

## Built-in Types

| Name        | Type Name | Example Literal                |
|-------------|-----------|--------------------------------|
| String      | `str`     | `"kawaii"`                     |
| Number      | `num`     | `42`                           |
| Boolean     | `bool`    | `true` / `false`               |
| Array       | `arr`     | `["ai", "chan", "cute"]`         |
| Object      | `obj`     | `{ foo: "bar", a: 42 }`       |
| Null        | `null`    | `null`                         |
| Function    | `fn`      | `@(x) { x }`                   |
| Error       | `error`   | *(TODO)*                       |

## Variables

### Declaration

You declare variables as follows:

```aiscript
let message = "Hello"
```

Write `let`, followed by the variable name, then `=`, and the value.

Variables declared this way in AiScript are immutable. You cannot change their values later. If you need a mutable variable, use `var` instead of `let`:

```aiscript
// Declare a mutable variable
var message = "Hello"

// Reassign a value
message = "Hi"

// Reassign again
message = "Yo"
```

Redeclaring variables in the same scope is not allowed.

### Accessing Variables

To access the value of a variable, simply write its name:

```aiscript
print(message)
```

## Arrays

Declare arrays by listing expressions within `[]`, separated by `,`:

```aiscript
["ai", "chan", "kawaii"]
```

Access array elements using `[<index>]`. The index starts from 0:

```aiscript playground
let arr = ["ai", "chan", "kawaii"]
<: arr[0] // "ai"
<: arr[2] // "kawaii"
```

## Objects

Objects in AiScript are similar to associative arrays with string-only keys. Each element consists of a key and a value, called a **property**. 

Write properties within `{}`, separated by `,` or newlines. Use `:` to separate keys and values:

```aiscript
{
	foo: "bar"
	answer: 42
	nested: {
		some: "thing"
	}
}
```

Access object properties using `.<name>` or `[<str>]`:

```aiscript playground
let obj = {foo: "bar", answer: 42}
<: obj.foo      // "bar"
<: obj["answer"] // 42
```

## Operations

Write operations like this:

```aiscript
(1 + 1)
```

This is a shorthand for a standard function call. It is equivalent to:

```aiscript
Core:add(1, 1)
```

For more details: [Syntax Reference](../references/syntax.md)

## Block Expressions

Use block expressions `eval { ~ }` to return the last expression's value within the block:

```aiscript playground
let foo = eval {
	let a = 1
	let b = 2
	(a + b)
}

<: foo // 3
```

## Conditional Statements

Write conditional statements like this:

```aiscript
if (a == b) {
	<: "a equals b"
}
```

Use `else` to define the action for unmatched conditions:

```aiscript
if (a == b) {
	<: "a equals b"
} else {
	<: "a does not equal b"
}
```

Chain multiple conditions using `elif` (or `else if`):

```aiscript
if (a == b) {
	<: "a equals b"
} elif (a > b) {
	<: "a is greater than b"
} else {
	<: "a is less than b"
}
```

## Loops

Write loops using `for`:

```aiscript
for (let i, 100) {
	<: i
}
```

You can omit the iterator variable:

```aiscript playground
for (20) {
	<: "yo"
}
```

For array iteration, use `each`:

```aiscript playground
let items = ["a", "b", "c"]
each (let item, items) {
	<: item
}
```

## Functions

### Defining Functions

Write function definitions as follows:

```aiscript
@fn(x) {
	(x * 2)
}
```

Use `@` followed by the function name, parentheses for arguments, and a block for the function body.

### Returning Values

The last expression in a function is its return value. To return early, use `return`.

### Standard Constants and Functions

These are constants and functions that are available without any prior declaration.

[List of Standard Constants and Functions](../references/std.md)

### Built-in Properties

Built-in properties are pseudo-properties that can be accessed using `.` even on non-object values.

[List of Built-in Properties](../references/builtin-props.md)

## Templates

Using backticks, you can embed variables or expressions within strings:

```aiscript playground
let ai = "kawaii"
<: `Hello, {ai} world!`
```

## Metadata

AiScript files support embedding metadata. You can include metadata at the top of your file like this:

```aiscript
### {
	name: "example"
	version: 42
	keywords: ["foo", "bar", "baz"]
}
```

## Error Type

Some standard functions return an error type when execution fails. This allows for error handling:

```aiscript
@validate(str){
	let v = Json:parse(str)
	if (Core:type(v) == 'error') print(v.name)
	else print('successful')
}
```

## Error Messages

If a critical error occurs, an error message is displayed:

```aiscript playground
let scores = [10, 8, 5, 5]
let 3rd = scores[2] // unexpected token: NumberLiteral (Line 2, Column 5)
```

```aiscript playground
let arr = []
arr[0] // Runtime: Index out of range. Index: 0 max: -1 (Line 2, Column 4)
```

Error messages specify the line (Line) and column (Column) where the error occurred, starting from 1.
