# 組み込みプロパティ

組み込みプロパティとは、型ごとに用意された特殊な値あるいは関数です。  
オブジェクトのプロパティのように`.<name>`の記法で呼び出すことができます。（`[<str>]`の記法は使えません）
```aiscript
// 例
'ai kawaii'.len //9

Core:range(0,2).push(4) //[0,1,2,4]
```
今の所、数値・文字列・配列・エラー型に対応するものが用意されています。オブジェクトのそれに相当するものは、記法との兼ね合いで[std関数](std.md#-obj)として実装されています。

## 書式
本ページでは、（型名）型の任意の値に対する組み込みプロパティを下記のような形式で表記します。
> #(_v_: 型名).プロパティ名  

または

> @(_v_: 型名).組み込みメソッド名(引数リスト): 返り値の型  

`#`から始まるものは関数以外の値を持つ組み込みプロパティです。\
`@`から始まるものは関数の組み込みプロパティ（組み込みメソッド）です。

## 数値
### @(_x_: num).to_str(): str
数値を文字列に変換します。

```aiscript playground
let x = 123
<: x.to_str()
```

### @(_x_: num).to_hex(): str
数値から16進数の文字列を生成します。  

```aiscript playground
let x = 123
<: x.to_hex()
```

## 文字列
### #(_v_: str).len
型: `num`  
文字列の長さを取得します。  

```aiscript playground
let x = "Hello World!"
<: x.len
```

### @(_v_: str).to_num(): num | null
文字列が数字であれば、数値に変換します。

```aiscript playground
let x = "123"
<: x.to_num()

let y = "abc"
<: y.to_num()
```

### @(_v_: str).to_arr(): arr&lt;str&gt;
文字列を書記素クラスタ毎に区切り、配列にしたものを返します。  
文字列に孤立サロゲートが含まれない場合、孤立サロゲートを返すことはありません。  

### @(_v_: str).to_unicode_arr(): arr&lt;str&gt;
文字列を Unicode コードポイント毎に区切り、配列にしたものを返します。  
書記素クラスタは分割されます。  
文字列に孤立サロゲートが含まれない場合、孤立サロゲートを返すことはありません。  

### @(_v_: str).to_unicode_codepoint_arr(): arr&lt;num&gt;
文字列を Unicode コードポイント毎に区切り、それぞれ[コードポイント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)値を取得し配列にしたものを返します。  
文字列に孤立サロゲートが含まれない場合、孤立サロゲートを返すことはありません。  

### @(_v_: str).to_char_arr(): arr&lt;str&gt;
文字列を UTF-16 コード単位毎に区切り、配列にしたものを返します。  
文字列にサロゲートペアが含まれる場合、上位と下位それぞれ孤立サロゲートを返します。

### @(_v_: str).to_charcode_arr(): arr&lt;num&gt;
文字列を UTF-16 コード単位毎に区切り、それぞれ[UTF-16 コード単位を表す `0` から `65535` までの整数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)を取得し配列にしたものを返します。  
文字列にサロゲートペアが含まれる場合、上位と下位それぞれ孤立サロゲートを返します。

### @(_v_: str).to_utf8_byte_arr(): arr&lt;num&gt;
文字列を UTF-8 エンコードし、各バイト毎の `0` から `255` までの整数値を取得し配列にしたものを返します。  

### @(_v_: str).pick(_i_: num): str | null
文字列中の _i_ 番目の文字を取得します。

```aiscript playground
let x = "Hello World!"

<: x.pick(6)
```

### @(_v_: str).incl(_keyword_: str): bool
文字列中に _keyword_ が含まれていれば`true`、なければ`false`を返します。

```aiscript playground
let x = "Hello World!"
<: x.incl("World")

let y = "こんにちは！"
<: y.incl("Hello")
```

### @(_v_: str).starts_with(_prefix_: str, _start\_index_?: num): bool
文字列が _prefix_ で始まっていれば`true`、そうでなければ`false`を返します。\
_prefix_ が空文字列の場合は常に`true`を返します。\
_start\_index_ が指定されている場合、そのインデックスから始めます。\
_start\_index_ が`v.len`より大きいか`-v.len`より小さい場合は`false`を返します。\
_start\_index_ が負の場合は末尾から数えます。

```aiscript playground
let x = "Hello World!"

<: x.starts_with("Hello")
<: x.starts_with("World", 6)
```

### @(_v_: str).ends_with(_suffix_: str, _end\_index_?: num): bool
文字列が _suffix_ で終わっていれば`true`、そうでなければ`false`を返します。\
_suffix_ が空文字列の場合は常に`true`を返します。\
_end\_index_ が指定されている場合、そのインデックスの直前を末尾とします。（省略時は`v.len`）\
_end\_index_ が`v.len`より大きいか`-v.len`より小さい場合は`false`を返します。\
_end\_index_ が負の場合は末尾から数えます。

```aiscript playground
let x = "Hello World!"

<: x.ends_with("World!")
<: x.ends_with("Hello", 5)
```

### @(_v_: str).slice(_begin_: num, _end_: num): str
文字列の _begin_ 番目から _end_ 番目の直前までの部分を取得します。

```aiscript playground
let x = "Hello World!"

<: x.slice(6, 11)
```

### @(_v_: str).split(_splitter_?: str): arr&lt;str&gt;
文字列を _splitter_ がある場所で区切り、配列にしたものを返します。  
_splitter_ が与えられなければ一文字づつ区切ります。  

```aiscript playground
let x = "Hey, how are you?"

<: x.split()
<: x.split(",")
```

### @(_v_: str).replace(_old_: str, _new_: str): str
文字列中の _old_ を _new_ に置換したものを返します。  

```aiscript playground
let x = "Hello World!"

<: x.replace("World", "Ai-Chan")
```

### @(_v_: str).index_of(_search_: str, _fromIndex_?: num): num
文字列中から _search_ を探し、その添字を返します。  
_fromIndex_ が指定されていれば、その位置から検索を開始します。  
_fromIndex_ が負値の時は末尾からの位置（文字列の長さ+_fromIndex_）が使用されます。  
該当が無ければ-1を返します。

```aiscript playground
let x = "Hello World!"

<: x.index_of("World")
<: x.index_of("World", -7)
```

### @(_v_: str).pad_start(_width_: num, _pad_?: str): str
文字列の長さがが _width_ になるように、先頭を _pad_ の繰り返しで埋めた新しい文字列を返します。\
_pad_ を省略した場合、空白`' '`で埋められます。\
_pad_ が長すぎる場合、_pad_ の末尾が切り捨てられます。

```aiscript playground
let x = "7"

<: `Today is 2024/12/{x.pad_start(2, "0")}`
```

### @(_v_: str).pad_end(_width_: num, _pad_?: str): str
文字列の長さがが _width_ になるように、末尾を _pad_ の繰り返しで埋めた新しい文字列を返します。\
_pad_ を省略した場合、空白`' '`で埋められます。\
_pad_ が長すぎる場合、_pad_ の末尾が切り捨てられます。

```aiscript playground
let x = "5"

<: `I want {x.pad_end(4, "0")} yen`
```

### @(_v_: str).trim(): str
文字列の前後の空白を取り除いたものを返します。

```aiscript playground
let x = "  Hello World!  "

<: x.trim()
```

### @(_v_: str).upper(): str
文字列中の英字を大文字に変換して返します。

```aiscript playground
let x = "Hello World!"

<: x.upper()
```

### @(_v_: str).lower(): str
文字列中の英字を小文字に変換して返します。

```aiscript playground
let x = "Hello World!"

<: x.lower()
```

### @(_v_: str).charcode_at(_i_: num): num | null
_i_ 番目のにある [UTF-16 コード単位を表す `0` から `65535` までの整数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)を返します。  
インデックスは UTF-16 コード単位に基づきます。  
文字列にサロゲートペアが含まれる場合、位置によって上位または下位の孤立サロゲートを返すことがあります。  
_i_ 番目の文字が存在しない場合は null が返されます。  

### @(_v_: str).codepoint_at(_i_: num): num | null
_i_ 番目の文字の[コードポイント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)を取得します。  
インデックスは UTF-16 コード単位に基づきます。  
文字列にサロゲートペアが含まれ、指定位置が下位のサロゲートである場合、下位の孤立サロゲートを返します。  
_i_ 番目の文字が存在しない場合は null が返されます。  

## 配列
### #(_v_: arr).len
型: `num`  
配列の要素数を取得します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.len
```

### @(_v_: arr&lt;T&gt;).at(_index_: num, _otherwise_?: T): T | null
配列の _index_ の位置の要素を返します。\
_index_ が負の場合は末尾から数えます。\
_index_ が範囲外の場合は、代わりに _otherwise_ を返します。\
_otherwise_ が省略されている場合は`null`になります。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.at(2)
<: x.at(-1)
<: x.at(5)
<: x.at(5, "Not Found")
```

### @(_v_: arr&lt;T&gt;).push(_i_: T): null
**【この操作は配列を書き換えます】**  
配列の最後に要素を追加します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

x.push(8)
<: x
```

### @(_v_: arr&lt;T&gt;).unshift(i: T): null
**【この操作は配列を書き換えます】**  
配列の最初に要素を追加します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

x.unshift(7)
<: x
```

### @(_v_: arr&lt;T&gt;).pop(): T | null
**【この操作は配列を書き換えます】**  
配列の最後の要素を取り出します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

let popped = x.pop()
<: popped
<: x
```

### @(_v_: arr&lt;T&gt;).shift(): T | null
**【この操作は配列を書き換えます】**  
配列の最初の要素を取り出します。  

```aiscript playground
let x = [1, 2, 3, 4, 5]

let shifted = x.shift()
<: shifted
<: x
```

### @(_a_: arr&lt;T&gt;).concat(_b_: arr&lt;T&gt;): arr&lt;T&gt;
配列を連結します。

```aiscript playground
let x = [1, 2, 3]
let y = [4, 5, 6]

<: x.concat(y)

// 元の配列は変更されません
<: x
<: y
```

### @(_v_: arr&lt;str&gt;).join(_joiner_?: str): str
文字列の配列を結合して一つの文字列として返します。  

```aiscript playground
let x = ["Hello", "World", "!"]

<: x.join(" ")

// 引数を省略するとそのまま連結されます
<: x.join()
```

### @(_v_: arr&lt;T&gt;).slice(_begin_: num, _end_: num): arr&lt;T&gt;
配列の _begin_ 番目から _end_ 番目の部分を切り出して返します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.slice(1, 4)
```

### @(_v_: arr&lt;T&gt;).incl(_i_: T): bool
配列に指定した値が含まれているかどうかを返します。  

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.incl(3)
<: x.incl(6)
```

### @(_v_: arr&lt;T&gt;).map&lt;U&gt;(_func_: @(T, num) =&gt; U): arr&lt;U&gt;
配列の各要素に対し _func_ を非同期的に呼び出します。
それぞれの要素を _func_ の返り値で置き換えたものを返します。  

```aiscript playground
let x = ['田中', '鈴木', '山本']

<: x.map(@(v) {
    return `さん`
})
```

### @(_v_: arr&lt;T&gt;).filter(_func_: @(T, num) =&gt; bool): arr&lt;T&gt;
配列の要素のうち _func_ が true を返すようなもののみを抜き出して返します。  
順序は維持されます。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.filter(@(v) {
    // 2で割り切れる、つまり偶数のみを抜き出す
    return v % 2 == 0
})
```

### @(_v_: arr&lt;T&gt;).reduce&lt;U&gt;(_func_: Callback, _initial_: U): U
`Callback`: @(_acm_: U, _item_: T, _index_: num): U  
配列の各要素に対し _func_ を順番に呼び出します。  
各呼び出しでは、前回の結果が第1引数 _acm_ として渡されます。  
_initial_ が指定された場合は初回呼び出しの引数が(_initial_, _v_\[0], 0)、  
指定されなかった場合は(_v_\[0], _v_\[1], 1)となります。  
配列が空配列であり、かつ _initial_ が指定されていない場合はエラーになります。従って基本的には _initial_ を指定しておくことが推奨されています。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.reduce(@(acm, v) {
    // 合計を求める
    return acm + v
}, 0)
```

### @(_v_: arr&lt;T&gt;).find(_func_: @(_item_: T, _index_: num) =&gt; bool ): T | null
配列から _func_ が true を返すような要素を探し、その値を返します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.find(@(v) {
    // 3より大きい最初の要素を探す
    return v > 3
})
```

### @(_v_: arr&lt;T&gt;).index_of(_val_: T, _fromIndex_?: num): num
配列から_val_と同じ値を探し、その添字を返します。  
_fromIndex_が指定されていれば、その位置から検索を開始します。  
_fromIndex_が負値の時は末尾からの位置（配列の長さ+_fromIndex_）が使用されます。  
該当が無ければ-1を返します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

<: x.index_of(3)
```

### @(_v_: arr).reverse(): null
**【この操作は配列を書き換えます】**  
配列を反転させます。

```aiscript playground
let x = [1, 2, 3, 4, 5]

x.reverse()

<: x
```

### @(_v_: arr&lt;T&gt;).copy(): arr&lt;T&gt;
配列のコピーを生成します。  
シャローコピーであり、配列やオブジェクトの参照は維持されます。  

```aiscript playground
let x = [1, 2, 3, 4, 5]

let xCopy = x.copy()

// 配列を書き換える操作をしても…
xCopy.push(6)

// 元の配列には影響がありません
<: x
<: xCopy
```

### @(_v_: arr&lt;T&gt;).sort(_comp_: @(_a_: T, _b_: T) => num): arr&lt;T&gt;
**【この操作は配列を書き換えます】**  
配列の並べ替えをします。第1引数 _comp_ として次のような比較関数を渡します。  
安定ソートです。
* _a_ が _b_ より順番的に前の時、負の値を返す
* _a_ が _b_ より順番的に後の時、正の値を返す
* _a_ が _b_ と順番的に同等の時、0を返す

数値の並び替えでは`Core:sub`を渡すことで昇順、`@(a,b){b-a}`を渡すことで降順ソートができます。  
文字列用の比較関数として`Str:lt`（昇順）, `Str:gt`（降順）が用意されています。詳しくは[std.md](std.md#-str)をご覧下さい。  

```aiscript playground
let x = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]

