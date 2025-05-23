# AiScriptの文法

## 文と式
AiScriptにおける構文要素は、コメント等を除き「文(statement)」と「式(expression)」の2つからなります。  
文は行頭または式を受け取る構文要素（ifや関数リテラルなど）にのみ記述することができます。返り値が利用されることを想定されていない構文要素であり、返り値は常にnullです。  
対して式は、文を書ける場所に加えて何らかの値を要求するほとんど全ての構文要素の内部に書くことができます。また、多くの場合何らかの意味ある値を返します。  

## コメント
`//`で始めた行や`/*` `*/`で囲んだ箇所はコメントになり、プログラムの動作に影響を与えません。

```aiscript
// 単行コメント
/*
   複数行コメント
*/
```

## バージョン表記
プログラムの一行目に以下の記法を行うことで、想定されたAiScriptのバージョンを明記することができます。  
このバージョンはホストプログラムによって読み込まれる場合があります。  
```aiscript
/// @ 0.16.0
```

## 文

### 変数・関数宣言
イミュータブル変数（定数）には`let`、ミュータブル変数には`var`、関数には`@`を使用します。  
#### 予約語について
変数や関数の宣言において、名前として使用できないキーワードがいくつかあります。  
詳しくは[keywords.md](./keywords.md)を参照ください。  
#### 変数
```aiscript
// イミュータブル（再代入不可）
let answer = 42
// ミュータブル（再代入可能）
var answer2 = 57
```
```aiscript
// 初期値の省略は不可
var answer // Syntax Error
// match等の予約語は変数名として使用できない
let match = 12 // Syntax Error
// 同名の変数の再宣言は禁止
var a = 1
var a = 2 // Runtime Error
let a = 3 // Runtime Error
```
#### 関数
関数宣言はイミュータブル変数を関数で初期化するのと同じ動作になっています。  
```aiscript
// 最後の式が暗黙にreturnされる
@add(x, y) {
	x + y
}
<: add(1, 2) // 3
// 定数をリテラル関数で初期化しても同じ働きになる
let add2 = @(x, y) {
	x + y
}
// 明示的にreturnを書くこともできる
@add3(x, y) {
	return x + y
}
// 引数を複数行で書いてもよい
@add4(
	x,
	y
) {
	x + y
}
// 省略可能引数
@func1(a, b?) {
	<: a
	<: b // 省略されるとnullになる
}
func1('hoge') // 'hoge' null
// 初期値を設定された引数（省略可能引数と組み合わせて使用可能）
@func2(a, b?, c = 'piyo', d?) {
	<: a
	<: b
	<: c
	<: d
}
func2('hoge', 'fuga') // 'hoge' 'fuga' 'piyo' null
// 初期値には変数を使用可能（値は宣言時点で固定）
var v = 'hoge'
@func3(a = v) {
	<: a
}
v = 'fuga'
func3() // 'hoge'
// ワンライナー
@func4(a,b?,c=1){<:a;<:b;<:c}
```
```aiscript
// match等の予約語は関数名として使用できない
@match(x, y) { // Syntax Error
  x == y
}
// 最後の引数の後にはコロンを付けられない
@add(x, y,) { // Syntax Error
	x + y
}
// 変数同様再宣言は不可
var func = null
@func() { // Runtime Error
  'hoge'
}
// 省略可能引数構文と初期値構文は併用できない
@func(a? = 1) {} // Syntax Error
```

### 代入
宣言済みの変数の値を変更します。  
```aiscript
var a = 0
a = 1
<: a // 1
```
```aiscript
// letで宣言された変数は代入不可
let a = 0
a = 1 // Runtime Error
```

#### 分割代入
```aiscript
// 配列の分割代入
var a = ''
var b = ''
[a, b] = ['hoge', 'fuga']
<: a // 'hoge'
<: b // 'fuga'
// オブジェクトの分割代入
{ name: a, nature: b } = { name: 'Ai-chan', nature: 'kawaii' }
<: a // 'Ai-chan'
<: b // 'kawaii'
// 組み合わせ
let ai_kun = {
  name: 'Ai-kun',
  nature: ['kakkoii', 'kawaii', 'ponkotsu'],
}
{ name: a, nature: [b] } = ai_kun
<: a // 'Ai-kun'
<: b // 'kakkoii'
```
```aiscript
// 宣言で分割代入を使うことも可能
let [hoge, fuga] = ['hoge', 'fuga']

each let { value: a }, [{ value: 1 }, { value: 2 }] {
	<: a // 1, 2
}

// 引数でも使用可能
@func([a, b] = [0, 0]) {
	[a, b]
}
func([1, 2]) // [1, 2]
func([1]) // [1, null], not [1, 0]
func() // [0, 0]

// 再宣言を含む宣言は不可
var a = 0
let [a, b] = [1, 'piyo'] // Runtime Error

// 名前空間での宣言では使用不可
:: Ai {
	// Runtime Error
	let [chan, kun] = ['kawaii', 'kakkoii']
}
```
```aiscript
// 代入値が分割できる型でなければエラー
[a, b] = 1 // Runtime Error
{ zero: a, one: b } = ['hoge', 'fuga'] // Runtime Error
```

