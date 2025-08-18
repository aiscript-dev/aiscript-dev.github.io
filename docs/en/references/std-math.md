# Math
Standard constants and functions related to mathematics and numerical computation are assigned the namespace of `Math:`.

## Constants
The type is all `num`.

| Name | Description | Rough Value |
| --- | --- | --- |
| `Math:Infinity` | Positive infinity | N/A |
| `Math:E` | Napier number $e$ | `2.718281828459045` |
| `Math:LN2` | Natural logarithm of 2 | `0.6931471805599453` |
| `Math:LN10` | Natural logarithm of 10 | `2.302585092994046` |
| `Math:LOG2E` | Logarithm of $e$ with base 2 | `1.4426950408889634` |
| `Math:LOG10E` | Logarithm of $e$ with base 10 | `0.4342944819032518` |
| `Math:PI` | Pi $\pi$ | `3.141592653589793` |
| `Math:SQRT1_2` | $\sqrt{ 1 \over 2 }$ | `0.7071067811865476` |
| `Math:SQRT2` | $\sqrt{2}$ | `1.4142135623730951` |

## Basic Functions
### @Math:abs(_x_: num): num
Calculate absolute value. $|x|$

### @Math:sign(_x_: num): num
Returns 1 if $x$ is positive, -1 if it is negative, and the same value if it is 0 or -0.  
Returns NaN if $x$ is neither.

### @Math:round(_x_: num): num
Returns the nearest integer, rounded to the nearest whole number.

### @Math:ceil(_x_: num): num
Returns the smallest integer greater than or equal to the argument.

### @Math:floor(_x_: num): num
Returns the largest integer less than or equal to the argument.

### @Math:trunc(_x_: num): num
Truncates the decimal portion of the argument and returns the integer portion. $[x]$
### @Math:min(_a_: num, _b_: num): num
Returns the smaller value.  

### @Math:max(_a_: num, _b_: num): num
Returns the larger value.  

### @Math:sqrt(_x_: num): num
Computes the positive square root. $\sqrt{x}$

### @Math:cbrt(_x_: num): num
Calculate the cubic root. $\sqrt[3]{x}$

### @Math:hypot(_vs_: arr): num
Returns the positive square root of the sum of the elements of _vs_ after squaring each of them. $\sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}$

## Trigonometric Functions
Hereafter, all angles are in radians.

### @Math:sin(_rad_: num): num
Returns sine.

### @Math:cos(_rad_: num): num
Returns cosine.

### @Math:tan(_rad_: num): num
Returns tangent.

### @Math:asin(_x_: num): num
Returns arcsine.

### @Math:acos(_x_: num): num
Returns arccosine.

### @Math:atan(_x_: num): num
Returns arctangent.

### @Math:atan2(_y_: num, _x_: num): num
Returns the tangent of $y \over x$, but if $x$ is negative, returns a value off by $\pi$.

## Hyperbolic Functions
### @Math:sinh(_x_: num): num
Returns hyperbolic sine.

### @Math:cosh(_x_: num): num
Returns hyperbolic cosine.

### @Math:tanh(_x_: num): num
Returns hyperbolic tangent.

### @Math:asinh(_x_: num): num
Returns hyperbolic arcsine.

### @Math:acosh(_x_: num): num
Returns hyperbolic arccosine.

### @Math:atanh(_x_: num): num
Returns hyperbolic arctangent.

## Exponential / Logarithmic Functions
### @Math:pow(_x_: num, _y_: num): num
Returns the _y_ power of _x_. Almost identical to `Core:pow` except that it internally uses the `Math.pow` function instead of Javascript's `**` operator.

### @Math:exp(_x_: num): num
Returns the _x_ power of $e$.  

### @Math:expm1(_x_: num): num
Returns the _x_ power of $e$ minus 1.

### @Math:log(_x_: num): num
Returns the natural logarithm. **Use `Math:log10` for the ordinary logarithm.**

### @Math:log1p(_x_: num): num
Returns the natural logarithm of _x_ + 1.

### @Math:log10(_x_: num): num
Returns the logarithm with 10 as the base (ordinary logarithm).

### @Math:log2(_x_: num): num
Returns the logarithm with 2 as the base.

## Random Generators
### @Math:rnd(_min_?: num, _max_?: num): num
Generates random numbers.  
If _min_ and _max_ are passed, integers with _min_ <= x and x <= _max_ are returned, otherwise decimals with 0 <= x and x < 1 are returned.  

### @Math:gen_rng(_seed_: num | str, _options_?: obj): @(_min_?: num, _max_?: num)
Generates a random number generator from the seed.  
The generated random number generator returns an integer with _min_ <= x, x <= _max_ if _min_ and _max_ are passed,  
If not passed, it returns a floating point number with 0 <= x, x < 1.  
You can specify the internal behavior through the object passed to _options_.  
The change in behavior by specifying `options.algorithm` is shown below:

| `options.algorithm` | Internal randomize algorhythm | Range-specified integer generation algorithm |
|--|--|--|
| `rc4` | RC4 | Rejection Sampling |
| `rc4_legacy` | RC4 | Range limitation by floating-point arithmetic (pre-0.19.0 algorithm) |
| Not specified, or `chacha20` | ChaCha20 | Rejection Sampling |

**Note:** In JavaScript environments where [`crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto)[`.subtle`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle) is not available—such as in non-[secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)—only `rc4_legacy` can be used, and the default will also be changed to `rc4_legacy`.


```aiscript playground
let rng = Math:gen_rng('AICHAN')

// Seed value is fixed, so under the same conditions,
// the same generation pattern will be generated each time.
<: rng(0, 10)
<: rng(0, 10)
<: rng(0, 10)
```

:::warning
Range-specified integer generation algorithms with floating-point arithmetic, such as `rc4_legacy`, may generate values larger than the specified _max_ value due to rounding errors during arithmetic.
:::

## Misc.
### @Math:clz32(_x_: num): num
Returns the number of leading zeros when x is represented in 32-bit binary.

### @Math:fround(_x_: num): num
Returns the value when _x_ is converted to a 32-bit floating-point number.

### @Math:imul(_x_: num, _y_: num): num
Returns the result of a C-like 32-bit multiplication of _x_ and _y_.
