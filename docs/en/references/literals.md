# Literals
Literals in AiScript are a notation for writing values as strings.  
Literals can be used as expressions in scripts.  
Literals exist for null, truth values, numbers, strings, objects, and functions.  

## null
```aiscript
null
```

## Boolean
```aiscript
true
false
```

## Number
Notations other than decimal are not supported.

```aiscript
12 // Integer
-34 // Negative
52.448 // Floats
```
**Note:** The `-` for negative numbers can only be used with numeric literals. Notations such as `-variable` are not supported.

## String
There are two types of literals: regular string literals that can use `'` or `"`, and template literals that can use `` ` `` and contain expressions in the statement.

### Escape syntax
Characters prefixed with ```` are interpreted as a single character, not as part of the syntax.

For example, `'\"‘` is `’`,  
``“\”`“`, for example ``'\”“`, ``”`“”`,  
```` ``` `` is ``` ``,  
`` `` `\{` `` is interpreted as `{`, and `` `` `` ``.  
If a character has no particular syntactic meaning, it is simply ignored as `\`. Example: `'\n'` → `n`.  
If you want to use the character `\`, join two of them together like `'\\'`.  
Escape sequences are not supported.  

### String literal
```aiscript
'ここでは"を文字列に含むことができます'
"ここでは'を文字列に含むことができます"
'エスケープすれば\'を含むことができます'
"エスケープすれば\"を含むことができます"
'改行
できます'
"改行 // ここにコメントを書くと文字列の一部になります
できます" // ここは問題なし
```

### Template literal
Literals for creating strings with embedded variables and expressions.  
The entire string is enclosed in `` ` `` and the place where the expression is embedded is enclosed in `{ }`.  
If the value of the expression is not a string, then [Core:to_str](. /std.md#core-to-str-v-value-str) and converted to a string in the same way.  
```aiscript
<: `Ai chan is No.{ 2-1 }` // Ai chan is No.1
// Line breaks are allowed. Use { Str:lf } for one line
`This statement is { true }.
Previous statement is { !true }.`
// You can escape `, {, and } by prepending \
`\` \{ \}` // ` { }
```
```aiscript
// The contents of { } must not be empty (if you want to use { } as a string, escape it)
`Everything is { } here.` // Syntax Error
// No line breaks before or after an expression (line breaks are allowed within an expression)
`Oops, something went {
	'wrong'
}!` // Syntax Error
```

## Array
```aiscript
[] // Empty array
[1, 1+1, 1+1+1] // It can be separated by a colon
[1, 1+1, 1+1+1,] // You can leave trailing colon
[  // Line breaks are allowed
	'hoge'
	'huga'
	'piyo'
]
[  // Colons and line breaks can be used at the same time
	'hoge',
	'huga',
	'piyo',
]
```
```aiscript
[1 2 3] // Blank delimiters have been obseleted
```

## Object
```aiscript
{} // Empty object
{ // Separated by line breaks
	a: 12
	b: 'hoge'
}
{a: 12,b: 'hoge'} // Separated by colon
```
```aiscript
// Blank delimiters have been obseleted
{a: 12 b: 'hoge'} // Syntax Error
// Semicolon delimiters have been obseleted
{a: 12; b: 'hoge'} // Syntax Error
```

## Function
Function literals are called “unnamed functions” and are similar in form to [function declaration](./syntax.md#functions), but without a function name. Since it is literal, it is an expression, not a statement.

```aiscript
var func = @(){} // Function that does nothing
// The last expression is implicitly returned
func = @(x, y) {
	x + y
}
<: func(1, 2) // 3
// You can also explicitly write return
@(x, y) {
	return x + y
}
// Line breaks at arguments are allowed
@(
	x,
	y
) {
	x + y
}
@(x,y){x+y} // One-line
```

## Error
There is no literal for the error type, but you can use [Error:create](./std.md) can be used to create values.