x.sort(Core:sub)

/*
もしくは…

x.sort(@(a, b) {
    return a - b
})
*/

<: x
```

### @(_v_: arr&lt;T&gt;).fill(_val_?: T, _fromIndex_?: num, _toIndex_?: num): arr&lt;T&gt;
**【この操作は配列を書き換えます】**  
配列の _fromIndex_ から _toIndex_ までの範囲の要素を _val_ で置き換えます。  
_val_ 省略時は`null`で置き換えます。  
_fromIndex_ および _toIndex_ に関する挙動は`arr.slice`に準拠します。  

```aiscript playground
let x = [1, 2, 3, 4, 5]

// 1番目から4番目までを0で埋める
x.fill(0, 1, 4)

<: x
```

### @(_v_: arr&lt;T&gt;).repeat(_times_: num): arr&lt;T&gt;
配列を _times_ 回繰り返した配列を作成します。  
`arr.copy`同様シャローコピーであり、配列やオブジェクトの参照は維持されます。  
_times_ には0以上の整数値を指定します。それ以外ではエラーになります。 

```aiscript playground
let x = [1, 2, 3]

<: x.repeat(3)
```

### @(_v_: arr&lt;T&gt;).splice(_index_: num, _remove_count_?: num, _items_?: arr&lt;T&gt;): arr&lt;T&gt;
**【この操作は配列を書き換えます】**  
配列の _index_ から _remove_count_ 個の要素を取り除き、その位置に _items_ の要素を挿入します。  
返り値として、取り除いた要素の配列を返します。\
_index_ が負の場合は末尾から数えます。\
_index_ が最後の要素より後の場合は要素を取り除かず、挿入は末尾に追加します。\
_remove_count_ を省略した場合、末尾まで取り除きます。\
_items_ を省略した場合、何も挿入しません。

```aiscript playground
let x = [1, 2, 3, 4, 5]

