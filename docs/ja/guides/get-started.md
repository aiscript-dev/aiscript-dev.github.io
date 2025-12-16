# はじめに

## AiScriptとは

AiScript(あいすくりぷと)は、JavaScript上で動作するプログラミング言語です。ホスト側で関数の実装を拡張することもでき、安全にユーザー作成のスクリプトを実行させることができます。

このドキュメントでは、既にある程度のプログラミングの知識があることを前提にしています。
したがってAiScriptの構文、仕様などについてだけ書き、プログラミング自体についての説明は省きます。

参考：[リファレンス > 構文](../references/syntax.md)

## Hello, world!
AiScriptでは、次のように書きます:
```aiscript playground=true
print("Hello, world!")
```

`print( ~ )`は関数呼び出しです。カッコの前に呼び出す関数名を書き、カッコの中に引数を書きます。
引数が複数あるときは`,`で区切って列挙します。
関数についての詳細は後述します。

`"~"`は文字列リテラルです。`"`で囲ったものが文字列になります。

ちなみに、`print( ~ )`には糖衣構文があり、次のようにも書けます:
```aiscript playground
<: "Hello, world!"
```

## コメント
AiScriptのコメントは`//`で始めます。
コメントはプログラムの動作に影響を与えません。

```aiscript
// this is a comment
```

複数行にわたってコメントアウトする場合、`/*` `*/`で囲みます。  

```aiscript
/*
this is a comment
*/
```
## 組み込み型
<table>
	<tr><th>名称</th><th>型名</th><th>リテラル例</th></tr>
	<tr><td>文字列</td><td><code>str</code></td><td><code>"kawaii"</code></td></tr>
	<tr><td>数値</td><td><code>num</code></td><td><code>42</code></td></tr>
	<tr><td>真理値</td><td><code>bool</code></td><td><code>true</code>/<code>false</code></td></tr>
	<tr><td>配列</td><td><code>arr</code></td><td><code>["ai", "chan", "cute"]</code></td></tr>
	<tr><td>オブジェクト</td><td><code>obj</code></td><td><code>{ foo: "bar", a: 42 }</code></td></tr>
	<tr><td>null</td><td><code>null</code></td><td><code>null</code></td></tr>
	<tr><td>関数</td><td><code>fn</code></td><td><code>@(x) { x }</code></td></tr>
	<tr><td>エラー</td><td><code>error</code></td><td><code>(TODO)</code></td></tr>
</table>

## 変数
### 宣言
変数宣言は次のように書きます:
```aiscript
let message = "Hello"
```

`let`のあとに変数名を書き、`=`の後に値を書きます。

AiScriptではこの方法で宣言した変数はイミュータブルです。つまり、変数の値を後から変えることは出来ません。
再代入可能な変数を作る時は、`let`の代わりに`var`で変数宣言します。例:
```aiscript
// ミュータブルな変数を宣言
var message = "Hello"

// 再代入
message = "Hi"

// また再代入
message = "Yo"
```
なお、同一スコープ内での変数の再宣言は禁止されています。

### 参照
変数の値を参照する時は、単に変数名を書きます:
```aiscript
print(message)
```

## 配列
`[]`の中に式を`,`で区切って列挙します。
```aiscript
["ai", "chan", "kawaii"]
```

配列の要素にアクセスするときは、`[<index>]`と書きます。
インデックスは0始まりです。
```aiscript playground
let arr = ["ai", "chan", "kawaii"]
<: arr[0] // "ai"
<: arr[2] // "kawaii"
```

## オブジェクト
AiScriptにおけるオブジェクトは文字列のみをキーとした連想配列のようなものとなっています。  
キーと値から構成される各要素をプロパティと呼びます。  
この時キーをプロパティ名と呼びます。  
`{}`の中にプロパティを`,`か改行で区切って列挙します。
プロパティ名と値は`: `で区切ります。
```aiscript
{
	foo: "bar"
	answer: 42
	nested: {
		some: "thing"
	}
}
```