### for
与えられた回数のループを行います。  
```aiscript
let repeat = 5
for repeat print('Wan') // WanWanWanWanWan
// {}を使うことで複数の文を書ける
for 2 + 3 {
	<: 'Nyan'
} // NyanNyanNyanNyanNyan
// ()でくくってもよい
for ({ a: 3 }.a) {
  <: 'Piyo'
} // PiyoPiyoPiyo
```
```aiscript
// {の直前に空白必須
for 5{ // Syntax Error
	<: 'Mogu'
}
```
#### for-let
イテレータ変数を宣言し、ループ内で参照することができます。  
```aiscript
for let i, 5 {
	<: i
} // 0 1 2 3 4
// 初期値を設定することもできる
for let i = 3, 5 {
	<: i
} // 3 4 5 6 7
```
```aiscript
// イテレータ変数はletで宣言される必要がある
for var i, 5 {
	<: i
} // Syntax Error
```

### each
配列の各要素に対しループを行います。  
```aiscript
let arr = ['foo', 'bar', 'baz']
each let v, arr {
	<: v
} // foo bar baz
```
```aiscript
// {の直前に空白必須
each let v, arr{ // Syntax Error
	<: v
}
```

### while
条件がtrueの間ループを続けます。  
条件が最初からfalseの場合はループは実行されません。
```aiscript
var count = 0
while count < 42 {
	count += 1
}
<: count // 42
// 条件が最初からfalseの場合
while false {
  <: 'hoge'
} // no output
```

### do-while
条件がtrueの間ループを続けます。  
条件が最初からfalseであってもループは一度実行されます。
```aiscript
var count = 0
do {
	count += 1
} while count < 42
<: count // 42
// 条件が最初からfalseの場合
do {
  <: 'hoge'
} while false // hoge
```

### loop
`break`されるまで無制限にループを行います。  
```aiscript
var i = 5
loop {
	<: i
	i -= 1
	if i == 0 break
} // 5 4 3 2 1
```

## グローバル専用文
他の構文要素の内部に書くことを許容されない特殊な文です。  
これらの構文要素は実行開始時に巻き上げられるため、プログラム上のどこに書いても最初に読み込まれます。  

### メタデータ構文
オブジェクトリテラルと類似した記法でAiScriptファイルにメタデータを埋め込める機能です。  
メタデータはホストプログラムによって読まれる場合があります。  
要素として関数を除く純粋な[リテラル](./literals.md)のみが許可されており、それ以外の式を含むと構文エラーとなります。  
```aiscript
### {
	name: "example"
	version: 42
	keywords: ["foo", "bar", "baz"]
}
```

### 名前空間
複数の定数・関数に共通した接頭辞をつけることのできる機能です。  
ミュータブルな変数の存在は許容されていません。  
未発達な機能であり、今後役割が大きく変更される可能性があります。  
```aiscript
:: Ai {
	let chan = 'kawaii'
	@kun() {
		<: chan
	}
}
<: Ai:chan // kawaii
Ai:kun() // kawaii
```

## 式

### リテラル
値をスクリプト中に直接書き込むことができる構文です。  
詳しくは→[literals.md](./literals.md)  