// 2番目から2つ取り除き、その位置に[6, 7, 8]を挿入
let spliced = x.splice(2, 2, [6, 7, 8])

<: spliced // 取り除かれたものの配列
<: x // 取り除かれて挿入された後の配列
```

### @(_v_: arr).flat(_depth_?: num): arr
配列に含まれる配列を _depth_ で指定した深さの階層まで結合した新しい配列を作成します。  
_depth_ には0以上の整数値を指定します。省略時は1になります。  

```aiscript playground
let x = [1, [2, 3], [4, [5, 6]]]

<: x.flat()
<: x.flat(2)
```

### @(_v_: arr&lt;T&gt;).flat_map&lt;U&gt;(_func_: @(_item_: T, _index_: num) =&gt; arr&lt;U&gt; | U ): arr&lt;U&gt;
配列の各要素を _func_ の返り値で置き換えた後、1階層平坦化した新しい配列を作成します。  
_func_ は非同期的に呼び出されます。

```aiscript playground
let x = [1, 2, 3]

<: x.flat_map(@(v) {
    return [v, v * 2]
})
```

### @(_v_: arr&lt;T&gt;).insert(_index_: num, _item_: T): null
**【この操作は配列を書き換えます】**  
配列の _index_ の位置に _item_ を挿入します。\
_index_ が負の場合は末尾から数えます。\
_index_ が最後の要素より後の場合は末尾に追加します。

```aiscript playground
let x = [1, 2, 3, 4, 5]

