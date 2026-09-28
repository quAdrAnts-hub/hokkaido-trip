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
    rice:{name:'Seicomart · HOT CHEF 饭团',note:'早出门或坐车时带一个；选有 HOT CHEF 的门店。',url:'https://partner.seicomart.co.jp/introduction.html'},
    zangi:{name:'Seicomart · HOT CHEF 炸鸡',note:'ザンギ，买小份趁热吃；货架售完不一定马上补。',url:'https://www.seicomart.co.jp/instore/hotchef.html?mode=pc'},
    pudding:{name:'Secoma 牛奶 / 鸡蛋布丁',note:'冷藏甜点，回酒店再买；按包装保存。',url:'https://seicomart.co.jp/instore/rb/rb07_bread.html'},
    egg:{name:'7-Eleven · 鸡蛋三明治',note:'配热饮当轻早餐，出发前就近买。',url:'https://www.sej.co.jp/products/a/item/053738/'},
    chicken:{name:'Lawson · からあげクン',note:'原味鸡块，逛累了吃一小份。',url:'https://www.lawson.co.jp/recommend/original/fry/'},
    royce:{name:'ROYCE 巧克力薯片',note:'咸甜零食，也可留到机场再买。',url:'https://www.royce.com/contents/potatochip'},
    rokkatei:{name:'六花亭 · 葡萄干黄油夹心',note:'マルセイバターサンド；看包装保存方式与期限。',url:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=10050'},
    shiroi:{name:'白色恋人',note:'夹心饼干，公园或机场顺路挑小盒。',url:'https://shop.ishiya.co.jp/'}
  };
  const m=(note,ids=[],query='')=>({note,venues:ids,query});
  const hotelBreakfast=m('酒店早餐以订单为准；没有含餐就选面包、饭团和热饮。');
  function forDay(day,selected){
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
      return {...base,area:'中島公園駅',breakfast:last?m('札幌公园酒店早餐按订单；早餐后退房，将行李交前台寄存。'):m('大雪山远景酒店早餐以订单为准，之后乘巴士下山。'),lunch:city?m(last?'北大这餐选食堂或 Picante 本店。食堂可 11:00 或 13:00 后去，避开学生高峰；吃完再去大通。':'先到札幌公园酒店寄存行李，再去北大；食堂与 Picante 本店二选一，抵达较晚先确认是否还供餐。',['hokudai','picante']):last?m('沿当天路线吃汤咖喱，吃完预留回酒店取行李的时间。',['garaku']):m('先到札幌公园酒店寄存，再在中岛公园附近吃简餐；站前 Picante 需要折返，只在时间充裕时考虑。',['picanteStation'],'中島公園駅 ランチ'),dinner:last?m('在新千岁国内航站楼、安检前吃晚饭。',['ebi']):m('汤咖喱；中午若吃过 Picante，晚上改二条市场附近其他热餐，之后回札幌公园酒店。',['garaku'],'二条市場 夕食'),sweets:m(last?'沿途选一个小甜点，14:30 回札幌公园酒店取行李；小鸟可丽饼只在经过札幌站且不用久等时买。':'小鸟可丽饼、CREMIA、晚间芭菲，按路过的位置选，最后回中岛公园旁酒店。',last?['bird','cremia']:['bird','cremia','pal']),notes:[...(city?['食堂和 Picante 选一餐，在北大附近吃完再往南走；午餐偏晚就缩短大通、狸小路停留。']:['北大食堂和 Picante 本店随「北大与街巷」显示，不另绕北大吃第二顿。']),...(last?['14:30 回酒店取行李，尽量 14:40 前出发；目标 15:30 左右从札幌站乘机场 JR，具体车次待确认。','1/6 是周三，Picante 札幌站前店休。']:['抵达后先寄存行李；若到札幌较晚，吃好饭再缩短下午景点。'])],snacks:last?['royce','rokkatei','shiroi']:['rice','pudding','shiroi']};
    }
    return {...base,...plans[id]};
  }
  window.FOOD={venues,snacks,forDay};
})();