オブジェクトのプロパティにアクセスするときは、
`.<name>`か`[<str>]`と書きます。
```aiscript playground
let obj = {foo: "bar", answer: 42}
<: obj.foo // "bar"
<: obj["answer"] // 42
```

## 演算
演算は、
```aiscript
(1 + 1)
```
のように書きます。これは標準関数（後述）呼び出しの糖衣構文で、実際にはこのように解釈されます:
```aiscript
Core:add(1, 1)
```
詳しくは→[リファレンス > 構文](../references/syntax.md)

## ブロック式
ブロック式 `eval { ~ }` を使うと、ブロック内で最後に書かれた式が値として返されます。
```aiscript playground
let foo = eval {
	let a = 1
	let b = 2
	(a + b)
}

<: foo // 3
```

## 条件分岐
AiScriptでの条件分岐は、次のように書きます:
```aiscript
if (a == b) {
	<: "a equals to b"
}
```

`if`の後にboolを返す式(条件)を書き、その後に条件に一致した場合に評価される式(then節)を書きます。
then節の後に`else`を書き、さらに式を追加することで条件に一致しなかった場合の処理も行うことが出来ます:
```aiscript
if (a == b) {
	<: "a equals to b"
} else {
	<: "a does not equal to b"
}
```

`elif`（もしくは`else if`）の後に条件式を書くことで条件判定を複数行うことも出来ます:
```aiscript
if (a == b) {
	<: "a equals to b"
} elif (a > b) {
	<: "a is greater than b"
} else {
	<: "a is less than b"
}
```

これらの条件分岐は式なので、ブロック内で値を返せます:
```aiscript
<: if (a == b) {
	"a equals to b"
} elif (a > b) {
	"a is greater than b"
} else {
	"a is less than b"
}
```

## 繰り返し
AiScriptでの繰り返しは、次のように書きます:
```aiscript
for (let i, 100) {
	<: i
}
```
`for`の後にイテレータ変数名を書き、`,`の後に繰り返し回数を返す式を書きます。その後のブロックで繰り返す処理を書きます。
イテレータ変数は省略することも出来ます:
```aiscript playground
for (20) {
	<: "yo"
}
```

## 繰り返し(配列)
`each`を使うと、配列の各アイテムに対し処理を繰り返すことができます:
```aiscript playground
let items = ["a", "b", "c"]
each (let item, items) {
	<: item
}
```

## 関数
### 関数定義
次のように書きます:
```aiscript
@fn(x) {
	(x * 2)
}
```

`@`の後に関数名を書き、カッコの中に引数定義を書きます。その後にブロックが関数の処理になります。

### return
関数の最後に書かれた式の値が関数の返り値になりますが、関数の途中で値を返したい時は`return`を使います。

### 標準定数、標準関数
何も書かなくても最初から使える定数・関数です。

[標準定数・関数一覧](../references/std.md)

### 組み込みプロパティ
オブジェクト以外の値に`.`をつけて呼び出すことができる擬似的なプロパティです。

[組み込みプロパティ一覧](../references/builtin-props.md)

## テンプレート
バッククォートを使うと、文字列の中に変数や式を埋め込めます:
```aiscript playground
let ai = "kawaii"
<: `Hello, {ai} world!`
```

## メタデータ
AiScriptファイルにメタデータを埋め込める機能です。
```aiscript
### {
	name: "example"
	version: 42
	keywords: ["foo", "bar", "baz"]
}
```

## エラー型
一部の標準関数は実行失敗時にエラー型の値を返します。  
これによりエラー処理を行うことができます。  
```aiscript
@validate(str){
	let v=Json:parse(str)
	if (Core:type(v)=='error') print(v.name)
	else print('successful')
}
```

## エラーメッセージ
進行不能なエラーが発生するとエラーメッセージが表示されます。  
```aiscript playground
let scores=[10, 8, 5, 5]
let 3rd=scores[2] // unexpected token: NumberLiteral (Line 2, Column 5)
```
```aiscript playground
let arr=[]
arr[0] // Runtime: Index out of range. Index: 0 max: -1 (Line 2, Column 4)
```
行(Line)、列(Column)は1始まりです。