// 3番目に6を挿入
x.insert(2, 6)

<: x
```

### @(_v_: arr&lt;T&gt;).remove(_index_: num): T | null
**【この操作は配列を書き換えます】**  
配列から _index_ の位置の要素を取り除き、その要素を返します。\
_index_ が負の場合は末尾から数えます。\
_index_ が最後の要素より後の場合は取り除かず、`null`を返します。

```aiscript playground
let x = [1, 2, 6, 3, 4, 5]

// 3番目の要素を取り除く
let removed = x.remove(2)

<: removed
<: x
```

### @(_v_: arr&lt;T&gt;).every(_func_: @(_item_: T, _index_: num) =&gt; bool ): bool
配列の全ての要素に対して _func_ が true を返す時のみ true 返します。空配列には常に true を返します。

```aiscript playground
let x = [2, 4, 6, 8, 10]
let y = [2, 4, 6, 7, 8]

@judgeAllEven(arr) {
    if (arr.every(@(v) { return v % 2 == 0 })) {
        return "配列の要素は全て偶数です"
    } else {
        return "配列の要素に奇数が含まれています"
    }
}

<: judgeAllEven(x)
<: judgeAllEven(y)
```

### @(_v_: arr&lt;T&gt;).some(_func_: @(_item_: T, _index_: num) =&gt; bool ): bool
配列の要素に対して _func_ が true を返す要素が存在する時のみ true 返します。

```aiscript playground
let x = [2, 4, 6, 7, 8]

@judgeHasOdd(arr) {
    if (arr.some(@(v) { return v % 2 == 1 })) {
        return "配列の要素に奇数が含まれています"
    } else {
        return "配列の要素は全て偶数です"
    }
}

<: judgeHasOdd(x)
```

## エラー型
### #(_v_: error).name
型: `str`  
エラーの識別子となる文字列を取得します。

### #(_v_: error).info
型: `value`  
エラーに付加情報がある場合、それを取得します。
