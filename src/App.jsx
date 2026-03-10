import { useState, useEffect, useRef, useCallback } from "react";

// @@SECTION:PALETTE
const C = {
  bg:"#050d14", panel:"#0a1a26", panel2:"#0d2235",
  border:"#1a4a6a", accent:"#00c8ff", accent2:"#00ffcc",
  gold:"#f0c040", red:"#ff4466", text:"#c8e8f8",
  muted:"#4a7a9a", white:"#eef8ff"
};

// @@SECTION:SCENES
const SCENES = [
  { bg:["#050d14","#0a1820","#152838"], loc:"VRS接続中", sprites:[], dl:[
    { sp:"SYSTEM", t:"── VRS接続を開始します ──\n\nブレイン・サーバーに接続中..." },
    { sp:"SYSTEM", t:"接続完了。\n\nようこそ、冒険者よ。\n五感で体感するVRMMORPG──\n\n『ARCADIA』の世界へ。" },
    { sp:"SYSTEM", t:"プレイヤー名: Eltz  Lv: 1\n\nゲームを開始します──", next:1 }
  ]},
  { bg:["#0a1a30","#1a5080","#d4c8a0"], loc:"旅立ちの浜辺", sprites:["🧑"], dl:[
    { sp:"エルツ", t:"「煙い。なんだよ、始まりって\n結構雑なんだな」" },
    { sp:"エルツ", t:"大きく呼吸をする。海辺に流れる空気は\n澄んでいた。\n\n「ここが、ゲームの世界か」" },
    { sp:"エルツ", t:"「噂には聞いてたけど、本当に綺麗だな......\n\n現実と比べて遜色のない圧倒的な存在感。\nこれがVRSのプレゼンスってやつか」" },
    { sp:"エルツ", t:"「さて、まずは村を探すのがセオリーかな」\n\n旅立ちの浜辺。ここが全ての始まり──", next:2 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 海岸線", sprites:["🧑","🌿"], dl:[
    { sp:"ナレーション", t:"旅立ちの浜辺から海岸線を進むこと約一時間──\n\nイルカ島の自然が視界に広がる。" },
    { sp:"エルツ", t:"「見たことない鳥だ......あれもモンスターなんだろうか」\n\n頭上には白い翼に黒の斑点を持った\n鳥々が飛び交っていた。" },
    { sp:"SYSTEM", t:"⚠ 近くにモンスターの気配を感じる......\n\nどうする？", choices:[
      { t:"⚔ 戦って進む", battle:true, battleType:"seagull", battleNext:3 },
      { t:"💨 避けて進む", next:3 }
    ]}
  ]},
  { bg:["#0a1808","#203818","#302820"], loc:"エルム村", sprites:["🧑","👤"], dl:[
    { sp:"エルツ", t:"「着いた......村だ」\n\n花と木々に包まれた村が視界に広がった。" },
    { sp:"旅人", t:"「君、初心者かい？\n\n情報を集めたいなら、まずはギルドで\n講習を受けるといいよ。\nほら、奥の大きな建物がギルドだよ」" },
    { sp:"エルツ", t:"「ありがとうございます」", next:4 }
  ]},
  { bg:["#1a0e06","#3a2010","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"高い天井、囲炉裏から立ち上る煙。\n銀髪の青年と金髪の少女がくつろいでいた。" },
    { sp:"スウィフト", t:"「初心者講習？　ギルドの人が出払ってるんだ。\nここ座りなよ。僕はスウィフト、こっちはリンス」" },
    { sp:"エルツ", t:"「エルツです。よろしく」" },
    { sp:"スウィフト", t:"「エルツってMMO好きなの？\nなんで好きなわけ？」" },
    { sp:"エルツ", t:"「なぜか......あらためて問われると\n答えがたいけど」", choices:[
      { t:"「人の存在を感じられるから」", next:5 },
      { t:"「世界観を楽しみたいから」", next:5 }
    ]}
  ]},
  { bg:["#1a0e06","#3a2010","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","🐰"], dl:[
    { sp:"ナレーション", t:"談笑していると──\nギルドの外から甲高い怒声が聞こえてきた。" },
    { sp:"クリケット", t:"「全クモッテ、ふ・ざ・け・て・るデシ！\nたかが生肉の一ツで殴り合いとは\n愚の骨頂デシ！」" },
    { sp:"エルツ", t:"「う、うぉぉぉ、何だ！？」\n\n背丈の小さな毛むくじゃらの生物が現れた。\n兎の耳に猫の髭──" },
    { sp:"クリケット", t:"「申し遅れたデシ。我輩がギルドマスターの\n[クリケット]デシ！\n\n手を前に出して『ブック・オープン！』\nと言うデシ」", pbOpen:true }
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","📖"], dl:[
    { sp:"SYSTEM", t:"── パーソナル・ブック（P.B.）取得 ──\n\n✨ 新機能が解放されました！" },
    { sp:"クリケット", t:"「携帯パソコンのようなものだと\n思って構わないデシ。\n\nステータス、メール、マップ──\n全情報がここに集まるデシ」" },
    { sp:"クリケット", t:"「右上の光るシンボルが [P.BOOK] デシ。\n確認できるデシよ。\n超重要事項だから絶対覚えるデシ！」" },
    { sp:"ナレーション", t:"かくして、エルツの冒険は始まった。\n\nアルカディア──\n夢に見た理想郷の扉が、今、\n開かれようとしている。", next:7 }
  ]},
  { bg:["#0a1808","#184018","#2a2818"], loc:"エルム村 ギルド裏・草地", sprites:["🧑","🐰","🙍"], dl:[
    { sp:"ナレーション", t:"クリケットに連れられ村の裏手の草地へ──\n光のカーテンのような木漏れ日が差し込む。" },
    { sp:"クリケット", t:"「まずホームポイントを設定するデシ。\n女神様の像に向かって\n『ホームポイント・オン』と言うデシ」" },
    { sp:"SYSTEM", t:"── ホームポイント 設定 ──\n\n📍 エルム村 女神像前\n死亡時にここへ戻ることができます" },
    { sp:"クリケット", t:"「次は戦闘講習デシ。\nあそこのラヴィを狩ってみるデシ！」" },
    { sp:"三人", t:"「......無理だ」\n\n草地でぴょこぴょこ跳ねる\n丸くてモコモコの桃色の生物──\n三人は口を揃えて言った。\n「可愛い過ぎる」" },
    { sp:"クリケット", t:"「............代わりを用意するデシ」\n「コーザ！ お前が戦うデシ！」" },
    { sp:"コーザ", t:"「馬鹿も休み休み言って下さい。\n何で僕が戦わなくちゃならないんですか！」\n\n「......まぁ仕方ないですね。手加減はできませんよ」", battle:true, battleType:"koza", battleNext:8 }
  ]},
  { bg:["#0a1808","#184018","#2a2818"], loc:"エルム村 ギルド裏・草地", sprites:["🧑","🙍"], dl:[
    { sp:"ナレーション", t:"あっという間の一閃に三人は倒れた。\nだが──エルツは立ち上がった。\n\n三度目の突進でコーザの左胸に\n銅のナイフが突き刺さる──\nクリティカルヒット！" },
    { sp:"コーザ", t:"「有り得ない......\nまさか初心者に膝付かされるなんて\n夢にも思わなかったですよ」" },
    { sp:"クリケット", t:"「あの動き見事だったデシ。\n久々にいいもの見たデシ」" },
    { sp:"コーザ", t:"「勝てない状況では逃げることを\n最優先に考えなさい。\nそれがこの世界で生き残るコツですよ」" },
    { sp:"SYSTEM", t:"── 初心者講習 完了 ──\n\n🎖 初心者講習卒業の証 を入手した！\n物理攻撃力・物理防御力 +1", certificate:true },
    { sp:"ナレーション", t:"講習を終えた頃、辺りは\n美しい赤焼けの夕暮れに染まっていた。\n\n旅立ち行く三人の冒険者。\nクリケットとコーザはその姿が\n見えなくなるまで見送った。", next:9 }
  ]},
  { bg:["#100a00","#1a1006","#0a0804"], loc:"エルム村 宿屋", sprites:["🧑","🧑‍🦱","👩","👵"], dl:[
    { sp:"ナレーション", t:"夕方、クリケットに教えられた宿屋へと向かう三人。\n\n木造の温かみある建物。\n扉を開けると囲炉裏の煙と食事の香りが漂ってきた。" },
    { sp:"老婆", t:"「部屋かい？\n部屋なら空いとるよ。\nもっとも空いてない事なんてないわな」\n\n「あんたらルーキーだろう？\nあの子は無茶するから大変じゃったろう」" },
    { sp:"スウィフト", t:"「はい。今日ギルドで初心者講習受けてきたとこなんですよ」" },
    { sp:"老婆", t:"「そうかえそうかえ。\n\nこのタブレットにサインを書いておくれ。\nチェックアウトは明日の午前十時が規定じゃ」" },
    { sp:"SYSTEM", t:"── チェックイン ──\n\n🏨 エルム村 宿屋\n1泊 20 ELK\n\nHPとMPが全回復しました", innRest:true },
    { sp:"エルツ", t:"「自分の部屋か......\n\nなんか、あまりにも現実と変わらない事に\n感動するのは変かな」" },
    { sp:"エルツ", t:"「僕らはこの世界で衣食住をしてるんだ。\n\n紛れも無く、ここには現実とは別の次元の\nもう一つの現実が広がってるんだ」" },
    { sp:"ナレーション", t:"ベッドに横になり、ふと現実世界の事を考え、\nエルツはすぐに考える事を止めた。\n\nそもそも、ここへ来たのは\nそんな現実世界から逃れるために\nやってきたのだから。", next:10 }
  ]},
  { bg:["#0a1206","#1a2a0a","#100e04"], loc:"エルム村 レミングスの酒場", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"木々に囲まれたオープンテラス。\n蔓で吊り下げられたランプが淡い光を漏らす。\n\nそこがレミングスの酒場だった。" },
    { sp:"スウィフト", t:"「とりあえず席だけ取っとこう。\n\n折角だからさ、だって酒場だし。\n飲む？」" },
    { sp:"エルツ", t:"「いや......折角だから──\n\nビール追加」" },
    { sp:"スウィフト", t:"「なんだよ、結局飲むんじゃん！」" },
    { sp:"ナレーション", t:"テーブルの中央にふわっと光が漂い、\nビールのジョッキが三つ現れた。" },
    { sp:"スウィフト", t:"「ジョッキかよ！」\n\n「それじゃ、三人の出会いを祝って──\n乾杯！」" },
    { sp:"エルツ", t:"「ああ、生き返る！」" },
    { sp:"ナレーション", t:"記念すべきこの世界での一日目の夜。\n温かい食事に気づけば酔いも回り、\nあっという間に過ぎてゆく時間。\n\n心地よい仲間との出会いによって\n飾られていた。", next:11 }
  ]},
  { bg:["#0a1a30","#1a5080","#8ab8c8"], loc:"イルカ島 海岸線", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"翌朝──\n\n宿屋を出た三人は村の外へ。\n穴道を抜けると澄み渡った青空と\n広大な蒼海が広がっていた。" },
    { sp:"エルツ", t:"「なんか、昨日来たって感じがしないな。\nずっと昔に来たみたいだ」" },
    { sp:"スウィフト", t:"「それだけ、昨日一日が濃密だったって事だよ」" },
    { sp:"ナレーション", t:"体長五十センチ程の大きなヤドカリのような生物が\n無数に群がっている──" },
    { sp:"エルツ", t:"「あれが......シャメロット？\n\nPBのMapScanで確認すると......Lv1か」" },
    { sp:"スウィフト", t:"「どうする？　やってみる？」" },
    { sp:"エルツ", t:"「行こう。\n\nまず一匹、様子を見ながら戦ってみよう」", battle:true, battleType:"shamerlot", battleNext:12 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩"], dl:[
    { sp:"ナレーション", t:"何とか一匹を討伐。\n\n甲殻を剣で叩き続けること数分──\n光の粒子となって岩蟹は消えた。" },
    { sp:"エルツ", t:"「あれ、経験値が入ってない？」" },
    { sp:"スウィフト", t:"「パーティだと経験値入らないのかな？」" },
    { sp:"SYSTEM", gainExp:"shamerlot", t:"ソロで再挑戦の結果──\nEXP +20 獲得！\n\nパーティでの経験値には\n自分より強いLvのモンスターと\n戦う必要があることが判明。" },
    { sp:"ナレーション", t:"そうして三人は各自でシャメロットを狩り始めた。\n\n仮想現実の世界で汗を流しながら、\nエルツは静かに力を蓄えていた。", next:13 }
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 交易所", sprites:["🧑","🧑‍🦱","👩","👨","👩‍🦰"], dl:[
    { sp:"ナレーション", t:"昼食をレミングスの酒場で取りながら、\n一同は今後の計画を練っていた。" },
    { sp:"エルツ", t:"「まず情報収集だ。\nこの世界のルールを把握しないと\n先へは進めない」" },
    { sp:"SYSTEM", t:"── 売却 ──\n\nシャメロットの甲羅 x3\n▶ 75 ELK 獲得\n\n所持金 合計: 175 ELK", sellElk:75 },
    { sp:"ローズ", t:"「買い方がわからないの？\nPBを出して。\n\nインデックスで Viewer という項目を選ぶの。\nそこで MapScan っていう項目を選ぶの」", mapScanUnlock:true },
    { sp:"エルツ", t:"「へぇ、こんな機能が。\nありがとうございます、ローズさん」" },
    { sp:"ローズ", t:"「試練の洞窟ならギルドに行けば\n情報聞けるよ。\n\nあと......ジュダ！\nこの子達に少し教えてあげて」" },
    { sp:"ジュダ", t:"「......まぁ頑張れよ」\n\nそれだけ言うと、ジュダは\nまた手元の作業へ戻っていった。" },
    { sp:"エルツ", t:"「変な奴だったけど、\nなぜか嫌いじゃなかったな」", next:14 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"道具屋を後にした一行は\n再びシャメロットが群がる岩場へ──\n\n岩場には先客の姿があった。\n背丈の小さい少年が、懸命に\n岩蟹と格闘している。" },
    { sp:"チョッパー", t:"「えいっ、えいっ......！」" },
    { sp:"エルツ", t:"「今は各自で狩ろう。\nいざというときはフォローし合えるように\nあまり離れないようにしておこう」" },
    { sp:"ナレーション", t:"そうして三人はそれぞれシャメロットを狩り始めた。\n\nその時──", next:15 }
  ]},
  { bg:["#0a1808","#1a2808","#301008"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"チョッパー", t:"「うわぁ！\n\n助けて！！」" },
    { sp:"ナレーション", t:"突然聞こえた悲鳴に\n三人の視線がその声の主を追う──\n\n少年の身体が赤く発光し、\n点滅を始めた。\n\n⚠ HPが危険域──赤信号！" },
    { sp:"スウィフト", t:"「やばい、あの子のHP！」" },
    { sp:"エルツ", t:"「行くぞ、二人とも！」" },
    { sp:"ナレーション", t:"Lv3のシャメロットが少年に迫る。\nエルツは剣を抜いて駆けた──", battle:true, battleType:"shamerlot_lv3", battleNext:16 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"エルツ", t:"「危うく死ぬとこだった。\nいやぁ、むやみに善意で突っ込むもんじゃないね」" },
    { sp:"スウィフト", t:"「いやいや、瀕死で助けに突っ込む\nその姿こそ美しい」" },
    { sp:"チョッパー", t:"「......たすけてくれたの？」" },
    { sp:"エルツ", t:"「うん。怪我は大丈夫？」" },
    { sp:"チョッパー", t:"「うん......ありがとう」\n\n少年は静かに、だがはっきりと\nそう言った。" },
    { sp:"エルツ", t:"「チョッパーか。\nよかったら一緒に狩りしよう。\nこっちもちょうど人手が欲しかったんだ」" },
    { sp:"ナレーション", t:"四人の冒険が、今始まる。", next:17 }
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 武器屋", sprites:["🧑","🧑‍🦱","👩","👦","🧓"], dl:[
    { sp:"ナレーション", t:"翌日──\n\n四人はエルム村の武器屋へ。\n岩蟹を狩り続けて貯めたELKで\n装備を整える時が来た。" },
    { sp:"スウィフト", t:"「俺、槍にする。\nコーザとの戦いで間合いの\n大切さが分かったから」" },
    { sp:"店主", t:"「銅の剣なら87 ELK、\n銅の槍は95 ELK、\n銅の弓は110 ELK、\n銅の短剣は72 ELKだよ」" },
    { sp:"エルツ", t:"「......買えるか確認しよう」", choices:[
      { t:"⚔ 銅の剣を購入する（87 ELK）", buy:"sword" },
      { t:"💰 もう少し考える", next:18 }
    ]}
  ]},
  { bg:["#1a0e06","#2a1808","#1a1208"], loc:"エルム村 防具屋", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"SYSTEM", t:"── 装備購入 ──\n\n⚔ 銅の剣 を入手した！\n物理攻撃力 +6" },
    { sp:"チョッパー", t:"「チョッパーも短剣買えた！」" },
    { sp:"ナレーション", t:"四人それぞれが自分に合った\n武器を手にした。\n\n与えられた環境の中で、\n最大限に力を引き出す──\n\nそれがエルツの信条だった。", next:19 }
  ]},
  { bg:["#0a1a30","#1a5080","#8ab8d0"], loc:"イルカ島 船着場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"装備を整えた翌日──\n\n四人は島の海岸線を北上した。\n小さな桟橋が見えてきた。" },
    { sp:"ナレーション", t:"桟橋の先には、\n眩しいほどの光を放つ大きな門が立っていた。\n\n────────\n洗礼の門（オラクルゲート）\n────────\n\n洗礼を受けた者のみ\nここを通ることができる" },
    { sp:"エルツ", t:"「洗礼......か」\n\n「つまりあの向こうに\n次の大陸があるってことだ」" },
    { sp:"チョッパー", t:"「あの光、きれいだね......」" },
    { sp:"エルツ", t:"「でもその前に──\nまだこの島でやることがある」", next:20 }
  ]},
  { bg:["#0a1808","#183818","#1a2010"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩","👦","👧"], dl:[
    { sp:"ナレーション", t:"ギルドへ戻った四人を\n一人の少女が出迎えた。\n\n明るい雰囲気の、\n人懐っこそうな少女だった。" },
    { sp:"ユミル", t:"「あ、初心者の人たち！\n\nもしかして試練の洞窟、\nまだ行ってない感じ？」" },
    { sp:"ユミル", t:"「じゃあちょうどよかった！\n\n私、ホワイトガーデンって\nコミュニティに入ってるんだけど、\n一緒にどう？\n\n試練の情報なら全部教えられるよ！」" },
    { sp:"エルツ", t:"「コミュニティ......」", choices:[
      { t:"「ぜひ入れてください」", joinCom:true },
      { t:"「もう少し考えます」", next:21 }
    ]}
  ]},
  { bg:["#0a1808","#183818","#1a2010"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩","👦","👧"], dl:[
    { sp:"SYSTEM", t:"── コミュニティ加入 ──\n\n🌸 White Garden に参加しました\n\nメンバー: ユミル、エルツ、スウィフト、リンス、チョッパー" },
    { sp:"ユミル", t:"「やった！\n\nじゃあ試練の洞窟について\n教えるね。\n\n奥を目指して進んでいくと\n急に開ける場所があるの。\n\nそこにアイツ──Simuluu がいるから」" },
    { sp:"エルツ", t:"「Simuluu......ボスか」" },
    { sp:"ユミル", t:"「うん。でも皆で協力すれば\n絶対倒せるから！\n\n気をつけて。\n頑張ってね」" },
    { sp:"ナレーション", t:"ユミルの言葉と笑顔が、\n四人の背中を押した。\n\n試練の洞窟──\nその名を胸に刻み、\n四人は明日への準備を始める。", next:22 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"それからシャメロットを狩り続ける日々──\n\n一日に狩りができる時間は限られている。\n体力的にも四時間半が今の限界だった。\n\nだが不思議と、飽きる事はなかった。" },
    { sp:"スウィフト", t:"「今日、何匹目？」" },
    { sp:"エルツ", t:"「わかんない、もういちいち数えてないよ」" },
    { sp:"ナレーション", t:"エルツがそう答えたその時だった──\n\n突然、エルツの身体が\n煌びやかな光に包まれた。", battle:true, battleType:"shamerlot", battleNext:23 }
  ]},
  { bg:["#0a1808","#184010","#283020"], loc:"イルカ島 岩場", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"そんなやり取りを交わしながら、\n一同は再び狩りへと戻っていった。\n\n過程を楽しむ事こそが、\nエルツのゲームに対する信条だった。", next:24 }
  ]},
  { bg:["#1a0e06","#3a2010","#1a1208"], loc:"エルム村 ギルド", sprites:["🧑","🧑‍🦱","👩","👦","🙍","🤓"], dl:[
    { sp:"ナレーション", t:"あれから二週間──\n\n懸命に岩蟹を狩り続けた四人は、\n装備を整え、試練の洞窟へ向かう\n時が来たと判断していた。" },
    { sp:"コーザ", t:"「皆さんの旅はまだ始まったばかり。\n\nこれから皆さんの旅路が\n輝きあるものになるよう、\nここで祈らせて頂きますよ」" },
    { sp:"コーザ", t:"「皆さんの旅路に光あれ。\n御武運を」\n\n扉から光が溢れ──\n緑々しい自然と青空が広がる。", next:25 }
  ]},
  { bg:["#0a1a30","#1a5080","#8ab8c8"], loc:"イルカ島 西海岸", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"ギルド裏口から伸びる西の海岸線──\n\n海岸線を北上した先に、\nその洞窟はぽっかりと口を開けて\n冒険者達を待ち構えていた。" },
    { sp:"スウィフト", t:"「そう不安になる事ないよチョッパー。\nゲームっていうのは\n必ず攻略できるように作られてるんだ」" },
    { sp:"チョッパー", t:"「......うん」" },
    { sp:"エルツ", t:"「行こう、みんな」", next:26 }
  ]},
  { bg:["#020818","#0a2040","#0d3860"], loc:"試練の洞窟 ─ 青の洞窟", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"薄暗い洞窟内に入ると──\n\n一面に広がる青の世界。\n\n浸水した海水は紺碧の輝きを放ち、\nその輝きは洞窟全体を\n青く照らし上げていた。" },
    { sp:"スウィフト", t:"「嘘......だろ」" },
    { sp:"ナレーション", t:"その純正な青色は、\n今まで彼らが目にしたどんな色よりも\n美しく、そして神聖だった。" },
    { sp:"スウィフト", t:"「こんな綺麗な光景、初めて見た。\n\nあの木漏れ日の草地も綺麗だと\n思ったけど......ここは段違いだ」" },
    { sp:"ナレーション", t:"スウィフトは水面に一歩近づき、\n水をすくう。\n\n手から零れる青色の雫が舞い、\n地表に落下し溶け込んでゆく──" },
    { sp:"エルツ", t:"「行こう、奥へ」\n\n「皆、今のうちに装備と\nステータスを確認しとこう」" },
    { sp:"ナレーション", t:"美しい青の水面を踏みしめながら、\n四人は一歩一歩、洞窟の奥へと\n進んでいった。", next:27 }
  ]},
  { bg:["#010610","#050e28","#0a1840"], loc:"試練の洞窟 ─ 最深部", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"空間は唐突に一同の前に開けた。\n\n空気はいつの間にか\nはっきりとした冷気へと変わっていた。" },
    { sp:"ナレーション", t:"青い水面の上を、\nゆっくりと這う白影。\n\n滑らかな灰白肌の処々には\n白化した貝殻がこびりつき、\n長い首に沿って白い鬣が生え、\n頭部から天に向かう雄々しい鹿角──" },
    { sp:"エルツ", t:"「あれが......Simuluu」" },
    { sp:"ナレーション", t:"「Ｃキュｕィィｉィｉｉ......！！！」\n\n洞窟内に響く鳴き声。\nそれは自らの領域に踏み込んだ\n侵入者への警告だった。\n\nその白亜の姿は、\n戦いを前にした一同にとって\nあまりにも美しかった。", next:28 }
  ]},
  { bg:["#010610","#050e28","#0a1840"], loc:"試練の洞窟 ─ 最深部", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"エルツ", t:"「どうも、いつまでも見惚れてる\n場合じゃなさそうだな」" },
    { sp:"エルツ", t:"「とりあえず散開。\n\nリンスは遠距離から後方援護。\n僕ら三人は近距離から\nトライアングル陣形で攻撃しよう」" },
    { sp:"スウィフト", t:"「また随分と大まかな指示な事で」" },
    { sp:"ナレーション", t:"シムルーの周辺の水面に\n直径一メートル程の水球が浮かび上がる──\n\n「またあのタマ！！」\n\n水球は揺ら揺らと漂い、\n一同目掛けて飛来する！", battle:true, battleType:"simuluu", battleNext:29 }
  ]},
  { bg:["#020818","#0a2040","#0d3860"], loc:"試練の洞窟 ─ 青の洞窟", sprites:["🧑","🧑‍🦱","👩","👦"], dl:[
    { sp:"ナレーション", t:"水面に倒れた偉大なる主を前に、\nそこには今まさに試練を乗り越えた\n者達の姿があった。\n\n青の洞窟内に舞う、\n四人のシルエット。" },
    { sp:"エルツ", t:"「......やった」" },
    { sp:"スウィフト", t:"「勝った！！」" },
    { sp:"チョッパー", t:"「やったやった！！」" },
    { sp:"ナレーション", t:"大量のライフエナジーが\n洞窟内に散って行く、\nその様子は美しくも儚い。\n\nその存在に敬意を払いながら、\nエルツ達はこの戦いを\n自らの糧とした。", next:30 }
  ]},
  { bg:["#0a1206","#1a2a0a","#100e04"], loc:"エルム村 レミングスの酒場", sprites:["🧑","🧑‍🦱","👩","👦","👧"], dl:[
    { sp:"ユミル", t:"「それでは、試練の洞窟\n無事突破を祝ってカンパーイ！」" },
    { sp:"ナレーション", t:"蔓に吊るされたランプの明かりの元へ\n一斉に突き出される杯。\n\n乾杯と同時に盛大に\nアップルジュースを零すチョッパー。" },
    { sp:"エルツ", t:"「楽勝！　楽勝だったよなチョッパー」" },
    { sp:"ユミル", t:"「こっちはびびったんですけど！」" },
    { sp:"ユミル", t:"「皆さんがこれから向かう大陸\n─ Lexia ─ では\n魔法は日常的に見る光景ですよ」" },
    { sp:"エルツ", t:"「─ Lexia ─ か。\n楽しみだな」" },
    { sp:"エルツ", t:"「皆、人間の最も強い欲望って\n何だと思う？」" },
    { sp:"スウィフト", t:"「何だよそれ。\nまた下らない事だったら怒るぞ」" },
    { sp:"エルツ", t:"「排泄欲だよ」" },
    { sp:"スウィフト", t:"「お前、ここまで引っ張っといて\n下ネタか。\n\nいい加減にしろよ酔っ払い！」" },
    { sp:"ナレーション", t:"新世界への憧憬という\n最高の酒のツマミを手に、\nその日もまたいつまでも\n語り合う冒険者達の姿があった。\n\n旅立ちの日は明日──\nそこからまた新たな世界が広がるのだ。", ending:true }
  ]}
];

