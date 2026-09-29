(() => {
  'use strict';
  const venues = {
    kikuyo:{name:'きくよ食堂 本店',address:'函館市若松町11-15',near:'函馆朝市 · 车站旁',eat:'海鲜丼；想吃几种海鲜可看巴丼。',note:'冬季通常早上营业至午后；取行李、乘车前留足时间。',query:'きくよ食堂 本店 函館市若松町11-15',url:'https://hakodate-kikuyo.com/'},
    lucky:{name:'Lucky Pierrot 海湾本店',address:'函館市末広町23-18',near:'金森仓库旁',eat:'中华鸡肉汉堡，按胃口加小份配餐。',query:'ラッキーピエロ ベイエリア本店 函館市末広町23-18',url:'https://luckypierrot.jp/shop/bayarea/'},
    beerhall:{name:'函館ビヤホール',address:'函館市末広町14-12',near:'金森仓库内 · 晚上顺路',eat:'选一份热菜与主食，坐下来吃晚饭。',note:'圣诞期间先看空位，排队久就换海湾附近餐厅。',query:'函館ビヤホール 函館市末広町14-12',url:'https://hkumaiyo.com/shopinfo/'},
    adex:{name:'adex BAKERY & CAFE',address:'登別市登別温泉町76-2 · adex inn 大堂',near:'就在住处',eat:'早餐选可颂、三明治和咖啡；正餐可看意面菜单。',note:'常规 08:00 开门；不默认包含在房费里，供餐时段到店确认。',query:'adex BAKERY CAFE 登別温泉',url:'https://www.adexinn.com/ja-bakerycafe'},
    onsen:{name:'温泉市場',address:'登別市登別温泉町50',near:'温泉街 · 阎魔堂附近',eat:'海鲜饭，或当日供应的烤鱼贝。',note:'通常 11:30 开门；食材售完可能提前结束。',query:'温泉市場 登別市登別温泉町50',url:'https://www.onsenichiba.com/guide.html'},
    daikoku:{name:'大黒屋 旭川五丁目店',address:'旭川市4条通5丁目1425',near:'买物公园西侧 · 12/29 晚餐',eat:'成吉思汗烤羊肉。',note:'提前从原行程入口预约；年末营业再核对。',query:'大黒屋 旭川五丁目店',url:'https://daikoku-jgs.com/free/asahikawa'},
    santouka:{name:'山头火 旭川本店',address:'旭川市1条通8丁目348-6 · MANNY BLD 1F',near:'旭川站北侧 · 回站后顺路',eat:'盐味拉面；和酱油口味按喜好选。',note:'常规周四休，汤售完可能提早结束；12/31 不安排这家。',query:'らーめん山頭火 旭川本店',url:'https://www.santouka.co.jp/shop-jp/hokkaido/area01-001'},
    baikohken:{name:'梅光轩 旭川本店',address:'旭川市2条通8丁目 · 買物公園ピアザビル B1F',near:'平和通买物公园',eat:'旭川酱油拉面；回车站前吃一碗热的。',note:'午间最后点餐通常 15:00，有午休；年末营业待确认。',query:'梅光軒 旭川本店 買物公園ピアザビル',url:'https://baikohken-shop.com/page/shops.html'},
    toriton:{name:'TORITON 回转寿司 旭神店',address:'旭川市旭神3条5-1',near:'旭神地区 · 需另乘公交，不在站前',eat:'按当天鱼种点几盘寿司。',note:'不接受座位预约，网上预约为外带。先确认 12/30 营业与等位；1/1–1/2 近年休业，本季待公布。',query:'回転寿しトリトン 旭神店 旭川市旭神3条5-1',url:'https://toriton-kita1.jp/shop/kyokushin/',transport:'旭川站乘 81 路往共栄バスセンター，在「旭神3条5丁目」下车后步行；旧冬表去程约 27 分钟，2026–27 班次待确认，先查返程。',transportUrl:'https://www.asahikawa-denkikidou.jp/manage/wp-content/uploads/2025/11/81_2025.12.07.pdf'},
    aeon:{name:'AEON 旭川站前 · 餐饮楼层',address:'旭川市宮下通7丁目2-5',near:'旭川站旁 · Y’s Hotel 附近',eat:'乌冬、丼饭、熟食按当天营业店铺选。',note:'元旦和年末各店可能缩短营业，先看商场公告。',query:'イオンモール旭川駅前',url:'https://asahikawaekimae.aeonmall.jp/gourmet'},
    koeru:{name:'駅の見えるレストラン＆カフェ KOERU',address:'美瑛町大町1丁目1-7',near:'美瑛站后侧',eat:'咖喱乌冬或豚丼，二选一。',note:'通常周二及年末年始休；12/30 营业待确认。点餐制作需要时间，短换乘不去。',query:'レストラン カフェ KOERU 美瑛町大町1-1-7',url:'https://biei-koeru.jp/content/restaurant/'},
    mori:{name:'森之时计咖啡屋',address:'富良野市中御料 · 新富良野王子酒店森林内',near:'精灵露台附近',eat:'喝杯咖啡；甜点看当天菜单。',note:'不接受预约。排队长就略过，优先保住下午回旭川的车。',query:'珈琲 森の時計 富良野',url:'https://www.princehotels.co.jp/shinfurano/restaurant/morinotokei/'},
    hokudai:{name:'北海道大学 · 中央食堂',address:'札幌市北区北11条西8丁目 · 北海道大学内',near:'北大校园内 · 现名レバレジーズ中央食堂',eat:'热饭、面食或当日套餐，按柜台菜单选。',note:'游客避开 11:30–13:00；常规周末与节假日休。1/4、1/6 年始开门日待校历确认。',query:'北海道大学 レバレジーズ 中央食堂',url:'https://www.hokkaido-univcoop.jp/hokudai/bhours/'},
    picante:{name:'Picante 汤咖喱 · 本店',address:'札幌市北区北13条西3丁目 · アクロビュー北大前 1F',near:'北大东侧 · 北13条店',eat:'酥脆 PICA 鸡肉汤咖喱，汤底和辣度按喜好选。',note:'常规 11:30 开门。与食堂选一餐；1/6 用这家，札幌站前店周三休。',query:'ピカンティ 北13条 本店 札幌',url:'https://www.picante.jp/access/'},
    picanteStation:{name:'Picante 汤咖喱 · 札幌站前店',address:'札幌市中央区北2条西1丁目8-4 · 青山ビル 1F',near:'札幌站南侧',eat:'汤咖喱，按当天菜单选肉与蔬菜。',note:'常规午间营业，周三休；1/6 不用这家。先确认年始公告。',query:'ピカンティ 札幌駅前店 北2条西1丁目8-4',url:'https://www.picante2009.com/'},
    garaku:{name:'Soup Curry GARAKU · 札幌本店',address:'札幌市中央区南3条東2丁目6-1 · プレサント南3東2 B1F',near:'二条市场一带 · 已更新为搬迁后地址',eat:'鸡腿蔬菜汤咖喱；Picante 和这里分开两天更合适。',note:'有午休，汤售完可能结束；Google Maps 按新址查询。',query:'GARAKU 札幌市中央区南3条東2丁目6-1',url:'https://www.s-garaku.com/shoplist.php'},
    bird:{name:'小鸟可丽饼 · 札幌站前店',address:'札幌市中央区北4条西2丁目1-3 · ひまわりタワー 1F 外侧',near:'札幌站南侧 · シマエナガクレープ',eat:'银喉长尾山雀造型可丽饼，口味看当天菜单。',note:'造型配料可能售完；当天营业看门店公告。',query:'シマエナガクレープ 札幌駅前店',url:'https://www.instagram.com/shimaenaga_sapporoekimae/'},
    cremia:{name:'CREMIA · THE SOFTCREAM HOUSE',address:'札幌市中央区南2条西5丁目23-1 · 狸小路大王ビル店内',near:'狸小路沿线',eat:'CREMIA 生奶油软冰淇淋。',note:'品牌北海道门店目录列有此店；到访前确认营业与当天供应。',query:'THE SOFTCREAM HOUSE 札幌 南2条西5丁目23-1',url:'https://www.nissei-com.co.jp/cremia/shop/area01_hokkaido.html'},
    pal:{name:'夜パフェ専門店 Parfaiteria PaL',address:'札幌市中央区南4条西2丁目10-1 · 南4西2ビル 6F',near:'薄野 · 晚饭后的候选',eat:'季节芭菲杯，选无酒精口味。',note:'留在 1/4 或 1/5 晚上；1/6 晚上已经去机场。',query:'夜パフェ専門店 Parfaiteria PaL 札幌',url:'https://yoru-parfait-gaku.com/parfait/shop-info/'},
    sushi:{name:'おたる政寿司 本店',address:'小樽市花園1丁目1-1',near:'小樽寿司屋通',eat:'握寿司，套餐与单点按胃口选。',note:'可从官网预约；为下午行程留出用餐时间。',query:'おたる政寿司 本店 小樽市花園1-1-1',url:'https://masazushi.co.jp/shop-honten/'},
    letao:{name:'LeTAO 本店',address:'小樽市堺町7-16',near:'堺町 · 音乐盒堂附近',eat:'双层芝士蛋糕，配茶或咖啡。',note:'咖啡座排队长时可改为买一份带走。',query:'小樽洋菓子舗ルタオ 本店',url:'https://www.letao-brand.jp/shop/letao/'},
    ebi:{name:'えびそば一幻 · 新千岁机场店',address:'新千岁机场国内航站楼 3F · 北海道拉面道场',near:'安检前 · 国内航站楼',eat:'虾盐或虾味噌拉面。',note:'排队长就换同层其他店；先完成值机、看好安检截止时间。',query:'えびそば一幻 新千歳空港店',url:'https://www.hokkaido-airports.com/ja/new-chitose/spend/shop/146/'},
    kawatoyo:{name:'川豊 本店',address:'千葉県成田市仲町386',near:'成田山表参道',eat:'鳗鱼饭，作为较早的午餐候选。',note:'不接受预约，现场取号；新年等位久就略过，保留 13:00 到机场的安排。',query:'川豊 本店 成田市仲町386',url:'https://unagi-kawatoyo.com/foreign/index_cn.html'}
  };
  const snacks = {
    rice:{name:'Seicomart · 明太子饭团',channel:'便利店',note:'在饭团柜看明太子或明太子美乃滋；当天没有就选鲑鱼。HOT CHEF 只限设有该柜台的门店。',url:'https://www.seicomart.co.jp/instore/rb/rb05_rice.html'},
    zangi:{name:'Seicomart · HOT CHEF 炸鸡',channel:'便利店热食柜',note:'ザンギ，买一小份趁热分着吃；选有 HOT CHEF 的门店。',url:'https://www.seicomart.co.jp/instore/hotchef.html?mode=pc'},
    potato:{name:'Seicomart · 炸土豆',channel:'便利店热食柜',note:'道産ポテトのフライ；到 HOT CHEF 柜台看当天供应，与炸鸡配一份就够。',url:'https://www.seicomart.co.jp/instore/hotchef.html?mode=pc'},
    milk:{name:'Secoma · 北海道牛乳',channel:'便利店冷藏柜',note:'配面包或饭团，优先买小包装；回住处后按包装冷藏。',url:'https://www.seicomart.co.jp/instore/milk.html'},
    yogurt:{name:'Secoma · 丰富牛乳酸奶',channel:'便利店冷藏柜',note:'北海道とよとみヨーグルト；挑一小杯，可留作第二天早餐。',url:'https://www.seicomart.co.jp/instore/yogurtcp.html'},
    hakodateMilk:{name:'函馆牛乳 · 橙色包装',channel:'函馆超市 / 食品店',note:'函馆时顺路看冷藏奶柜，买小包装分享。当地品牌，按柜台当日供应选。',url:'https://www.e-milk.co.jp/milk/01.html'},
    pudding:{name:'Secoma · 鸡蛋布丁',channel:'便利店冷藏柜',note:'想吃焦糖口味就看杯底与包装；回酒店前买一杯，当天吃。',url:'https://seicomart.co.jp/instore/rb/rb07_bread.html'},
    icecream:{name:'Secoma · 北海道牛乳冰淇淋',channel:'便利店冰柜',note:'牛乳软冰淇淋或奶味杯装二选一，买后即吃；口味看当天冰柜。',url:'https://www.seicomart.co.jp/instore/rb/rb08_candy.html'},
    melonSour:{name:'Secoma · 哈密瓜气泡酒',channel:'便利店酒柜',note:'北海道メロンサワー，酒精 3%；想尝就选一罐，留到酒店休息时喝。',url:'https://online.seicomart.co.jp/delivery/goods_list/goods_list_3.php?o_no=760600000001'},
    melonJelly:{name:'Secoma · 北海道哈密瓜果冻',channel:'便利店甜点柜',note:'北海道メロンゼリー；买一小杯尝味，冬季有货再选。',url:'https://seicomart.co.jp/instore/rb/rb07_bread.html'},
    salmonCorn:{name:'Seicomart · 鲑鱼干风味玉米片',channel:'便利店零食架',note:'鮭とばコーンチップス，是一款鲑鱼风味玉米片；选一袋路上分享。',url:'https://online.seicomart.co.jp/delivery/goods_list/goods_list_3.php?disp_flg=pc&o_no=742800000001'},
    butterChips:{name:'Calbee · 北海道黄油酱油薯片',channel:'便利店 / 超市',note:'认「北海道バターしょうゆ味」；与玉米片选一袋即可，门店库存当天看。',url:'https://www.calbee.co.jp/products/detail/?p=20260604161954'},
    milkNoodle:{name:'日清 · 牛奶海鲜杯面',channel:'便利店 / 超市',note:'冬季限定；2026 冬季是否再售待确认。买不到就选普通海鲜面，酒店有热水时吃。',url:'https://cdn.nissin.com/gr-documents/attachments/news_posts/13556/a140ce3e418a253b/original/20251125-1.pdf?1763634649='},
    cheeseRoll:{name:'北海道牛乳芝士卷',channel:'便利店面包 / 冷藏柜',note:'具体品牌与商品名待确认；先记想吃的口味，看到包装再选，不为它专程跑店。',url:''},
    cheeseTara:{name:'鳕鱼芝士条 · チーズ鱈',channel:'便利店 / 超市',note:'鳕鱼片夹芝士，选一小袋。常温版和冷藏版不同，按包装保存。',url:'https://www.natori.co.jp/joy/cheese.html'},
    egg:{name:'7-Eleven · 鸡蛋三明治',channel:'便利店冷藏柜',note:'配牛奶或热饮当早餐；作为正餐时再加饭团。',url:'https://www.sej.co.jp/products/a/item/053738/'},
    chicken:{name:'Lawson · からあげクン',channel:'便利店热食柜',note:'鸡块一小份，配饭团或三明治更顶饱。',url:'https://www.lawson.co.jp/recommend/original/fry/'},
    royce:{name:'ROYCE · 巧克力薯片',channel:'品牌专柜 / 机场',note:'回程再买小盒，不占前几天行李；按包装温度保存。',url:'https://www.royce.com/contents/potatochip'},
    rokkatei:{name:'六花亭 · 葡萄干黄油夹心',channel:'六花亭门店 / 专柜',note:'マルセイバターサンド；与核桃款分开，是另一个口味。看包装保存方式与期限。',url:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=10050'},
    taiheigen:{name:'六花亭 · 大平原',channel:'六花亭门店 / 专柜',note:'黄油小蛋糕；札幌或小樽顺路买少量，尝过喜欢再带回家。',url:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=11768'},
    walnut:{name:'六花亭 · 核桃黄油夹心蛋糕',channel:'六花亭门店 / 专柜',note:'マルセイバターケーキ，核桃与焦糖奶油夹心；买小包装，和大平原分着尝。',url:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=11770'},
    roastCorn:{name:'YOSHIMI · 烤玉米米果',channel:'伴手礼店 / 机场',note:'Oh!焼とうきび；烤玉米与酱油香的小袋米果，路过卖伴手礼的店再看。',url:'https://www.yoshimi-ism.com/product/oh_yakitoukibi.php'},
    currySenbei:{name:'YOSHIMI · 汤咖喱仙贝',channel:'伴手礼店 / 机场',note:'カリカリまだある？带辣味的条状仙贝，选小袋尝味。',url:'https://www.yoshimi-ism.com/product/karikari.php'},
    calbee:{name:'Calbee · じゃがポックル 薯条',channel:'伴手礼店 / 机场',note:'北海道伴手礼，选盐味或当日供应口味。国内航站楼不找仅限国际免税区的黄油版。',url:'https://faq.calbee.co.jp/faq_detail.html?id=112'},
    shiroi:{name:'白色恋人',channel:'品牌专柜 / 机场',note:'夹心饼干，在白色恋人公园或回程机场顺路挑小盒。',url:'https://shop.ishiya.co.jp/'}
  };
  const m=(note,ids=[],query='')=>({note,venues:ids,query});
  const hotelBreakfast=m('酒店早餐以订单为准；没有含餐就选面包、饭团和热饮。');
  function buildDay(day,selected){
    const id=day.id;
    const area=id==='12-23'||id==='01-07'?'成田駅':id==='12-24'?'羽田空港':id==='12-25'||id==='12-26'?'函館駅':id==='12-27'||id==='12-28'?'登別温泉':id==='01-05'?'小樽駅':id==='01-04'||id==='01-06'?'札幌駅':'旭川駅';
    const base={area,breakfast:hotelBreakfast,lunch:m('在当天停留的车站或景点附近吃热饭。'),dinner:m('回住处前吃晚饭。'),sweets:null,notes:['年末年始营业待各店公告；候选按位置挑一家即可。'],snacks:['rice','zangi','pudding']};
    const plans={
      '12-23':{breakfast:m('出发前就近吃；起飞时间待补。'),lunch:m('按机票时间在出发机场吃简餐。'),dinner:m('若落地较晚，先在成田机场买三明治或饭团，再乘酒店接驳。',[],'成田空港 コンビニ'),notes:['机场航站楼待补；别把晚饭完全寄望于酒店附近仍有店开门。'],snacks:['egg','chicken']},
      '12-24':{breakfast:m('酒店早餐或昨晚买的面包；08:30 前准备出门。'),lunch:m('抵达羽田后，在实际航站楼吃乌冬、丼饭或简餐。',[],'羽田空港 レストラン'),dinner:m('渚亭晚餐以订单含餐及入席时间为准；抵达时先向前台确认。'),notes:['今天跨机场，午餐放在抵达羽田之后。'],snacks:['egg','chicken']},
      '12-25':{lunch:m('元町走完到海湾吃汉堡。',['lucky']),dinner:m('金森仓库附近坐下来吃饭，再回酒店。',['beerhall']),notes:['酒店早餐以订单为准；圣诞晚餐先看营业与空位。'],snacks:['rice','pudding','chicken']},
      '12-26':{breakfast:m('没订酒店早餐的话，出发前去朝市吃一碗；和酒店早餐二选一。',['kikuyo']),lunch:m('函馆站买便当或饭团，按北斗发车时间安排。',[],'函館駅 駅弁'),dinner:m('Kitutuki 晚餐按订单，提前确认入席时间；没有含餐需在进酒店前落实。'),notes:['下午要去湖边酒店，车上带水和一点简餐。'],snacks:['rice','pudding']},
      '12-27':{lunch:m('放下行李后在温泉街吃。',['onsen']),dinner:m('adex 大堂吃意面或附近简餐，之后再泡汤。',['adex']),notes:['住 adex inn、泡汤去第一滝本館；免费泡汤不等于包含晚餐。'],snacks:['rice','pudding']},
      '12-28':{breakfast:m('住处大堂买面包和咖啡，留意开门时间。',['adex']),lunch:m('熊牧场回温泉街后吃一餐；转去时代村前不排长队。',['onsen']),dinner:m('回温泉街吃晚饭；想省事可在住处大堂点意面。',['adex']),notes:['如果午餐等位影响巴士，就改带简餐；不把吃饭挤到景区关门前。'],snacks:['rice','zangi']},
      '12-29':{breakfast:m('退房前在 adex 吃面包；巴士早时前一晚备好。',['adex']),lunch:m('札幌中转先吃简餐；换乘充裕才去站前 Picante。',['picanteStation'],'札幌駅 弁当'),dinner:m('抵达旭川后，保留这一顿烤羊肉。',['daikoku']),notes:['午餐以 JR 接续为先；汤咖喱也可留到札幌的几天。'],snacks:['rice','pudding']},
      '12-31':{lunch:m('买物公园一带吃午餐，先看年末开门公告。',['baikohken']),dinner:m('下午在 AEON 买年越荞麦或熟食，晚上回酒店吃。',['aeon']),notes:['山头火常规周四休，今天不安排；顺手买好元旦早餐。','TORITON 近年 12/31 仅处理预约外带，本季未确认，不当作堂食晚餐。'],snacks:['rice','pudding','rokkatei']},
      '01-01':{breakfast:m('昨晚备好的早餐或订单内酒店早餐。'),lunch:m('神社回来先去站前看营业店铺；无合适店就吃备好的简餐。',['aeon']),dinner:m('选站前当天营业的店，或提前买好便当回酒店。',[],'旭川駅 レストラン'),notes:['元旦不保证餐厅开门；午餐、晚餐都留一份简餐备选。','TORITON 近年 1/1–1/2 休业，本季待公布，今天不安排。'],snacks:['egg','pudding']},
      '01-03':{breakfast:m('酒店早餐或站前面包，乘巴士前吃完。'),lunch:m('在旭川先买饭团、三明治带上山；酒店是否供应午餐先确认。',[],'旭川駅 コンビニ'),dinner:m('大雪山远景酒店晚餐以订单为准，入住时确认入席时间。'),notes:['今天在旭岳，先在旭川备好水和简餐，别依赖山上临时找店。'],snacks:['rice','egg']},
      '01-05':{breakfast:m('在札幌公园酒店或中岛公园站附近吃早餐，再乘地铁去札幌站换 JR。',[],'中島公園駅 パン'),lunch:m('按预约时间到店，之后继续逛运河。',['sushi']),dinner:m('返程前在小樽站附近吃，或回中岛公园后找一份热饭。',[],'中島公園駅 レストラン'),sweets:m('LeTAO 在白天；回札幌还有胃口，可在薄野停留吃芭菲后再回酒店。',['letao','pal']),notes:['今晚回札幌公园酒店；Picante 本店留在北大那天，不在小樽返程后往北绕。'],snacks:['royce','rokkatei','shiroi']},
      '01-07':{breakfast:m('酒店或成田站附近吃简餐。',[],'成田駅 パン'),lunch:m('表参道较早吃午餐，等位太久就去机场吃。',['kawatoyo']),dinner:m('按回程机票与到达时间安排，机上供餐以订单为准。'),notes:['保留 12:00 取行李、13:00 到机场；不为鳗鱼饭等过时间。'],snacks:['egg','chicken']}
    };
    if(id==='12-30'||id==='01-02'){
      const biei=selected==='biei';
      if(biei)return {...base,breakfast:m('出门前吃早餐，顺手带午餐、热水和小零食。'),lunch:m(id==='01-02'?'先带好饭团或三明治；年始不依赖美瑛临时找店。':'带简餐最省时；KOERU 只在开门且换乘宽裕时考虑。',id==='01-02'?[]:['koeru']),dinner:m('回旭川后吃热拉面或站前简餐。',['santouka','aeon']),sweets:m('森之时计只在有空位时坐一会儿。',['mori']),notes:['青池和瀑布附近不保证有营业餐饮；便当不在行驶中的市内巴士上吃。','冬季回程待确认，咖啡与甜点不延后离开富良野的时间。'],snacks:['rice','egg','chicken']};
      return {...base,lunch:m(id==='01-02'&&selected==='zoo'?'动物园回来后吃午餐；已经饿了就先在园内当天开放的餐饮处吃。':'见本林前后，在站北侧吃拉面。',['santouka','baikohken']),dinner:m(id==='12-30'?'今天留时间去 TORITON；营业与往返公交先确认。想少走路就选站前。':'晚上留在站前吃饭，TORITON 本季 1/2 营业未确认。',id==='12-30'?['toriton','aeon']:['aeon']),notes:[id==='12-30'?'TORITON 需要单独往返旭神，先看公交和等位，不当作出站即到。':'拉面店年始开门日待确认；午餐偏晚时看好最后点单。'],snacks:['rice','pudding','rokkatei']};
    }
    if(id==='01-04'||id==='01-06'){
      const city=selected==='city',last=id==='01-06';
      return {
        ...base,area:'中島公園駅',
        breakfast:last?m('札幌公园酒店早餐按订单；早餐后退房，将行李交前台寄存。'):m('大雪山远景酒店早餐以订单为准，之后乘巴士下山。'),
        lunch:city?m(last?'北大这餐选食堂或 Picante 本店。食堂尽量 11:00 去；Picante 常规 11:30 开门，排队久就换简餐，午饭后直接回酒店取行李。':'先到札幌公园酒店寄存行李，再去北大；食堂与 Picante 本店二选一，抵达较晚先确认是否还供餐。',['hokudai','picante']):last?m('沿当天路线较早吃午餐，13:30 左右回酒店取行李；排队久就改买简餐。',['garaku']):m('先到札幌公园酒店寄存，再在中岛公园附近吃简餐；站前 Picante 需要折返，只在时间充裕时考虑。',['picanteStation'],'中島公園駅 ランチ'),
        dinner:last?m('约 16:00 在新千岁国内航站楼提前吃晚饭，排队久就改便当；先办好值机并留够安检时间。',['ebi']):m('汤咖喱；中午若吃过 Picante，晚上改二条市场附近其他热餐，之后回札幌公园酒店。',['garaku'],'二条市場 夕食'),
        sweets:m(last?'小鸟可丽饼或 CREMIA 只在上午顺路且不用久等时买；午饭后回酒店取行李。':'小鸟可丽饼、CREMIA 按路过的位置选一个；芭菲留在晚饭后。',last?['bird','cremia']:['bird','cremia','pal']),
        notes:[...(city?['北大食堂与 Picante 选一餐；年始开门日仍需看门店公告。']:['北大食堂与 Picante 本店放在「北大与街巷」那天。']),...(last?['18:10 新千岁起飞，约 19:55 抵达成田，之后乘酒店接送车。','13:30 左右回酒店取行李、14:15 左右札幌站乘 JR、15:00 左右到机场；这些是预留目标时间，具体冬季车次待确认。','1/6 是周三，Picante 札幌站前店休。']:['抵达后先寄存行李；若到札幌较晚，吃好饭再缩短下午景点。'])],
        snacks:last?['calbee','royce','shiroi']:['taiheigen','walnut','currySenbei']
      };
    }
    return {...base,...plans[id]};
  }
  const convenience=(title,items,query,note='按当天货架搭配，买一餐的量即可。')=>({title,items,query,note});
  function forDay(day,selected){
    const f=buildDay(day,selected),id=day.id;
    if(id==='01-06'&&selected==='west'){
      f.lunch=m('白色恋人公园或宫之泽附近较早吃简餐；12:15 左右离开，回酒店取行李。',[],'白い恋人パーク レストラン');
      f.sweets=null;
    }
    // Clone shared meal defaults before adding notes or practical alternatives.
    for(const meal of ['breakfast','lunch','dinner'])f[meal]={...f[meal]};
    const snackDays={
      '12-23':['egg','chicken'],
      '12-24':['cheeseTara','egg'],
      '12-25':['hakodateMilk','icecream','melonJelly'],
      '12-26':['hakodateMilk','salmonCorn'],
      '12-27':['zangi','potato','pudding'],
      '12-28':['rice','milk','cheeseTara'],
      '12-29':['salmonCorn','butterChips'],
      '12-30':selected==='biei'?['cheeseTara','butterChips']:['cheeseRoll','melonJelly','icecream'],
      '12-31':['rice','milk','yogurt','milkNoodle','cheeseTara'],
      '01-01':['pudding','melonSour','cheeseTara'],
      '01-02':selected==='biei'?['cheeseTara','salmonCorn']:['melonJelly','cheeseRoll','milk'],
      '01-03':['salmonCorn','cheeseTara'],
      '01-04':['taiheigen','walnut','currySenbei'],
      '01-05':['roastCorn','rokkatei','royce','shiroi'],
      '01-06':['calbee','currySenbei','shiroi','royce'],
      '01-07':['egg','chicken']
    };
    f.snacks=snackDays[id]||['milk','pudding'];
    f.snackArea=id==='01-06'?'新千歳空港 国内線':id==='01-04'?'札幌駅':id==='01-05'?'小樽 堺町':f.area;
    f.snackNote=id==='12-31'?'下午先买好元旦早餐，再挑一两样零食；冷藏品回酒店及时放冰箱。':id==='01-03'?'在旭川站前买好再上山；只带当天吃的量。':id==='01-04'||id==='01-05'?'专柜小包装尝味，喜欢的再带回家；不用今天全部买齐。':id==='01-06'?'伴手礼集中在国内航站楼安检前补齐，先值机，再按剩余时间逛。':'路过时选一两样即可；便利店与专柜的库存都以当天为准。';
    const add=(meal,value)=>{f[meal].convenience=value;};
    if(['12-25','12-27','12-30','01-02','01-05','01-06'].includes(id)){
      add('breakfast',convenience('没含早餐时',['饭团 1–2 个或鸡蛋三明治','牛奶或酸奶；想吃热的加一份鸡蛋'],`${f.area} コンビニ`,'按胃口选一套；已有酒店早餐就不用另买。'));
    }
    if(id==='12-23')add('dinner',convenience('落地后简单吃饱',['饭团 2 个或一份便当','鸡蛋三明治或热鸡块','水或热饮'],'成田空港 コンビニ','先看酒店接送车时间，买好再去乘车。'));
    if(id==='12-24')add('breakfast',convenience('出发前早餐',['昨晚买的面包或三明治','牛奶或热饮'],'成田空港 コンビニ','早上赶车，尽量前一晚备好。'));
    if(id==='12-26')add('lunch',convenience('带上 JR 的午餐',['一份便当，或饭团 2 个＋鸡蛋','一小盒牛奶或水'],'函館駅 弁当','在函馆站附近买好；不为找特定口味耽误乘车。'));
    if(id==='12-28')add('lunch',convenience('巴士衔接紧时',['明太子或鲑鱼饭团 2 个','HOT CHEF 炸鸡小份','热茶'],'登別温泉 セイコーマート','有热食柜才选炸鸡；找休息处吃完再上巴士。'));
    if(id==='12-29')add('lunch',convenience('中转简餐',['一份热便当或饭团 2 个','鸡蛋或小份炸鸡','热饮'],'札幌駅 コンビニ','明太子蟹肉饭的具体商品待确认，遇到再选；没有就选当天便当。'));
    if((id==='12-30'||id==='01-02')&&selected==='biei')add('lunch',convenience('去美瑛前带好',['饭团 2 个＋鸡蛋三明治，或一份便当','热水与一小袋零食'],'旭川駅 コンビニ','按胃口组合；早上在旭川买好，白金一带不临时找店。'));
    if(id==='12-31')add('dinner',convenience('跨年晚饭与明早备餐',['今晚：荞麦面＋熟食或饭团','明早：面包或饭团＋牛奶 / 酸奶'],'イオン旭川駅前 食品','下午采购；隔夜食物看保质期和保存温度，不把热食留到明天。'));
    if(id==='01-01'){
      add('breakfast',convenience('昨晚备好的早餐',['面包或饭团','牛奶 / 酸奶＋鸡蛋'],'旭川駅 コンビニ','有酒店早餐时直接在酒店吃；无需元旦早上再找店。'));
      add('dinner',convenience('餐厅关门时',['一份当日便当或饭团 2 个','杯面或热汤','小份蔬菜 / 鸡蛋'],'旭川駅 コンビニ','牛奶海鲜面若未上市就选普通海鲜面；按胃口减掉重复主食。'));
    }
    if(id==='01-03')add('lunch',convenience('上旭岳前备午餐',['一份便当，或饭团 2 个＋鸡蛋三明治','保温杯热水'],'旭川駅 コンビニ','乘巴士前在站前买齐，只带一餐；抵达后找室内休息处吃。'));
    if(id==='01-06')add('dinner',convenience('机场排队长时',['国内航站楼买一份便当或三明治＋饭团','水或热饮'],'新千歳空港 国内線 コンビニ','也可约 19:55 抵达成田后买简餐，先核对酒店接送时间，不等餐厅长队。'));
    if(f.sweets){
      const afternoon=f.sweets.venues.filter(key=>key!=='pal');
      const evening=f.sweets.venues.filter(key=>key==='pal');
      if(afternoon.length)f.lunch.afternoonTea={note:id==='01-05'?'堺町走累了，选一份芝士蛋糕坐一会儿。':id==='01-06'?'只在上午顺路且不用久等时买；午饭后回酒店取行李。':(id==='12-30'||id==='01-02')?'森之时计有空位再坐，留足回旭川的时间。':'小鸟可丽饼或 CREMIA，路过时挑一个。',venues:afternoon};
      if(evening.length)f.dinner.afterMeal={note:'晚饭后还有胃口，再去薄野吃一杯芭菲。',venues:evening};
    }
    delete f.sweets;
    return f;
  }
  window.FOOD={venues,snacks,forDay};
})();
