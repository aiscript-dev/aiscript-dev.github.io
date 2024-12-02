# Built-in Properties

Built-in properties are special values or functions provided for each type.  
They can be accessed using the `.<name>` notation, similar to object properties. (`[<str>]` notation cannot be used.)  
```aiscript
// Example
'ai kawaii'.len // 9

Core:range(0,2).push(4) // [0,1,2,4]
```
Currently, built-in properties are available for numbers, strings, arrays, and error types. For objects, their equivalents are implemented as [standard functions](std.md#-obj) for compatibility with the syntax.

## Format
In this document, built-in properties for any value of a specific type are described in the following format:
> #(_v_: type).property_name  

or  

> @(_v_: type).built_in_method_name(argument_list): return_type  

Entries starting with `#` represent non-function values of built-in properties.  
Entries starting with `@` represent function-based built-in properties (built-in methods).

## Numbers
### @(_x_: num).to_str(): str
Converts a number to a string.  
```aiscript playground
let x = 123
<: x.to_str()
```

### @(_x_: num).to_hex(): str
Generates a hexadecimal string representation of the number.  
```aiscript playground
let x = 123
<: x.to_hex()
```

## Strings
### #(_v_: str).len
Type: `num`  
Gets the length of the string.  
```aiscript playground
let x = "Hello World!"
<: x.len
```

### @(_v_: str).to_num(): num | null
Converts the string to a number if it represents a numeric value.  
```aiscript playground
let x = "123"
<: x.to_num()

let y = "abc"
<: y.to_num()
```

### @(_v_: str).to_arr(): arr&lt;str&gt;
Splits the string into an array of grapheme clusters.  
If the string contains no isolated surrogates, they are not returned.  

### @(_v_: str).to_unicode_arr(): arr&lt;str&gt;
Splits the string into an array of Unicode code points.  
Grapheme clusters are divided.  
If the string contains no isolated surrogates, they are not returned.  

### @(_v_: str).to_unicode_codepoint_arr(): arr&lt;num&gt;
Splits the string into Unicode code points and returns their numeric values as an array.  
If the string contains no isolated surrogates, they are not returned.  

### @(_v_: str).to_char_arr(): arr&lt;str&gt;
Splits the string into an array of UTF-16 code units.  
If the string contains surrogate pairs, both the high and low surrogates are returned separately.  

### @(_v_: str).to_charcode_arr(): arr&lt;num&gt;
Splits the string into UTF-16 code units and returns their numeric values as an array.  
If the string contains surrogate pairs, both the high and low surrogates are returned separately.  

### @(_v_: str).to_utf8_byte_arr(): arr&lt;num&gt;
Encodes the string into UTF-8 and returns an array of byte values (0–255).  

### @(_v_: str).pick(_i_: num): str | null
Retrieves the _i_-th character in the string.  
```aiscript playground
let x = "Hello World!"

<: x.pick(6)
```

### @(_v_: str).incl(_keyword_: str): bool
Returns `true` if the string contains _keyword_; otherwise, returns `false`.  
```aiscript playground
let x = "Hello World!"
<: x.incl("World")

let y = "こんにちは！"
<: y.incl("Hello")
```

### @(_v_: str).starts_with(_prefix_: str, _start_index_?: num): bool
Returns `true` if the string starts with _prefix_; otherwise, returns `false`.  
If _prefix_ is an empty string, always returns `true`.  
If _start_index_ is specified, starts checking from that index. If _start_index_ exceeds the bounds of the string, returns `false`.  
```aiscript playground
let x = "Hello World!"

<: x.starts_with("Hello")
<: x.starts_with("World", 6)
```

### @(_v_: str).ends_with(_suffix_: str, _end_index_?: num): bool
Returns `true` if the string ends with _suffix_; otherwise, returns `false`.  
If _suffix_ is an empty string, always returns `true`.  
If _end_index_ is specified, considers the character just before _end_index_ as the end of the string.  
```aiscript playground
let x = "Hello World!"

<: x.ends_with("World!")
<: x.ends_with("Hello", 5)
```

### @(_v_: str).slice(_begin_: num, _end_: num): str
Extracts a portion of the string from _begin_ to _end_ (exclusive).  
```aiscript playground
let x = "Hello World!"

<: x.slice(6, 11)
```

### @(_v_: str).split(_splitter_?: str): arr&lt;str&gt;
Splits the string into an array based on the delimiter _splitter_. If _splitter_ is omitted, splits the string into individual characters.  
```aiscript playground
let x = "Hey, how are you?"

<: x.split()
<: x.split(",")
```  

Here is the English translation of the provided document while preserving the original formatting:

---

## Arrays

### #(_v_: arr).len  
Type: `num`  
Gets the number of elements in the array.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.len
```

### @(_v_: arr&lt;T&gt;).at(_index_: num, _otherwise_?: T): T | null
Returns the element at the position _index_ in the array.\
If _index_ is negative, it counts from the end.\
If _index_ is out of range, it returns _otherwise_ instead.\
If _otherwise_ is omitted, it defaults to `null`.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.at(2)
<: x.at(-1)
<: x.at(5)
<: x.at(5, "Not Found")
```

### @(_v_: arr&lt;T&gt;).push(_i_: T): null  
**【This operation mutates the array】**  
Adds an element to the end of the array.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

x.push(8)
<: x
```

### @(_v_: arr&lt;T&gt;).unshift(i: T): null  
**【This operation mutates the array】**  
Adds an element to the beginning of the array.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

x.unshift(7)
<: x
```

### @(_v_: arr&lt;T&gt;).pop(): T | null
**【This operation mutates the array】**  
Removes and returns the last element of the array.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

let popped = x.pop()
<: popped
<: x
```

### @(_v_: arr&lt;T&gt;).shift(): T | null
**【This operation mutates the array】**  
Removes and returns the first element of the array.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

let shifted = x.shift()
<: shifted
<: x
```

### @(_a_: arr&lt;T&gt;).concat(_b_: arr&lt;T&gt;): arr&lt;T&gt;
Concatenates two arrays.  

```aiscript playground
let x = [1, 2, 3]
let y = [4, 5, 6]

<: x.concat(y)

// The original arrays remain unchanged
<: x
<: y
```

### @(_v_: arr&lt;str&gt;).join(_joiner_?: str): str  
Joins the elements of a string array into a single string.  

```aiscript playground
let x = ["Hello", "World", "!"]

<: x.join(" ")

// If the argument is omitted, elements are joined directly
<: x.join()
```

### @(_v_: arr&lt;T&gt;).slice(_begin_: num, _end_: num): arr&lt;T&gt;
Extracts a section of the array from _begin_ to _end_.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.slice(1, 4)
```

### @(_v_: arr&lt;T&gt;).incl(_i_: T): bool  
Returns whether the specified value is present in the array.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.incl(3)
<: x.incl(6)
```

### @(_v_: arr&lt;U&gt;).map(_func_: @(T, num) =&gt; U): arr&lt;U&gt;
Asynchronously calls _func_ on each element of the array.\
Returns a new array with elements replaced by the results of _func_.  

```aiscript playground
let x = ['Tanaka', 'Suzuki', 'Yamamoto']

<: x.map(@(v) {
    return `{v}-san`
})
```

### @(_v_: arr&lt;T&gt;).filter(_func_: @(T, num) =&gt; bool): arr&lt;T&gt;
Extracts elements from the array where _func_ returns true.\
The order is preserved.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.filter(@(v) {
    // Extract even numbers
    return v % 2 == 0
})
```

### @(_v_: arr&lt;T&gt;).reduce&lt;U&gt;(_func_: Callback, _initial_: U): U
`Callback`: @(_acm_: U, _item_: T, _index_: num): U  
Calls _func_ for each element of the array in turn.  
In each call, the previous result is passed as the first argument _acm_.  
If _initial_ is specified, the argument of the first call is (_initial_, _v_\[0], 0),  
If _initial_ is not specified, then (_v_\[0], _v_\[1], 1).  
If the array is empty and _initial_ is not specified, an error occurs. Therefore, it is basically recommended that _initial_ be specified.

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.reduce(@(acm, v) {
    // Get sum
    return acm + v
}, 0)
```

### @(_v_: arr&lt;T&gt;).find(_func_: @(_item_: T, _index_: num) =&gt; bool ): T | null
Find the first element in the array such that _func_ returns true and returns their values.

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.find(@(v) {
    // 3より大きい最初の要素を探す
    return v > 3
})
```

### @(_v_: arr&lt;T&gt;).index_of(_val_: T, _fromIndex_?: num): num
Searches the array for a value equal to _val_ and returns its index.  
If _fromIndex_ is specified, the search starts at that position.  
If _fromIndex_ is negative, the position from the end (array length + _fromIndex_) is used.  
If there is no match, -1 is returned.

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.index_of(3)
```

### @(_v_: arr).reverse(): null
**【This operation mutates the array】**  
Reverses the array.

```aiscript playground
let x = [1, 2, 3, 4, 5]

x.reverse()

<: x
```

### @(_v_: arr&lt;T&gt;).copy(): arr&lt;T&gt;
Generates a copy of the array.  
It is a shallow copy, and array and object references are preserved.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

let xCopy = x.copy()

// Rewriting an array operation...
xCopy.push(6)

// ...does not affect the original array
<: x
<: xCopy
```

### @(_v_: arr&lt;T&gt;).sort(_comp_: @(_a_: T, _b_: T) => num): arr&lt;T&gt;
**【This operation mutates the array】**  
Sort an array. Pass the following comparison function as the first argument _comp_.  
This operation is stable sort.
* returns a negative value if _a_ is before _b_ in order
* returns a positive value if _a_ is later than _b_ in order
* returns 0 when _a_ is orderly equivalent to _b_ * returns positive when _a_ is orderly later than _b_ * returns zero when _a_ is orderly equal to _b_

For numeric sorting, you can pass `Core:sub` for ascending order, or `@(a,b){b-a}` for descending order.  
Comparison functions for strings are provided as `Str:lt` (ascending order) and `Str:gt` (descending order). See [std.md](std.md#-str) for details.  

```aiscript playground
let x = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

x.sort(Core:sub)

/*
Alternatively...

x.sort(@(a, b) {
    return a - b
})
*/

<: x
```

### @(_v_: arr&lt;T&gt;).fill(_val_?: T, _fromIndex_?: num, _toIndex_?: num): arr&lt;T&gt;
**【This operation mutates the array】**  
Replaces elements in the range _fromIndex_ to _toIndex_ of the array with _val_.  
If _val_ is omitted, it is replaced with `null`.  
The behavior regarding _fromIndex_ and _toIndex_ conforms to `arr.slice`.  

```aiscript playground
let x = [1, 2, 3, 4, 5]

// Fill the 1st through the 4th with 0.
x.fill(0, 1, 4)

<: x
```

### @(_v_: arr&lt;T&gt;).repeat(_times_: num): arr&lt;T&gt;
Creates an array repeated _times_ times.  
Like `arr.copy`, it is a shallow copy, and array and object references are preserved.  
_times_ must be an integer value greater than or equal to 0. Otherwise, throws error.

```aiscript playground
let x = [1, 2, 3]

<: x.repeat(3)
```

### @(_v_: arr&lt;T&gt;).splice(_index_: num, _remove_count_?: num, _items_?: arr&lt;T&gt;): arr&lt;T&gt;
**【This operation mutates the array】**  
Removes _remove_count_ elements from the _index_ array and inserts _items_ elements in their place.  
Returns an array of the elements removed as the return value.
If _index_ is negative, count from the end.  
If _index_ is after the last element, no element is removed and the insertion is appended to the end.  
If _remove_count_ is omitted, removes up to the end.  
If _items_ is omitted, nothing is inserted.

```aiscript playground
let x = [1, 2, 3, 4, 5]

// Remove two from the second and insert [6, 7, 8] in its place
let spliced = x.splice(2, 2, [6, 7, 8])

<: spliced // Array of what was removed
<: x // Array after being removed and inserted
```

### @(_v_: arr).flat(_depth_?: num): arr
Creates a new array that combines the arrays contained in the array to the depth hierarchy specified by _depth_.  
The _depth_ must be an integer value greater than or equal to 0. If omitted, it is set to 1.  

```aiscript playground
let x = [1, [2, 3], [4, [5, 6]]]

<: x.flat()
<: x.flat(2)
```

### @(_v_: arr&lt;T&gt;).flat_map&lt;U&gt;(_func_: @(_item_: T, _index_: num) =&gt; arr&lt;U&gt; | U ): arr&lt;U&gt;
After replacing each element of the array with the return value of _func_, a new array is created, flattened by one level.  
_func_ is called asynchronously.

```aiscript playground
let x = [1, 2, 3]

<: x.flat_map(@(v) {
    return [v, v * 2]
})
```

### @(_v_: arr&lt;T&gt;).insert(_index_: num, _item_: T): null
**【This operation mutates the array】**  
Inserts _item_ at the _index_ position in the array.  
If _index_ is negative, count from the end.  
If _index_ is after the last element, appends it to the end.

```aiscript playground
let x = [1, 2, 3, 4, 5]

// Insert 6 in the third
x.insert(2, 6)

<: x
```

### @(_v_: arr&lt;T&gt;).remove(_index_: num): T | null
**【This operation mutates the array】**  
Removes the element at position _index_ from the array and returns that element.  
If _index_ is negative, count from the end.  
If _index_ is after the last element, it is not removed and `null` is returned.

```aiscript playground
let x = [1, 2, 6, 3, 4, 5]

// Remove the third element
let removed = x.remove(2)

<: removed
<: x
```

### @(_v_: arr&lt;T&gt;).every(_func_: @(_item_: T, _index_: num) =&gt; bool ): bool
Returns true only if _func_ returns true for all elements of the array. Always returns true for an empty array.

```aiscript playground
let x = [2, 4, 6, 8, 10]
let y = [2, 4, 6, 7, 8]

@judgeAllEven(arr) {
    if (arr.every(@(v) { return v % 2 == 0 })) {
        return "All array elements are even"
    } else {
        return "Some elements are odd"
    }
}

<: judgeAllEven(x)
<: judgeAllEven(y)
```

### @(_v_: arr&lt;T&gt;).some(_func_: @(_item_: T, _index_: num) =&gt; bool): bool
Returns true only when there is an element for which _func_ returns true for an array element.

```aiscript playground
let x = [2, 4, 6, 7, 8]

@judgeHasOdd(arr) {
    if (arr.some(@(v) { return v % 2 == 1 })) {
        return "Array contains odd numbers"
    } else {
        return "All elements of the array are even numbers"
    }
}

<: judgeHasOdd(x)
```

## Error
### #(_v_: error).name
Type: `str`.  
Get the string that is the identifier of the error.

### #(_v_: error).info
Type: `value`.  
Get additional information about the error, if any.
