---
outline: [2, 3]
---

# 標準定数・標準関数について
Aiscriptで最初から定義されていてどこでも使える定数・関数を指します。  
standardを省略してstd定数/関数とも呼ばれています。

## 書式
> #Core:v

`Core:v`という標準定数を表します。
> @Core:type(_v_: value): str

`Core:type`という標準関数を表します。  
`v`という名のvalue型（つまり任意の型）の引数を一つとり、str型（文字列型）の値を返します。

## 一覧

### std

#### @print(_message_: str): void
画面に文字列を表示します。  

#### @readline(_message_: str): str
文字列の入力を受け付けます。  

### :: Core
演算子系関数については[演算子一覧](./syntax.md#演算子一覧)を参照してください。 

#### #Core:v
型: `str`  
AiScriptのバージョンです。  

#### @Core:type(_v_: any): str
値の型名を取得します。  

#### @Core:to_str(_v_: any): str
値を表す文字列を取得します。  

#### @Core:range(_a_: num, _b_: num): arr<num>
_a_ から始まり _b_ で終わる数値の等差配列を返します。  
`a < b`なら1づつ増え、`a > b`なら1づつ減ります。  
`a == b`であれば`[a]`を返します。  
`a`および`b`が非整数であるときの動作は未定義です。  

#### @Core:sleep(_time_: num): void
指定時間（ミリ秒）待機します。

#### @Core:abort(_message_: str): never
プログラムを緊急停止します。

### :: Util
#### @Util:uuid(): str
新しいUUIDを生成します。  

### :: Json
#### @Json:stringify(_v_: any): str
JSONを生成します。  

#### @Json:parse&lt;T&gt;(_json_: str): T
JSONをパースします。 引数がJSONとしてパース可能性でない場合、エラー型の値（`name`=`'not_json'`）を返します。 

#### @Json:parsable(_str_: str): bool
文字列がJSONとしてパース可能であるかの判定を行います。歴史的理由により存在しています 

### :: Date
#### @Date:now(): num
現在時刻を取得します。  

#### @Date:year(_date_?: num): num
時刻の年を取得します。  
_date_ を渡した場合、_date_に対応する年、  
渡していない場合は現在時刻の年が返されます。    

#### @Date:month(_date_?: num): num
現在時刻の月を取得します。  
_date_ を渡した場合、_date_に対応する月、  
渡していない場合は現在時刻の月が返されます。    

#### @Date:day(_date_?: num): num
現在時刻の日を取得します。  
_date_ を渡した場合、_date_に対応する日、  
渡していない場合は現在時刻の日が返されます。    

#### @Date:hour(_date_?: num): num
現在時刻の時を取得します。  
_date_ を渡した場合、_date_に対応する時、  
渡していない場合は現在時刻の時が返されます。    

#### @Date:minute(_date_?: num): num
現在時刻の分を取得します。  
_date_ を渡した場合、_date_に対応する分、  
渡していない場合は現在時刻の分が返されます。    

#### @Date:second(_date_?: num): num
現在時刻の秒を取得します。  
_date_ を渡した場合、_date_に対応する秒、  
渡していない場合は現在時刻の秒が返されます。    

#### @Date:millisecond(_date_?: num): num
現在時刻のミリ秒を取得します。  
_date_ を渡した場合、_date_に対応するミリ秒、  
渡していない場合は現在時刻のミリ秒が返されます。  

#### @Date:parse(_date_: str): num
日付として解釈可能な文字列から日時を表す数値を生成します。  
解釈は[JavaScriptのDateコンストラクター](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date/Date)に依存します。  
引数が日付として解釈可能でない場合、エラー型の値（`name`=`'not_date'`）を返します。  


#### @Date:to_iso_str(_date_?: num, _time_offset_?: num): str
_date_ を拡張表記のISO形式にした文字列を返します。  
_date_ を渡していない場合は現在時刻を使用します。  
_time_offset_ はUTCからの時差（分単位）を指定します。  
_time_offset_ を渡していない場合はローカルのものを参照します。  

### :: Math
数が多いため専用のページになっています。→[std-math.md](std-math.md)

### :: Num
#### @Num:from_hex(_hex_: str): num
16進数の文字列から数値を生成します。  

### :: Str
#### #Str:lf
型: `str`  
改行コード(LF)です。  

#### @Str:lt(a: str, b: str): num
a < b ならば -1、a == b ならば 0、a > b ならば 1 を返します。  
arr.sortの比較関数として使用できます。

#### @Str:gt(a: str, b: str): num
a > b ならば -1、a == b ならば 0、a < b ならば 1 を返します。  
arr.sortの比較関数として使用できます。

#### @Str:from_codepoint(codepoint: num): str
Unicodeのコードポイントから文字を生成します。

_codepoint_ は 0 以上、10FFFF<sub>16</sub> 以下である必要があります。

#### @Str:from_unicode_codepoints(_codePoints_: `arr<num>`): str
Unicodeのコードポイント列を表す数値の配列から文字を生成します。  
_codePoints_の各要素は 0 以上、10FFFF<sub>16</sub> 以下である必要があります。

#### @Str:from_utf8_bytes(_bytes_: `arr<num>`): str
UTF-8のバイト列を表す数値の配列から文字を生成します。  
_bytes_の各要素は 0 以上、255 以下である必要があります。

### :: Uri
#### @Uri:encode_full(uri: str): str
uri をURIとしてエンコードした文字列を返します。以下の文字はエンコードされません。  
`A-Z a-z 0-9 - _ . ! ~ * ' ( ) ; , / ? : @ & = + $ #`

#### @Uri:encode_component(text: str): str
text をURI構成要素としてエンコードした文字列を返します。以下の文字はエンコードされません。  
`A-Z a-z 0-9 - _ . ! ~ * ' ( )`

#### @Uri:decode_full(encoded_uri: str): str
encoded_uri をエンコードされたURIとしてデコードした文字列を返します。  
以下の文字に対応するエスケープシーケンスはデコードされません。  
`; , / ? : @ & = + $ #`

#### @Uri:decode_component(encoded_text: str): str
encoded_text をエンコードされたURI構成要素としてデコードした文字列を返します。  

### :: Arr
#### @Arr:create&lt;T&gt;(_length_: num, _initial_?: T): arr&lt;T&gt;
長さが`length`の配列を作成します。  
配列は _initial_ が与えられていれば _initial_ 、でなければ`null`で埋められます。  

### :: Obj
#### @Obj:keys(_v_: obj): arr
#### @Obj:vals&lt;T&gt;(_v_: obj&lt;T&gt;): arr&lt;T&gt;
#### @Obj:kvs(_v_: obj): arr
オブジェクトのキー、値、キーと値の組を配列にして返します。

#### @Obj:get&lt;T&gt;(_v_: obj&lt;T&gt;, _key_: str): T

#### @Obj:set&lt;T&gt;(_v_: obj&lt;T&gt;, _key_: str, _val_: T): null

#### @Obj:has(_v_: obj, _key_: str): bool

#### @Obj:copy&lt;T&gt;(_v_: obj&lt;T&gt;): obj&lt;T&gt;
オブジェクトのコピーを生成します。  

#### @Obj:merge&lt;T&gt;(_o1_: obj&lt;T&gt;, _o2_: obj&lt;T&gt;): obj&lt;T&gt;
２つのオブジェクトを併合したものを返します。

### :: Error
#### @Error:create(_name_: str, _info_?: any): error
エラー型の値を作成します。

### :: Async
#### @Async:interval(_interval_: num, _callback_: @() => any, _immediate_?: bool): @() => void
指定した周期でコールバック関数を呼び出します。  
戻り値として停止関数を返します。  

#### @Async:timeout(_delay_: num, _callback_: @() => any): @() => void
指定した時間経過後にコールバック関数を呼び出します。  
戻り値として停止関数を返します。  