### 演算子
主要な演算を表現します。  
#### 単項演算子
式に前置して使用します。論理否定（`!`）、正数符号（`+`）、負数符号（`-`）の三種があります。
#### 二項演算子
２つの式の間に置いて使用します。四則演算とその派生（`+`,`-`,`*`,`^`,`/`,`%`)、比較演算（`==`,`!=`,`<`,`<=`,`>`,`>=`）、論理演算（`&&`,`||`）があります。
#### 演算子の優先度
例えば`1 + 2 * 3`などは`2 * 3`が先に計算されてから`1 +`が行われます。これは`*`の優先度が`+`より高いことによるものです。優先度の一覧は下の表をご覧下さい。  
この優先度は`(1 + 2) * 3`のように`(` `)`で括ることで変えることができます。  
#### 二項演算子の糖衣構文性
二項演算子は構文解析の過程でそれぞれ対応する組み込み関数に置き換えられます。  
（単項演算子である`!`にも対応する関数`Core:not`が存在しますが、置き換えは行われていません）  
何の関数に置き換えられるかは下の表をご覧下さい。  
### 演算子一覧
上から順に優先度が高くなっています。（一部優先度が同じものもあります）  
<table>
	<tbody>
		<tr><th>演算子</th><th>対応する関数</th><th>意味</th></tr>
		<tr><td><code>^</code></td><td><code>Core:pow</code></td><td>冪算</td></tr>
		<tr><td><code>+（単項）</code></td><td>なし</td><td>正数</td></tr>
		<tr><td><code>-（単項）</code></td><td>なし</td><td>負数</td></tr>
		<tr><td><code>!（単項）</code></td><td>なし</td><td>否定</td></tr>
		<tr><td><code>*</code></td><td><code>Core:mul</code></td><td>乗算</td></tr>
		<tr><td><code>/</code></td><td><code>Core:div</code></td><td>除算</td></tr>
		<tr><td><code>%</code></td><td><code>Core:mod</code></td><td>剰余</td></tr>
		<tr><td><code>+</code></td><td><code>Core:add</code></td><td>加算</td></tr>
		<tr><td><code>-</code></td><td><code>Core:sub</code></td><td>減算</td></tr>
		<tr><td><code>></code></td><td><code>Core:gt</code></td><td>大きい</td></tr>
		<tr><td><code>>=</code></td><td><code>Core:gteq</code></td><td>以上</td></tr>
		<tr><td><code><</code></td><td><code>Core:lt</code></td><td>小さい</td></tr>
		<tr><td><code><=</code></td><td><code>Core:lteq</code></td><td>以下</td></tr>
		<tr><td><code>==</code></td><td><code>Core:eq</code></td><td>等しい</td></tr>
		<tr><td><code>!=</code></td><td><code>Core:neq</code></td><td>等しくない</td></tr>
		<tr><td><code>&&</code></td><td><code>Core:and</code></td><td>かつ</td></tr>
		<tr><td><code>||</code></td><td><code>Core:or</code></td><td>または</td></tr>
	</tbody>
</table>

### if
キーワード`if`に続く式がtrueに評価されるかfalseに評価されるかで条件分岐を行います。  
式として扱うことができ、最後の文の値を返します。
`if`の直後に１つ以上の空白またはタブを挟む必要があります。（改行があっても）  
条件式が`bool`型ではない値に評価されるとエラーになります。  
```aiscript
// 単行
if answer == 42 print("correct answer")
// 複数行
if answer == 42 {
	<: "correct answer"
}
// 条件式は()で囲ってもよい
if ({ a: true }.a) print('ok')
// 式として使用可能
<: `{if answer == 42 "collect answer"}`
// else, elif, else ifも使用可能
let result = if answer == "bebeyo" {
	"correct answer"
} elif answer == "ai" {
	"kawaii"
} else if answer == "hoge" {
	"fuga"
} else {
	"wrong answer"
}
// elseがない場合、条件式がfalseならnullを返す
<: if false 1 // null
```
```aiscript
// 条件式の前後の空白は必須（かっこでくくっていても）
if(true) return 1 // Syntax Error
if (true)return 1 // Syntax Error
// elif, elseの直前の空白は必須
if (false) {
}elif (true) { // Syntax Error
}else {} // Syntax Error
```

### eval
別名ブロック式。
`{ }`内の文を順次評価し、最後の文の値を返します。
```aiscript
let foo = eval {
	let x = 1
	let y = 2
	x + y
}
<: foo // 3
```

### match
```aiscript
let x = 1
let y = match x {
	case 1 => "yes"
	case 0 => "no"
	default => "other"
}
<: y // "yes"

// ワンライナー
<:match x{case 1=>"yes",case 0=>"no",default=>"other"} // "yes"
```

### exists
与えられた名称の変数または関数が存在すればtrue、しなければfalseを返します。
```aiscript
// 変数barは存在しないためfalse
var foo = exists bar
// 変数fooが存在するためtrue
var bar = exists foo
```

## ラベル構文
以下の文や式にラベルを付与することができます。
- [`for`](#for)
- [`each`](#each)
- [`while`](#while)
- [`do-while`](#do-while)
- [`loop`](#loop)
- [`if`](#if)
- [`eval`](#eval)
- [`match`](#match)

ネストしたブロック内でラベルを付与した`break`文や`continue`文を使用することで外側のブロックから脱出することができます。
```aiscript playground
#outer: for let x, 3 {
	for let y, 2 {
		if (x == 1 && y == 1) {
			continue #outer
		}
		<: [x, y]
	}
}
```

`eval`または`if`, `match`に対応するbreak文には値を指定することができます。
```aiscript playground
<: #label1: eval {
	break #label1
	1
} // => null

<: #label2: eval {
	break #label2 2
	3
} // => 2
```
