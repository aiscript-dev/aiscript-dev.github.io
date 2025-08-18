# Reserved Words

## What are Reserved Words?
A reserved word in AiScript is a word that is prohibited to be used as the name of a variable or function.  
Use of such words will result in a Syntax Error.  

```aiscript
// match and for are reserved

let match = null // Error

@for() {
    print('hoge')
} // Error
```
```aiscript
let obj = {
  default: true
} // Since 1.1.0: it works when used as a key in object literals

obj.default = false // Error (property access notation not supported yet)
obj["default"] = false // This works
```

## Words in Use and Words Planned for Use
The keywords `match` and `for` are already used as keywords in the grammar.  
If they are used as variable names, they not only make the program look confusing, but also increase the cost of grammar analysis.  
Hence, all keywords in the grammar are basically reserved words.  

On the other hand, some words are reserved words even though they do not exist in the grammar.  
This is in anticipation of their possible use in the future when the grammar is expanded.  

## List

The following words are registered as reserved words:

### In use
`null`, `true`, `false`, `each`, `for`, `loop`, `break`, `continue`, `match`, `case`, `default`, `if`, `elif`, `else`, `return`, `eval`, `var`, `let`, `exists`

### Reserved for future use
`as`, `async`, `attr`, `attribute`, `await`, `catch`, `class`, `component`, `constructor`, `dictionary`, `do`, `enum`, `export`, `finally`, `fn`, `hash`, `in`, `interface`, `out`, `private`, `public`, `ref`, `static`, `struct`, `table`, `this`, `throw`, `trait`, `try`, `undefined`, `use`, `using`, `when`, `while`, `yield`, `import`, `is`, `meta`, `module`, `namespace`, `new`