// @@SECTION:BATTLE_CONFIG ─────────────────────────────────────────────────────
// 【編集ガイド】
//   敵のパターンを変えたいとき → 各エネミーの pattern: [...] だけ書き換える
//   使える行動ID:
//     "atk"         強攻       プレイヤーのcounterに負ける
//     "counter"     カウンター プレイヤーのatkを無効化して反撃、dodgeには空振り
//     "dodge"       回避       このターン敵は行動しない（atkには避けられない）
//     "unavoidable" 回避不能   ボス専用。counter/dodgeを粉砕して高ダメージ
//   データの正本は battle_defs.js で管理。JSXとの同期を保つこと。

// ─── プレイヤー行動 ───────────────────────────────────────────────────────
const BATTLE_SKILLS = [
  { id:"atk",     label:"強攻",      icon:"⚔",  color:"#00ffcc", cost:0,  dmg:[14,22] },
  { id:"counter", label:"カウンター", icon:"🔄", color:"#f97316", cost:10, dmg:[18,28] },
  { id:"dodge",   label:"回避",      icon:"💨",  color:"#a78bfa", cost:8,  dmg:[0,0]   },
  { id:"heal",    label:"回復",      icon:"🧪",  color:"#f0c040", cost:0,  dmg:[0,0]   },
];

// ─── 敵定義 ─────────────────────────────────────────────────────────────
// ★ パターン変更は各エネミーの pattern:[...] だけ編集すればOK
// ★ unavoidableAtk:[min,max] はボス専用の回避不能ダメージ範囲
const INITIAL_BATTLE_DEFS = {

  seagull: {
    name:"カモメ型モンスター", em:"🦅",
    maxHp:55, atk:[8,14], elk:20, exp:15, lv:1,
    bg:["#0a1628","#0d2a5e","#1a5fa0"], isFloating:true, isGround:false,
    // ★ パターン調整ポイント ─────────────────────────────────────────────
    pattern:["atk","dodge","atk","counter"],
  },

  koza: {
    name:"コーザ（訓練）", em:"🙍",
    maxHp:120, atk:[10,16], elk:0, exp:0, lv:1,
    bg:["#0a1808","#184018","#2a2818"], isFloating:false, isGround:true,
    // ★ パターン調整ポイント ─────────────────────────────────────────────
    pattern:["atk","counter","atk","dodge","counter","atk"],
  },

  shamerlot: {
    name:"シャメロット Lv.1", em:"🦀",
    maxHp:80, atk:[6,12], elk:30, exp:20, lv:1,
    bg:["#0a1808","#184010","#283020"], isFloating:false, isGround:true,
    // ★ パターン調整ポイント ─────────────────────────────────────────────
    pattern:["atk","atk","dodge","counter"],
  },

  shamerlot_lv3: {
    name:"シャメロット Lv.3", em:"🦀",
    maxHp:130, atk:[10,18], elk:50, exp:40, lv:3,
    bg:["#0a1808","#1a2808","#301008"], isFloating:false, isGround:true,
    // ★ パターン調整ポイント ─────────────────────────────────────────────
    pattern:["counter","atk","dodge","atk","counter","dodge"],
  },

  shamerlot_lv5: {
    name:"シャメロット Lv.5", em:"🦀",
    maxHp:200, atk:[14,24], elk:80, exp:70, lv:5,
    bg:["#0a1808","#1a2808","#301008"], isFloating:false, isGround:true,
    // ★ パターン調整ポイント ─────────────────────────────────────────────
    pattern:["counter","atk","unavoidable_lite","dodge","atk","counter","atk","dodge"],
  },

  simuluu: {
    name:"Simuluu ─ 試練の主", em:"🦌",
    maxHp:400, atk:[15,25], elk:200, exp:200, lv:6,
    bg:["#010610","#050e28","#0a1840"], isBoss:true, isFloating:false, isGround:true,
    // ★ パターン調整ポイント ─────────────────────────────────────────────
    // unavoidable はカウンター/回避を粉砕するボス専用行動
    pattern:["atk","counter","unavoidable","atk","dodge","unavoidable","counter","unavoidable"],
    unavoidableAtk:[30,45],
  },

};

// @@SECTION:UTILS
const randInt = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const EXP_TABLE = [0,30,80,160,280,450,700];

// @@SECTION:NOVEL_TEXTS ─────────────────────────────────────────────────────
// ノベルテキストはGitHub Pages の novels/ フォルダに外出しされた TXTファイルから
// fetch() で動的読み込みする。
//
// ファイルURL例:
//   https://superapolon.github.io/Arcadia_Assets/novels/s01.txt
//   → ファイルの中身がそのままテキストとして表示される
//
// ファイルの書き方: 改行や字下げをそのまま書くだけでOK。
//   　青く透き通った宝石のような輝きを放つ海原──
//   　その二つが織り成す海岸線はどこまでも──
//
// NOVEL_STATUS: true = ファイルアップロード済み → fetchを試みる
//               false = 未アップロード → 「執筆中」フォールバックを表示
//
// アップロードしたら該当シーンを false → true に変更するだけでOK。
// ファイル命名規則: s{シーンインデックス2桁}.txt  例: s01.txt, s07.txt
const NOVEL_BASE_URL = "https://superapolon.github.io/Arcadia_Assets/novels/";

const NOVEL_STATUS = {
  0:  false,
  1:  true,   // ✅ s01.txt
  2:  true,   // ✅ s02.txt
  3:  true,   // ✅ s03.txt
  4:  true,   // ✅ s04.txt
  5:  true,   // ✅ s05.txt
  6:  true,   // ✅ s06.txt
  7:  true,   // ✅ s07.txt
  8:  true,   // ✅ s08.txt
  9:  true,   // ✅ s09.txt
  10: true,   // ✅ s10.txt
  11: true,   // ✅ s11.txt
  12: true,   // ✅ s12.txt
  13: true,   // ✅ s13.txt
  14: true,   // ✅ s14.txt
  15: true,   // ✅ s15.txt
  16: false,
  17: true,   // ✅ s17.txt
  18: true,   // ✅ s18.txt
  19: true,   // ✅ s19.txt
  20: true,   // ✅ s20.txt
  21: false,
  22: true,   // ✅ s22.txt
  23: false,
  24: true,   // ✅ s24.txt
  25: false,
  26: true,   // ✅ s26.txt
  27: true,   // ✅ s27.txt
  28: true,   // ✅ s28.txt
  29: true,   // ✅ s29.txt
  30: true,   // ✅ s30.txt
};

// ノベルTXTのURL解決ヘルパー -- false のシーンは null を返す
function novelUrl(sceneIdx) {
  if (!NOVEL_STATUS[sceneIdx]) return null;
  const key = String(sceneIdx).padStart(2, "0");
  return `${NOVEL_BASE_URL}s${key}.txt`;
}

// @@SECTION:ASSETS
const BASE_URL = "https://superapolon.github.io/Arcadia_Assets/";

const ASSET_STATUS = {
  "title/title_bg":          true,
  "movies/ch01_opening":     true,   // ✅ 確認済み 2026-03-05
  // ── bgm ──
  "bgm/title":               true,   // ✅ 確認済み 2026-03-05
  "bgm/field":               true,   // ✅ 確認済み 2026-03-05
  "bgm/night":               true,   // ✅ 確認済み 2026-03-05
  "bgm/cave":                true,   // ✅ 確認済み 2026-03-05
  "bgm/battle_normal":       true,   // ✅ 確認済み 2026-03-05
  "bgm/battle_boss":         true,   // ✅ 確認済み 2026-03-05
  "bgm/fanfare":             true,   // ✅ 確認済み 2026-03-05
  "scenes/s00_vrs":          true,   // ✅ 確認済み 2026-03-04
  "scenes/s01_beach":        true,   // ✅ 確認済み 2026-03-04
  "scenes/s02_coast":        true,   // ✅ 確認済み 2026-03-04
  "scenes/s03_village":      true,   // ✅ 確認済み 2026-03-04
  "scenes/s04_guild":        true,   // ✅ 確認済み 2026-03-04
  "scenes/s07_meadow":       true,   // ✅ 確認済み 2026-03-04
  "scenes/s09_inn":          true,   // ✅ 確認済み 2026-03-04
  "scenes/s10_tavern":       true,   // ✅ 確認済み 2026-03-04
  "scenes/s11_coast2":       true,   // ✅ 確認済み 2026-03-04
  "scenes/s13_market":       true,   // ✅ 確認済み 2026-03-04
  "scenes/s14_rocks":        true,   // ✅ 確認済み 2026-03-04
  "scenes/s17_armory":       true,   // ✅ 確認済み 2026-03-04
  "scenes/s19_pier":         true,   // ✅ 確認済み 2026-03-04
  "scenes/s20_guild2":       true,   // ✅ 確認済み 2026-03-04
  "scenes/s25_westcoast":    true,   // ✅ 確認済み 2026-03-04
  "scenes/s26_cave_blue":    true,   // ✅ 確認済み 2026-03-04
  "scenes/s27_cave_deep":    true,   // ✅ 確認済み 2026-03-04
  "battle/bg_coast":         true,
  "battle/bg_meadow":        true,
  "battle/bg_rocks":         true,
  "battle/bg_cave":          true,
  "enemies/seagull":         true,
  "enemies/koza":            true,
  "enemies/shamelot":        true,
  "enemies/simuluu":         true,
  "sprites/eltz":            true,   // ✅ 確認済み 2026-03-02
  "sprites/swift":           true,   // ✅ 確認済み 2026-03-02
  "sprites/linz":            true,   // ✅ 確認済み 2026-03-02
  "sprites/chopper":         true,   // ✅ 確認済み 2026-03-02
  "sprites/cricket":         true,   // ✅ 確認済み 2026-03-02
  "sprites/koza":            true,   // ✅ 確認済み 2026-03-02 ※ファイル名は koza.webp（koza_sp ではない）
  "sprites/rose":            true,   // ✅ 確認済み 2026-03-07
  "sprites/juda":            true,   // ✅ 確認済み 2026-03-07
  "sprites/ymir":            true,   // ✅ 確認済み 2026-03-07
  "sprites/rubens":          true,   // ✅ 確認済み 2026-03-02
  "sprites/traveler":        true,   // ✅ 確認済み 2026-03-07
  "sprites/old_woman":       true,   // ✅ 確認済み 2026-03-07
  "sprites/shopkeeper":      true,   // ✅ 確認済み 2026-03-07
  "skills/atk":              false,
  "skills/skill":            false,
  "skills/guard":            false,
  "skills/item":             false,
};

function assetUrl(key) {
  return ASSET_STATUS[key] ? `${BASE_URL}${key}.webp` : null;
}

// ムービーURL解決ヘルパー -- 拡張子は .mp4 固定
function movieUrl(key) {
  return ASSET_STATUS[key] ? `${BASE_URL}${key}.mp4` : null;
}

// BGM URL解決ヘルパー -- 拡張子は .mp3 固定
function bgmUrl(key) {
  return ASSET_STATUS[key] ? `${BASE_URL}${key}.mp3` : null;
}

// ── BGM割り当てマップ ──────────────────────────────────────────────────────
const PHASE_BGM = {
  title:  "bgm/title",
  ending: "bgm/field",
};

const LOC_BGM = {
  "VRS接続中":               "bgm/field",
  "旅立ちの浜辺":             "bgm/field",
  "イルカ島 海岸線":          "bgm/field",
  "エルム村":                "bgm/field",
  "エルム村 ギルド":          "bgm/field",
  "エルム村 ギルド裏・草地":   "bgm/field",
  "エルム村 交易所":          "bgm/field",
  "エルム村 武器屋":          "bgm/field",
  "エルム村 防具屋":          "bgm/field",
  "イルカ島 岩場":            "bgm/field",
  "イルカ島 船着場":          "bgm/field",
  "イルカ島 西海岸":          "bgm/field",
  "エルム村 ギルド（ユミル登場）": "bgm/field",
  "エルム村 宿屋":            "bgm/night",
  "エルム村 レミングスの酒場": "bgm/night",
  "試練の洞窟 ─ 青の洞窟":   "bgm/cave",
  "試練の洞窟 ─ 最深部":     "bgm/cave",
};

const BATTLE_BGM = {
  seagull:       "bgm/battle_normal",
  koza:          "bgm/battle_normal",
  shamerlot:     "bgm/battle_normal",
  shamerlot_lv3: "bgm/battle_normal",
  shamerlot_lv5: "bgm/battle_normal",
  simuluu:       "bgm/battle_boss",
};

function resolveBgmId(phase, sceneLoc, enemyType) {
  if (phase === "title" || phase === "tos") return PHASE_BGM.title;
  if (phase === "end")     return PHASE_BGM.ending;
  if (phase === "victory") return null;  // ファンファーレはplayFanfareで別管理
  if (phase === "battle")  return BATTLE_BGM[enemyType] ?? null;
  if (phase === "game")    return LOC_BGM[sceneLoc] ?? null;
  return null;
}

const ENEMY_IMG_MAP = {
  seagull:       "enemies/seagull",
  koza:          "enemies/koza",
  shamerlot:     "enemies/shamelot",
  shamerlot_lv3: "enemies/shamelot",
  shamerlot_lv5: "enemies/shamelot",
  simuluu:       "enemies/simuluu",
};

const SPRITE_MAP = {
  "🧑":     "sprites/eltz",
  "🧑‍🦱":     "sprites/swift",
  "👩":     "sprites/linz",
  "👦":     "sprites/chopper",
  "🐰":     "sprites/cricket",
  "🙍":     "sprites/koza",
  "👩‍🦰":     "sprites/rose",
  "👨":     "sprites/juda",
  "👧":     "sprites/ymir",
  "🤓":     "sprites/rubens",
  "👤":     "sprites/traveler",
  "👵":     "sprites/old_woman",
  "🧓":     "sprites/shopkeeper",
};

// @@SECTION:SPRITE_SIZE ────────────────────────────────────────────────────
// スプライトごとの表示サイズ個別設定。変更したいときはここだけ編集する。
//
// scale:        最大表示高さ（スプライトエリア高さ）に対する比率（0.0〜1.0）
//               5人表示時の最大キャラを基準1.0として各キャラの相対比率を指定。
//               これにより人数が少ないほど大きく、かつキャラごとの身長差が出る。
// heroScale:    index=0（主人公）として表示されるときのscale（通常より大きめにできる）
// offsetY:      下端からの垂直オフセット（px）。正値で上に、負値で下にずらす
// fallbackSize: 画像なしの場合の絵文字フォントサイズ（px）
const SPRITE_SIZE = {
  "🧑":    { scale: 1.00, heroScale: 1.00, offsetY:  0, fallbackSize: 52 }, // 🧑  eltz
  "🧑‍🦱":    { scale: 0.96, heroScale: 1.00, offsetY:  0, fallbackSize: 48 }, // 🧑‍🦱 swift
  "👩":    { scale: 0.94, heroScale: 1.00, offsetY:  0, fallbackSize: 48 }, // 👩  linz
  "👦":    { scale: 0.75, heroScale: 1.00, offsetY:  0, fallbackSize: 40 }, // 👦  chopper（少年・低め）
  "🐰":    { scale: 0.55, heroScale: 0.92, offsetY:  0, fallbackSize: 40 }, // 🐰  cricket（小さい）
  "🙍":    { scale: 0.90, heroScale: 1.05, offsetY:  0, fallbackSize: 48 }, // 🙍  koza
  "👩‍🦰":    { scale: 0.97, heroScale: 1.05, offsetY:  0, fallbackSize: 50 }, // 👩‍🦰 rose
  "👨":    { scale: 0.96, heroScale: 1.05, offsetY:  0, fallbackSize: 50 }, // 👨  juda
  "👧":    { scale: 0.86, heroScale: 1.02, offsetY:  0, fallbackSize: 50 }, // 👧  ymir
  "🤓":    { scale: 0.80, heroScale: 1.05, offsetY:  0, fallbackSize: 48 }, // 🤓  rubens
  "👤":    { scale: 0.88, heroScale: 1.02, offsetY:  0, fallbackSize: 50 }, // 👤  traveler
  "👵":    { scale: 0.82, heroScale: 1.00, offsetY:  0, fallbackSize: 50 }, // 👵  old_woman
  "🧓":    { scale: 0.88, heroScale: 1.02, offsetY:  0, fallbackSize: 50 }, // 🧓  shopkeeper
};

// @@SECTION:ENEMY_SIZE ─────────────────────────────────────────────────────
// エネミーごとの表示サイズ設定。変更したいときはここだけ編集する。
//
// 【指定方法】数値 or オブジェクトの2通り:
//
//   数値だけ書く場合 → px固定（縦横ともその値で表示）
//     seagull: 160
//
//   オブジェクトで書く場合 → モードを明示指定
//     { mode:"fixed", size:160 }   // px固定（数値指定と同じ）
//     { mode:"auto",  pct:75  }    // 縦方向基準・左カラム高さの pct% で表示
//                                  // pct 省略時は 80%
//
// 【使い分けの目安】
//   - 画面を大きく使いたいボス・大型エネミー → mode:"auto"
//   - 小さめに見せたい雑魚・人型エネミー    → mode:"fixed" or 数値
//
const ENEMY_IMG_SIZE = {
  seagull:       { mode:"fixed", size: 180 },
  koza:          { mode:"fixed", size: 450 },
  shamerlot:     { mode:"fixed", size: 220 },
  shamerlot_lv3: { mode:"fixed", size: 260 },
  shamerlot_lv5: { mode:"fixed", size: 300 },
  simuluu:       { mode:"fixed", size: 500 },
};

const BATTLE_BG_MAP = {
  seagull:       "battle/bg_coast",
  koza:          "battle/bg_meadow",
  shamerlot:     "battle/bg_rocks",
  shamerlot_lv3: "battle/bg_rocks",
  shamerlot_lv5: "battle/bg_rocks",
  simuluu:       "battle/bg_cave",
};

// @@SECTION:BATTLE_BG_STYLE ─────────────────────────────────────────────────
// バトル背景画像のサイズ・位置をエネミーごとに個別調整する。
// size:     CSS background-size 値（"cover" / "contain" / "120%" など）
// position: CSS background-position 値（"center" / "top center" / "50% 30%" など）
const BATTLE_BG_STYLE = {
  seagull:       { size: "contain", position: "top center" },
  koza:          { size: "contain", position: "top center" },
  shamerlot:     { size: "contain", position: "top center" },
  shamerlot_lv3: { size: "contain", position: "top center" },
  shamerlot_lv5: { size: "contain", position: "top center" },
  simuluu:       { size: "contain", position: "top center" },
};

// @@SECTION:SCENE_BG_STYLE ──────────────────────────────────────────────────
// シーン背景画像のサイズ・位置をロケーションごとに個別調整する。
// size:     CSS background-size 値（"cover" / "contain" / "120%" など）
// position: CSS background-position 値（"center" / "top center" / "50% 30%" など）
// ※ キーは LOC_TO_SCENE_IMG のキー（loc文字列）と一致させる
const SCENE_BG_STYLE = {
  "VRS接続中":               { size: "contain", position: "center" },
  "旅立ちの浜辺":            { size: "contain", position: "center" },
  "イルカ島 海岸線":         { size: "contain", position: "center" },
  "エルム村":                { size: "contain", position: "center" },
  "エルム村 ギルド":         { size: "contain", position: "center" },
  "エルム村 ギルド裏・草地": { size: "contain", position: "center" },
  "エルム村 宿屋":           { size: "contain", position: "center" },
  "エルム村 レミングスの酒場":{ size: "contain", position: "center" },
  "イルカ島 岩場":           { size: "contain", position: "center" },
  "エルム村 交易所":         { size: "contain", position: "center" },
  "エルム村 武器屋":         { size: "contain", position: "center" },
  "エルム村 防具屋":         { size: "contain", position: "center" },
  "イルカ島 船着場":         { size: "contain", position: "center" },
  "イルカ島 西海岸":         { size: "contain", position: "center" },
  "試練の洞窟 ─ 青の洞窟":  { size: "contain", position: "center" },
  "試練の洞窟 ─ 最深部":    { size: "contain", position: "center" },
};

