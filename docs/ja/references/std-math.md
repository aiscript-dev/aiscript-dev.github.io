# Math
数学・数値計算関連の標準定数・関数には`Math:`の名前空間が付与されています。

## 定数
型は全て`num`です。

| 定数名 | 説明 | 概算値 |
| --- | --- | --- |
| `Math:Infinity` | 無限大 | なし |
| `Math:E` | ネイピア数 $e$ | `2.718281828459045` |
| `Math:LN2` | 2の自然対数 | `0.6931471805599453` |
| `Math:LN10` | 10の自然対数 | `2.302585092994046` |
| `Math:LOG2E` | 2を底とした $e$ の対数 | `1.4426950408889634` |
| `Math:LOG10E` | 10を底とした $e$ の対数 | `0.4342944819032518` |
| `Math:PI` | 円周率 $\pi$ | `3.141592653589793` |
| `Math:SQRT1_2` | $\sqrt{ 1 \over 2 }$ | `0.7071067811865476` |
| `Math:SQRT2` | $\sqrt{2}$ | `1.4142135623730951` |

## 基本的な関数
### @Math:abs(_x_: num): num
絶対値を計算します。 $|x|$

### @Math:sign(_x_: num): num
$x$ が正であれば1、負であれば-1、0または-0であればそのままの値を返します。  
いずれでもなければNaNを返します。  

### @Math:round(_x_: num): num
四捨五入して、もっとも近い整数を返します。

### @Math:ceil(_x_: num): num
引数以上の最小の整数を返します。

### @Math:floor(_x_: num): num
引数以下の最大の整数を返します。

### @Math:trunc(_x_: num): num
引数の小数部を切り捨て、整数部を返します。 $[x]$

### @Math:min(_a_: num, _b_: num): num
小さい方の値を取得します。  

### @Math:max(_a_: num, _b_: num): num
大きい方の値を取得します。

### @Math:sqrt(_x_: num): num
正の平方根を計算します。 $\sqrt{x}$

### @Math:cbrt(_x_: num): num
立方根を計算します。 $\sqrt[3]{x}$

### @Math:hypot(_vs_: arr): num
_vs_ の要素をそれぞれ自乗してから合計した値の正の平方根を返します。 $\sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}$

## 三角関数
角度の単位はラジアンです。
### @Math:sin(_rad_: num): num
正弦を計算します。

### @Math:cos(_rad_: num): num
余弦を計算します。

### @Math:tan(_rad_: num): num
正接を計算します。

### @Math:asin(_x_: num): num
逆正弦を計算します。

### @Math:acos(_x_: num): num
逆余弦を計算します。

### @Math:atan(_x_: num): num
逆正接を計算します。

### @Math:atan2(_y_: num, _x_: num): num
$y \over x$ の正接を返しますが、 $x$ が負値の場合は $\pi$ だけずれた値を返します。

## 双曲線関数
### @Math:sinh(_x_: num): num
双曲線正弦を計算します。

### @Math:cosh(_x_: num): num
双曲線余弦を計算します。

### @Math:tanh(_x_: num): num
双曲線正接を計算します。

### @Math:asinh(_x_: num): num
双曲線逆正弦を計算します。

### @Math:acosh(_x_: num): num
双曲線逆余弦を計算します。

### @Math:atanh(_x_: num): num
双曲線逆正接を計算します。

## 指数・対数関数
### @Math:pow(_x_: num, _y_: num): num
_x_ の _y_ 乗を計算します。内部的にJavascriptの`**`演算子ではなく`Math.pow`関数を用いている点を除き、ほぼ`Core:pow`と同じものです。

### @Math:exp(_x_: num): num
$e$ の _x_ 乗を計算します。  

### @Math:expm1(_x_: num): num
$e$ の _x_ 乗から1を引いた値を計算します。

### @Math:log(_x_: num): num
自然対数を計算します。**常用対数には`Math:log10`を使用して下さい。**  

### @Math:log1p(_x_: num): num
_x_ + 1の自然対数を計算します。

### @Math:log10(_x_: num): num
10を底とした対数を計算します。

### @Math:log2(_x_: num): num
2を底とした対数を計算します。

## 乱数
### @Math:rnd(_min_?: num, _max_?: num): num
乱数を生成します。  
_min_ および _max_ を渡した場合、_min_ <= x, x <= _max_ の整数、  
渡していない場合は 0 <= x, x < 1 の 小数が返されます。  

### @Math:gen_rng(_seed_: num | str, _options_?: obj): @(_min_?: num, _max_?: num)
シードから乱数生成機を生成します。  
生成された乱数生成器は、_min_ および _max_ を渡した場合、_min_ <= x, x <= _max_ の整数、  
渡していない場合は 0 <= x, x < 1 の浮動小数点数を返します。  
_options_ に渡したオブジェクトを通じて、内部の挙動を指定できます。  
`options.algorithm`の指定による挙動の変化は下記の通りです。  
| `options.algorithm` | 内部の乱数生成アルゴリズム | 範囲指定整数生成アルゴリズム |
|--|--|--|
| `rc4` | RC4 | Rejection Sampling |
| `rc4_legacy` | RC4 | 浮動小数点数演算による範囲制限​(0.19.0以前のアルゴリズム) |
| 無指定 または 'chacha20' | ChaCha20 | Rejection Sampling |

なお、**非[セキュアコンテクスト](https://developer.mozilla.org/ja/docs/Web/Security/Secure_Contexts)などの[`crypto`](https://developer.mozilla.org/ja/docs/Web/API/Window/crypto)[`.subtle`](https://developer.mozilla.org/ja/docs/Web/API/Crypto/subtle)が利用できないJavascript環境下では`rc4_legacy`のみが利用可能**となり、デフォルトも`rc4_legacy`に変更されます。

```aiscript playground
let rng = Math:gen_rng('AICHAN')

// シード値を固定しているので、同じ条件下では毎回同じ生成パターンになる
<: rng(0, 10)
<: rng(0, 10)
<: rng(0, 10)
```

:::warning 注意
`rc4_legacy`等、浮動小数点数演算を伴う範囲指定整数生成アルゴリズムでは、演算時の丸め誤差により、指定した _max_ の値より大きな値が生成される可能性があります。
:::

## その他
### @Math:clz32(_x_: num): num
xを32ビットのバイナリで表現したときの先頭の0の個数を返します。  

### @Math:fround(_x_: num): num
_x_ を32ビットの浮動小数点数に変換した時の値を返します。  

### @Math:imul(_x_: num, _y_: num): num
_x_ と _y_ に対しC言語風の32ビット乗算を行った結果を返します。