const LOC_TO_SCENE_IMG = {
  "VRS接続中":               "scenes/s00_vrs",
  "旅立ちの浜辺":            "scenes/s01_beach",
  "イルカ島 海岸線":         "scenes/s02_coast",
  "エルム村":                "scenes/s03_village",
  "エルム村 ギルド":         "scenes/s04_guild",
  "エルム村 ギルド裏・草地": "scenes/s07_meadow",
  "エルム村 宿屋":           "scenes/s09_inn",
  "エルム村 レミングスの酒場":"scenes/s10_tavern",
  "イルカ島 岩場":           "scenes/s14_rocks",
  "エルム村 交易所":         "scenes/s13_market",
  "エルム村 武器屋":         "scenes/s17_armory",
  "エルム村 防具屋":         "scenes/s17_armory",
  "イルカ島 船着場":         "scenes/s19_pier",
  "イルカ島 西海岸":         "scenes/s25_westcoast",
  "試練の洞窟 ─ 青の洞窟":  "scenes/s26_cave_blue",
  "試練の洞窟 ─ 最深部":    "scenes/s27_cave_deep",
};

// 勝利画面ボタン -- 1回目押下でファンファーレ開始、2回目押下でシーン遷移
function VictoryButton({ onFanfareStart, onProceed }) {
  const [started, setStarted] = useState(false);
  const handleClick = () => {
    if (!started) {
      setStarted(true);
      onFanfareStart();
    } else {
      onProceed();
    }
  };
  const label  = started ? "次へ ▶" : "結果を確認  ▶";
  const border = started ? C.accent2 : C.gold;
  const color  = started ? C.accent2 : C.gold;
  return (
    <button
      onClick={handleClick}
      style={{padding:"12px 52px",background:"transparent",border:`1px solid ${border}`,color,fontSize:15,letterSpacing:4,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",transition:"all 0.3s"}}
      onMouseEnter={e => { e.currentTarget.style.background = `${border}22`; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >{label}</button>
  );
}

// @@SECTION:ORIENTATION_HOOK ────────────────────────────────────────────────
// 縦長（portrait）か横長（landscape）かを判定するカスタムフック。
// portrait = true  → モバイル縦持ちレイアウトを使用
// portrait = false → 既存の横長レイアウトをそのまま使用
function useIsPortrait() {
  const getPortrait = () => {
    if (typeof window === "undefined") return false;
    return window.innerHeight > window.innerWidth;
  };
  const [isPortrait, setIsPortrait] = useState(getPortrait);
  useEffect(() => {
    const handler = () => setIsPortrait(getPortrait());
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);
  return isPortrait;
}

// @@SECTION:MAIN_COMPONENT
export default function Arcadia() {
  const isPortrait = useIsPortrait();
  // @@SECTION:STATE_ADVENTURE
  const [phase, setPhase] = useState("title");
  const [tosScrolled, setTosScrolled] = useState(false);
  // エネミーパターンをランタイムで編集可能なステートとして保持
  const [battleDefs, setBattleDefs] = useState(INITIAL_BATTLE_DEFS);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [dlIdx, setDlIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(false);
  const [choices, setChoices] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [pbTab, setPbTab] = useState(0);
  const [fade, setFade] = useState(false);
  const [notif, setNotif] = useState(null);
  const [lvUpInfo, setLvUpInfo] = useState(null);
  const [showStatUI, setShowStatUI] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const autoAdvanceRef = useRef(false);
  const setAutoAdv = (v) => { autoAdvanceRef.current = v; setAutoAdvance(v); };
  const [novelLog, setNovelLog] = useState([]);  // { sp, t, sIdx }[] -- 全ダイアログ履歴
  const [novelSelScene, setNovelSelScene] = useState(null);  // 表示中のシーンindex
  const [novelTab, setNovelTab] = useState("novel");  // "novel" | "log"
  const [novelCache, setNovelCache] = useState({});   // { [sceneIdx]: string | null } fetchキャッシュ
  const [novelLoading, setNovelLoading] = useState(false);  // fetch中フラグ
  // パターンエディター用ステート
  const [editorSelKey, setEditorSelKey] = useState("seagull");
  const [showExport, setShowExport] = useState(false);

  // @@SECTION:STATE_PLAYER
  const [hp, setHp] = useState(100);
  const [mhp, setMhp] = useState(100);
  const [mp, setMp] = useState(80);
  const [mmp, setMmp] = useState(80);
  const [elk, setElk] = useState(50);
  const [lv, setLv] = useState(1);
  const [exp, setExp] = useState(0);
  const [weapon, setWeapon] = useState("銅の短剣");
  const [weaponPatk, setWeaponPatk] = useState(3);   // 武器による物理ATK補正（銅の短剣+3）
  const [statPoints, setStatPoints] = useState(0);
  const [statAlloc, setStatAlloc] = useState({patk:10,pdef:10,matk:10,spd:10});
  const [hasPb, setHasPb] = useState(false);
  const [hasMapScan, setHasMapScan] = useState(false);
  const [inCom, setInCom] = useState(false);

  // @@SECTION:STATE_BATTLE
  const [battleEnemy, setBattleEnemy] = useState(null);
  const [currentEnemyType, setCurrentEnemyType] = useState(null);
  const [enemyHp, setEnemyHp] = useState(0);
  const [btlLogs, setBtlLogs] = useState([]);
  const [guarding, setGuarding] = useState(false);
  const [victory, setVictory] = useState(false);
  const [defeat, setDefeat] = useState(false);
  const [turn, setTurn] = useState(0);
  const [battleNext, setBattleNext] = useState(null);
  const [battlePrev, setBattlePrev] = useState(null); // 敗北時の戻り先（バトル開始直前シーン）
  const [btlAnimEnemy, setBtlAnimEnemy] = useState(false);
  const [btlAnimPlayer, setBtlAnimPlayer] = useState(false);
  const [victoryNextSc, setVictoryNextSc] = useState(null); // 勝利画面から遷移する先シーン
  // 戦闘リザルトデータ。将来: dropItems追加予定
  // { gainExp, gainElk, currentElk, currentExp, currentLv, expToNext }
  const [battleResult, setBattleResult] = useState(null);
  // 敵の行動ローテーション用インデックス
  const [enemyTurnIdx, setEnemyTurnIdx] = useState(0);
  // 今ターンの敵予告行動（UI表示用）
  const [enemyNextAction, setEnemyNextAction] = useState(null);
  // 連続無被弾ターン数（Comboカウンター）
  const [noDmgStreak, setNoDmgStreak] = useState(0);
  // リザルト表示用ボーナス情報（コンボ・格上倍率）
  const [battleResultBonus, setBattleResultBonus] = useState({ comboMult: 1.0, gradeMult: 1.0 });

  const typeTimerRef = useRef(null);
  const notifTimerRef = useRef(null);
  const textScrollRef = useRef(null);
  const tapStartYRef  = useRef(0);   // スクロール判定用
  const autoAdvTimerRef = useRef(null); // オート進行タイマー
  const spriteAreaRef = useRef(null); // スプライトエリア実測高さ取得用
  const [spriteAreaH, setSpriteAreaH] = useState(0); // スプライトエリア実測高さ(px)

  // ── BGM制御 ref ────────────────────────────────────────────────────────────
  const audioRef        = useRef(null);   // 現在再生中のAudioインスタンス
  const currentBgmRef   = useRef(null);   // 現在再生中のbgmId
  const audioUnlocked   = useRef(false);  // AutoPlay Policy: ユーザー操作後にtrue
  const pendingBgmRef   = useRef(null);   // アンロック前に要求されたbgmId
  const fanfareRef      = useRef(null);   // ファンファーレ専用Audioインスタンス
  const isFanfareRef    = useRef(false);  // ファンファーレ再生中フラグ

  const FADE_OUT_MS = 1000;
  const FADE_IN_MS  = 800;

  // fadeOutはタイマーをローカル管理（競合しない）
  const fadeOut = useCallback((audio, ms, onDone) => {
    if (!audio) { onDone(); return; }
    const steps    = 20;
    const interval = ms / steps;
    const delta    = audio.volume / steps;
    let count      = 0;
    let timer      = null;
    timer = setInterval(() => {
      count++;
      audio.volume = Math.max(0, audio.volume - delta);
      if (count >= steps) { clearInterval(timer); onDone(); }
    }, interval);
  }, []);

  const fadeIn = useCallback((audio, ms, targetVolume = 0.7) => {
    const steps    = 20;
    const interval = ms / steps;
    const delta    = targetVolume / steps;
    let count      = 0;
    const timer = setInterval(() => {
      count++;
      audio.volume = Math.min(targetVolume, audio.volume + delta);
      if (count >= steps) clearInterval(timer);
    }, interval);
  }, []);

  // ── スプライトエリア高さ実測（ResizeObserver）──────────────────────────────
  useEffect(() => {
    const el = spriteAreaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect?.height ?? 0;
      if (h > 0) setSpriteAreaH(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // BGMを即再生する内部関数（アンロック済み前提）
  const _startBgm = useCallback((nextId) => {
    // ファンファーレ再生中はBGM切り替えをスキップ
    if (isFanfareRef.current) { currentBgmRef.current = nextId; return; }
    const nextUrl = nextId ? bgmUrl(nextId) : null;
    fadeOut(audioRef.current, FADE_OUT_MS, () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      currentBgmRef.current = nextId;
      if (!nextUrl) return;
      const audio = new Audio(nextUrl);
      audio.loop   = true;
      audio.volume = 0;
      audio.play().catch(() => {});
      audioRef.current = audio;
      fadeIn(audio, FADE_IN_MS);
    });
  }, [fadeOut, fadeIn]);

  const switchBgm = useCallback((nextId) => {
    if (currentBgmRef.current === nextId) return;
    // ユーザー操作前はpendingに積むだけ（AutoPlay Policy対策）
    if (!audioUnlocked.current) {
      pendingBgmRef.current = nextId;
      return;
    }
    _startBgm(nextId);
  }, [_startBgm]);

  // ユーザーの最初の操作でAudioContextをアンロックし、pendingBGMを再生する
  const unlockAudio = useCallback((bgmId) => {
    audioUnlocked.current = true;
    const target = bgmId ?? pendingBgmRef.current;
    pendingBgmRef.current = null;
    if (target && currentBgmRef.current !== target) {
      _startBgm(target);
    }
  }, [_startBgm]);

  // ファンファーレ再生。メインBGMとは独立したAudioで再生し競合しない。
  const playFanfare = useCallback((onDone) => {
    const url = bgmUrl("bgm/fanfare");
    // urlなし or AutoPlayブロック時でも必ずonDoneを呼ぶためフラグで管理
    let called = false;
    const done = () => {
      if (!called) {
        called = true;
        isFanfareRef.current = false;
        fanfareRef.current = null;
        onDone?.();
      }
    };

    if (!url) { done(); return; }

    // メインBGMをフェードダウン（停止はしない）
    if (audioRef.current) {
      fadeOut(audioRef.current, 600, () => {
        if (audioRef.current) audioRef.current.volume = 0;
      });
    }

    isFanfareRef.current = true;
    if (fanfareRef.current) { fanfareRef.current.pause(); fanfareRef.current = null; }

    const audio = new Audio(url);
    audio.loop   = false;
    audio.volume = 0.8;
    fanfareRef.current = audio;
    audio.onerror = done;

    // play()が失敗（AutoPlayブロック含む）した場合も即done
    audio.play().then(() => {
      // 再生成功: onendedで遷移、念のため最大10秒のフォールバック
      const fallback = setTimeout(done, 10000);
      audio.onended = () => { clearTimeout(fallback); done(); };
      audio.onerror = () => { clearTimeout(fallback); done(); };
    }).catch(() => {
      // 再生失敗 → 即座にシーン遷移
      done();
    });
  }, [fadeOut]);

  // @@SECTION:LOGIC_TYPEWRITER
  const startType = useCallback((text, onDone) => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    setTyping(true);
    setDisplayText("");
    let i = 0;
    const tick = () => {
      if (i >= text.length) { setTyping(false); onDone && onDone(); return; }
      const ch = text[i];
      setDisplayText(text.slice(0,i+1));
      i++;
      const delay = /[。！？...]/.test(ch) ? 120 : ch==="\n" ? 80 : 28;
      typeTimerRef.current = setTimeout(tick, delay);
    };
    tick();
  }, []);

  const showNotif = useCallback((msg) => {
    setNotif(msg);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotif(null), 2800);
  }, []);

  const showDl = useCallback((sIdx, dIdx) => {
    const sc = SCENES[sIdx];
    if (!sc) return;
    const dl = sc.dl[dIdx];
    if (!dl) return;

    // シナリオログに追記（sceneIdxも記録してシーン別表示に対応）
    setNovelLog(prev => [...prev, { sp: dl.sp, t: dl.t, sIdx: sIdx }]);

    // Handle events
    if (dl.pbOpen) setHasPb(true);
    if (dl.mapScanUnlock) { setHasMapScan(true); showNotif("📡 MapScan 解放！"); }
    if (dl.innRest) {
      setHp(h => { const v = Math.max(h, mhp); return v; });
      setMp(m => { const v = Math.max(m, mmp); return v; });
      setHp(mhp); setMp(mmp);
      showNotif("🏨 HP・MP が全回復した！");
    }
    if (dl.sellElk) {
      setElk(e => e + dl.sellElk);
      if (dl.sellElk > 0) showNotif(`💰 ${dl.sellElk} ELK 獲得！`);
    }
    if (dl.gainExp) {
      const ed = battleDefs[dl.gainExp];
      if (ed) handleExpGain(ed.exp, ed.lv);
    }
    if (dl.joinCom) setInCom(true);
    if (dl.certificate) {
      setStatAlloc(sa => ({ ...sa, patk: sa.patk + 1, pdef: sa.pdef + 1 }));
      showNotif("🎖 物理攻撃力・物理防御力 +1！");
    }

    // Battle
    if (dl.battle) {
      const eKey = dl.battleType || "seagull";
      const ed = battleDefs[eKey];
      setBattleEnemy(ed);
      setCurrentEnemyType(eKey);
      setEnemyHp(ed.maxHp);
      setBtlLogs([`⚔ ${ed.name} との戦闘が始まった！`]);
      setGuarding(false);
      setVictory(false);
      setDefeat(false);
      setTurn(0);
      setNoDmgStreak(0);
      setBattleResultBonus({ comboMult: 1.0, gradeMult: 1.0 });
      setEnemyTurnIdx(0);
      setEnemyNextAction((ed.pattern || ["atk"])[0]);
      setBattleNext(dl.battleNext !== undefined ? dl.battleNext : sIdx + 1);
      setBattlePrev(sIdx);
      setPhase("battle");
      return;
    }

    // Ending
    if (dl.ending) {
      startType(dl.t, () => setTimeout(() => { setFade(true); setTimeout(() => { setPhase("end"); setFade(false); }, 600); }, 1200));
      return;
    }

    startType(dl.t, () => {
      if (dl.choices) { setChoices(dl.choices); return; }
      // オートページめくり: 選択肢・バトル・ending以外のみ発火
      if (autoAdvanceRef.current) {
        if (autoAdvTimerRef.current) clearTimeout(autoAdvTimerRef.current);
        autoAdvTimerRef.current = setTimeout(() => {
          if (!autoAdvanceRef.current) return;
          // dl.next 指定あり → シーン遷移
          if (dl.next !== undefined) {
            setFade(true);
            setTimeout(() => { setSceneIdx(dl.next); setDlIdx(0); setFade(false); }, 300);
            return;
          }
          // 次のダイアログへ
          const sc2 = SCENES[sIdx];
          const nextDl = dIdx + 1;
          if (nextDl < sc2.dl.length) {
            setDlIdx(nextDl);
          } else {
            const nextSc = sIdx + 1;
            if (nextSc < SCENES.length) {
              setFade(true);
              setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300);
            }
          }
        }, 1800);
      }
    });
  }, [mhp, mmp, showNotif, startType]);

  // enemyLv を受け取り、プレイヤーLvとの差で倍率を計算して経験値付与
  const handleExpGain = useCallback((amount, enemyLv, comboMult) => {
    // 自分以下のLvの敵からは経験値なし（コーザ/シムルー除外フラグは呼び出し側で制御）
    if (enemyLv !== undefined && enemyLv <= lv - 1) {
      showNotif("経験値なし（格下の敵）");
      return;
    }
    // 格上ボーナス: 敵Lvが自分より高いほど多く入手
    let gradeBonus = 1.0;
    if (enemyLv !== undefined) {
      const diff = enemyLv - lv;
      if (diff >= 3)       gradeBonus = 2.0;
      else if (diff === 2) gradeBonus = 1.5;
      else if (diff === 1) gradeBonus = 1.2;
    }
    // comboMult は doBattleAction 側で計算済みの値を受け取る（未渡しは 1.0）
    const totalMult   = gradeBonus * (comboMult ?? 1.0);
    const finalAmount = Math.round(amount * totalMult);

    // ── 多段レベルアップ処理（while ループで何段でも対応）──────────────────
    // React の setState は非同期なので、ここでは現在の lv を直接参照して
    // 「何レベル上がるか」「残EXPはいくつか」を同期的に計算してからまとめてセットする。
    let curLv  = lv;
    let curExp = exp + finalAmount;   // exp は useCallback の deps に含まれているため最新値
    let gained = 0;                   // 今回上がったレベル数

    while (curLv < 6) {
      const threshold = EXP_TABLE[curLv];
      if (!threshold || curExp < threshold) break;
      curExp -= threshold;
      curLv  += 1;
      gained += 1;
    }

    // ステートをまとめて更新（gained > 0 なら複数段もまとめて処理）
    if (gained > 0) {
      setLv(curLv);
      setMhp(h  => h  + 10 * gained);
      setHp(prev => prev + 10 * gained);
      setMmp(m  => m  + 5  * gained);
      setMp(prev => prev + 5 * gained);
      setStatPoints(sp => sp + 3 * gained);
      setLvUpInfo({ oldLv: lv, newLv: curLv });
    }
    setExp(curExp);

    // 通知文字列
    const bonusParts = [];
    if (gradeBonus > 1.0)          bonusParts.push(`格上×${gradeBonus}`);
    if ((comboMult ?? 1.0) > 1.0)  bonusParts.push(`Combo×${(comboMult ?? 1.0).toFixed(2)}`);
    const bonusStr = bonusParts.length > 0 ? ` (${bonusParts.join(", ")})` : "";
    showNotif(`✨ EXP +${finalAmount}${bonusStr}！`);
  }, [lv, exp, showNotif]);

  useEffect(() => {
    if (phase === "game") {
      setChoices(null);
      showDl(sceneIdx, dlIdx);
    }
  }, [phase, sceneIdx, dlIdx]);

  // ── タイプライター自動スクロール ─────────────────────────────────────────
  useEffect(() => {
    const el = textScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayText]);

  // ── BGM切り替え（フェーズ・シーン・バトル敵が変わるたびに呼ぶ）──────────
  useEffect(() => {
    const sceneLoc = SCENES[sceneIdx]?.loc;
    const nextId   = resolveBgmId(phase, sceneLoc, currentEnemyType);
    switchBgm(nextId);
  }, [phase, sceneIdx, currentEnemyType, switchBgm]);

  // アンマウント時にBGM・オートタイマーを停止
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (fanfareRef.current) fanfareRef.current.pause();
      if (autoAdvTimerRef.current) clearTimeout(autoAdvTimerRef.current);
    };
  }, []);

  // @@SECTION:LOGIC_DIALOG_TAP
  const onTapDlg = useCallback(() => {
    if (choices) return;
    // 手動タップ時はオートタイマーをリセット（次のページはオートが再スケジュールする）
    if (autoAdvTimerRef.current) clearTimeout(autoAdvTimerRef.current);
    if (typing) {
      if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      const sc = SCENES[sceneIdx];
      const dl = sc?.dl[dlIdx];
      if (dl) setDisplayText(dl.t);
      setTyping(false);
      if (sc?.dl[dlIdx]?.choices) setChoices(sc.dl[dlIdx].choices);
      return;
    }
    // Advance
    const sc = SCENES[sceneIdx];
    const dl = sc?.dl[dlIdx];
    if (!dl) return;
    if (dl.choices) return;

    // Ending フラグがある場合はエンディングへ遷移
    if (dl.ending) {
      setFade(true);
      setTimeout(() => { setPhase("end"); setFade(false); }, 600);
      return;
    }

    if (dl.next !== undefined) {
      setFade(true);
      setTimeout(() => { setSceneIdx(dl.next); setDlIdx(0); setFade(false); }, 300);
    } else {
      const nextDl = dlIdx + 1;
      if (nextDl < sc.dl.length) { setDlIdx(nextDl); }
      else {
        const nextSc = sceneIdx + 1;
        if (nextSc < SCENES.length) { setFade(true); setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300); }
      }
    }
  }, [choices, typing, sceneIdx, dlIdx]);

  // @@SECTION:LOGIC_CHOICE
  const onChoice = useCallback((ch) => {
    setChoices(null);
    if (ch.buy === "sword") {
      if (elk >= 87) {
        setElk(e => e - 87);
        setWeapon("銅の剣");
        setWeaponPatk(6);
        showNotif("⚔ 銅の剣を購入した！ 物理ATK +6");
        const nextSc = sceneIdx + 1;
        setFade(true);
        setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300);
      } else {
        showNotif("💸 ELKが足りない！");
        const nextDl = dlIdx + 1;
        const sc = SCENES[sceneIdx];
        if (nextDl < sc.dl.length) setDlIdx(nextDl);
      }
      return;
    }
    if (ch.joinCom) {
      setInCom(true);
      showNotif("🌸 White Garden に加入した！");
      const nextSc = sceneIdx + 1;
      setFade(true);
      setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300);
      return;
    }
    if (ch.battle) {
      const eKey = ch.battleType || "seagull";
      const ed = battleDefs[eKey];
      setBattleEnemy(ed);
      setCurrentEnemyType(eKey);
      setEnemyHp(ed.maxHp);
      setBtlLogs([`⚔ ${ed.name} との戦闘が始まった！`]);
      setGuarding(false); setVictory(false); setDefeat(false); setTurn(0); setNoDmgStreak(0);
      setBattleResultBonus({ comboMult: 1.0, gradeMult: 1.0 });
      setEnemyTurnIdx(0);
      setEnemyNextAction((ed.pattern || ["atk"])[0]);
      setBattleNext(ch.battleNext !== undefined ? ch.battleNext : sceneIdx + 1);
      setBattlePrev(sceneIdx);
      setPhase("battle");
      return;
    }
    if (ch.next !== undefined) {
      setFade(true);
      setTimeout(() => { setSceneIdx(ch.next); setDlIdx(0); setFade(false); }, 300);
    } else if (ch.reply !== undefined) {
      const nextDl = dlIdx + 1;
      const sc = SCENES[sceneIdx];
      if (nextDl < sc.dl.length) setDlIdx(nextDl);
    } else {
      const nextDl = dlIdx + 1;
      const sc = SCENES[sceneIdx];
      if (nextDl < sc.dl.length) setDlIdx(nextDl);
    }
  }, [elk, sceneIdx, dlIdx, showNotif]);

  // @@SECTION:LOGIC_BATTLE
  // ─── すくみ判定ヘルパー ───────────────────────────────────────────────
  // 戻り値: "win" | "lose" | "neutral"
  function judgeRPS(playerAction, enemyAction) {
    if (enemyAction === "unavoidable") {
      if (playerAction === "counter" || playerAction === "dodge") return "lose_unavoidable";
      return "neutral";
    }
    if (enemyAction === "unavoidable_lite") {
      // 中程度の回避不能：回避は潰すがカウンターは通常ダメージを受けるだけ
      if (playerAction === "dodge") return "lose_unavoidable_lite";
      return "neutral";
    }
    if (playerAction === "atk"     && enemyAction === "counter") return "lose";
    if (playerAction === "counter" && enemyAction === "atk")     return "win";
    if (playerAction === "counter" && enemyAction === "dodge")   return "lose";
    if (playerAction === "dodge"   && enemyAction === "counter") return "win";
    if (playerAction === "dodge"   && enemyAction === "atk")     return "lose";
    if (playerAction === "atk"     && enemyAction === "dodge")   return "neutral";
    return "neutral";
  }

  const ENEMY_ACTION_LABEL = {
    atk:         { icon:"⚔",  text:"強攻" },
    counter:     { icon:"🔄", text:"カウンター" },
    dodge:       { icon:"💨", text:"回避" },
    unavoidable: { icon:"💥", text:"回避不能攻撃！" },
    unavoidable_lite: { icon:"⚡", text:"強化攻撃！" },
  };

  const doBattleAction = useCallback((skillId) => {
    if (victory || defeat) return;
    const sk = BATTLE_SKILLS.find(s => s.id === skillId);
    if (!sk) return;
    if (sk.cost > 0 && mp < sk.cost) { showNotif("MPが足りない！"); return; }

    const ed = battleEnemy;
    // battleDefsから最新パターンを取得（エディターで変更されても即反映）
    const pattern = (battleDefs[currentEnemyType]?.pattern) || ed.pattern || ["atk"];
    const eAction = pattern[enemyTurnIdx % pattern.length];
    const nextEnemyIdx = (enemyTurnIdx + 1) % pattern.length;

    let logs = [];
    let newEnemyHp = enemyHp;
    let newHp = hp;
    let newMp = mp - (sk.cost > 0 ? sk.cost : 0);
    const atkBonus = weaponPatk + Math.floor((statAlloc.patk - 10) * 1.5);
    const defBonus = Math.floor((statAlloc.pdef - 10) * 1.2);

    setBtlAnimEnemy(true); setTimeout(() => setBtlAnimEnemy(false), 400);

    // ─── プレイヤー行動フェーズ ─────────────────────────────────────────
    if (skillId === "heal") {
      // 回復は敵攻撃の後に適用。ここでは宣言ログのみ
      logs.push(`🧪 回復ポーションを使った...`);
    } else if (skillId === "dodge") {
      // 回避ターンはダメージを与えない（回避成否は敵行動フェーズで判定）
      logs.push("💨 回避態勢をとった！");
    } else {
      // atk / counter のダメージを計算（すくみで無効化される可能性あり）
      const rawDmg = Math.max(1, randInt(sk.dmg[0], sk.dmg[1]) + atkBonus);
      const rps = judgeRPS(skillId, eAction);

      if (skillId === "atk" && rps === "lose") {
        // 強攻 → 敵カウンター: プレイヤー攻撃は無効化
        logs.push(`⚔ 強攻！ → 🔄 ${ed.name}にカウンターされた！ 攻撃無効！`);
      } else if (skillId === "atk" && eAction === "dodge") {
        // 強攻 → 敵回避: 看破してダメージ（1行で表現）
        newEnemyHp = Math.max(0, enemyHp - rawDmg);
        logs.push(`⚔ ${ed.name}の回避を看破！ 強攻 ${rawDmg} ダメージ！`);
      } else if (skillId === "counter" && rps === "lose") {
        // カウンター → 敵回避: カウンター空振り
        logs.push(`🔄 カウンター！ → 💨 ${ed.name}に回避された！ カウンター空振り！`);
      } else if (skillId === "counter" && rps === "win") {
        // カウンター → 敵強攻: 追加ダメージ付与
        const bonusDmg = Math.floor(rawDmg * 1.5);
        newEnemyHp = Math.max(0, enemyHp - bonusDmg);
        logs.push(`🔄 カウンター成功！ ${ed.name} に ${bonusDmg} ダメージ（×1.5）！`);
      } else {
        newEnemyHp = Math.max(0, enemyHp - rawDmg);
        logs.push(`${sk.icon} ${sk.label}！ ${ed.name} に ${rawDmg} ダメージ！`);
      }
    }

    // ─── 敵行動フェーズ（敵が生存している場合） ─────────────────────────
    if (newEnemyHp > 0) {
      setBtlAnimPlayer(true); setTimeout(() => setBtlAnimPlayer(false), 400);
      const rps = judgeRPS(skillId, eAction);

      if (eAction === "unavoidable") {
        const uDmg = ed.unavoidableAtk ? randInt(ed.unavoidableAtk[0], ed.unavoidableAtk[1]) : randInt(25, 38);
        const actualUDmg = Math.max(1, uDmg - defBonus);
        newHp = Math.max(0, newHp - actualUDmg);
        if (rps === "lose_unavoidable") {
          logs.push(`💥 回避不能攻撃！ カウンター/回避を粉砕！ ${actualUDmg} ダメージ！`);
        } else {
          logs.push(`💥 回避不能攻撃！ ${actualUDmg} ダメージ！`);
        }
      } else if (eAction === "unavoidable_lite") {
        const uDmg = randInt(18, 28);
        const actualUDmg = Math.max(1, uDmg - defBonus);
        newHp = Math.max(0, newHp - actualUDmg);
        if (rps === "lose_unavoidable_lite") {
          logs.push(`⚡ 強化攻撃！ 回避を粉砕！ ${actualUDmg} ダメージ！`);
        } else {
          logs.push(`⚡ 強化攻撃！ ${actualUDmg} ダメージ！`);
        }
      } else if (eAction === "dodge") {
        if (skillId === "atk") {
          // 強攻 vs 敵回避: ダメージ・ログはプレイヤー行動フェーズで処理済み（行動不能）
        } else if (skillId === "counter") {
          // 敵回避 vs プレイヤーカウンター: すでに上で「カウンター空振り」処理済み
          logs.push(`💨 ${ed.name}は身をかわした！（行動なし）`);
        } else {
          logs.push(`💨 ${ed.name}は身をかわした！（行動なし）`);
        }
      } else if (eAction === "counter") {
        if (skillId === "atk") {
          // 敵カウンター vs プレイヤー強攻: カウンターダメージ
          const cDmg = Math.max(1, randInt(ed.atk[0], ed.atk[1]) + Math.floor(ed.atk[1] * 0.3) - defBonus);
          newHp = Math.max(0, newHp - cDmg);
          logs.push(`🔄 ${ed.name}のカウンター！ ${cDmg} ダメージ！（プレイヤーの攻撃は無効化）`);
        } else if (skillId === "counter") {
          // 敵カウンター vs プレイヤーカウンター成功: 敵攻撃を完全無効化
          // newHpはそのまま（ダメージなし）
          logs.push(`🔄 カウンターで ${ed.name}の攻撃を完全に無効化した！`);
        } else if (skillId === "dodge") {
          // 敵カウンター vs プレイヤー回避: 回避成功
          logs.push(`💨 回避成功！ ${ed.name}のカウンターをかわした！`);
        } else {
          // 回復など: カウンターは発動するが通常ダメージ
          const eDmg = Math.max(1, randInt(ed.atk[0], ed.atk[1]) - defBonus);
          newHp = Math.max(0, newHp - eDmg);
          logs.push(`🔄 ${ed.name}のカウンター！ ${eDmg} ダメージ！`);
        }
      } else {
        // 敵の通常強攻
        if (skillId === "counter" && rps === "win") {
          // カウンター成功: 敵の強攻を完全に封じる（ダメージなし）
          // ※ログはプレイヤー行動フェーズ側で「カウンター成功！」として出力済み
        } else if (skillId === "dodge") {
          // プレイヤー回避 vs 敵強攻: 回避できない
          const eDmg = Math.max(1, randInt(ed.atk[0], ed.atk[1]) - defBonus);
          newHp = Math.max(0, newHp - eDmg);
          logs.push(`⚔ ${ed.name}の強攻！ 回避できず ${eDmg} ダメージ！`);
        } else {
          const eDmg = Math.max(1, randInt(ed.atk[0], ed.atk[1]) - defBonus);
          newHp = Math.max(0, newHp - eDmg);
          logs.push(`⚔ ${ed.name}の強攻！ ${eDmg} ダメージ！`);
        }
      }
    }

    // ─── 回復ポーション適用（敵攻撃後）──────────────────────────────────
    if (skillId === "heal") {
      const healAmt = 80;
      newHp = Math.min(newHp + healAmt, mhp);
      logs.push(`✨ HP +${healAmt} 回復！`);
    }

    // ─── Combo判定（無被弾ストリーク）────────────────────────────────────
    // 「このターン受けたダメージ」を算出する
    const dmgTakenThisTurn = hp - newHp; // 正値 = ダメージを受けた

    // 特例: 回避不能攻撃でも差し引き後ダメージが0以下ならcombo継続とみなす
    const isUnavoidableHit = eAction === "unavoidable" && newEnemyHp > 0;
    const comboBreak = isUnavoidableHit
      ? dmgTakenThisTurn > 0    // unavoidable: 実際にダメージが通った場合のみリセット
      : dmgTakenThisTurn > 0;   // 通常: ダメージを受けたらリセット

    const newStreak = comboBreak ? 0 : noDmgStreak + 1;

    // 3ターン以上継続中はMP回復（combo数 = newStreakで計算）
    let mpComboGain = 0;
    if (newStreak >= 3) {
      mpComboGain = 5 + newStreak;
      newMp = Math.min(newMp + mpComboGain, mmp);
      logs.push(`✨ Combo ${newStreak}! MP +${mpComboGain} 回復！`);
    }

    // ─── ステート更新 ────────────────────────────────────────────────────
    setHp(Math.min(newHp, mhp));
    setMp(Math.max(0, newMp));
    setEnemyHp(newEnemyHp);
    setTurn(t => t + 1);
    setNoDmgStreak(newStreak);
    setEnemyTurnIdx(nextEnemyIdx);
    setEnemyNextAction(pattern[nextEnemyIdx]);
    setBtlLogs(prev => [...prev, ...logs].slice(-10));

    if (newEnemyHp <= 0) {
      setVictory(true);
      setBtlLogs(prev => [...prev, `🏆 ${ed.name}を倒した！`]);
      if (ed.elk > 0) { setElk(e => e + ed.elk); showNotif(`💰 ${ed.elk} ELK 獲得！`); }
      if (ed.exp > 0) {
        const comboTier = Math.floor(newStreak / 15);
        const comboMult = comboTier > 0 ? Math.pow(1.5, comboTier) : 1;
        if (comboTier > 0) {
          setBtlLogs(prev => [...prev, `✨ Combo bonus ×${comboMult.toFixed(2)}！`]);
        }
        // gradeBonus は handleExpGain 内部で計算。ここはcomboMultだけ渡す
        setTimeout(() => handleExpGain(ed.exp, ed.lv, comboMult), 500);
        // リザルト表示用: 格上倍率をローカル計算して保存
        const gradeMult = (() => {
          const diff = ed.lv - lv;
          if (diff >= 3) return 2.0;
          if (diff === 2) return 1.5;
          if (diff === 1) return 1.2;
          return 1.0;
        })();
        setBattleResultBonus({ comboMult, gradeMult });
      }
    } else if (newHp <= 0) {
      setDefeat(true);
      setBtlLogs(prev => [...prev, "💀 戦闘不能..."]);
    }
  }, [victory, defeat, mp, enemyHp, hp, mhp, mmp, lv, battleEnemy, statAlloc, weaponPatk, enemyTurnIdx, noDmgStreak, showNotif, handleExpGain, setBattleResultBonus]);

  const exitBattle = useCallback(() => {
    if (defeat) {
      setHp(Math.floor(mhp * 0.3));
      setMp(Math.floor(mmp * 0.3));
      showNotif("💀 敗北... 直前のシーンへ戻る");
      const prevSc = battlePrev !== null ? battlePrev : sceneIdx;
      setFade(true);
      setTimeout(() => {
        setPhase("game");
        setSceneIdx(prevSc);
        setDlIdx(0);
        setFade(false);
      }, 400);
      return;
    }
    // 勝利時: victoryフェーズへ遷移し、そこでユーザー操作を受けてファンファーレ再生
    const nextSc = battleNext !== null ? battleNext : sceneIdx;
    setVictoryNextSc(nextSc);
    // リザルトデータをセット（EXP/ELKはdoBattleAction内で付与済み）
    const ed = battleEnemy;
    const totalMult = (battleResultBonus.comboMult ?? 1.0) * (battleResultBonus.gradeMult ?? 1.0);
    const displayExp = ed ? Math.round(ed.exp * totalMult) : 0;
    setBattleResult({
      gainExp:    displayExp,
      gainElk:    ed ? ed.elk  : 0,
      comboMult:  battleResultBonus.comboMult  ?? 1.0,
      gradeMult:  battleResultBonus.gradeMult  ?? 1.0,
      // dropItems: [], // 将来: ドロップアイテム配列
    });
    setFade(true);
    setTimeout(() => { setPhase("victory"); setFade(false); }, 300);
  }, [defeat, mhp, mmp, battleNext, battlePrev, sceneIdx, showNotif, battleEnemy, battleResultBonus]);

  // ──────────── RENDER ────────────
  const sc = SCENES[sceneIdx] || SCENES[0];
  const bg = sc.bg;
  const sceneImgKey = LOC_TO_SCENE_IMG[sc.loc];
  const sceneBgUrl = sceneImgKey ? assetUrl(sceneImgKey) : null;
  const sceneBgSt = SCENE_BG_STYLE[sc.loc] ?? { size: "cover", position: "center" };
  const bgStyle = sceneBgUrl
    ? { background: `url(${sceneBgUrl}) ${sceneBgSt.position}/${sceneBgSt.size} no-repeat, linear-gradient(180deg, ${bg[0]} 0%, ${bg[1]} 50%, ${bg[2]} 100%)` }
    : { background: `linear-gradient(180deg, ${bg[0]} 0%, ${bg[1]} 50%, ${bg[2]} 100%)` };

  const keyframes = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Share+Tech+Mono&display=swap');
    @keyframes idle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes blnk { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes dngr { 0%,100%{color:#ff4466} 50%{color:#ff9999} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
    @keyframes glow { 0%,100%{box-shadow:0 0 10px #00c8ff44} 50%{box-shadow:0 0 25px #00c8ff88,0 0 50px #00c8ff33} }
    @keyframes bossFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.03)} }
    @keyframes scanLine { 0%{top:0%} 100%{top:100%} }
    @keyframes notifIn { from{opacity:0;transform:translate(-50%,-20px)} to{opacity:1;transform:translate(-50%,0)} }
    @keyframes victoryRise { 0%{opacity:0;transform:translateY(40px) scale(0.85)} 60%{opacity:1;transform:translateY(-6px) scale(1.04)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes victoryGlow { 0%,100%{text-shadow:0 0 30px #f0c04088,0 0 60px #f0c04044} 50%{text-shadow:0 0 60px #f0c040cc,0 0 120px #f0c04066,0 0 200px #f0c04022} }
    @keyframes starBurst { 0%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1.2) rotate(180deg)} 100%{opacity:0;transform:scale(0.8) rotate(360deg)} }
    @keyframes comboPop { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.4)} 60%{opacity:1;transform:translate(-50%,-50%) scale(1.15)} 100%{opacity:1;transform:translate(-50%,-50%) scale(1)} }
    @keyframes comboPulse { 0%,100%{text-shadow:0 0 20px #f0c040cc,0 0 40px #f0c04088} 50%{text-shadow:0 0 40px #ffffffcc,0 0 80px #f0c040bb,0 0 120px #f0c04044} }
    @keyframes pbSpin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    @keyframes pbSpinR { 0%{transform:rotate(0deg)} 100%{transform:rotate(-360deg)} }
    @keyframes pbPulse { 0%,100%{opacity:0.6;r:6} 50%{opacity:1;r:8} }
    @keyframes pbGlow { 0%,100%{filter:drop-shadow(0 0 4px #00c8ff88)} 50%{filter:drop-shadow(0 0 10px #00c8ffcc) drop-shadow(0 0 20px #00c8ff44)} }
    @keyframes lvPulse { 0%,100%{filter:drop-shadow(0 0 4px #f0c04088)} 50%{filter:drop-shadow(0 0 12px #f0c040cc) drop-shadow(0 0 24px #f0c04044)} }
  `;

  // @@SECTION:RENDER_VICTORY
  if (phase === "victory") {
    const handleFanfareStart = () => {
      unlockAudio(null);
      playFanfare(null);
    };
    const handleProceed = () => {
      if (fanfareRef.current) { fanfareRef.current.pause(); fanfareRef.current = null; }
      isFanfareRef.current = false;
      setFade(true);
      setTimeout(() => {
        setPhase("game");
        setSceneIdx(victoryNextSc ?? 0);
        setDlIdx(0);
        setFade(false);
      }, 400);
    };

    // リザルト表示用の値を解決
    const res        = battleResult ?? {};
    const gainExp    = res.gainExp ?? 0;
    const gainElk    = res.gainElk ?? 0;
    const comboMult  = res.comboMult  ?? 1.0;
    const gradeMult  = res.gradeMult  ?? 1.0;
    const totalMult  = comboMult * gradeMult;
    const dropItems  = res.dropItems ?? [];   // 将来: ドロップアイテム配列
    const expToNext  = EXP_TABLE[lv] ? Math.max(0, EXP_TABLE[lv] - exp) : null;
    // ボーナス行の表示要否
    const hasGradeBonus = gradeMult > 1.0;
    const hasComboBonus = comboMult > 1.0;

    return (
      <div style={{width:"100%",height:"100%",minHeight:"min(600px,100dvh)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#020608 0%,#050d14 40%,#0a1420 100%)",fontFamily:"'Noto Serif JP',serif",position:"relative",overflow:"hidden",userSelect:"none"}}>
        <style>{keyframes}</style>

        {fade && <div style={{position:"absolute",inset:0,background:"#050d14",zIndex:50}}/>}

        {/* 背景パーティクル */}
        {[...Array(24)].map((_,i) => (
          <div key={i} style={{
            position:"absolute",
            width: i%4===0 ? 6 : i%3===0 ? 4 : 2,
            height: i%4===0 ? 6 : i%3===0 ? 4 : 2,
            borderRadius:"50%",
            background: i%3===0 ? C.gold : i%3===1 ? C.accent2 : C.accent,
            top:`${10+Math.random()*80}%`,
            left:`${5+Math.random()*90}%`,
            opacity: 0.3+Math.random()*0.5,
            animation:`starBurst ${2+Math.random()*3}s ${Math.random()*2}s infinite`,
          }}/>
        ))}

        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(240,192,64,0.02) 3px,rgba(240,192,64,0.02) 4px)",pointerEvents:"none",zIndex:1}}/>

        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 24px",width:"100%",maxWidth:460}}>

          {/* ロゴ */}
          <div style={{fontSize:11,letterSpacing:10,color:C.muted,marginBottom:10,fontFamily:"'Share Tech Mono',monospace",animation:"fadeIn 0.8s ease"}}>VRMMORPG</div>
          <div style={{fontSize:44,fontWeight:700,letterSpacing:12,color:C.white,textShadow:`0 0 30px ${C.accent}88`,lineHeight:1,marginBottom:4,animation:"fadeIn 0.8s ease"}}>ARCADIA</div>

          <div style={{width:"100%",height:1,background:`linear-gradient(90deg,transparent,${C.gold}88,transparent)`,margin:"16px auto"}}/>

          {/* BATTLE RESULT ヘッダー */}
          <div style={{fontSize:10,letterSpacing:8,color:C.gold,fontFamily:"'Share Tech Mono',monospace",marginBottom:12,animation:"fadeIn 1s 0.3s ease both"}}>── BATTLE RESULT ──</div>
          <div style={{fontSize:52,fontWeight:700,letterSpacing:6,color:C.gold,animation:"victoryRise 0.8s 0.4s cubic-bezier(0.22,1,0.36,1) both, victoryGlow 2.5s 1.2s ease-in-out infinite",lineHeight:1.1,marginBottom:4}}>戦闘勝利</div>
          <div style={{fontSize:13,letterSpacing:4,color:C.accent2,fontFamily:"'Share Tech Mono',monospace",animation:"fadeIn 1s 1s ease both",marginBottom:20}}>VICTORY</div>

          {/* ─── リザルトパネル ─── */}
          <div style={{background:"rgba(10,26,38,0.85)",border:`1px solid ${C.border}`,borderRadius:4,padding:"16px 24px",marginBottom:20,animation:"slideUp 0.6s 0.8s ease both",textAlign:"left"}}>

            {/* 取得EXP */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}33`}}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>取得 EXP</span>
              <span style={{fontSize:14,color:C.accent2,fontFamily:"'Share Tech Mono',monospace",fontWeight:700}}>+{gainExp}</span>
            </div>

            {/* 格上ボーナス（1.0超のときのみ表示） */}
            {hasGradeBonus && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0 5px 12px",borderBottom:`1px solid ${C.border}22`}}>
                <span style={{fontSize:10,color:C.gold,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>┗ 格上ボーナス</span>
                <span style={{fontSize:12,color:C.gold,fontFamily:"'Share Tech Mono',monospace",fontWeight:700}}>×{gradeMult.toFixed(1)}</span>
              </div>
            )}

            {/* コンボボーナス（1.0超のときのみ表示） */}
            {hasComboBonus && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0 5px 12px",borderBottom:`1px solid ${C.border}22`}}>
                <span style={{fontSize:10,color:C.accent2,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>┗ Combo ボーナス</span>
                <span style={{fontSize:12,color:C.accent2,fontFamily:"'Share Tech Mono',monospace",fontWeight:700}}>×{comboMult.toFixed(2)}</span>
              </div>
            )}

            {/* 合計倍率（いずれかのボーナスがある場合のみ） */}
            {(hasGradeBonus || hasComboBonus) && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0 5px 12px",borderBottom:`1px solid ${C.border}33`}}>
                <span style={{fontSize:10,color:C.accent,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>┗ 合計倍率</span>
                <span style={{fontSize:12,color:C.accent,fontFamily:"'Share Tech Mono',monospace",fontWeight:700}}>×{totalMult.toFixed(2)}</span>
              </div>
            )}

            {/* 取得ELK */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}33`}}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>取得 ELK</span>
              <span style={{fontSize:14,color:C.gold,fontFamily:"'Share Tech Mono',monospace",fontWeight:700}}>+{gainElk}</span>
            </div>

            {/* 所持ELK */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}33`}}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>所持 ELK</span>
              <span style={{fontSize:14,color:C.text,fontFamily:"'Share Tech Mono',monospace"}}>{elk}</span>
            </div>

            {/* 現在EXP / 次のLvまで */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}33`}}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>現在 EXP</span>
              <span style={{fontSize:14,color:C.text,fontFamily:"'Share Tech Mono',monospace"}}>{exp}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}33`}}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>次のLvまで</span>
              <span style={{fontSize:14,color:C.accent,fontFamily:"'Share Tech Mono',monospace"}}>{expToNext !== null ? expToNext : "MAX"}</span>
            </div>

            {/* ドロップアイテム（将来実装 -- 今は「なし」表示） */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0"}}>
              <span style={{fontSize:11,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>ドロップ</span>
              <span style={{fontSize:12,color:dropItems.length > 0 ? C.accent2 : C.muted,fontFamily:"'Share Tech Mono',monospace"}}>
                {dropItems.length > 0 ? dropItems.join(" / ") : "なし"}
              </span>
            </div>
          </div>

          {/* ボタン */}
          <VictoryButton onFanfareStart={handleFanfareStart} onProceed={handleProceed} />
        </div>
      </div>
    );
  }

  // @@SECTION:RENDER_TITLE
  if (phase === "title") {
    // ── 縦長タイトル ──────────────────────────────────────────────────────
    if (isPortrait) return (
      <div style={{width:"100%",height:"100%",minHeight:"100dvh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg,#020810 0%,#050d14 40%,#0a1828 100%)`,backgroundImage:`url(https://superapolon.github.io/Arcadia_Assets/title/title_bg2.webp)`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"'Noto Serif JP',serif",position:"relative",overflowX:"hidden",overflowY:"auto"}}>
        <style>{keyframes}</style>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.015) 2px,rgba(0,200,255,0.015) 4px)",pointerEvents:"none",zIndex:1}}/>
        {[...Array(20)].map((_,i)=>(
          <div key={i} style={{position:"absolute",width:i%5===0?2:1,height:i%5===0?2:1,borderRadius:"50%",background:"#adf",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:0.3+Math.random()*0.5,animation:`blnk ${1.5+Math.random()*2}s ${Math.random()*2}s infinite`}}/>
        ))}
        <div style={{position:"relative",zIndex:2,textAlign:"center",animation:"fadeIn 1.5s ease",padding:"clamp(16px,4vh,40px) 24px",width:"100%",maxWidth:420,boxSizing:"border-box"}}>
          <div style={{fontSize:11,letterSpacing:10,color:C.accent,marginBottom:"clamp(8px,2vh,14px)",fontFamily:"'Share Tech Mono',monospace",textShadow:`0 0 12px ${C.accent},0 2px 6px rgba(0,0,0,0.9)`}}>VRMMORPG</div>
          <div style={{fontSize:"clamp(40px,12vw,72px)",fontWeight:700,letterSpacing:"clamp(4px,2.5vw,14px)",textIndent:"clamp(4px,2.5vw,14px)",color:C.white,textShadow:`0 0 40px ${C.accent},0 0 80px ${C.accent}66,0 3px 14px rgba(0,0,0,1),0 0 2px rgba(0,0,0,1)`,lineHeight:1.1,marginBottom:"clamp(6px,1.5vh,10px)",whiteSpace:"nowrap"}}>ARCADIA</div>
          <div style={{fontSize:"clamp(11px,2.5vw,13px)",letterSpacing:4,color:C.accent2,marginBottom:"clamp(20px,4vh,40px)",fontFamily:"'Share Tech Mono',monospace",textShadow:`0 0 14px ${C.accent2},0 2px 8px rgba(0,0,0,0.95)`}}>─── 理想郷への扉 ───</div>
          <div style={{width:"70%",height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`,margin:`0 auto clamp(20px,4vh,36px)`}}/>
          <button
            onClick={() => { unlockAudio("bgm/title"); setTosScrolled(false); setPhase("tos"); }}
            style={{width:"80%",padding:"clamp(12px,2.5vh,18px) 0",background:"transparent",border:`2px solid ${C.accent}`,boxShadow:`0 0 12px ${C.accent}88,inset 0 0 8px rgba(0,200,255,0.05)`,color:C.accent,fontSize:"clamp(14px,4vw,17px)",letterSpacing:6,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",animation:"glow 2s infinite",transition:"all 0.3s",display:"block",margin:"0 auto"}}
            onMouseEnter={e => e.target.style.background = `${C.accent}22`}
            onMouseLeave={e => e.target.style.background = "transparent"}
          >GAME START</button>
          <div style={{marginTop:"clamp(12px,2.5vh,20px)",fontSize:12,color:C.accent2,letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>VRS CONNECT ▶</div>
          <div style={{width:"70%",height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`,margin:`clamp(16px,3vh,28px) auto 0`}}/>
          <button
            onClick={() => setPhase("patternEditor")}
            style={{marginTop:"clamp(12px,2vh,18px)",padding:"clamp(8px,1.5vh,12px) 0",width:"60%",background:"transparent",border:`1px solid ${C.muted}`,color:C.text,fontSize:11,letterSpacing:4,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",transition:"all 0.3s",display:"block",margin:`clamp(12px,2vh,18px) auto 0`}}
            onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
          >⚙ PATTERN EDITOR</button>
        </div>
      </div>
    );
    // ── 横長タイトル ──────────────────────────────────────────────────────
    return (
    <div style={{width:"100%",height:"100%",minHeight:"min(600px,100dvh)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg,#020810 0%,#050d14 40%,#0a1828 100%)`,backgroundImage:`url(https://superapolon.github.io/Arcadia_Assets/title/title_bg.webp)`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"'Noto Serif JP',serif",position:"relative",overflow:"hidden"}}>
      <style>{keyframes}</style>
      {/* Scanline effect */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.015) 2px,rgba(0,200,255,0.015) 4px)",pointerEvents:"none",zIndex:1}}/>
      {/* Stars */}
      {[...Array(30)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:i%5===0?2:1,height:i%5===0?2:1,borderRadius:"50%",background:"#adf",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,opacity:0.3+Math.random()*0.5,animation:`blnk ${1.5+Math.random()*2}s ${Math.random()*2}s infinite`}}/>
      ))}

      <div style={{position:"relative",zIndex:2,textAlign:"center",animation:"fadeIn 1.5s ease",padding:"clamp(8px,2vh,20px) 24px",boxSizing:"border-box"}}>
        <div style={{fontSize:12,letterSpacing:12,color:C.accent,marginBottom:"clamp(8px,1.5vh,16px)",fontFamily:"'Share Tech Mono',monospace",textShadow:`0 0 12px ${C.accent},0 2px 6px rgba(0,0,0,0.9)`}}>VRMMORPG</div>
        <div style={{fontSize:"clamp(44px,8vh,72px)",fontWeight:700,letterSpacing:"clamp(8px,1.5vh,16px)",paddingLeft:"clamp(8px,1.5vh,16px)",color:C.white,textShadow:`0 0 40px ${C.accent},0 0 80px ${C.accent}66,0 3px 14px rgba(0,0,0,1),0 0 2px rgba(0,0,0,1)`,lineHeight:1,marginBottom:"clamp(4px,1vh,8px)",whiteSpace:"nowrap"}}>ARCADIA</div>
        <div style={{fontSize:13,letterSpacing:4,color:C.accent2,marginBottom:"clamp(20px,4vh,48px)",fontFamily:"'Share Tech Mono',monospace",textShadow:`0 0 14px ${C.accent2},0 2px 8px rgba(0,0,0,0.95)`}}>─── 理想郷への扉 ───</div>

        <div style={{width:280,height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`,margin:`0 auto clamp(16px,3vh,40px)`}}/>

        <button
          onClick={() => { unlockAudio("bgm/title"); setTosScrolled(false); setPhase("tos"); }}
          style={{padding:"clamp(8px,1.8vh,14px) 48px",background:"transparent",border:`2px solid ${C.accent}`,boxShadow:`0 0 12px ${C.accent}88,inset 0 0 8px rgba(0,200,255,0.05)`,color:C.accent,fontSize:"clamp(13px,2vh,16px)",letterSpacing:6,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",animation:"glow 2s infinite",transition:"all 0.3s"}}
          onMouseEnter={e => e.target.style.background = `${C.accent}22`}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >GAME START</button>

        <div style={{marginTop:"clamp(12px,2vh,24px)",fontSize:12,color:C.accent2,letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>VRS CONNECT ▶</div>
        <div style={{marginTop:"clamp(14px,2.5vh,32px)",width:280,height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`}}/>
        <button
          onClick={() => setPhase("patternEditor")}
          style={{marginTop:"clamp(10px,1.8vh,20px)",padding:"clamp(5px,1vh,8px) 32px",background:"transparent",border:`1px solid ${C.muted}`,color:C.text,fontSize:11,letterSpacing:4,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",transition:"all 0.3s"}}
          onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
        >⚙ PATTERN EDITOR</button>
      </div>
    </div>
    );
  }

  // @@SECTION:RENDER_TOS
  if (phase === "tos") {
    const tosMinH = isPortrait ? "100dvh" : "min(600px,100dvh)";
    return (
      <div style={{width:"100%",height:"100%",minHeight:tosMinH,maxHeight:"100dvh",display:"flex",flexDirection:"column",background:`linear-gradient(180deg,#020810 0%,${C.bg} 100%)`,fontFamily:"'Noto Serif JP',serif",position:"relative",overflow:"hidden"}}>
        <style>{keyframes}</style>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.012) 2px,rgba(0,200,255,0.012) 4px)",pointerEvents:"none",zIndex:0}}/>

        {/* ヘッダー */}
        <div style={{padding:"16px 24px 14px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,13,20,0.92)",flexShrink:0,position:"relative",zIndex:1}}>
          <div style={{fontSize:10,letterSpacing:6,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginBottom:4}}>ARCADIA -- VRS SYSTEM</div>
          <div style={{fontSize:16,color:C.white,fontWeight:"bold",letterSpacing:2}}>利用規約 / 同意書</div>
          <div style={{fontSize:10,color:C.muted,marginTop:4,fontFamily:"'Share Tech Mono',monospace"}}>── プレイ前に必ず全文をお読みください ──</div>
        </div>

        {/* スクロール本文 */}
        <div style={{flex:1,overflowY:"scroll",padding:"0 24px 8px",position:"relative",zIndex:1,scrollbarWidth:"thin",scrollbarColor:`${C.border} transparent`}}
          onScroll={e => {
            const el = e.currentTarget;
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
              setTosScrolled(true);
            }
          }}>
          <div style={{color:C.accent,fontSize:13,fontWeight:"bold",marginTop:22,marginBottom:8,paddingLeft:10,borderLeft:`3px solid ${C.accent}`,letterSpacing:1}}>■ ご挨拶</div>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>この度は弊社製品をご購入頂きまして誠にありがとうございます。本製品はVRS[Virtual Reality System]を採用しております。プレーヤーはVRSによって創り出された仮想現実空間に広がる世界を自由に探索する事が可能です。壮大かつ繊細な世界を思う存分お楽しみ下さい。</p>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>つきまして、プレイされる前に必ず本説明書をご覧下さい。説明書には、本製品をプレイするにあたっての同意書が含まれておりますので、ご確認下さい。</p>

          <div style={{color:C.accent,fontSize:13,fontWeight:"bold",marginTop:22,marginBottom:8,paddingLeft:10,borderLeft:`3px solid ${C.accent}`,letterSpacing:1}}>■ 注意事項</div>

          <div style={{color:C.gold,fontSize:12,fontWeight:"bold",marginTop:16,marginBottom:5,letterSpacing:1}}>◇ プレイヤーの身体情報</div>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>プレイヤーの身体情報については、これは現実と同期という形を取らさせて頂きます。つまり現実の姿形がゲーム内においても適応されるという事です。ゲーム内においてキャラクターが変更出来る身体情報については、髪型・髪色・瞳色の三点となっております。</p>
          <p style={{color:C.muted,fontSize:11,lineHeight:1.85,marginBottom:8}}>※ 身長・体重・声質・性別・年齢といったキャラクターの基本情報については、あくまで現実の情報が適応されますので、ご注意下さい。</p>

          <div style={{color:C.gold,fontSize:12,fontWeight:"bold",marginTop:16,marginBottom:5,letterSpacing:1}}>◇ 死亡定義</div>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>本製品において『死亡』の定義は現実世界とは大きく異なり、ゲーム内でプレイヤーが死亡した場合においては、いかなる場合においても蘇生が可能です。</p>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>また、ゲーム内ではモンスターの攻撃によってダメージを受けた際、致死レベルの痛覚を受けないよう調整させて頂いております。これは、ゲーム内でのV-Shock[バーチャル・ショック]による事故死を防ぐための処置です。</p>
          <p style={{color:C.muted,fontSize:11,lineHeight:1.85,marginBottom:8}}>※ ゲーム内においての視覚・嗅覚・味覚・聴覚・触覚についてはシステム上、個人差がありません。</p>

          <div style={{color:C.gold,fontSize:12,fontWeight:"bold",marginTop:16,marginBottom:5,letterSpacing:1}}>◇ 時層差</div>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>本製品では、時層弛緩技術を用いる事で現実世界の二十四倍というスピードでの時流を実現しています。つまりARCADIAで二十四時間経過した場合、現実での一日に相当します。</p>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>なお、肉体の老化につきましては、現実の経過時間に即して身体が疲弊します。老化につきましては、個人差がありますので、あらかじめご了承ください。現状、本製品の連続使用による副次的作用は報告されておりませんが、ゲーム内時間において七十二日に一度は現実世界へ帰還される事を推奨致します。</p>

          <div style={{color:C.gold,fontSize:12,fontWeight:"bold",marginTop:16,marginBottom:5,letterSpacing:1}}>◇ 医療提携について</div>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>また弊社は医療機関と提携させて頂いております。万が一、本製品によって身体に何らかの障害が発生した場合、弊社では医療機関とその症状を分析し、その医療責任が弊社のシステムに由ると判断された場合に限り、お客様の医療負担を負うものとさせて頂きます。</p>

          <div style={{color:C.accent,fontSize:13,fontWeight:"bold",marginTop:22,marginBottom:8,paddingLeft:10,borderLeft:`3px solid ${C.accent}`,letterSpacing:1}}>■ 免責事項</div>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>本製品アルカディアは多くのプレイヤーの皆様が同時に参加されるという性質上、仮想世界では他のプレイヤーの方々との接触があります。そのため、お客様間で発生する問題については弊社においてサポートデスク、又はGM[ゲームマスター]を通して対応をさせて頂きますが、多数のお問い合わせが集中した場合、運営上、全てのお問い合わせに対して円滑に対応出来ない状況が予想されます。</p>
          <p style={{color:C.text,fontSize:12,lineHeight:1.95,marginBottom:10}}>基本的にサポートデスク、及びGMはゲーム上の不具合改善のために存在します。こうしたアクセスが混雑した状況を未然に防ぐためにも、ゲームに関する攻略のご質問、又はお客様間でのトラブルについては、なるべくお客様自身で解消される事をお願い致します。お客様の良識ある行動[プレイ]を心よりお願い申し上げます。</p>

          <div style={{textAlign:"center",padding:"16px 0 8px",fontFamily:"'Share Tech Mono',monospace",fontSize:11}}>
            {tosScrolled
              ? <span style={{color:C.accent2}}>✓ 内容の確認が完了しました</span>
              : <span style={{color:C.muted}}>↓ 下までスクロールして内容をご確認ください</span>}
          </div>
          <div style={{height:16}}/>
        </div>

        {/* フッター */}
        <div style={{padding:"14px 24px 18px",borderTop:`1px solid ${C.border}`,background:"rgba(5,13,20,0.95)",flexShrink:0,display:"flex",gap:12,position:"relative",zIndex:1}}>
          <button
            style={{padding:"13px 28px",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:4,fontSize:14,fontWeight:"bold",cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,flexShrink:0}}
            onClick={() => setPhase("title")}
            onMouseEnter={e=>{e.currentTarget.style.color=C.red;e.currentTarget.style.borderColor=C.red;}}
            onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor=C.border;}}>
            同意しない
          </button>
          <button
            disabled={!tosScrolled}
            style={{flex:1,padding:"13px 0",borderRadius:4,fontSize:14,fontWeight:"bold",letterSpacing:1,fontFamily:"'Share Tech Mono',monospace",border:"none",
              background: tosScrolled ? `linear-gradient(135deg,${C.accent},${C.accent2})` : "#0d2235",
              color: tosScrolled ? C.bg : C.muted,
              cursor: tosScrolled ? "pointer" : "not-allowed",
            }}
            onClick={() => { unlockAudio("bgm/title"); setSceneIdx(0); setDlIdx(0); setPhase("movie"); }}>
            {tosScrolled ? "同意する  ▶  ゲーム開始" : "同意する（要スクロール）"}
          </button>
        </div>
      </div>
    );
  }

  // @@SECTION:RENDER_MOVIE
  if (phase === "movie") {
    const url = movieUrl("movies/ch01_opening");
    // ムービーが存在しない場合は即座にゲームへ
    if (!url) {
      setPhase("game");
      return null;
    }
    const onMovieEnd = () => {
      setSceneIdx(0);
      setDlIdx(0);
      setPhase("game");
    };
    return (
      <div style={{width:"100%",height:"100%",minHeight:"min(600px,100dvh)",position:"relative",background:"#000",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <style>{keyframes}</style>
        <video
          src={url}
          autoPlay
          playsInline
          style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}
          onEnded={onMovieEnd}
        />
        <button
          onClick={onMovieEnd}
          style={{
            position:"absolute", bottom:24, right:24,
            background:"rgba(5,13,20,0.8)",
            color:C.text,
            border:`1px solid ${C.border}`,
            borderRadius:4,
            padding:"8px 20px",
            cursor:"pointer",
            fontSize:12,
            letterSpacing:2,
            fontFamily:"'Share Tech Mono',monospace",
            zIndex:10,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
        >
          SKIP ▶
        </button>
        <div style={{
          position:"absolute", bottom:60, left:"50%", transform:"translateX(-50%)",
          fontSize:10, letterSpacing:8, color:"rgba(200,232,248,0.4)",
          fontFamily:"'Share Tech Mono',monospace",
          pointerEvents:"none",
        }}>
          CHAPTER 1 -- 旅立ち
        </div>
      </div>
    );
  }

  // @@SECTION:RENDER_PATTERN_EDITOR
  if (phase === "patternEditor") {
    const ACTION_DEFS = {
      atk:         { icon:"⚔",  label:"強攻",      color:"#00ffcc", desc:"通常攻撃。プレイヤーのカウンターに負ける" },
      counter:     { icon:"🔄", label:"カウンター", color:"#f97316", desc:"強攻を無効化して反撃。回避には空振り" },
      dodge:       { icon:"💨", label:"回避",       color:"#a78bfa", desc:"このターン行動しない。強攻には避けられない" },
      unavoidable: { icon:"💥", label:"回避不能",   color:"#ff4466", desc:"ボス専用。カウンター/回避を粉砕" },
    };
    const enemyKeys = Object.keys(battleDefs);
    const selKey = editorSelKey;
    const setSelKey = setEditorSelKey;

    const curDef = battleDefs[selKey];
    const curPattern = curDef.pattern || [];

    const updatePattern = (key, newPat) => setBattleDefs(prev => ({ ...prev, [key]: { ...prev[key], pattern: newPat } }));
    const addAction = (actionId) => updatePattern(selKey, [...curPattern, actionId]);
    const removeAction = (idx) => updatePattern(selKey, curPattern.filter((_, i) => i !== idx));
    const moveAction = (fromIdx, toIdx) => {
      if (toIdx < 0 || toIdx >= curPattern.length) return;
      const np = [...curPattern];
      const [item] = np.splice(fromIdx, 1);
      np.splice(toIdx, 0, item);
      updatePattern(selKey, np);
    };
    const resetPattern = (key) => updatePattern(key, [...INITIAL_BATTLE_DEFS[key].pattern]);
    const genExportCode = () => {
      const out = ["export const BATTLE_DEFS = {"];
      Object.entries(battleDefs).forEach(([k, def]) => {
        out.push("  " + k + ": {");
        out.push('    name:"' + def.name + '", em:"' + def.em + '",');
        out.push("    maxHp:" + def.maxHp + ", atk:[" + def.atk[0] + "," + def.atk[1] + "], elk:" + def.elk + ", exp:" + def.exp + ", lv:" + def.lv + ",");
        const bgs = def.bg.map(b => '"' + b + '"').join(",");
        const bossF = def.isBoss ? "isBoss:true, " : "";
        out.push("    bg:[" + bgs + "], " + bossF + "isFloating:" + !!def.isFloating + ", isGround:" + !!def.isGround + ",");
        out.push("    pattern:[" + def.pattern.map(p => '"' + p + '"').join(",") + "],");
        if (def.unavoidableAtk) out.push("    unavoidableAtk:[" + def.unavoidableAtk[0] + "," + def.unavoidableAtk[1] + "],");
        out.push("  },");
      });
      out.push("};");
      return out.join("\n");
    };

    const ACTION_COLOR_MAP = { atk:"#00ffcc", counter:"#f97316", dodge:"#a78bfa", unavoidable:"#ff4466", unavoidable_lite:"#f59e0b" };

    return (
      <div style={{width:"100%",height:"100%",minHeight:"min(600px,100dvh)",display:"flex",flexDirection:"column",background:`linear-gradient(180deg,${C.bg} 0%,${C.panel} 100%)`,fontFamily:"'Noto Serif JP',serif",overflow:"hidden"}}>
        <style>{keyframes}</style>

        {/* ヘッダー */}
        <div style={{display:"flex",alignItems:"center",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,13,20,0.8)",flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{fontSize:10,letterSpacing:6,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>ARCADIA</div>
            <div style={{fontSize:16,letterSpacing:4,color:C.gold,fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>⚙ PATTERN EDITOR</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={() => setShowExport(v => !v)}
              style={{padding:"6px 16px",background:showExport?`${C.gold}22`:"transparent",border:`1px solid ${C.gold}`,color:C.gold,fontSize:11,cursor:"pointer",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>
              {showExport ? "✕ CLOSE" : "⬇ EXPORT"}
            </button>
            <button onClick={() => setPhase("title")}
              style={{padding:"6px 16px",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,fontSize:11,cursor:"pointer",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>
              ← TITLE
            </button>
          </div>
        </div>

        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* 左ペイン: エネミー選択 */}
          <div style={{width:160,borderRight:`1px solid ${C.border}`,overflowY:"auto",flexShrink:0}}>
            {enemyKeys.map(key => {
              const def = battleDefs[key];
              const isChanged = JSON.stringify(def.pattern) !== JSON.stringify(INITIAL_BATTLE_DEFS[key].pattern);
              const isActive = key === selKey;
              const paneStyle = isActive
                ? {padding:"12px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:`${C.accent}11`,borderLeft:`2px solid ${C.accent}`}
                : {padding:"12px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:"transparent",borderLeft:"2px solid transparent"};
              return (
                <div key={key} style={paneStyle} onClick={() => setSelKey(key)}>
                  <div style={{fontSize:18,marginBottom:4}}>{def.em}</div>
                  <div style={{fontSize:10,color:isActive?C.white:C.muted,fontFamily:"'Share Tech Mono',monospace",lineHeight:1.4}}>
                    {def.name.replace(" ─ 試練の主","")}
                  </div>
                  {def.isBoss && <div style={{fontSize:8,color:C.red,letterSpacing:1,marginTop:2}}>BOSS</div>}
                  {isChanged && <div style={{fontSize:8,color:C.gold,letterSpacing:1,marginTop:2}}>● EDITED</div>}
                  <div style={{display:"flex",flexWrap:"wrap",gap:2,marginTop:6}}>
                    {def.pattern.map((a,i) => (
                      <span key={i} style={{fontSize:9,color:ACTION_COLOR_MAP[a]??C.muted}}>{ACTION_DEFS[a]?.icon ?? "?"}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 右ペイン: パターン編集 */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

            {/* エネミー情報 */}
            <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,13,20,0.4)",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28}}>{curDef.em}</span>
              <div>
                <div style={{fontSize:13,color:C.white,fontWeight:700}}>{curDef.name}</div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>
                  HP:{curDef.maxHp} ATK:{curDef.atk[0]}-{curDef.atk[1]} Lv:{curDef.lv}
                </div>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <button onClick={() => resetPattern(selKey)}
                  style={{padding:"4px 12px",background:"transparent",border:`1px solid ${C.muted}`,color:C.muted,fontSize:10,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace"}}>
                  ↺ RESET
                </button>
              </div>
            </div>

            {/* パターンタイムライン */}
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:10,fontFamily:"'Share Tech Mono',monospace"}}>
                TURN PATTERN -- {curPattern.length}ターンでループ
              </div>
              {curPattern.length === 0 && (
                <div style={{fontSize:12,color:C.muted,padding:"16px 0"}}>パターンが空です。下のボタンで行動を追加してください。</div>
              )}
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
                {curPattern.map((actionId, idx) => {
                  const ad = ACTION_DEFS[actionId];
                  const col = ad?.color ?? C.muted;
                  return (
                    <div key={idx} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      {/* ターン番号 */}
                      <div style={{fontSize:8,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>T{idx+1}</div>
                      {/* 行動カード */}
                      <div style={{padding:"6px 8px",background:`${col}18`,border:`1px solid ${col}66`,borderRadius:4,textAlign:"center",minWidth:48}}>
                        <div style={{fontSize:18}}>{ad?.icon ?? "?"}</div>
                        <div style={{fontSize:9,color:col,fontFamily:"'Share Tech Mono',monospace",marginTop:2}}>{ad?.label ?? actionId}</div>
                      </div>
                      {/* 操作ボタン */}
                      <div style={{display:"flex",gap:2}}>
                        <button onClick={() => moveAction(idx, idx-1)} disabled={idx===0}
                          style={{padding:"1px 5px",background:"transparent",border:`1px solid ${idx===0?C.border:C.muted}`,color:idx===0?C.border:C.muted,fontSize:9,cursor:idx===0?"not-allowed":"pointer"}}>
                          ◀
                        </button>
                        <button onClick={() => removeAction(idx)}
                          style={{padding:"1px 5px",background:"transparent",border:`1px solid ${C.red}44`,color:C.red,fontSize:9,cursor:"pointer"}}>
                          ✕
                        </button>
                        <button onClick={() => moveAction(idx, idx+1)} disabled={idx===curPattern.length-1}
                          style={{padding:"1px 5px",background:"transparent",border:`1px solid ${idx===curPattern.length-1?C.border:C.muted}`,color:idx===curPattern.length-1?C.border:C.muted,fontSize:9,cursor:idx===curPattern.length-1?"not-allowed":"pointer"}}>
                          ▶
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 行動追加パレット */}
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:8,fontFamily:"'Share Tech Mono',monospace"}}>+ ADD ACTION</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {Object.entries(ACTION_DEFS).map(([id, ad]) => {
                  const isBossOnly = id === "unavoidable";
                  const disabled = isBossOnly && !curDef.isBoss;
                  const btnStyle = disabled
                    ? {padding:"8px 12px",background:"transparent",border:`1px solid ${C.border}`,color:C.border,fontSize:12,cursor:"not-allowed",borderRadius:4,opacity:0.4}
                    : {padding:"8px 12px",background:`${ad.color}11`,border:`1px solid ${ad.color}66`,color:ad.color,fontSize:12,cursor:"pointer",borderRadius:4,transition:"all 0.2s"};
                  return (
                    <button key={id} onClick={() => !disabled && addAction(id)} style={btnStyle}
                      title={ad.desc + (disabled?" (ボス専用)":"")}>
                      <span style={{fontSize:16,marginRight:4}}>{ad.icon}</span>
                      <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10}}>{ad.label}</span>
                      {isBossOnly && <span style={{fontSize:8,color:C.red,marginLeft:4}}>BOSS</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* すくみ関係ガイド */}
            <div style={{padding:"10px 16px",flex:1,overflowY:"auto"}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:2,marginBottom:8,fontFamily:"'Share Tech Mono',monospace"}}>すくみ関係</div>
              {[
                {from:"⚔ 強攻",     to:"🔄 カウンター", result:"負け", note:"攻撃無効 + カウンターダメージ", col:C.red},
                {from:"🔄 カウンター",to:"💨 回避",       result:"負け", note:"カウンター空振り",              col:C.red},
                {from:"💨 回避",     to:"⚔ 強攻",        result:"負け", note:"回避できず通常ダメージ",        col:C.red},
                {from:"🔄 カウンター",to:"⚔ 強攻",        result:"勝ち", note:"×1.5ダメージで反撃",           col:C.accent2},
                {from:"💨 回避",     to:"🔄 カウンター",  result:"勝ち", note:"完全回避",                      col:C.accent2},
                {from:"💥 回避不能", to:"🔄/💨",          result:"粉砕", note:"ボス専用・カウンター/回避を無効化", col:"#ff4466"},
              ].map((r,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",borderBottom:`1px solid ${C.border}22`}}>
                  <span style={{fontSize:11,color:C.text,minWidth:90,fontFamily:"'Share Tech Mono',monospace"}}>{r.from}</span>
                  <span style={{fontSize:10,color:C.muted}}>vs</span>
                  <span style={{fontSize:11,color:C.text,minWidth:90,fontFamily:"'Share Tech Mono',monospace"}}>{r.to}</span>
                  <span style={{fontSize:10,color:r.col,minWidth:32,fontFamily:"'Share Tech Mono',monospace"}}>{r.result}</span>
                  <span style={{fontSize:10,color:C.muted}}>{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* エクスポートパネル */}
        {showExport && (
          <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:50,display:"flex",flexDirection:"column",padding:20}}>
            <div style={{display:"flex",alignItems:"center",marginBottom:12}}>
              <div style={{flex:1,fontSize:13,color:C.gold,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2}}>⬇ EXPORT -- battle_defs.js</div>
              <button onClick={() => setShowExport(false)}
                style={{padding:"4px 12px",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace"}}>
                ✕ 閉じる
              </button>
            </div>
            <div style={{fontSize:10,color:C.muted,marginBottom:8}}>以下のコードをbattle_defs.jsのBATTLE_DEFSに貼り付けてください</div>
            <textarea readOnly value={genExportCode()}
              style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,color:C.accent2,fontSize:11,padding:12,fontFamily:"'Share Tech Mono',monospace",lineHeight:1.6,resize:"none",outline:"none"}}
              onClick={e => e.target.select()}
            />
            <div style={{fontSize:10,color:C.muted,marginTop:8}}>クリックで全選択 → Ctrl+C でコピー</div>
          </div>
        )}
      </div>
    );
  }

  // @@SECTION:RENDER_ENDING
  if (phase === "end") {
    // ── セーブデータ生成 ────────────────────────────────────────────────────
    const buildSaveData = () => ({
      version:    "arcadia_ch1_v1",
      chapter:    1,
      savedAt:    new Date().toISOString(),
      player: {
        hp, mhp, mp, mmp,
        elk, lv, exp,
        weapon, weaponPatk,
        statPoints,
        statAlloc: { ...statAlloc },
        hasPb, hasMapScan, inCom,
      },
    });

    const handleExport = () => {
      const data = buildSaveData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `arcadia_save_ch1_lv${lv}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const resetToTitle = () => {
      setPhase("title"); setSceneIdx(0); setDlIdx(0);
      setElk(50); setHp(100); setMhp(100); setMp(80); setMmp(80);
      setLv(1); setExp(0);
      setWeapon("銅の短剣"); setWeaponPatk(3);
      setStatPoints(0); setStatAlloc({patk:10,pdef:10,matk:10,spd:10});
      setHasPb(false); setHasMapScan(false); setInCom(false);
    };

    return (
      <div style={{width:"100%",height:"100%",overflowY:"auto",background:`linear-gradient(180deg,#030a06 0%,#0a1a0a 50%,#0d2010 100%)`,fontFamily:"'Noto Serif JP',serif",textAlign:"center"}}>
        <style>{keyframes}</style>
        <div style={{animation:"fadeIn 2s ease",maxWidth:480,width:"100%",margin:"0 auto",padding:40}}>
          <div style={{fontSize:11,letterSpacing:12,color:C.muted,marginBottom:20,fontFamily:"'Share Tech Mono',monospace"}}>─ EPISODE 1 END ─</div>
          <div style={{fontSize:48,fontWeight:700,color:C.white,textShadow:`0 0 30px ${C.accent2}`,marginBottom:16}}>ARCADIA</div>
          <div style={{fontSize:18,color:C.accent2,letterSpacing:4,marginBottom:40}}>旅立ちの日は明日──</div>
          <div style={{width:240,height:1,background:`linear-gradient(90deg,transparent,${C.accent2},transparent)`,margin:"0 auto 32px"}}/>

          {/* ── ステータスサマリー ───────────────────────────────────────── */}
          <div style={{background:"rgba(10,26,38,0.7)",border:`1px solid ${C.border}`,borderRadius:8,padding:"20px 28px",marginBottom:32,textAlign:"left"}}>
            <div style={{fontSize:10,letterSpacing:6,color:C.muted,marginBottom:14,fontFamily:"'Share Tech Mono',monospace",textAlign:"center"}}>PLAYER DATA</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px",fontSize:13,color:C.text,fontFamily:"'Share Tech Mono',monospace",lineHeight:1.8}}>
              <div><span style={{color:C.muted}}>NAME</span>  Eltz</div>
              <div><span style={{color:C.muted}}>Lv</span>    {lv}</div>
              <div><span style={{color:C.muted}}>HP</span>    {hp} / {mhp}</div>
              <div><span style={{color:C.muted}}>MP</span>    {mp} / {mmp}</div>
              <div><span style={{color:C.muted}}>EXP</span>   {exp}</div>
              <div><span style={{color:C.muted}}>ELK</span>   {elk}</div>
              <div><span style={{color:C.muted}}>武器</span>  {weapon}</div>
              <div><span style={{color:C.muted}}>ATK+</span>  {weaponPatk}</div>
              <div><span style={{color:C.muted}}>PATK</span>  {statAlloc.patk}</div>
              <div><span style={{color:C.muted}}>PDEF</span>  {statAlloc.pdef}</div>
              <div><span style={{color:C.muted}}>MATK</span>  {statAlloc.matk}</div>
              <div><span style={{color:C.muted}}>SPD</span>   {statAlloc.spd}</div>
            </div>
          </div>

          {/* ── セーブデータエクスポート ─────────────────────────────────── */}
          <div style={{marginBottom:16,fontSize:12,color:C.muted,letterSpacing:1,lineHeight:1.8}}>
            第二章へ引き継ぐには、セーブデータをエクスポートして<br/>
            ARCADIA Ch.2 で読み込んでください。
          </div>
          <button
            onClick={handleExport}
            style={{width:"100%",padding:"14px 0",marginBottom:12,background:`linear-gradient(135deg,rgba(0,200,255,0.15),rgba(0,255,204,0.1))`,border:`1px solid ${C.accent}`,color:C.accent,fontSize:14,letterSpacing:4,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",borderRadius:4}}
          >
            💾 セーブデータをエクスポート
          </button>
          <div style={{fontSize:11,color:C.muted,marginBottom:32,fontFamily:"'Share Tech Mono',monospace",opacity:0.7}}>
            arcadia_save_ch1_lv{lv}.json がダウンロードされます
          </div>

          <div style={{width:240,height:1,background:`linear-gradient(90deg,transparent,${C.border},transparent)`,margin:"0 auto 24px"}}/>
          <button
            onClick={resetToTitle}
            style={{padding:"10px 40px",background:"transparent",border:`1px solid ${C.muted}`,color:C.muted,fontSize:12,letterSpacing:4,fontFamily:"'Share Tech Mono',monospace",cursor:"pointer",borderRadius:4}}
          >
            TITLE へ戻る
          </button>
        </div>
      </div>
    );
  }

  // @@SECTION:RENDER_BATTLE
  if (phase === "battle") {
    const ed = battleEnemy;
    if (!ed) return null;
    const enemyPct = Math.max(0, enemyHp / ed.maxHp * 100);
    const playerPct = Math.max(0, hp / mhp * 100);
    const mpPct = Math.max(0, mp / mmp * 100);
    const isBoss = ed.isBoss;

    const battleBgKey = BATTLE_BG_MAP[currentEnemyType];
    const battleBgUrl = battleBgKey ? assetUrl(battleBgKey) : null;
    const enemyImgKey = ENEMY_IMG_MAP[currentEnemyType];
    const enemyImgUrl = enemyImgKey ? assetUrl(enemyImgKey) : null;

    // ENEMY_IMG_SIZE は数値 or { mode:"fixed"|"auto", size?:px, pct?:% } のどちらでも受け付ける
    const _rawSize = ENEMY_IMG_SIZE[currentEnemyType] ?? (isBoss ? 220 : 140);
    const _sizeConf = typeof _rawSize === "number" ? { mode:"fixed", size:_rawSize } : _rawSize;
    const enemySizeMode = _sizeConf.mode ?? "fixed";
    const enemyImgSize  = _sizeConf.size ?? (isBoss ? 220 : 140);
    const enemyImgPct   = _sizeConf.pct  ?? 80;

    const bgSt = BATTLE_BG_STYLE[currentEnemyType] ?? { size: "cover", position: "center" };
    const battleBg = battleBgUrl
      ? `url(${battleBgUrl}) ${bgSt.position}/${bgSt.size} no-repeat, linear-gradient(180deg,${ed.bg[0]} 0%,${ed.bg[1]} 50%,${ed.bg[2]} 100%)`
      : `linear-gradient(180deg,${ed.bg[0]} 0%,${ed.bg[1]} 50%,${ed.bg[2]} 100%)`;

    return (
      <div style={{width:"100%",height:"100%",minHeight:isPortrait?"100dvh":"min(600px,100dvh)",display:"flex",flexDirection:"column",background:battleBg,fontFamily:"'Noto Serif JP',serif",userSelect:"none",position:"relative",overflow:"hidden"}}>
        <style>{keyframes}</style>
        {notif && <div style={{position:"absolute",top:20,left:"50%",transform:"translateX(-50%)",background:"rgba(10,26,38,0.95)",border:`1px solid ${C.accent}`,color:C.accent,padding:"8px 20px",fontSize:13,letterSpacing:1,zIndex:100,whiteSpace:"nowrap",fontFamily:"'Share Tech Mono',monospace",animation:"notifIn 0.3s ease"}}>{notif}</div>}

        {isPortrait ? (
          /* ══ 縦長バトルレイアウト ══════════════════════════════════════════ */
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>

            {/* 上部：エネミーエリア -- ボス/大型は広め */}
            <div style={{flex:isBoss||["koza","shamerlot_lv3","shamerlot_lv5"].includes(currentEnemyType)?"0 0 52%":"0 0 42%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 8px 4px",position:"relative",overflow:"hidden",gap:6}}>
              {isBoss && <div style={{position:"absolute",top:6,left:"50%",transform:"translateX(-50%)",fontSize:10,letterSpacing:6,color:C.red,fontFamily:"'Share Tech Mono',monospace",animation:"dngr 1s infinite",whiteSpace:"nowrap",zIndex:2}}>─── BOSS ───</div>}

              {/* コンボ表示 */}
              {noDmgStreak >= 3 && (
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:10,pointerEvents:"none",textAlign:"center",animation:"comboPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both"}}>
                  <div style={{fontSize:"clamp(32px,10vw,56px)",fontWeight:900,fontFamily:"'Share Tech Mono',monospace",color:C.gold,letterSpacing:2,lineHeight:1,animation:"comboPulse 1s infinite",WebkitTextStroke:`1px #ffffff44`}}>
                    {noDmgStreak}
                    <span style={{fontSize:"0.45em",letterSpacing:4,display:"block",marginTop:2,color:"#ffe08a"}}>COMBO</span>
                  </div>
                  <div style={{fontSize:9,color:"#ffe08a",fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,marginTop:3,opacity:0.85}}>MP +{5 + noDmgStreak} / turn</div>
                </div>
              )}

              {/* エネミー画像 */}
              {(() => {
                const isLargeEnemy = ["koza","shamerlot_lv3","shamerlot_lv5"].includes(currentEnemyType);
                const imgMaxH = isBoss ? 400 : isLargeEnemy ? 345 : 210;
                return enemyImgUrl
                  ? <img src={enemyImgUrl} alt={ed.name} style={{
                      width:"auto", height:"75%", maxHeight:imgMaxH, maxWidth:"85%", flexShrink:0,
                      objectFit:"contain",
                      animation:isBoss?"bossFloat 2s infinite":"idle 2s infinite",
                      filter:isBoss?`drop-shadow(0 0 20px ${C.red})`:"drop-shadow(0 4px 16px rgba(0,0,0,0.6))",
                      transform:btlAnimEnemy?"scale(1.05)":"scale(1)", transition:"transform 0.1s",
                    }} />
                  : <div style={{fontSize:isBoss?90:60,lineHeight:1,animation:isBoss?"bossFloat 2s infinite":"idle 2s infinite",filter:isBoss?`drop-shadow(0 0 20px ${C.red})`:"none",transform:btlAnimEnemy?"scale(1.1)":"scale(1)",transition:"transform 0.1s",flexShrink:0}}>{ed.em}</div>;
              })()}

              {/* エネミー名＋HPバー */}
              <div style={{width:"85%",flexShrink:0,zIndex:2,background:"rgba(5,13,20,0.65)",padding:"5px 10px",borderRadius:4}}>
                <div style={{color:C.white,fontSize:12,fontWeight:700,letterSpacing:1,textAlign:"center",marginBottom:5,textShadow:"0 1px 4px #000"}}>{ed.name}</div>
                <div style={{width:"100%",height:7,background:C.panel2,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${enemyPct}%`,background:isBoss?`linear-gradient(90deg,${C.red},#ff8844)`:`linear-gradient(90deg,${C.accent2},${C.accent})`,transition:"width 0.4s",borderRadius:4}}/>
                </div>
                <div style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace",textAlign:"center",marginTop:2}}>{enemyHp} / {ed.maxHp}</div>
              </div>
            </div>

            {/* 下部：ログ＋ステータス＋ボタン */}
            <div style={{flex:1,display:"flex",flexDirection:"column",background:"rgba(5,13,20,0.88)",borderTop:`1px solid ${C.border}44`,overflow:"hidden",minHeight:0}}>

              {/* すくみガイド */}
              <div style={{padding:"3px 10px",borderBottom:`1px solid ${C.border}33`,display:"flex",gap:8,justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:8,color:"#00ffcc88",fontFamily:"'Share Tech Mono',monospace"}}>⚔→🔄負</span>
                <span style={{fontSize:8,color:"#f9731688",fontFamily:"'Share Tech Mono',monospace"}}>🔄→💨負</span>
                <span style={{fontSize:8,color:"#a78bfa88",fontFamily:"'Share Tech Mono',monospace"}}>💨→⚔負</span>
                <span style={{fontSize:8,color:"#ff446688",fontFamily:"'Share Tech Mono',monospace"}}>💥回避不能</span>
              </div>

              {/* バトルログ */}
              <div style={{flex:1,overflowY:"auto",padding:"4px 14px",minHeight:0}}>
                {btlLogs.slice(-4).map((l,i,arr) => (
                  <div key={i} style={{fontSize:10,color:i===arr.length-1?C.white:C.muted,lineHeight:1.55,animation:i===arr.length-1?"slideUp 0.3s ease":"none"}}>{l}</div>
                ))}
              </div>

              {/* プレイヤーステータス */}
              <div style={{padding:"8px 14px",background:"rgba(10,26,38,0.98)",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div>
                    <span style={{fontSize:10,color:C.muted,marginRight:5,fontFamily:"'Share Tech Mono',monospace"}}>HP</span>
                    <span style={{fontSize:12,color:playerPct<=25?C.red:C.accent2,fontFamily:"'Share Tech Mono',monospace",animation:playerPct<=25?"dngr 0.8s infinite":"none"}}>{hp}/{mhp}</span>
                  </div>
                  <div>
                    <span style={{fontSize:10,color:C.muted,marginRight:5,fontFamily:"'Share Tech Mono',monospace"}}>MP</span>
                    <span style={{fontSize:12,color:"#60a5fa",fontFamily:"'Share Tech Mono',monospace"}}>{mp}/{mmp}</span>
                  </div>
                  <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>Turn {turn}</div>
                </div>
                <div style={{height:3,background:C.panel2,borderRadius:2,marginBottom:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${playerPct}%`,background:`linear-gradient(90deg,${C.red},${C.accent2})`,transition:"width 0.4s"}}/>
                </div>
                <div style={{height:3,background:C.panel2,borderRadius:2,marginBottom:6,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${mpPct}%`,background:"linear-gradient(90deg,#2255cc,#60a5fa)",transition:"width 0.4s"}}/>
                </div>

                {/* 敵の次ターン行動予告 */}
                {!victory && !defeat && enemyNextAction && (() => {
                  const eLabel = ENEMY_ACTION_LABEL[enemyNextAction];
                  const isUnavoidable = enemyNextAction === "unavoidable";
                  const previewColor = isUnavoidable ? C.red : enemyNextAction === "counter" ? "#f97316" : enemyNextAction === "dodge" ? C.muted : "#60a5fa";
                  return (
                    <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",background:`${previewColor}11`,border:`1px solid ${previewColor}44`,borderRadius:4,marginBottom:6}}>
                      <span style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>次のターン</span>
                      <span style={{fontSize:10,color:previewColor,fontFamily:"'Share Tech Mono',monospace",fontWeight:700,animation:isUnavoidable?"dngr 0.8s infinite":"none"}}>
                        {eLabel?.icon} {ed.name}：{eLabel?.text}
                      </span>
                      {isUnavoidable && <span style={{fontSize:8,color:C.red}}>⚠ 回避不能</span>}
                    </div>
                  );
                })()}

                {/* アクションボタン / 勝敗結果 */}
                {!victory && !defeat ? (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                    {BATTLE_SKILLS.map(sk => {
                      const canAfford = sk.cost === 0 || mp >= sk.cost;
                      const btnStyle = canAfford
                        ? { padding:"10px 4px", background:C.panel, border:`1px solid ${sk.color}44`, color:sk.color, fontSize:12, cursor:"pointer", borderRadius:4, transition:"all 0.2s", fontFamily:"'Noto Serif JP',serif" }
                        : { padding:"10px 4px", background:C.panel, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, cursor:"not-allowed", borderRadius:4, transition:"all 0.2s", fontFamily:"'Noto Serif JP',serif", opacity:0.5 };
                      return (
                        <button key={sk.id} onClick={() => canAfford && doBattleAction(sk.id)} style={btnStyle}
                          onMouseEnter={e => { if (canAfford) e.currentTarget.style.background = `${sk.color}22`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.panel; }}>
                          <div style={{fontSize:20}}>{sk.icon}</div>
                          <div style={{fontSize:10,marginTop:2}}>{sk.label}</div>
                          {sk.cost > 0 && <div style={{fontSize:8,color:canAfford?C.muted:"#553333"}}>MP {sk.cost}</div>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 0"}}>
                    <div style={{fontSize:16,color:victory?C.gold:C.red,fontWeight:700,marginBottom:10,animation:"fadeIn 0.5s"}}>{victory ? "🏆 Victory！" : "💀 Defeat..."}</div>
                    <button onClick={exitBattle} style={{padding:"10px 40px",background:"transparent",border:`1px solid ${victory?C.gold:C.muted}`,color:victory?C.gold:C.muted,fontSize:14,cursor:"pointer",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>
                      {victory ? "続ける ▶" : "戻る ▶"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
        /* ══ 横長バトルレイアウト（変更なし）══════════════════════════════ */
        /* ── メインエリア：左＝エネミー、右＝ログ＋ステータス＋ボタン ── */
        <div style={{flex:1,display:"flex",flexDirection:"row",overflow:"hidden",minHeight:0}}>

          {/* 左カラム：エネミー表示 */}
          <div style={{flex:"0 0 65%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(6px,1.5vh,12px) 8px",position:"relative",overflow:"hidden",gap:"clamp(4px,1vh,10px)"}}>
            {isBoss && <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",fontSize:11,letterSpacing:6,color:C.red,fontFamily:"'Share Tech Mono',monospace",animation:"dngr 1s infinite",whiteSpace:"nowrap",zIndex:2}}>─── BOSS ───</div>}

            {/* コンボ表示（3ターン以上継続時） */}
            {noDmgStreak >= 3 && (
              <div style={{
                position:"absolute",
                top:"50%", left:"50%",
                transform:"translate(-50%, -50%)",
                zIndex:10,
                pointerEvents:"none",
                textAlign:"center",
                animation:"comboPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                <div style={{
                  fontSize:"clamp(36px, 8vw, 64px)",
                  fontWeight:900,
                  fontFamily:"'Share Tech Mono',monospace",
                  color:C.gold,
                  letterSpacing:2,
                  lineHeight:1,
                  animation:"comboPulse 1s infinite",
                  WebkitTextStroke:`1px #ffffff44`,
                }}>
                  {noDmgStreak}
                  <span style={{fontSize:"0.45em", letterSpacing:4, display:"block", marginTop:2, color:"#ffe08a"}}>COMBO</span>
                </div>
                <div style={{
                  fontSize:10,
                  color:"#ffe08a",
                  fontFamily:"'Share Tech Mono',monospace",
                  letterSpacing:2,
                  marginTop:4,
                  opacity:0.85,
                }}>
                  MP +{5 + noDmgStreak} / turn
                </div>
              </div>
            )}

            {/* エネミー画像 / 絵文字フォールバック */}
            {enemyImgUrl
              ? <img src={enemyImgUrl} alt={ed.name} style={{
                  // mode:"auto"  → 左カラム高さの enemyImgPct% を height に使い、幅は自動
                  // mode:"fixed" → px 固定（width/height ともに enemyImgSize px）
                  ...(enemySizeMode === "auto"
                    ? { width:"auto", height:`${enemyImgPct}%`, maxWidth:"95%", flexShrink:0 }
                    : { width:enemyImgSize, height:enemyImgSize, maxWidth:"95%", maxHeight:"80%", flexShrink:0 }),
                  objectFit:"contain",
                  animation:isBoss?"bossFloat 2s infinite":"idle 2s infinite",
                  filter:isBoss?`drop-shadow(0 0 20px ${C.red})`:"drop-shadow(0 4px 16px rgba(0,0,0,0.6))",
                  transform:btlAnimEnemy?"scale(1.05)":"scale(1)", transition:"transform 0.1s",
                }} />
              : <div style={{
                  fontSize: enemySizeMode === "auto" ? "clamp(60px, 12vw, 120px)" : Math.round(enemyImgSize * 0.5),
                  lineHeight:1,
                  animation:isBoss?"bossFloat 2s infinite":"idle 2s infinite",
                  filter:isBoss?`drop-shadow(0 0 20px ${C.red})`:"none",
                  transform:btlAnimEnemy?"scale(1.1)":"scale(1)", transition:"transform 0.1s",
                  flexShrink:0,
                }}>{ed.em}</div>
            }

            {/* エネミー名＋HPバー（画像の直下） */}
            <div style={{width:"88%",flexShrink:0,zIndex:2,background:"rgba(5,13,20,0.6)",padding:"6px 10px",borderRadius:4}}>
              <div style={{color:C.white,fontSize:13,fontWeight:700,letterSpacing:1,textAlign:"center",marginBottom:6,textShadow:"0 1px 4px #000"}}>{ed.name}</div>
              <div style={{width:"100%",height:8,background:C.panel2,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${enemyPct}%`,background:isBoss?`linear-gradient(90deg,${C.red},#ff8844)`:`linear-gradient(90deg,${C.accent2},${C.accent})`,transition:"width 0.4s",borderRadius:4}}/>
              </div>
              <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace",textAlign:"center",marginTop:3}}>{enemyHp} / {ed.maxHp}</div>
            </div>
          </div>

          {/* 右カラム：ログ＋ステータス＋ボタン */}
          <div style={{flex:"0 0 35%",display:"flex",flexDirection:"column",background:"rgba(5,13,20,0.82)",borderLeft:`1px solid ${C.border}44`,overflow:"hidden"}}>

            {/* すくみガイド */}
            <div style={{padding:"4px 10px",borderBottom:`1px solid ${C.border}33`,display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:8,color:"#00ffcc88",fontFamily:"'Share Tech Mono',monospace"}}>⚔→🔄負 </span>
              <span style={{fontSize:8,color:"#f9731688",fontFamily:"'Share Tech Mono',monospace"}}>🔄→💨負 </span>
              <span style={{fontSize:8,color:"#a78bfa88",fontFamily:"'Share Tech Mono',monospace"}}>💨→⚔負 </span>
              <span style={{fontSize:8,color:"#ff446688",fontFamily:"'Share Tech Mono',monospace"}}>💥回避不能</span>
            </div>

            {/* バトルログ（flex:1で残り高さをすべて使う） */}
            <div style={{flex:1,overflowY:"auto",padding:"8px 12px",minHeight:0}}>
              {btlLogs.map((l,i) => (
                <div key={i} style={{fontSize:11,color:i===btlLogs.length-1?C.white:C.muted,lineHeight:1.7,animation:i===btlLogs.length-1?"slideUp 0.3s ease":"none"}}>{l}</div>
              ))}
            </div>

            {/* プレイヤーステータス */}
            <div style={{padding:"8px 12px",background:"rgba(10,26,38,0.95)",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div>
                  <span style={{fontSize:10,color:C.muted,marginRight:6,fontFamily:"'Share Tech Mono',monospace"}}>HP</span>
                  <span style={{fontSize:12,color:playerPct<=25?C.red:C.accent2,fontFamily:"'Share Tech Mono',monospace",animation:playerPct<=25?"dngr 0.8s infinite":"none"}}>{hp}/{mhp}</span>
                </div>
                <div>
                  <span style={{fontSize:10,color:C.muted,marginRight:6,fontFamily:"'Share Tech Mono',monospace"}}>MP</span>
                  <span style={{fontSize:12,color:"#60a5fa",fontFamily:"'Share Tech Mono',monospace"}}>{mp}/{mmp}</span>
                </div>
                <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>Turn {turn}</div>
              </div>
              <div style={{height:3,background:C.panel2,borderRadius:2,marginBottom:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${playerPct}%`,background:`linear-gradient(90deg,${C.red},${C.accent2})`,transition:"width 0.4s"}}/>
              </div>
              <div style={{height:3,background:C.panel2,borderRadius:2,marginBottom:6,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${mpPct}%`,background:"linear-gradient(90deg,#2255cc,#60a5fa)",transition:"width 0.4s"}}/>
              </div>

              {/* 敵の次ターン行動予告 */}
              {!victory && !defeat && enemyNextAction && (() => {
                const eLabel = ENEMY_ACTION_LABEL[enemyNextAction];
                const isUnavoidable = enemyNextAction === "unavoidable";
                const previewColor = isUnavoidable ? C.red : enemyNextAction === "counter" ? "#f97316" : enemyNextAction === "dodge" ? C.muted : "#60a5fa";
                return (
                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:`${previewColor}11`,border:`1px solid ${previewColor}44`,borderRadius:4,marginBottom:6}}>
                    <span style={{fontSize:9,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>次のターン</span>
                    <span style={{fontSize:10,color:previewColor,fontFamily:"'Share Tech Mono',monospace",fontWeight:700,animation:isUnavoidable?"dngr 0.8s infinite":"none"}}>
                      {eLabel?.icon} {ed.name}：{eLabel?.text}
                    </span>
                    {isUnavoidable && <span style={{fontSize:8,color:C.red}}>⚠ 回避不能</span>}
                  </div>
                );
              })()}

              {/* アクションボタン / 勝敗結果 */}
              <div style={{flexShrink:0}}>
                {!victory && !defeat ? (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5}}>
                    {BATTLE_SKILLS.map(sk => {
                      const canAfford = sk.cost === 0 || mp >= sk.cost;
                      const btnStyle = canAfford
                        ? { padding:"6px 4px", background:C.panel, border:`1px solid ${sk.color}44`, color:sk.color, fontSize:11, cursor:"pointer", borderRadius:4, transition:"all 0.2s", fontFamily:"'Noto Serif JP',serif" }
                        : { padding:"6px 4px", background:C.panel, border:`1px solid ${C.border}`, color:C.muted, fontSize:11, cursor:"not-allowed", borderRadius:4, transition:"all 0.2s", fontFamily:"'Noto Serif JP',serif", opacity:0.5 };
                      return (
                        <button key={sk.id} onClick={() => canAfford && doBattleAction(sk.id)}
                          style={btnStyle}
                          onMouseEnter={e => { if (canAfford) e.currentTarget.style.background = `${sk.color}22`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.panel; }}>
                          <div style={{fontSize:18}}>{sk.icon}</div>
                          <div style={{fontSize:10,marginTop:2}}>{sk.label}</div>
                          {sk.cost > 0 && <div style={{fontSize:8,color:canAfford?C.muted:"#553333"}}>MP {sk.cost}</div>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 0"}}>
                    <div style={{fontSize:15,color:victory?C.gold:C.red,fontWeight:700,marginBottom:10,animation:"fadeIn 0.5s"}}>
                      {victory ? "🏆 Victory！" : "💀 Defeat..."}
                    </div>
                    <button onClick={exitBattle} style={{padding:"7px 32px",background:"transparent",border:`1px solid ${victory?C.gold:C.muted}`,color:victory?C.gold:C.muted,fontSize:13,cursor:"pointer",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace"}}>
                      {victory ? "続ける ▶" : "戻る ▶"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    );
  }

  // @@SECTION:RENDER_GAME
  const dl = sc.dl[dlIdx] || sc.dl[0];
  const spColor = dl.sp === "SYSTEM" ? C.accent : dl.sp === "ナレーション" ? C.muted : C.accent2;
  const isHpLow = hp / mhp <= 0.25;

  return (
    <div style={{width:"100%",height:"100%",minHeight:isPortrait?"100dvh":"min(600px,100dvh)",display:"flex",flexDirection:"column",...bgStyle,fontFamily:"'Noto Serif JP',serif",userSelect:"none",position:"relative",overflow:"hidden",transition:"background 1s"}}>
      <style>{keyframes}</style>

      {/* Overlay fade */}
      {fade && <div style={{position:"absolute",inset:0,background:"#050d14",opacity:1,zIndex:50,transition:"opacity 0.3s"}}/>}

      {/* Notification */}
      {notif && <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",background:"rgba(5,13,20,0.95)",border:`1px solid ${C.accent}`,color:C.accent,padding:"8px 20px",fontSize:12,letterSpacing:1,zIndex:100,whiteSpace:"nowrap",fontFamily:"'Share Tech Mono',monospace",animation:"notifIn 0.3s ease",borderRadius:2}}>{notif}</div>}

      {/* Scanlines */}
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.01) 3px,rgba(0,200,255,0.01) 4px)",pointerEvents:"none",zIndex:1}}/>

      {/* HUD top */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:isPortrait?"5px 12px":"6px 14px",background:"rgba(5,13,20,0.7)",borderBottom:`1px solid ${C.border}`,zIndex:10,position:"relative"}}>
        <div style={{fontSize:isPortrait?9:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"40%"}}>{sc.loc}</div>
        <div style={{display:"flex",gap:isPortrait?7:10,alignItems:"center"}}>
          <div style={{fontSize:isPortrait?9:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>
            <span style={{color:isHpLow?C.red:C.accent2,animation:isHpLow?"dngr 0.8s infinite":"none"}}>HP {hp}</span>
            <span style={{color:C.muted}}>/</span>
            <span style={{color:C.muted}}>{mhp}</span>
          </div>
          <div style={{fontSize:isPortrait?9:10,color:"#60a5fa",fontFamily:"'Share Tech Mono',monospace"}}>MP {mp}</div>
          <div style={{fontSize:isPortrait?9:10,color:C.gold,fontFamily:"'Share Tech Mono',monospace"}}>💰{elk}</div>
          <div style={{fontSize:isPortrait?9:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace"}}>Lv.{lv}</div>
        </div>
      </div>

      {/* Sprite area */}
      <div ref={spriteAreaRef} style={{flex:1,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:isPortrait?"4px 8px 0":"clamp(4px,1vh,8px) 20px 0",position:"relative",zIndex:5,minHeight:isPortrait?160:"clamp(160px,48vh,320px)",overflow:"hidden"}}>
        {/* Scene-specific atmosphere */}
        {sc.loc.includes("洞窟") && (
          <>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{position:"absolute",width:4,height:4,borderRadius:"50%",background:`rgba(0,100,255,${0.3+Math.random()*0.3})`,left:`${10+Math.random()*80}%`,top:`${Math.random()*80}%`,animation:`idle ${2+Math.random()*3}s ${Math.random()*2}s infinite`}}/>
            ))}
          </>
        )}

        {/* P.BOOK 幾何学シンボル -- 右上固定 */}
        {hasPb && (
          <button
            onClick={() => setOverlay(overlay==="pb"?null:"pb")}
            style={{position:"absolute",top:12,right:14,width:52,height:52,background:"transparent",border:"none",padding:0,cursor:"pointer",zIndex:20,animation:"pbGlow 3s ease-in-out infinite"}}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 外周リング -- 低速回転 */}
              <circle cx="26" cy="26" r="24" stroke={overlay==="pb"?C.accent:C.border} strokeWidth="1" fill="none" strokeDasharray="4 3" style={{animation:"pbSpin 18s linear infinite",transformOrigin:"26px 26px"}}/>
              {/* 内周リング -- 逆回転 */}
              <circle cx="26" cy="26" r="19" stroke={overlay==="pb"?C.accent+"88":C.border+"66"} strokeWidth="0.8" fill="none" strokeDasharray="2 4" style={{animation:"pbSpinR 12s linear infinite",transformOrigin:"26px 26px"}}/>
              {/* 六角形フレーム */}
              <polygon points="26,5 44,15.5 44,36.5 26,47 8,36.5 8,15.5" stroke={overlay==="pb"?C.accent:C.border} strokeWidth="1" fill={overlay==="pb"?"rgba(0,200,255,0.08)":"rgba(10,26,38,0.7)"} />
              {/* 中央 -- 菱形 */}
              <polygon points="26,14 34,26 26,38 18,26" stroke={overlay==="pb"?C.accent:C.muted} strokeWidth="1" fill={overlay==="pb"?"rgba(0,200,255,0.15)":"transparent"} />
              {/* 中心点 */}
              <circle cx="26" cy="26" r="3" fill={overlay==="pb"?C.accent:C.muted} style={{animation:"pbPulse 2s ease-in-out infinite"}}/>
              {/* 四方位の小ダイヤ */}
              {[[26,9],[43,26],[26,43],[9,26]].map(([cx,cy],i) => (
                <polygon key={i} points={`${cx},${cy-3} ${cx+2},${cy} ${cx},${cy+3} ${cx-2},${cy}`} fill={overlay==="pb"?C.accent:C.border} opacity="0.8"/>
              ))}
              {/* P.B テキスト */}
              <text x="26" y="29" textAnchor="middle" fill={overlay==="pb"?C.accent:C.muted} fontSize="7" fontFamily="'Share Tech Mono',monospace" letterSpacing="1" opacity="0.9">P.B</text>
            </svg>
          </button>
        )}

        {/* LV UP シンボル -- P.BOOKの下 */}
        {lvUpInfo && (
          <button
            onClick={() => setOverlay("lvup")}
            style={{position:"absolute",top:hasPb?72:12,right:14,width:52,height:52,background:"transparent",border:"none",padding:0,cursor:"pointer",zIndex:20,animation:"lvPulse 1.2s ease-in-out infinite"}}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 外周リング */}
              <circle cx="26" cy="26" r="24" stroke={C.gold} strokeWidth="1" fill="none" strokeDasharray="3 3" style={{animation:"pbSpin 6s linear infinite",transformOrigin:"26px 26px"}}/>
              {/* 星形 */}
              <polygon points="26,7 29.5,19.5 42.5,19.5 32,27.5 35.5,40 26,32 16.5,40 20,27.5 9.5,19.5 22.5,19.5" fill={C.gold} opacity="0.85"/>
              {/* LV テキスト */}
              <text x="26" y="30" textAnchor="middle" fill={C.bg} fontSize="7" fontFamily="'Share Tech Mono',monospace" letterSpacing="0.5" fontWeight="bold">LV!</text>
            </svg>
          </button>
        )}

        <div style={{display:"flex",gap:isPortrait?2:8,alignItems:"flex-end",justifyContent:"center",flexWrap:"nowrap",width:"100%",overflow:"hidden"}}>
          {sc.sprites.map((sp, i) => {
            const sprKey = SPRITE_MAP[sp];
            const sprUrl = sprKey ? assetUrl(sprKey) : null;
            const isHero = i === 0;
            const sz = SPRITE_SIZE[sp] ?? { scale: 0.9, heroScale: 1.0, offsetY: 0, fallbackSize: 40 };
            const count = sc.sprites.length;
            // 人数ごとの高さ縮小率（6人が最大）
            const countScale = count <= 1 ? 1.0 : count <= 2 ? 0.95 : count <= 3 ? 0.90 : count <= 4 ? 0.84 : count <= 5 ? 0.78 : 0.70;
            const appliedScale = isHero ? sz.heroScale : sz.scale;
            // スプライトエリアの実測高さが取れていればpxで計算、取れなければvhフォールバック
            const areaH = spriteAreaH > 0 ? spriteAreaH : (isPortrait ? window.innerHeight * 0.30 : window.innerHeight * 0.52);
            const maxHPx = Math.round(areaH * countScale * appliedScale * 0.90);
            const maxHStr = `${maxHPx}px`;
            const heroFilter = isHero ? "drop-shadow(0 0 8px rgba(0,200,255,0.3))" : "none";
            const fbSize = Math.round(sz.fallbackSize * countScale * appliedScale);
            // flexShrink:1 + minWidth:0 で人数が多くても画面内に収まるよう横幅を縮める
            return sprUrl
              ? <img key={i} src={sprUrl} alt={sp} style={{maxHeight:maxHStr,width:"auto",maxWidth:`${Math.floor(100/count)-1}%`,objectFit:"contain",marginBottom:sz.offsetY,animation:`idle ${2+i*0.3}s ${i*0.2}s infinite`,filter:heroFilter,flexShrink:1,minWidth:0}} />
              : <div key={i} style={{fontSize:fbSize,animation:`idle ${2+i*0.3}s ${i*0.2}s infinite`,filter:heroFilter,marginBottom:sz.offsetY,textShadow:"0 4px 8px rgba(0,0,0,0.5)",lineHeight:1,flexShrink:1,minWidth:0}}>{sp}</div>;
          })}
        </div>
      </div>

      {/* Dialog box -- 5行固定高さ＋スクロール対応 */}
      <style>{`
        .arcadia-text-scroll::-webkit-scrollbar { width: 4px; }
        .arcadia-text-scroll::-webkit-scrollbar-track { background: transparent; }
        .arcadia-text-scroll::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        .arcadia-text-scroll::-webkit-scrollbar-thumb:hover { background: ${C.accent}88; }
        .arcadia-text-scroll { scrollbar-width: thin; scrollbar-color: ${C.border} transparent; }
      `}</style>
      <div
        style={{position:"relative",zIndex:10,height:isPortrait?220:"clamp(140px,28vh,171px)",margin:isPortrait?"0 6px 6px":"0 8px 4px",flexShrink:0}}
        onPointerDown={e => { tapStartYRef.current = e.clientY; }}
        onPointerUp={e => {
          const dy = Math.abs(e.clientY - tapStartYRef.current);
          if (dy < 8) onTapDlg();   // 8px未満の移動はタップとみなす
        }}
      >
        {/* ベースダイアログ */}
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.92)",border:`1px solid ${C.border}`,borderTop:`1px solid ${C.accent}44`,padding:"14px 18px 16px",cursor:"pointer",backdropFilter:"blur(4px)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Speaker + Auto toggle */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,flexShrink:0}}>
            <div style={{fontSize:11,color:spColor,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,borderLeft:`2px solid ${spColor}`,paddingLeft:8}}>
              {dl.sp}
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onPointerUp={e => e.stopPropagation()}
              onClick={e => {
                e.stopPropagation();
                const next = !autoAdvanceRef.current;
                setAutoAdv(next);
                // ONに切り替えた瞬間、すでにテキスト表示完了・選択肢なしなら即タイマー起動
                if (next && !typing && !choices) {
                  if (autoAdvTimerRef.current) clearTimeout(autoAdvTimerRef.current);
                  autoAdvTimerRef.current = setTimeout(() => {
                    if (!autoAdvanceRef.current) return;
                    const sc2 = SCENES[sceneIdx];
                    const dl2 = sc2?.dl[dlIdx];
                    if (!dl2 || dl2.choices || dl2.battle || dl2.ending) return;
                    if (dl2.next !== undefined) {
                      setFade(true);
                      setTimeout(() => { setSceneIdx(dl2.next); setDlIdx(0); setFade(false); }, 300);
                      return;
                    }
                    const nextDl = dlIdx + 1;
                    if (nextDl < sc2.dl.length) {
                      setDlIdx(nextDl);
                    } else {
                      const nextSc = sceneIdx + 1;
                      if (nextSc < SCENES.length) {
                        setFade(true);
                        setTimeout(() => { setSceneIdx(nextSc); setDlIdx(0); setFade(false); }, 300);
                      }
                    }
                  }, 1800);
                }
              }}
              style={{padding:"2px 8px",fontSize:9,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,border:`1px solid ${autoAdvance ? C.accent : C.border}`,background:autoAdvance ? `${C.accent}22` : "transparent",color:autoAdvance ? C.accent : C.muted,cursor:"pointer",borderRadius:2,transition:"all 0.2s",flexShrink:0}}
            >
              {autoAdvance ? "AUTO ●" : "AUTO ○"}
            </button>
            <button
              onPointerDown={e => e.stopPropagation()}
              onPointerUp={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); setOverlay("novel"); }}
              style={{padding:"2px 8px",fontSize:9,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer",borderRadius:2,transition:"all 0.2s",flexShrink:0}}
              onMouseEnter={e => { e.currentTarget.style.color=C.accent2; e.currentTarget.style.borderColor=C.accent2; }}
              onMouseLeave={e => { e.currentTarget.style.color=C.muted;   e.currentTarget.style.borderColor=C.border; }}
            >
              📖 NOVELIZE
            </button>
            </div>
          </div>
          {/* Text -- スクロールエリア */}
          <div
            ref={textScrollRef}
            className="arcadia-text-scroll"
            style={{flex:1,fontSize:isPortrait?14:13,color:C.white,lineHeight:isPortrait?2.0:1.85,whiteSpace:"pre-wrap",overflowY:"auto",overflowX:"hidden",paddingRight:6}}
          >
            {displayText}
            {typing && <span style={{animation:"blnk 0.5s infinite",color:C.accent}}>█</span>}
          </div>
          {/* Advance indicator */}
          {!typing && !choices && (
            <div style={{position:"absolute",bottom:10,right:16,fontSize:10,color:C.accent,animation:"blnk 1s infinite",fontFamily:"'Share Tech Mono',monospace"}}>▼</div>
          )}
        </div>

        {/* Choices -- ダイアログ全体を上書きして表示 */}
        {choices && !typing && (
          <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",border:`1px solid ${C.border}`,borderTop:`1px solid ${C.accent}44`,display:"flex",flexDirection:"column",justifyContent:"center",gap:8,padding:"12px 10px",backdropFilter:"blur(4px)",animation:"slideUp 0.3s ease"}}>
            {choices.map((ch, i) => (
              <button key={i}
                onPointerDown={e => e.stopPropagation()}
                onPointerUp={e => { e.stopPropagation(); onChoice(ch); }}
                onClick={e => e.stopPropagation()}
                style={{flex:1,padding:"0 16px",background:C.panel,border:`1px solid ${C.border}`,color:C.text,fontSize:13,textAlign:"left",cursor:"pointer",transition:"all 0.2s",fontFamily:"'Noto Serif JP',serif",letterSpacing:0.5,display:"flex",alignItems:"center"}}
                onMouseEnter={e => { e.currentTarget.style.background = C.panel2; e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border; }}>
                {ch.t}
              </button>
            ))}
          </div>
        )}
      </div>



      {/* P.BOOK Overlay */}
      {overlay === "pb" && (
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:30,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s"}}>
          <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${C.border}`,padding:"10px 16px"}}>
            <div style={{fontSize:11,letterSpacing:4,color:C.accent,fontFamily:"'Share Tech Mono',monospace",flex:1}}>P.BOOK</div>
            <button onClick={() => setOverlay(null)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace"}}>✕</button>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
            {["STATUS","MAIL","MAP"].map((tab,i) => (
              <button key={i} onClick={() => setPbTab(i)} style={{flex:1,padding:"8px 4px",background:"transparent",border:"none",borderBottom:pbTab===i?`2px solid ${C.accent}`:"2px solid transparent",color:pbTab===i?C.accent:C.muted,fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{flex:1,padding:16,overflowY:"auto"}}>
            {pbTab === 0 && (
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,lineHeight:2}}>
                <div style={{color:C.accent2,fontSize:14,marginBottom:12,letterSpacing:2}}>Eltz</div>
                {[
                  ["Lv", lv],
                  ["EXP", `${exp} / ${EXP_TABLE[lv] || "MAX"}`],
                  ["HP", `${hp} / ${mhp}`],
                  ["MP", `${mp} / ${mmp}`],
                  ["ELK", elk],
                  ["武器", weapon],
                  ["物理ATK", weaponPatk + statAlloc.patk],
                  ["物理DEF", statAlloc.pdef],
                  ...(statPoints>0?[["未振り", `${statPoints} pt`]]:[]),
                  ...(inCom?[["コミュニティ","White Garden"]]:[]),
                ].map(([k,v]) => (
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:`1px solid ${C.border}44`}}>
                    <span style={{color:C.muted}}>{k}</span>
                    <span style={{color:C.text}}>{v}</span>
                  </div>
                ))}
                {statPoints > 0 && (
                  <button onClick={() => setOverlay("stat")} style={{marginTop:16,width:"100%",padding:"10px",background:C.panel,border:`1px solid ${C.gold}`,color:C.gold,fontSize:12,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:2}}>
                    ⭐ ステータス振り分け ({statPoints} pt)
                  </button>
                )}
              </div>
            )}
            {pbTab === 1 && (
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.muted}}>
                <div style={{color:C.accent,marginBottom:12,letterSpacing:2,fontSize:11}}>── MAIL ──</div>
                {hasPb ? (
                  <div style={{color:C.text,lineHeight:2}}>
                    <div style={{color:C.accent2,marginBottom:8}}>クリケットより</div>
                    <div style={{color:C.muted,fontSize:11,lineHeight:1.8}}>P.BOOKの初期設定を\n完了してください。\n\n冒険者よ、健闘を祈る！</div>
                    {inCom && (
                      <>
                        <div style={{color:C.accent2,marginBottom:8,marginTop:16}}>ユミルより</div>
                        <div style={{color:C.muted,fontSize:11,lineHeight:1.8}}>White Garden へようこそ！\n一緒に頑張ろうね。🌸</div>
                      </>
                    )}
                  </div>
                ) : <div>メールなし</div>}
              </div>
            )}
            {pbTab === 2 && (
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.muted}}>
                <div style={{color:C.accent,marginBottom:8,letterSpacing:2,fontSize:11}}>── MAP SCAN ──</div>
                {hasMapScan ? (
                  <div>
                    <div style={{background:C.panel,border:`1px solid ${C.border}`,padding:"8px 10px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{color:C.accent2}}>📍</span>
                      <span style={{color:C.white,fontSize:11}}>{sc.loc}</span>
                    </div>
                    {/* ─ 狩り場エンカウント ─ */}
                    <div style={{color:C.gold,fontSize:10,letterSpacing:2,marginBottom:6}}>── エンカウント ──</div>
                    {[
                      { key:"seagull",       label:"海岸線",   note:"Lv.1 カモメ型" },
                      { key:"shamerlot",     label:"岩場",     note:"Lv.1 シャメロット" },
                      { key:"shamerlot_lv3", label:"岩場 深部",note:"Lv.3 シャメロット" },
                      { key:"shamerlot_lv5", label:"岩場 最奥",note:"Lv.5 シャメロット" },
                    ].map(({ key, label, note }) => {
                      const def = battleDefs[key];
                      const lvDiff = def.lv - lv;
                      const canFight = true;
                      const expNote = lvDiff >= 1 ? `EXP ×${lvDiff>=3?2.0:lvDiff===2?1.5:1.2}` : lvDiff === 0 ? "EXP 等倍" : "経験値なし";
                      const expColor = lvDiff >= 1 ? C.accent2 : lvDiff === 0 ? C.muted : C.red;
                      const rowStyle = { display:"flex", alignItems:"center", gap:6, padding:"7px 8px", marginBottom:4, background:C.panel, border:`1px solid ${C.border}`, borderRadius:2 };
                      return (
                        <div key={key} style={rowStyle}>
                          <span style={{fontSize:16}}>{def.em}</span>
                          <div style={{flex:1}}>
                            <div style={{color:C.text,fontSize:11}}>{label}</div>
                            <div style={{color:C.muted,fontSize:9}}>{note} &nbsp;
                              <span style={{color:expColor}}>{expNote}</span>
                            </div>
                          </div>
                          <button onClick={() => {
                            setOverlay(null);
                            setBattleDefs(prev => prev); // flush
                            const ed = battleDefs[key];
                            setBattleEnemy(ed);
                            setCurrentEnemyType(key);
                            setEnemyHp(ed.maxHp);
                            setBtlLogs([`⚔ ${ed.name} との戦闘が始まった！`]);
                            setGuarding(false); setVictory(false); setDefeat(false); setTurn(0); setNoDmgStreak(0);
                            setBattleResultBonus({ comboMult: 1.0, gradeMult: 1.0 });
                            setEnemyTurnIdx(0); setEnemyNextAction((ed.pattern||["atk"])[0]);
                            setBattleNext(sceneIdx);
                            setBattlePrev(sceneIdx);
                            setPhase("battle");
                          }} style={{padding:"4px 10px",background:`${C.accent}11`,border:`1px solid ${C.accent}44`,color:C.accent,fontSize:10,cursor:"pointer",letterSpacing:1,flexShrink:0}}>
                            戦う
                          </button>
                        </div>
                      );
                    })}
                    <div style={{color:C.muted,fontSize:9,marginTop:6,lineHeight:1.6}}>
                      ※ コーザ・Simuluuはここから戦えません
                    </div>
                  </div>
                ) : <div style={{color:C.muted,padding:8}}>MapScan 未解放<br/><span style={{fontSize:10}}>交易所のローズと話すと解放されます</span></div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LvUp Overlay */}
      {overlay === "lvup" && lvUpInfo && (
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:30,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s"}}>
          <div style={{textAlign:"center",padding:32,border:`1px solid ${C.gold}`,background:C.panel,maxWidth:280}}>
            <div style={{fontSize:11,letterSpacing:6,color:C.gold,fontFamily:"'Share Tech Mono',monospace",marginBottom:16}}>LEVEL UP!</div>
            <div style={{fontSize:48,color:C.gold,textShadow:`0 0 20px ${C.gold}`,marginBottom:8}}>⭐</div>
            <div style={{fontSize:24,color:C.white,fontFamily:"'Share Tech Mono',monospace",marginBottom:20}}>Lv.{lvUpInfo.oldLv} → Lv.{lvUpInfo.newLv}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:2,fontFamily:"'Share Tech Mono',monospace",marginBottom:20}}>
              <div style={{color:C.accent2}}>MAX HP +10</div>
              <div style={{color:"#60a5fa"}}>MAX MP +5</div>
              <div style={{color:C.gold}}>ステータスポイント +3</div>
              <div style={{color:C.muted,fontSize:10,marginTop:4}}>物理ATK / 物理DEF に振り分け可</div>
            </div>
            <button onClick={() => { setOverlay(null); setLvUpInfo(null); }}
              style={{padding:"10px 32px",background:"transparent",border:`1px solid ${C.gold}`,color:C.gold,fontSize:12,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:2}}>OK</button>
          </div>
        </div>
      )}

      {/* Stat Alloc Overlay */}
      {overlay === "stat" && (
        <div style={{position:"absolute",inset:0,background:"rgba(5,13,20,0.97)",zIndex:30,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s"}}>
          <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${C.border}`,padding:"10px 16px"}}>
            <div style={{fontSize:11,letterSpacing:4,color:C.gold,fontFamily:"'Share Tech Mono',monospace",flex:1}}>ステータス振り分け</div>
            <button onClick={() => setOverlay("pb")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace"}}>戻る</button>
          </div>
          <div style={{flex:1,padding:16}}>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:C.gold,marginBottom:16}}>残りポイント: {statPoints}</div>
            {[
              {key:"patk",label:"物理攻撃力",color:C.accent2},
              {key:"pdef",label:"物理防御力",color:"#a78bfa"},
            ].map(({key,label,color}) => (
              <div key={key} style={{display:"flex",alignItems:"center",marginBottom:12,gap:8}}>
                <div style={{flex:1,fontSize:12,color:C.text,fontFamily:"'Share Tech Mono',monospace"}}>{label}</div>
                <div style={{fontSize:14,color,fontFamily:"'Share Tech Mono',monospace",minWidth:32,textAlign:"center"}}>{statAlloc[key]}</div>
                <button disabled={statPoints<=0} onClick={() => { if(statPoints>0){ setStatPoints(sp=>sp-1); setStatAlloc(sa=>({...sa,[key]:sa[key]+1})); }}}
                  style={{padding:"4px 12px",background:statPoints>0?`${color}22`:"transparent",border:`1px solid ${statPoints>0?color:C.border}`,color:statPoints>0?color:C.muted,cursor:statPoints>0?"pointer":"not-allowed",fontSize:12,fontFamily:"'Share Tech Mono',monospace"}}>
                  ＋
                </button>
                <button disabled={statAlloc[key]<=10} onClick={() => { if(statAlloc[key]>10){ setStatPoints(sp=>sp+1); setStatAlloc(sa=>({...sa,[key]:sa[key]-1})); }}}
                  style={{padding:"4px 12px",background:statAlloc[key]>10?`${C.muted}22`:"transparent",border:`1px solid ${statAlloc[key]>10?C.muted:C.border}`,color:statAlloc[key]>10?C.muted:C.border,cursor:statAlloc[key]>10?"pointer":"not-allowed",fontSize:12,fontFamily:"'Share Tech Mono',monospace"}}>
                  ─
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Novelize Overlay -- チャプター/シーン選択＋小説ログ */}
      {overlay === "novel" && (() => {
        // ── チャプター定義 ────────────────────────────────────────────────
        const NOVEL_CHAPTERS = [
          { id:1, label:"序章", sub:"Chapter 1", scenes:[
            { idx:0,  label:"S00 VRS接続中" },
            { idx:1,  label:"S01 旅立ちの浜辺" },
            { idx:2,  label:"S02 イルカ島 海岸線" },
            { idx:3,  label:"S03 エルム村" },
            { idx:4,  label:"S04 エルム村 ギルド（出会い）" },
            { idx:5,  label:"S05 P.BOOK取得" },
            { idx:6,  label:"S06 チュートリアル説明" },
          ]},
          { id:2, label:"初心者講習", sub:"Chapter 2", scenes:[
            { idx:7,  label:"S07 ギルド裏・草地（コーザ戦）" },
            { idx:8,  label:"S08 講習終了・卒業証" },
            { idx:9,  label:"S09 宿屋の夜" },
            { idx:10, label:"S10 レミングスの酒場" },
          ]},
          { id:3, label:"仲間との狩り", sub:"Chapter 3", scenes:[
            { idx:11, label:"S11 シャメロット初戦" },
            { idx:12, label:"S12 経験値の謎" },
            { idx:13, label:"S13 交易所・ローズとジュダ" },
            { idx:14, label:"S14 チョッパー登場" },
            { idx:15, label:"S15 チョッパー救出（赤信号）" },
            { idx:16, label:"S16 四人パーティ結成" },
          ]},
          { id:4, label:"準備と旅立ち", sub:"Chapter 4", scenes:[
            { idx:17, label:"S17 武器屋" },
            { idx:18, label:"S18 防具屋" },
            { idx:19, label:"S19 船着場・洗礼の門" },
            { idx:20, label:"S20 ホワイトガーデン加入" },
            { idx:21, label:"S21 Simuluu情報入手" },
          ]},
          { id:5, label:"試練の洞窟", sub:"Chapter 5", scenes:[
            { idx:22, label:"S22 狩り継続・レベルアップ" },
            { idx:23, label:"S23 岩場（継続）" },
            { idx:24, label:"S24 コーザの餞別" },
            { idx:25, label:"S25 西海岸・洞窟入口" },
            { idx:26, label:"S26 青の洞窟" },
            { idx:27, label:"S27 最深部・Simuluu遭遇" },
            { idx:28, label:"S28 ボス戦前" },
            { idx:29, label:"S29 撃破・勝利" },
            { idx:30, label:"S30 祝杯・エンディング" },
          ]},
        ];

        // 訪問済みシーンのセット
        const visitedSet = new Set(novelLog.map(e => e.sIdx));

        // 選択シーンのエントリ（SYSTEMも含めて表示）
        const selEntries = novelSelScene !== null
          ? novelLog.filter(e => e.sIdx === novelSelScene)
          : [];

        const selScene = NOVEL_CHAPTERS.flatMap(c => c.scenes).find(s => s.idx === novelSelScene);

        return (
          <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,#020810 0%,${C.bg} 100%)`,zIndex:30,display:"flex",flexDirection:"column",animation:"fadeIn 0.2s",fontFamily:"'Noto Serif JP',serif"}}>
            <style>{`
              .nv-scroll::-webkit-scrollbar{width:4px}
              .nv-scroll::-webkit-scrollbar-track{background:transparent}
              .nv-scroll::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
              .nv-scroll{scrollbar-width:thin;scrollbar-color:${C.border} transparent}
            `}</style>

            {/* ヘッダー */}
            <div style={{padding:"12px 18px 10px",borderBottom:`1px solid ${C.border}`,background:"rgba(5,13,20,0.97)",flexShrink:0,display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,letterSpacing:5,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginBottom:2}}>ARCADIA -- SCENARIO LOG</div>
                <div style={{fontSize:13,color:C.white,fontWeight:"bold",letterSpacing:2}}>小説ログ / NOVELIZE</div>
              </div>
              <button onClick={() => setOverlay(null)}
                style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:1,borderRadius:2,flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.color=C.white;e.currentTarget.style.borderColor=C.accent;}}
                onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor=C.border;}}
              >✕ 閉じる</button>
            </div>

            {/* 本体 -- 左ペイン（目次） + 右ペイン（本文） */}
            <div style={{flex:1,display:"flex",flexDirection:isPortrait?"column":"row",overflow:"hidden"}}>

              {/* 左ペイン -- チャプター/シーン一覧 */}
              <div className="nv-scroll" style={isPortrait
                ? {height:140,flexShrink:0,borderBottom:`1px solid ${C.border}`,overflowX:"auto",overflowY:"hidden",background:"rgba(5,13,20,0.6)",padding:"6px 0",display:"flex",flexDirection:"row",gap:0}
                : {width:188,flexShrink:0,borderRight:`1px solid ${C.border}`,overflowY:"auto",background:"rgba(5,13,20,0.6)",padding:"8px 0"}}>
                {NOVEL_CHAPTERS.map(ch => {
                  const anyVisited = ch.scenes.some(s => visitedSet.has(s.idx));
                  return (
                    <div key={ch.id} style={isPortrait ? {display:"flex",flexDirection:"column",flexShrink:0,minWidth:120,borderRight:`1px solid ${C.border}44`} : {}}>
                      {/* チャプターヘッダー */}
                      <div style={{padding:isPortrait?"4px 10px 3px":"8px 12px 5px",borderTop: (!isPortrait && ch.id>1) ? `1px solid ${C.border}44` : "none"}}>
                        <div style={{fontSize:8,letterSpacing:3,color: anyVisited ? C.accent : C.muted+"66",fontFamily:"'Share Tech Mono',monospace"}}>{ch.sub}</div>
                        <div style={{fontSize:11,color: anyVisited ? C.accent2 : C.muted+"66",fontWeight:"bold",letterSpacing:1,marginTop:1}}>{ch.label}</div>
                      </div>
                      {/* シーンボタン */}
                      {ch.scenes.map(s => {
                        const visited  = visitedSet.has(s.idx);
                        const selected = novelSelScene === s.idx;
                        const btnBg    = selected ? `${C.accent}22` : "transparent";
                        const btnColor = selected ? C.accent : visited ? C.text : C.muted+"44";
                        const btnBorder = selected ? `1px solid ${C.accent}` : "1px solid transparent";
                        return (
                          <button key={s.idx}
                            disabled={!visited}
                            onClick={() => {
                              setNovelSelScene(s.idx);
                              const hasNovel = NOVEL_STATUS[s.idx];
                              setNovelTab(hasNovel ? "novel" : "log");
                              // キャッシュ済みなら再fetchしない
                              if (hasNovel && !(s.idx in novelCache)) {
                                const url = novelUrl(s.idx);
                                setNovelLoading(true);
                                fetch(url)
                                  .then(r => r.ok ? r.text() : Promise.reject(r.status))
                                  .then(text => {
                                    setNovelCache(prev => ({ ...prev, [s.idx]: text || null }));
                                  })
                                  .catch(() => {
                                    setNovelCache(prev => ({ ...prev, [s.idx]: null }));
                                  })
                                  .finally(() => setNovelLoading(false));
                              }
                            }}
                            style={{display:"block",width:"100%",textAlign:"left",padding:isPortrait?"3px 10px 3px 12px":"5px 14px 5px 18px",background:btnBg,border:"none",borderLeft: selected ? `3px solid ${C.accent}` : `3px solid transparent`,color:btnColor,fontSize:isPortrait?9:10,cursor: visited ? "pointer" : "default",fontFamily:"'Noto Serif JP',serif",letterSpacing:0.3,lineHeight:1.5,transition:"all 0.15s"}}
                            onMouseEnter={e=>{ if(visited && !selected){ e.currentTarget.style.background=`${C.accent}11`; e.currentTarget.style.color=C.white; }}}
                            onMouseLeave={e=>{ if(visited && !selected){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.text; }}}
                          >
                            {s.label}
                            {!visited && <span style={{fontSize:8,color:C.muted+"44",marginLeft:4}}>──</span>}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* 右ペイン -- 本文 */}
              <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

                {/* タブバー */}
                {novelSelScene !== null && (
                  <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0,background:"rgba(5,13,20,0.8)"}}>
                    {[
                      { id:"novel", label:"📖 NOVEL" },
                      { id:"log",   label:"📋 GAME LOG" },
                    ].map(tab => {
                      const active = novelTab === tab.id;
                      const tabStyle = active
                        ? { color:C.accent, borderBottom:`2px solid ${C.accent}`, background:`${C.accent}11` }
                        : { color:C.muted,  borderBottom:"2px solid transparent", background:"transparent" };
                      return (
                        <button key={tab.id}
                          onClick={() => setNovelTab(tab.id)}
                          style={{padding:"9px 20px",fontSize:10,cursor:"pointer",border:"none",letterSpacing:2,fontFamily:"'Share Tech Mono',monospace",transition:"all 0.15s",...tabStyle}}
                          onMouseEnter={e=>{ if(!active){ e.currentTarget.style.color=C.white; }}}
                          onMouseLeave={e=>{ if(!active){ e.currentTarget.style.color=C.muted; }}}
                        >{tab.label}</button>
                      );
                    })}
                  </div>
                )}

                <div className="nv-scroll" style={{flex:1,overflowY:"auto",padding:"22px 24px 32px"}}>
                {novelSelScene === null ? (
                  <div style={{color:C.muted,fontSize:12,textAlign:"center",marginTop:60,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,lineHeight:2}}>
                    <div style={{fontSize:20,marginBottom:12}}>📖</div>
                    左のリストからシーンを選択してください<br/>
                    <span style={{fontSize:10}}>訪問済みのシーンのみ閲覧できます</span>
                  </div>
                ) : novelTab === "novel" ? (
                  /* ── NOVEL タブ ── */
                  (() => {
                    // ローディング中
                    if (novelLoading && !(novelSelScene in novelCache)) {
                      return (
                        <div style={{color:C.muted,fontSize:12,textAlign:"center",marginTop:60,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,lineHeight:2}}>
                          <div style={{fontSize:20,marginBottom:12,animation:"arcadiaBlnk 1s step-end infinite"}}>📖</div>
                          読み込み中...
                        </div>
                      );
                    }
                    const novelText = novelCache[novelSelScene] ?? null;
                    return novelText ? (
                      <>
                        <div style={{marginBottom:24,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
                          <div style={{fontSize:9,letterSpacing:4,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginBottom:4}}>
                            {NOVEL_CHAPTERS.find(c=>c.scenes.some(s=>s.idx===novelSelScene))?.sub ?? ""}
                          </div>
                          <div style={{fontSize:15,color:C.white,fontWeight:"bold",letterSpacing:1}}>
                            {selScene?.label ?? ""}
                          </div>
                          <div style={{fontSize:10,color:C.muted,marginTop:4}}>
                            {SCENES[novelSelScene]?.loc ?? ""}
                          </div>
                        </div>
                        <p style={{color:C.text,fontSize:13,lineHeight:2.2,margin:0,whiteSpace:"pre-wrap",letterSpacing:0.5,fontFamily:"'Noto Serif JP',serif"}}>
                          {novelText}
                        </p>
                      </>
                    ) : (
                      <div style={{color:C.muted,fontSize:12,textAlign:"center",marginTop:60,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,lineHeight:2}}>
                        <div style={{fontSize:20,marginBottom:12}}>✏️</div>
                        {novelSelScene in novelCache
                          ? <>読み込みに失敗しました<br/><span style={{fontSize:10}}>ネットワーク接続を確認してください</span></>
                          : <>このシーンのノベルはまだ執筆中です<br/><span style={{fontSize:10}}>GAME LOG タブでゲームログを確認できます</span></>
                        }
                      </div>
                    );
                  })()
                ) : selEntries.length === 0 ? (
                  /* ── LOG タブ（エントリなし） ── */
                  <div style={{color:C.muted,fontSize:12,textAlign:"center",marginTop:60,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2}}>
                    ── ログがありません ──
                  </div>
                ) : (
                  /* ── LOG タブ（本文） ── */
                  <>
                    {/* シーンタイトル */}
                    <div style={{marginBottom:24,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
                      <div style={{fontSize:9,letterSpacing:4,color:C.muted,fontFamily:"'Share Tech Mono',monospace",marginBottom:4}}>
                        {NOVEL_CHAPTERS.find(c=>c.scenes.some(s=>s.idx===novelSelScene))?.sub ?? ""}
                      </div>
                      <div style={{fontSize:15,color:C.white,fontWeight:"bold",letterSpacing:1}}>
                        {selScene?.label ?? ""}
                      </div>
                      <div style={{fontSize:10,color:C.muted,marginTop:4}}>
                        {SCENES[novelSelScene]?.loc ?? ""}
                      </div>
                    </div>

                    {/* 本文エントリ */}
                    {selEntries.map((entry, i) => {
                      const isNarration = entry.sp === "ナレーション";
                      const isSystem    = entry.sp === "SYSTEM";
                      return (
                        <div key={i} style={{marginBottom: isNarration ? 22 : isSystem ? 16 : 18}}>
                          {isSystem ? (
                            // SYSTEMメッセージ -- モノスペース・シアン枠
                            <div style={{background:`${C.accent}0d`,border:`1px solid ${C.accent}44`,borderLeft:`3px solid ${C.accent}`,padding:"10px 14px",borderRadius:2}}>
                              <div style={{fontSize:8,letterSpacing:4,color:C.accent,fontFamily:"'Share Tech Mono',monospace",marginBottom:6}}>── SYSTEM ──</div>
                              <p style={{color:C.accent,fontSize:12,lineHeight:1.9,margin:0,whiteSpace:"pre-wrap",fontFamily:"'Share Tech Mono',monospace",letterSpacing:0.3}}>
                                {entry.t}
                              </p>
                            </div>
                          ) : isNarration ? (
                            <p style={{color:C.text,fontSize:13,lineHeight:2.15,margin:0,textIndent:"1em",whiteSpace:"pre-wrap",letterSpacing:0.4}}>
                              {entry.t}
                            </p>
                          ) : (
                            <div>
                              <div style={{fontSize:9,color:C.accent2,fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,marginBottom:4,borderLeft:`2px solid ${C.accent2}`,paddingLeft:7,display:"inline-block"}}>
                                {entry.sp}
                              </div>
                              <p style={{color:C.white,fontSize:13,lineHeight:2.0,margin:"4px 0 0 0",paddingLeft:9,whiteSpace:"pre-wrap",letterSpacing:0.4,borderLeft:`1px solid ${C.border}`}}>
                                {entry.t}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
                </div>
              </div>
            </div>

            {/* フッター */}
            <div style={{padding:"9px 18px 12px",borderTop:`1px solid ${C.border}`,background:"rgba(5,13,20,0.97)",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:10,color:C.muted,fontFamily:"'Share Tech Mono',monospace",letterSpacing:1}}>
                {visitedSet.size} / {NOVEL_CHAPTERS.flatMap(c=>c.scenes).length} シーン解放済み
              </div>
              <button onClick={() => setOverlay(null)}
                style={{padding:"7px 22px",background:`${C.accent}1a`,border:`1px solid ${C.accent}`,color:C.accent,fontSize:11,cursor:"pointer",fontFamily:"'Share Tech Mono',monospace",letterSpacing:2,borderRadius:2}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${C.accent}33`;}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${C.accent}1a`;}}
              >ゲームに戻る ▶</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
