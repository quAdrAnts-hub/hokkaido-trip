/* V3: itinerary from the supplied V2 archive, with the requested changes.
   Times are proposed pacing, not reserved departures. All coordinates are map guides. */
(() => {
  const U = {
    jr:'https://www.jrhokkaido.co.jp/global/cn/train/',
    jrbook:'https://www.eki-net.com/en/jreast-train-reservation/Top/Index',
    jrrule:'https://www.jrhokkaido.co.jp/global/english/ticket/reservation/index.html',
    jrstatus:'https://www3.jrhokkaido.co.jp/trainlocation/index_en.html',
    airport:'https://www.jrhokkaido.co.jp/global/cn/travel/airport.html',
    donan:'https://www.donanbus.co.jp/',
    onsen:'https://www.donanbus.co.jp/map/noboribetsu_onsen/',
    onsenbook:'https://donanbus.eexpress.jp/bus_search/hokkaido/all/hokkaido/all/?simpleRouteCode=1466002',
    nobori:'https://noboribetsu-spa.jp/access/',
    limousine:'https://www.limousinebus.co.jp/ja/line/detail/Narita-Haneda/',
    limousinebook:'https://www.limousinebus.co.jp/ja/line/reserve/Narita-Haneda/?dir=1',
    art:'https://iconia.co.jp/location-hotel-art-hotel-narita-chiba',
    biei:'https://www.biei-hokkaido.jp/ja/',
    dohokubus:'https://www.dohokubus.com/rosen_passing.html',
    bieiticket:'https://dohokubus.tourbooking-japan.com/A/ja-JP/product-detail/1358',
    furano:'https://www.princehotels.co.jp/ski/furano/winter/access/',
    furanobus:'https://www.furanobus.jp/rosen/',
    snowticket:'https://www.princehotels.co.jp/ski/furano/winter/lift/',
    school:'https://www.princehotels.co.jp/ski/furano/winter/school/',
    ideyu:'https://www.asahikawa-denkikidou.jp/asahidaek_line/',
    lavista:'https://dormy-hotels.com/resort/hotels/la_daisetsuzan/',
    lavistaaccess:'https://dormy-hotels.com/resort/hotels/la_daisetsuzan/access/',
    lavistafaq:'https://dormy-hotels.com/resort/hotels/la_daisetsuzan/faq/',
    ropeway:'https://asahidake.hokkaido.jp/',
    daikoku:'https://daikoku-jgs.com/free/asahikawa',
    daikokubook:'https://yoyaku.toreta.in/daikokuya-honten/',
    garaku:'https://www.s-garaku.com/',
    sushi:'https://masazushi.co.jp/shop-honten/',
    letao:'https://www.letao.jp/',
    otarubus:'https://otaru-aq.jp/guide/bus',
    shukutsu:'https://www.city.otaru.lg.jp/docs/2020100900664/',
    tengu:'https://tenguyama.ckk.chuo-bus.co.jp/en/access',
    subway:'https://www.city.sapporo.jp/st/english/',
    sapporopark:'https://park1964.com/access/',
    weather:'https://www.jma.go.jp/bosai/',
    volcano:'https://www.data.jma.go.jp/vois/data/tokyo/STOCK/activity_info/105.html'
  };
  const rawPlaces = [
    ['nrt','成田机场',35.7720,140.3929,'Narita International Airport'],
    ['art','ART HOTEL Narita',35.7930,140.3590,'ART HOTEL Narita',U.art],
    ['hnd','羽田机场',35.5494,139.7798,'Haneda Airport'],
    ['hkd','函馆机场',41.7768,140.8161,'Hakodate Airport'],
    ['nagisa','汤之川渚亭',41.7742,140.7878,'Yunokawa Prince Hotel Nagisatei'],
    ['botanical','函馆热带植物园',41.7721,140.7900,'Hakodate Tropical Botanical Garden'],
    ['global','HOTEL GLOBAL VIEW 函馆',41.7674,140.7335,'HOTEL GLOBAL VIEW Hakodate'],
    ['hachiman','八幡坂',41.7623,140.7116,'Hachimanzaka Hakodate'],
    ['motomachi','元町',41.7620,140.7104,'Motomachi Hakodate'],
    ['lucky','Lucky Pierrot 海湾店',41.7667,140.7163,'Lucky Pierrot Bay Area Main Shop'],
    ['kanemori','金森红砖仓库',41.7668,140.7171,'Kanemori Red Brick Warehouse'],
    ['hakodate','函馆站',41.7737,140.7263,'Hakodate Station'],
    ['toya','洞爷站',42.5501,140.7634,'Toya Station Hokkaido'],
    ['kitutuki','Kitutuki Canadian Club',42.5902834,140.7918728,'Kitutuki Canadian Club Toyako','https://kitutukicc.sakura.ne.jp/map.htm'],
    ['noborist','登别站',42.4521,141.1790,'Noboribetsu Station'],
    ['nobori','登别温泉',42.4929,141.1438,'Noboribetsu Onsen Bus Terminal',U.nobori],
    ['adex','adex inn',42.4958,141.1445,'adex inn Noboribetsu','https://www.adexinn.com/ja-access'],
    ['jigoku','地狱谷',42.4996,141.1489,'Noboribetsu Jigokudani'],
    ['bear','登别熊牧场',42.4910,141.1596,'Noboribetsu Bear Park'],
    ['date','登别伊达时代村',42.4659,141.1719,'Noboribetsu Date Jidaimura'],
    ['sapporo','札幌站',43.0687,141.3507,'Sapporo Station',U.jr],
    ['asahikawa','旭川站',43.7635,142.3583,'Asahikawa Station',U.jr],
    ['ys',"Y’s Hotel 旭川站前",43.762812,142.359735,"Y's Hotel Asahikawa Ekimae",'https://yshotel-asahikawa.com/'],
    ['daikoku','旭川成吉思汗 大黒屋',43.7694,142.3565,'大黒屋 旭川五丁目店',U.daikoku,U.daikokubook],
    ['biei','美瑛站',43.5911,142.4614,'Biei Station',U.biei],
    ['blue','白金青池',43.4935,142.6141,'Shirogane Blue Pond Biei',U.biei],
    ['shirahige','白须瀑布',43.4742,142.6392,'Shirahige Waterfall Biei',U.biei],
    ['santouka','山头火 旭川本店',43.7655,142.3601,'Ramen Santouka Asahikawa Main Shop'],
    ['heiwa','平和通买物公园',43.7694,142.3613,'Asahikawa Heiwa Dori Shopping Park'],
    ['aeon','AEON 旭川站前',43.7642,142.3569,'AEON MALL Asahikawa Ekimae'],
    ['shrine','上川神社',43.7494,142.3714,'Kamikawa Shrine Asahikawa'],
    ['furano','富良野站',43.3460,142.3918,'Furano Station'],
    ['ningle','精灵露台',43.32265,142.35431,'Ningle Terrace Furano','https://www.princehotels.co.jp/shinfurano/facility/ningle_terrace/'],
    ['prince','新富良野王子酒店',43.3232257,142.3543008,'Shin Furano Prince Hotel','https://www.princehotels.co.jp/shinfurano/access/'],
    ['lavista','大雪山远景酒店',43.648038,142.7933931,'La Vista Daisetsuzan',U.lavista],
    ['asahidake','旭岳缆车 山麓站',43.6535,142.7999,'Asahidake Ropeway Sanroku Station',U.ropeway],
    ['sugatami','姿见站',43.6622,142.8256,'Asahidake Ropeway Sugatami Station',U.ropeway],
    ['hokkaidoshrine','北海道神宫',43.0543,141.3078,'Hokkaido Jingu'],
    ['shiroi','白色恋人公园',43.0887,141.2719,'Shiroi Koibito Park'],
    ['garaku','Soup Curry GARAKU',43.0578,141.3552,'Soup Curry GARAKU Sapporo',U.garaku],
    ['odori','大通公园',43.0598,141.3478,'Odori Park Sapporo'],
    ['tanuki','狸小路',43.0565,141.3511,'Tanukikoji Shopping Street'],
    ['pal','Parfaiteria Pal',43.0551,141.3542,'Parfaiteria Pal Sapporo'],
    ['hokudai','北海道大学',43.0752,141.3408,'Hokkaido University Main Gate'],
    ['nakajima','中岛公园',43.0445,141.3545,'Nakajima Park Sapporo'],
    ['minamiotaru','南小樽站',43.1865,141.0072,'Minami Otaru Station'],
    ['musicbox','小樽音乐盒堂',43.1906,141.0075,'Otaru Music Box Museum Main Building'],
    ['letao','LeTAO 本店',43.1911,141.0070,'LeTAO Main Store Otaru',U.letao],
    ['glass','大正硝子馆',43.1965,141.0038,'Taisho Glass Palace Otaru'],
    ['snoopy','SNOOPY 茶屋 小樽',43.1945,141.0057,'Snoopy Chaya Otaru'],
    ['sushi','おたる政寿司 本店',43.1938,140.9991,'Otaru Masazushi Honten',U.sushi],
    ['canal','小樽运河',43.1990,141.0024,'Otaru Canal'],
    ['otarust','小樽站',43.1972,140.9937,'Otaru Station'],
    ['shukutsu','祝津全景展望台',43.2381,141.0078,'Shukutsu Panorama Observation Deck',U.shukutsu],
    ['tengu','天狗山缆车',43.1740,140.9694,'Otaru Tenguyama Ropeway',U.tengu],
    ['cts','新千岁机场',42.7870,141.6808,'New Chitose Airport',U.airport],
    ['naritast','成田站',35.7776,140.3138,'Narita Station'],
    ['omote','成田山表参道',35.7810,140.3152,'Naritasan Omotesando'],
    ['naritasan','成田山新胜寺',35.7860,140.3181,'Naritasan Shinshoji Temple']
  ];
  const places = Object.fromEntries(rawPlaces.map((p,i)=>[p[0],{id:p[0],n:String(i+1).padStart(2,'0'),name:p[1],lat:p[2],lng:p[3],query:p[4],url:p[5],booking:p[6]}]));
  const link=(label,url)=>({label,url});
  const jrLinks=[link('查时刻',U.jr),link('JR 官方预约',U.jrbook)];
  const leg=(mode,duration,steps,ticket,links=[],status='')=>({mode,duration,steps,ticket,links,status});
  const walk=(duration,note='按导航步行，积雪路面多留一点时间。')=>leg('步行',duration,note,'无需购票。');
  const taxi=(duration,note)=>leg('出租车',duration,note||'在车站出租车乘车处上车，或请酒店协助叫车。','按车程付费；冬季建议提前请酒店确认叫车。');
  const train=(duration,steps)=>leg('JR · 指定席',duration,steps,'乘车券＋特急指定席券。北斗、Lilac、Kamui 全车指定席；通常乘车日前一个月日本时间 10:00 开售。',jrLinks,'所选日期车次待确认');
  const localtrain=(duration,steps)=>leg('JR · 普通 / 快速',duration,steps,'普通自由席无需提前订座，出发前在车站购票；IC 卡适用范围以 JR 为准。',[link('查时刻',U.jr)],'冬季班次与接续待确认');
  const subway=(duration,steps)=>leg('地铁＋步行',duration,steps,'无需预约；车站购票或使用适用 IC 卡。',[link('札幌地铁',U.subway)],'耗时为估算，步行另留雪天余量');
  const L={
    art:leg('酒店接驳','约 30–35 分钟','成田 T1 一层 16 号 / T2 一层 26 号候车，乘 ART HOTEL Narita 接驳；以抵达航站楼与酒店当天通知为准。','住客免费，通常无需购票；晚间末班待酒店确认。',[link('酒店交通',U.art)],'12/23 接驳时刻待确认'),
    artNrt:leg('酒店接驳','约 30–35 分钟','从酒店回成田机场，向酒店确认所乘班次停靠的航站楼；留出换乘机场巴士时间。','免费接驳。',[link('酒店交通',U.art)],'12/24 接驳时刻待确认'),
    crossAirport:leg('机场巴士','约 1.5–2 小时','成田机场 → 羽田机场 Airport Limousine。按机票选择羽田航站楼，目标 11:30 前到羽田；堵车时需额外缓冲。','时间指定票，可提前网上购买，也可在柜台 / 售票机购票。',[link('路线 / 时刻',U.limousine),link('官方购票',U.limousinebook)],'年末班次待确认'),
    flightHkd:leg('飞机','1 小时 20 分钟','羽田 14:40 → 函馆 16:00，按现有行程时间；航司、航班号和航站楼仍待补。','需提前购买机票；以现有订单为准。',[],'航班号与订单待确认'),
    hkdHotel:taxi('约 10–15 分钟','函馆机场出租车乘车处 → 汤之川渚亭。'),
    hakodateToya:train('约 2 小时','函馆站乘特急北斗 → 洞爷站，直达；原行程安排中午前后出发，实际班次以预约为准。'),
    toyaHotel:taxi('约 20–30 分钟','洞爷站 → Kitutuki Canadian Club，直接到酒店；不经温泉街换乘。'),
    hotelToya:taxi('约 20–30 分钟','酒店 → 洞爷站。前一晚请酒店协助确认叫车时间。'),
    toyaNobori:train('约 40–45 分钟','洞爷站乘札幌方向特急北斗 → 登别站。'),
    noboriBus:leg('道南巴士','约 15 分钟','登别站前 → 登别温泉；前往 adex inn / 第一滝本館时，核对是否停「第一滝本前」。','普通路线巴士无需提前订座，现场购票 / 支付。',[link('交通说明',U.nobori),link('道南巴士',U.donan)],'冬季班次待确认'),
    onsen:leg('高速 Onsen 号','约 1 小时 50 分钟','登别温泉区上车 → 札幌站前（北2西3）。预约时选择实际酒店附近站点，下车后步行至 JR 札幌站。若无合适班次，改巴士至登别站，再乘北斗至札幌。','完全预约制。现行规则：始发前至少 2 小时完成网上预约；年末建议开放后提前订。',[link('路线 / 时刻',U.onsen),link('官方预约',U.onsenbook),...jrLinks],'12/29 班次、上车点待确认'),
    sapporoAsahi:train('约 1 小时 25–35 分钟','札幌站乘特急 Lilac / Kamui → 旭川站，直达。'),
    asahiSapporo:train('约 1 小时 25–35 分钟','旭川站乘特急 Lilac / Kamui → 札幌站，直达。'),
    asahiBiei:localtrain('约 33–40 分钟','旭川站乘 JR 富良野线普通列车 → 美瑛站。'),
    bieiAsahi:localtrain('约 33–40 分钟','美瑛站乘 JR 富良野线旭川方向 → 旭川站。'),
    blue:leg('道北巴士 39 / 42 路','车程约 22 分钟','美瑛站前 →「白金青い池入口」，下车后步行至青池。先核对去程、回程再出发。','普通路线无需订座；可现场支付或买美瑛白金一日券，一日券不保证座位。',[link('官方时刻',U.dohokubus),link('官方一日券',U.bieiticket),link('冬季观光巴士公告',U.biei)],'2026–27 美遊冬季观光巴士尚待公告；当前走法为普通路线巴士'),
    waterfall:leg('道北巴士＋步行','车程约 4 分钟','「白金青い池入口」→「白金温泉」，下车步行去白须瀑布；候车与步行时间另计。','普通路线无需预约。',[link('官方时刻',U.dohokubus)],'冬季班次待确认'),
    whiteBiei:leg('道北巴士 39 / 42 路','车程约 26 分钟','「白金温泉」→ 美瑛站前，转 JR 返回旭川；务必提前确定末班与换乘。','现场支付或使用有效的一日券。',[link('官方时刻',U.dohokubus)],'冬季回程班次待确认'),
    asahiFurano:localtrain('约 70–80 分钟','旭川站乘 JR 富良野线 → 富良野站。'),
    furanoAsahi:localtrain('约 70–80 分钟','富良野站乘 JR 富良野线 → 旭川站；先查回程，不临时等末班。'),
    furanoSki:leg('巴士 / 出租车','车程约 17 / 12 分钟','富良野站乘ラベンダー号 → 新富良野プリンスホテル，前往富良野区域雪场；也可乘出租车。不是北之峰区域。','路线巴士无需预约，下车付费。雪票、租赁、课程另购，初学者建议提前订课程。',[link('雪场交通',U.furano),link('巴士时刻',U.furanobus),link('雪票',U.snowticket),link('课程预约',U.school)],'2026–27 雪季开放范围、课程与冬季加班车待确认'),
    skiFurano:leg('巴士 / 出租车','车程约 17 / 12 分钟','新富良野プリンスホテル → 富良野站。若与 JR 接续不合适，请酒店协助叫车。','巴士无需订座；出租车按车程付费。',[link('巴士时刻',U.furanobus)],'冬季回程时刻待确认'),
    ideyu:leg('66 いで湯号','约 1 小时 35–40 分钟','旭川站北口 9 号站台 →「旭岳キャンプ場」，下车步行约 1 分钟到大雪山远景酒店。','定期路线巴士，购票不等于预约座位；可按官网指引现场购票。酒店当前 FAQ 不提供送迎。',[link('巴士时刻 / 购票',U.ideyu),link('酒店交通',U.lavistaaccess),link('酒店 FAQ',U.lavistafaq)],'现行表可参考，1/3 当天班次出发前复核'),
    ideyuBack:leg('66 いで湯号','约 1 小时 35–40 分钟','酒店步行到「旭岳キャンプ場」站，乘 66 いで湯号 → 旭川站；与札幌方向 JR 留出换乘余量。','路线巴士现场购票 / 支付，不保证座位。',[link('官方时刻',U.ideyu)],'现行表可参考，1/4 当天班次出发前复核'),
    ropeway:leg('旭岳缆车','单程约 10 分钟','山麓站 → 姿见站。只在官方开放区域停留；强风、停运、低能见度时留在温泉区。','缆车票按官网购票说明办理；不把开放视为已确认。',[link('运行 / 购票',U.ropeway)],'当天运行与开放范围待确认'),
    otaru:localtrain('约 35–50 分钟','札幌站乘 JR 函馆本线小樽方向 → 南小樽站。确认终点为小樽，手稻 / 星见终到列车不到。'),
    otaruBack:localtrain('约 35–50 分钟','小樽站乘 JR 函馆本线札幌方向 → 札幌站。'),
    shukutsu:leg('中央巴士＋步行','车程约 20–25 分钟','小樽站前乘 10 / 11 路 →「おたる水族館」，再步行约 10 分钟去展望台。','普通路线巴士无需预约。积雪或临时管制时不前往。',[link('巴士走法',U.otarubus),link('展望台开放说明',U.shukutsu)],'冬季时刻、积雪与步行通行情况待确认'),
    shukutsuTengu:leg('巴士换乘＋缆车','约 60–90 分钟起','水族馆站乘 10 / 11 路回小樽站前；4 号乘车处换 9 路至「天狗山ロープウエイ」，车程约 20 分钟；索道单程约 4 分钟。候车另计。','巴士无需预约，缆车票另购；若接续不好，就在两个远端点中选一个。',[link('祝津巴士',U.otarubus),link('天狗山交通 / 购票',U.tengu)],'2026–27 冬季巴士与索道时段待确认'),
    tenguBack:leg('缆车＋中央巴士 9 路','车程约 24 分钟＋候车','先乘索道下山约 4 分钟，再在山麓站乘 9 路至小樽站前约 20 分钟。错过合适巴士时再考虑出租车。','索道使用有效往返票；路线巴士无需预约。',[link('官方交通',U.tengu)],'冬季末班待确认'),
    airport:leg('JR Airport','日间约 36–43 分钟起','札幌站 → 新千岁机场站，出站按指示前往国内航站楼。目标 14:15 左右从札幌出发、15:00 左右到机场；这是行程预留时间，具体车次待确认。雪天或运行延误时再提前。','普通自由席无需预约；4 号车 u-seat 须另购指定席券。',[link('机场铁路','https://www.jrhokkaido.co.jp/airport/'),link('指定席预约',U.jrbook),link('运行信息',U.jrstatus)],'1/6 冬季车次与运行情况出发前复核'),
    flightNrt:leg('飞机','1 小时 45 分钟','1/6 新千岁 18:10 → 成田 19:55，均为日本当地时间；航班号和到达航站楼按机票补齐。落地取行李后乘酒店接送。','需提前购买机票；以现有订单为准。',[],'起降时间已确认；航班号、航站楼待补'),
    naritaAirport:leg('JR / 酒店接驳','铁路约 10–15 分钟','从 JR 成田站乘成田线往成田机场，按机票航站楼下车；如从酒店出发则确认接驳。目标 13:00 左右到国际航站楼。','JR 普通列车现场购票；酒店接驳按酒店规定。',[link('JR 东日本',U.jrbook)],'航站楼、酒店接驳与所选车次待确认')
  };
  const s=(place,time,desc='',via=null,kind='',title='')=>({place,time,desc,via,kind,title});
  const parkFromStation=leg('南北线＋步行','地铁约 5 分钟；全程预留 20–30 分钟','JR 札幌站步行至地铁「さっぽろ」站，乘南北线真驹内方向至「中岛公园」。3 号出口旁就是札幌公园酒店；大件行李可按酒店说明走 1 号出口一侧电梯。','无需预约；车站购票或使用适用 IC 卡。',[link('酒店交通',U.sapporopark),link('札幌地铁',U.subway)],'全程预留含站内步行与候车，雪天再留余量');
  const parkToStation=leg('南北线＋步行','地铁约 5 分钟；全程预留 20–30 分钟','酒店旁「中岛公园」站乘南北线麻生方向至「さっぽろ」，按指示步行到 JR 札幌站。带行李时可走 1 号出口一侧电梯。','无需预约；车站购票或使用适用 IC 卡。',[link('酒店交通',U.sapporopark),link('札幌地铁',U.subway)],'全程预留含站内步行与候车，JR 转乘及雪天另留余量');
  const parkFromCentre=place=>subway(place==='garaku'?'约 25–35 分钟':'约 15–25 分钟',place==='garaku'?'从二条市场旁 GARAKU 步行至薄野站，乘南北线真驹内方向至中岛公园站，3 号出口旁回札幌公园酒店。':'从狸小路或芭菲店一带步行至薄野站，乘南北线真驹内方向至中岛公园站，3 号出口旁回札幌公园酒店。');
  const H={art:{place:'art',note:'12/23 · 入住与休息'},nagisa:{place:'nagisa',note:'12/24 · 温泉与晚餐按订单'},global:{place:'global',note:'12/25 · 抵达后先寄存行李'},kitutuki:{place:'kitutuki',note:'12/26 · 19:00 前入住，晚餐按订单'},adex:{place:'adex',note:'12/27–28 · 两家相邻，入住酒店以订单确认'},ys:{place:'ys',note:'12/29–1/2 · 旭川站前'},lavista:{place:'lavista',note:'1/3 · La Vista Daisetsuzan｜晚餐、温泉'},sapporo:{place:'sapporopark',note:'1/4–5 · 中岛公园站 3 号出口旁；1/6 上午退房寄存，13:30 回来取行李'},narita:{name:'成田住宿',note:'1/6 · 19:55 落地后乘酒店接送。酒店名称待补；集合点、班次、末班、车程与是否需预约由酒店确认。'}};
  const asahiReturn=[s('asahikawa','傍晚','回旭川后再吃晚饭。',L.bieiAsahi),s('aeon','晚餐','站前吃一餐；年末营业到店前再看。',walk('约 3–5 分钟'),'餐食')];
  const variants={
    biei:{label:'美瑛',sub:'青池 · 白须瀑布',city:'旭川 / 美瑛',title:'去美瑛看雪',note:'先确认回程，再慢慢看雪。',alert:'出发前看天气、JR、十胜岳与景区公告。青池可能封冻积雪；当季灯光与观光巴士待确认。',alertUrl:U.biei,stops:[s('asahikawa','早上','早餐后出发，先看 JR 与天气。'),s('biei','上午','车站周边吃午餐或带简餐，按巴士时间安排。',L.asahiBiei,'午餐'),s('blue','午后','只在开放步道停留。',L.blue),s('shirahige','下午','到桥上看瀑布，积雪处慢走。',L.waterfall),s('biei','返程','按已查好的班次回站。',L.whiteBiei),...asahiReturn]},
    asahi:{label:'旭川',sub:'拉面 · 散步 · 咖啡',city:'旭川',title:'在旭川慢慢逛',note:'拉面之后，沿着街道随便走走。',stops:[s('ys','上午','早餐后晚一点出门。'),s('santouka','午餐','一碗拉面。年末营业待门店确认，休息时就近吃。',walk('约 8–12 分钟'),'餐食'),s('heiwa','午后','逛街、喝咖啡，累了就停下来。',walk('约 8–15 分钟')),s('aeon','下午','逛逛商店，买些酒店里吃的东西。',walk('约 10–15 分钟')),s('ys','晚餐','带回去吃，早一点休息。',walk('约 5–8 分钟'),'餐食')]},
    furano:{label:'富良野',sub:'滑雪场 · 半日雪地',city:'旭川 / 富良野',title:'把半天留给雪场',note:'课程与交通都确认后再出发。',alert:'2026–27 雪季课程、租赁与开放区域待确认。没有预约课程时，只选择当天开放的游览活动。',alertUrl:U.school,stops:[s('asahikawa','早上','早点吃早餐，确认富良野线回程。'),s('furano','上午','下车后换乘前往雪场。',L.asahiFurano),s('ski','上午','从富良野区域进入，按已预约的课程时间安排。',L.furanoSki),s('prince','午餐','雪场或酒店开放餐厅吃午饭。',walk('约 5–10 分钟'),'餐食'),s('ski','午后','留在同一区域，不临时跨雪场。',walk('约 5–10 分钟')),s('furano','下午','预留等车与取行李时间。',L.skiFurano),s('asahikawa','傍晚','回旭川。',L.furanoAsahi),s('aeon','晚餐','站前吃饭或带回酒店。',walk('约 3–5 分钟'),'餐食')]},
    west:{label:'神宫与白色恋人',sub:'圆山 · 甜点',city:'札幌',title:'神宫与一座甜点花园',note:'到札幌较晚时，只保留其中一处。',stops:[s('hokkaidoshrine','午后','从圆山公园方向步行入神宫。',subway('约 35–45 分钟','札幌站乘南北线至大通，换东西线至圆山公园站，步行约 15 分钟。')),s('shiroi','下午','吃点甜的，慢慢逛。园区当季营业与收费区域以官网为准。',subway('约 35–45 分钟','圆山公园站乘东西线至宫之泽站，步行约 7–10 分钟。'),'甜点'),s('garaku','晚餐','汤咖喱。到店前看营业公告；等位太久就留到 1/6。',subway('约 35–45 分钟','宫之泽站乘东西线至大通站，从狸小路方向步行至店。'),'餐食'),s('tanuki','晚间','晚饭后散散步。',walk('约 5–10 分钟')),s('pal','甜品','想吃再去，选无酒精口味；营业待确认。',walk('约 5–10 分钟'),'可选')]},
    city:{label:'北大与街巷',sub:'大通 · 狸小路',city:'札幌',title:'回到札幌的街道',note:'步行多一点，安排少一点。',stops:[s('hokudai','午后','校园主路散步，雪天不走偏僻小道。',walk('约 12–20 分钟')),s('odori','下午','路过大通，走一小段。',subway('约 20–30 分钟','步行回札幌站，乘南北线至大通站；也可走地下步行空间。')),s('garaku','晚餐','早点吃汤咖喱，先看当天营业。',walk('约 10–15 分钟'),'餐食'),s('tanuki','晚间','逛逛商店，买一点喜欢的东西。',walk('约 5–10 分钟')),s('pal','甜品','还有胃口再去，选无酒精口味。',walk('约 5–10 分钟'),'可选')]},
    park:{label:'中岛公园慢日',sub:'公园 · 汤咖喱',city:'札幌',title:'公园里，再看一会儿雪',note:'午饭后就准备去机场。',stops:[s('nakajima','09:30','公园主路短程散步。',subway('约 20–30 分钟','札幌站乘南北线至中岛公园站，出站进入公园。')),s('garaku','午餐','若 1/4 没吃到，今天再试一次。以当天营业为准。',subway('约 15–25 分钟','中岛公园站乘南北线至薄野站，步行到 GARAKU。'),'餐食'),s('tanuki','午后','有余裕再短逛，13:30 回酒店取行李。',walk('约 5–10 分钟'))]}
  };
  const days=[
    {id:'12-23',date:'2026-12-23',city:'成田',title:'先睡一个好觉',note:'落地后的晚上，留给入住和休息。',hotel:H.art,stops:[s('nrt','晚间','入境、取行李。落地时间与航站楼待补。'),s('art','抵达后','办理入住，便利店买些晚餐和明早吃的东西。',L.art,'晚餐')]},
    {id:'12-24',date:'2026-12-24',city:'函馆',title:'圣诞夜，泡在温泉里',note:'上午跨机场，下午飞往函馆。',hotel:H.nagisa,stops:[s('art','08:30','早餐后出门；此为原行程目标出发时间。'),s('nrt','上午','接上前往羽田的机场巴士。',L.artNrt),s('hnd','11:30前','办理值机、吃午餐。航站楼以机票为准。',L.crossAirport,'午餐'),s('hkd','16:00','14:40 从羽田起飞，16:00 抵达；以机票为准。',L.flightHkd),s('nagisa','17:30后','入住、晚餐、私汤。今天不再往外赶。',L.hkdHotel,'晚餐')]},
    {id:'12-25',date:'2026-12-25',city:'函馆',title:'温泉猴子与港口灯火',note:'白天沿着元町走，晚上留在海湾。',hotel:H.global,stops:[s('nagisa','早上','日出私汤与早餐。','', '早餐'),s('botanical','09:00','冬季猴子温泉，开放与活动以当季公告为准。',walk('约 5–10 分钟')),s('global','10:30','换酒店，先寄存行李。',taxi('约 15–20 分钟')),s('hachiman','中午','从海湾一侧慢慢往上走。',taxi('约 10–15 分钟')),s('motomachi','午后','元町坡道与街景，路滑就缩短步行。',walk('约 5–10 分钟')),s('lucky','午餐','海湾店吃汉堡。',walk('约 10–15 分钟'),'餐食'),s('kanemori','傍晚','金森仓库与 Christmas Fantasy；2026 点灯、烟花日期时间待确认。',walk('约 3–5 分钟')),s('global','晚上','在海湾附近吃晚餐后回酒店。',taxi('约 10–15 分钟'),'晚餐')]},
    {id:'12-26',date:'2026-12-26',city:'洞爷湖',title:'窗外是湖，今晚住木屋',note:'中午前取好行李，下午到湖边。',hotel:H.kitutuki,stops:[s('global','上午','早餐，附近补逛，取行李。','', '早餐'),s('hakodate','中午前','买些车上吃的简餐，按已订车次进站。',taxi('约 5–10 分钟'),'午餐'),s('toya','午后','乘北斗到洞爷站。中午前后出发，实际车次待订。',L.hakodateToya),s('kitutuki','16:00后','尽量天亮时到；19:00 前入住，酒店晚餐按订单安排。',L.toyaHotel,'晚餐')]},
    {id:'12-27',date:'2026-12-27',city:'登别',title:'走进冒着热气的山谷',note:'天黑前逛完户外，晚上泡汤。',hotel:H.adex,stops:[s('kitutuki','早上','早餐后退房。','', '早餐'),s('toya','上午','预留候车时间。',L.hotelToya),s('noborist','中午前','下车转温泉区巴士。',L.toyaNobori),s('nobori','午后','放行李，在温泉街吃午餐。',L.noboriBus,'午餐'),s('jigoku','13:30后','只走开放步道，16:00 前后结束户外。',walk('约 15–20 分钟')),s('adex','晚间','晚餐后泡汤。入住哪家按订单确认。',walk('约 5–10 分钟'),'晚餐')]},
    {id:'12-28',date:'2026-12-28',city:'登别',title:'熊牧场与江户的一天',hotel:H.adex,stops:[s('adex','早上','早餐后出发。','', '早餐'),s('bear','09:15','熊牧场，缆车运行以当天公告为准。',leg('步行＋缆车','约 20–30 分钟','步行到温泉街缆车乘车处，上山进入熊牧场。','入园与往返缆车票按景区官网购买。',[link('熊牧场官网','https://bearpark.jp/')],'2026 冬季时段待确认')),s('nobori','11:30','回温泉街吃午餐。',leg('缆车＋步行','约 20–30 分钟','乘原缆车下山，步行至温泉街。','使用有效往返票。',[link('运行 / 门票','https://bearpark.jp/')]),'餐食'),s('date','12:30','伊达时代村，节目时间到场后按当日安排。',taxi('约 15–20 分钟','温泉街乘出租车前往时代村；若选巴士，请在道南巴士官网核对「登別伊達時代村前」班次。')),s('adex','16:00后','回去吃晚餐、泡汤。',taxi('约 15–20 分钟'),'晚餐')]},
    {id:'12-29',date:'2026-12-29',city:'旭川',title:'抵达旭川，晚饭吃大黒屋',note:'把长途移动放在白天。',hotel:H.ys,stops:[s('nobori','上午','早餐后退房，按预约的上车点候车。'),s('sapporo','中午','巴士抵达后吃午饭，再去 JR 站。',L.onsen,'午餐'),s('asahikawa','午后','乘特急到旭川。',L.sapporoAsahi),s('ys','下午','放下行李，休息一会儿。',walk('约 3–5 分钟')),s('daikoku','晚餐','预约五丁目店。官网列 12/31–1/2 休业但未注明年份，2026 安排仍待门店确认。',walk('约 12–18 分钟'),'餐食')]},
    {id:'12-30',date:'2026-12-30',city:'旭川 / 美瑛',choice:'asahi-first',default:'biei',hotel:H.ys},
    {id:'12-31',date:'2026-12-31',city:'旭川',title:'在旭川，慢慢跨年',note:'今天不远行。',hotel:H.ys,stops:[s('ys','上午','早餐后睡个回笼觉，想出门再出门。','', '早餐'),s('heiwa','午后','市区走走；午餐看当天开门的店。',walk('约 12–20 分钟'),'午餐'),s('aeon','15:00前后','买齐今晚和明早的食物：年越荞麦、熟食、饮料。年末缩短营业需确认。',walk('约 10–15 分钟')),s('ys','晚上','年越荞麦与熟食，暖暖地等新年。冷或雪大时，把初诣留到明早。',walk('约 5–8 分钟'),'晚餐')]},
    {id:'01-01',date:'2027-01-01',city:'旭川',title:'新年的第一天，慢一点',note:'早餐用昨晚备好的食物。',hotel:H.ys,stops:[s('ys','上午','睡晚一点，吃早餐。','', '早餐'),s('shrine','晚些时候','想初诣就短程去上川神社；雪大时留在酒店，出门前先确认开放与路况。',taxi('约 10–15 分钟')),s('ys','午后','回去吃备好的午餐，午睡、看雪。',taxi('约 10–15 分钟'),'午餐'),s('aeon','傍晚','有开门的店就逛一会儿；未确认营业时用已有食品。',walk('约 5–8 分钟'),'晚餐')]},
    {id:'01-02',date:'2027-01-02',city:'旭川',choice:'asahi-later',default:'biei',hotel:H.ys},
    {id:'01-03',date:'2027-01-03',city:'旭岳',title:'雪山脚下住一晚',note:'今晚：大雪山远景酒店。',hotel:H.lavista,alert:'缆车若停运，就在酒店与温泉区休息；不安排冬季登顶。',alertUrl:U.ropeway,stops:[s('asahikawa','早上','早餐后带行李，北口 9 号站台乘车。'),s('lavista','中午前后','寄存行李、安排午餐；用餐时间以酒店确认为准。',L.ideyu,'午餐'),s('asahidake','午后','确认运行与能见度后再上山。',walk('约 15–20 分钟','酒店到缆车站步行约 15 分钟，雪地多留余量；酒店当前无送迎。')),s('sugatami','下午','只在官方开放区域赏雪，不沿夏季步道继续上山。',L.ropeway),s('asahidake','返程','按当日末班提前下山。',leg('缆车','约 10 分钟','姿见站 → 山麓站，遵守当日末班与工作人员安排。','使用有效往返票。',[link('运行信息',U.ropeway)],'当日末班待确认')),s('lavista','晚上','酒店晚餐与温泉。',walk('约 15–20 分钟'),'晚餐')]},
    {id:'01-04',date:'2027-01-04',city:'札幌',choice:'sapporo-first',default:'west',hotel:H.sapporo},
    {id:'01-05',date:'2027-01-05',city:'小樽',title:'沿着堺町，一直走到运河',note:'南小樽进，小樽站出。祝津与天狗山接续不好时只留一个。',hotel:H.sapporo,alert:'祝津冬季通行视积雪而定。天黑早，两个远端点不必都赶。',alertUrl:U.shukutsu,stops:[s('sapporo','08:00后','早餐后出发。'),s('minamiotaru','09:00左右','从南小樽开始步行。',L.otaru),s('musicbox','上午','音乐盒堂。',walk('约 7–12 分钟')),s('letao','甜点','本店吃点甜的，再往堺町走。',walk('约 2–5 分钟'),'餐食'),s('snoopy','沿途','喜欢就进去看看。',walk('约 5–8 分钟'),'可选'),s('glass','上午','大正硝子与堺町小店。',walk('约 5–8 分钟')),s('sushi','午餐','おたる政寿司本店，可从官网预约。',walk('约 10–15 分钟'),'餐食'),s('canal','午后','沿着运河走一段。',walk('约 10–15 分钟')),s('otarust','13:30前后','若去祝津，先回车站乘巴士；积雪封路就留在市区。',walk('约 12–18 分钟')),s('shukutsu','午后','开放且步行安全才去；不把它当作必到点。',L.shukutsu,'可省略'),s('tengu','下午','若从祝津过来接续太晚，就省略；不追夜景。跳过祝津时，从小樽站直接乘 9 路。',L.shukutsuTengu,'可省略'),s('otarust','傍晚','回车站，晚饭可在小樽或札幌吃。',L.tenguBack,'晚餐'),s('sapporo','晚间','返回札幌。',L.otaruBack)]},
    {id:'01-06',date:'2027-01-06',city:'札幌 / 新千岁',choice:'sapporo-later',default:'west',hotel:H.narita},
    {id:'01-07',date:'2027-01-07',city:'成田',title:'表参道走走，然后回家',note:'13:00 左右到国际航站楼，16:00 起飞。',stops:[s('naritast','08:30','酒店早餐后，寄存行李。酒店名称待补，酒店到车站这段按实际地址确认。'),s('omote','上午','表参道散步。',walk('约 10–15 分钟')),s('naritasan','上午','新胜寺，返程沿表参道吃午餐。',walk('约 10–15 分钟'),'午餐'),s('naritast','12:00前后','取行李，准备去机场。',walk('约 20–30 分钟')),s('nrt','13:00左右','办理值机；16:00 回程航班，目的地与航班号待补。',L.naritaAirport)]}
  ];
  const sapporoArrival=[s('lavista','早上','早餐后退房，按巴士班次下山。'),s('asahikawa','上午','与 JR 留出换乘余量。',L.ideyuBack),s('sapporo','中午后','抵达后换地铁，先去酒店放行李。',L.asahiSapporo),s('sapporopark','抵达后','前台寄存行李，再吃午餐和出门；通常 15:00 起入住，以订单为准。',parkFromStation,'寄存行李')];
  const airportEnd=[s('sapporo','14:15左右','目标乘机场列车；提前到 JR 乘车区域，具体冬季车次待确认。',parkToStation),s('cts','15:00左右','这是目标到达时间，航班 18:10 起飞。先确认值机、托运与安检安排，再买伴手礼、早点吃晚餐；按航司要求提前到登机口。',L.airport,'晚餐'),s('nrt','19:55','18:10 从新千岁起飞。到达后取行李，按酒店通知到集合点乘接送车；班次、末班及是否需预约待酒店确认。',L.flightNrt)];
  function finishDay(day){
    const last=day.stops[day.stops.length-1];
    if(day.hotel?.place==='ys'&&last.place!=='ys')return {...day,stops:[...day.stops,s('ys','回酒店','暖暖地休息一晚。',walk(last.place==='daikoku'?'约 12–18 分钟':'约 5–8 分钟'))]};
    return day;
  }
  function itinerary(day,selected,context={}){
    if(!day.choice)return finishDay(day);
    const v=variants[selected]||variants[day.default];
    const meta={...v};
    let stops=v.stops.map(x=>({...x}));
    if(day.id==='01-02'&&selected==='biei'){
      stops=stops.filter(x=>!['cheese','furano'].includes(x.place));
      stops.find(x=>x.place==='prince').via=bieiFurano;
      meta.summary='青池 · 瀑布徒步 → 精灵露台 → 森之时计';
      meta.alert='芝士工厂 12/31–1/3 休馆，本日自动略过。选这一天去美瑛，就无法安排本次旭山动物园；1/3 仍按原定前往旭岳。徒步和下午回程接续待确认。';
    }
    if(day.id==='01-02'&&selected==='asahi')meta.alert='选市区散步就会放弃本次旭山动物园；动物园 12/30–1/1 休园，现有行程只留出 1/2。';
    if(selected==='zoo'&&context.completed?.['12-30']==='asahi'){
      stops=stops.filter(x=>x.place!=='forest');
      const hotel=stops.find(x=>x.place==='ys');hotel.via=walk('约 5–8 分钟');hotel.time='下午';hotel.desc='见本林 12/30 已去过，下午回酒店休息，晚餐在站前吃。';
      meta.summary='旭山动物园 → 站前午餐 → 休息';
    }
    if(day.id==='01-04')stops=[...sapporoArrival,...stops,s('sapporopark','回酒店','回札幌公园酒店办理入住、休息。',parkFromCentre(stops.at(-1).place))];
    if(day.id==='01-06'){
      if(selected==='west'){
        stops=[s('shiroi','10:00左右','上午只逛白色恋人园区，开门时间待当季确认；可在园区吃早午餐，12:15 左右离开，留足回酒店时间。',subway('约 45–60 分钟','中岛公园站乘南北线至大通，换东西线宫之泽方向至终点，再步行约 7–10 分钟。'),'午餐')];
        meta.label='白色恋人';meta.sub='上午园区 · 早午餐';meta.summary='白色恋人 → 酒店取行李 → 新千岁 → 成田';
      }else if(selected==='city'){
        stops=stops.filter(x=>x.place==='hokudai').map(x=>({...x,time:'09:30左右',kind:'午餐',desc:'校园主路散步，11:00 左右在附近吃早午餐；北大食堂年始营业待确认，也可选 Picante。12:30 前离开，排队太久就换简餐。'}));
        meta.label='北大与午餐';meta.sub='校园散步 · 早午餐';meta.summary='北大与午餐 → 酒店取行李 → 新千岁 → 成田';
      }else{
        stops=stops.filter(x=>['nakajima','garaku'].includes(x.place)).map(x=>({...x,time:x.place==='nakajima'?'09:30':'11:30左右'}));
        stops.find(x=>x.place==='garaku').desc='若 1/4 没吃到，营业后早点来；开门时间待确认。12:15 还未入座就换附近简餐，12:45 前开始回酒店。';
        meta.label='中岛公园与午餐';meta.sub='短程散步 · 汤咖喱';meta.summary='中岛公园 → 午餐 → 酒店取行李 → 新千岁 → 成田';
      }
      const returnLeg=selected==='west'?subway('约 45–60 分钟','白色恋人园区步行至宫之泽站，乘东西线新札幌方向至大通，换南北线真驹内方向至中岛公园站，回札幌公园酒店。'):selected==='city'?subway('约 25–35 分钟','从北大一带回地铁北12条站或札幌站，乘南北线真驹内方向至中岛公园站，回札幌公园酒店。'):parkFromCentre(stops.at(-1).place);
      stops=[s('sapporopark','早上','早餐后退房，行李交前台寄存；取件安排入住时确认。'),...stops,s('sapporopark','13:30','回札幌公园酒店取行李，尽量 13:40 前出发去札幌站。',returnLeg,'取行李'),...airportEnd];
      meta.alert='13:30 回酒店取行李，14:15 左右乘机场 JR、15:00 左右到机场均为目标时间；具体冬季班次待确认。雪天或铁路延误时提前结束上午行程。';
      meta.alertUrl=U.jrstatus;
    }
    return finishDay({...day,...meta,stops,hotel:day.hotel,city:day.id==='01-06'?'札幌 / 成田':v.city,note:day.id==='01-06'?'13:30 取行李 · 18:10 新千岁起飞 · 19:55 成田到达 · 酒店接送。':v.note});
  }
  // Revision 2: public transport, separate accommodation/bathing, combined Biei–Furano day.
  const revisedLeg=(mode,duration,steps,ticket,links=[],status='')=>leg(mode,duration,steps,ticket,links,status);
  const findDay=id=>days.find(d=>d.id===id);
  const setLeg=(id,place,newLeg,last=false)=>{const entries=findDay(id).stops.filter(x=>x.place===place);const target=last?entries.at(-1):entries[0];if(target)target.via=newLeg;};
  const busLinks=[link('函馆巴士','https://hakobus.co.jp/visitors/hub/hakodate-airport/'),link('市内线路','https://map.hakobus.co.jp/pdf/95.pdf')];
  const tramLinks=[link('市电线路','https://www.city.hakodate.hokkaido.jp/docs/2014012101004/file_contents/line_2025.pdf'),link('官方时刻','https://www.city.hakodate.hokkaido.jp/docs/2014012100939/')];
  setLeg('12-24','nagisa',revisedLeg('函馆巴士＋步行','车程约 16 分钟＋步行','函馆机场 2 号站台乘 96 路，在海边「湯の川温泉」下车，步行至渚亭。也可按当天班次选择 5 路；核对停靠站。','普通公交无需预约，现场支付。',busLinks,'12/24 当天班次出发前复核'));
  setLeg('12-25','global',revisedLeg('函馆巴士＋步行','约 25–35 分钟＋候车','在「熱帯植物園前」或「湯の川プリンスホテル渚亭前」乘 95 / 96 路函馆站方向，到「松風町」下车，步行至 Global View。','市内公交无需预约。',busLinks,'实际出发班次待确认'));
  setLeg('12-25','hachiman',revisedLeg('市电 5 系统＋步行','约 25–35 分钟＋候车','酒店步行约 8 分钟至「松風町」，乘 5 系统「函館どつく前」方向至「末広町」，再步行到八幡坂。2 系统不到末広町。','市电无需预约，车内按规定支付；可按当天行程考虑一日券。',tramLinks));
  setLeg('12-25','global',revisedLeg('市电 2 / 5 系统＋步行','约 25–35 分钟＋候车','金森仓库步行至「十字街」，乘 2 / 5 系统「湯の川」方向至「松風町」，步行回酒店。','无需预约。',tramLinks),true);
  findDay('12-25').stops.find(x=>x.place==='botanical').time='09:30';
  setLeg('12-26','hakodate',walk('约 15–20 分钟','酒店步行至函馆站，带行李和雪天多留余量。'));
  const toyaAccessLinks=[link('道南巴士时刻','https://www.donanbus.co.jp/kougai/?sw=next'),link('酒店交通','https://kitutukicc.sakura.ne.jp/map.htm')];
  setLeg('12-26','kitutuki',revisedLeg('道南巴士 · 末段待确认','至温泉街约 20 分钟','洞爷站前乘巴士至洞爷湖温泉。换乘月浦方向的准确下车点、酒店入口和雪天步行路段需先向酒店确认；酒店不提供接送。无法落实末段公共交通时，短程出租车作为备选。','普通路线无需预约；先确认末段，再决定是否需要备选车辆。',toyaAccessLinks,'月浦换乘、下车点与雪天步行尚未确认'));
  setLeg('12-27','toya',revisedLeg('道南巴士 · 接续待确认','温泉街至车站约 20 分钟','酒店回洞爷湖温泉的站点与步行路段待酒店确认，再乘巴士至洞爷站。酒店无接送；末段无法落实时使用短程车备选。','普通路线巴士无需预约，务必与已订 JR 留出余量。',toyaAccessLinks,'酒店至温泉街的公共交通衔接待确认'));
  const eraLinks=[link('时代村官方交通','https://edo-trip.jp/access/'),link('道南巴士',U.donan)];
  setLeg('12-28','date',revisedLeg('道南巴士＋步行','车程约 7 分钟＋候车','登别温泉乘「登別駅前」方向巴士，在「登別時代村前」下车。若所乘班次不停该站，可在「三愛病院登別伊達時代村前」下车，再步行约 10 分钟。','无需预约，按当日停站表选车。',eraLinks,'出发日班次与停站待确认'));
  setLeg('12-28','adex',revisedLeg('道南巴士＋步行','约 15–25 分钟＋候车','从时代村对应站点乘「登別温泉／足湯入口」方向巴士，按班次在登别温泉或第一滝本前下车，步行回 adex inn。','无需预约。',eraLinks,'返程班次待确认'),true);
  findDay('12-28').stops.find(x=>x.place==='bear').time='09:30';
  const shrineLinks=[link('旭川电气轨道','https://www.asahikawa-denkikidou.jp/'),link('站前乘车点','https://www.asahikawa-denkikidou.jp/manage/wp-content/uploads/2026/05/ekimaenoriba_2026.05.10-.pdf')];
  setLeg('01-01','shrine',revisedLeg('公交 · 元旦待确认','耗时待当日班次确认','旭川站前「宮下9丁目」可乘经上川神社的 82 路（南高前方向；83 / 84 亦有途经），「上川神社前」下车后步行约 5 分钟。过去元旦曾全日停开，不能套用普通周日班次。无车或路况不好时留在市区。','普通路线无需预约；先确认元旦是否运营。',shrineLinks,'2027/1/1 班次待确认'));
  setLeg('01-01','ys',revisedLeg('公交 · 元旦待确认','耗时待当日班次确认','从上川神社前乘旭川站方向巴士，回站前酒店。出发前同时确认去程与回程；不依赖临时末班。','无需预约。',shrineLinks,'2027/1/1 运营待确认'),true);
  places.takimoto={id:'takimoto',n:'60',name:'第一滝本館',lat:42.49625,lng:141.14466,query:'Dai-ichi Takimotokan Noboribetsu',url:'https://takimotokan.co.jp/ja/'};
  places.mori={id:'mori',n:'61',name:'森之时计咖啡屋（待确认）',lat:43.3227,lng:142.3511,query:'Coffee Mori no Tokei Furano',url:'https://www.princehotels.co.jp/shinfurano/restaurant/morinotokei/'};
  H.adex.name='adex inn';H.adex.note='12/27–28 · 住 adex inn，去第一滝本館泡汤';
  for(const id of ['12-27','12-28']){
    const d=findDay(id);d.stops.filter(x=>x.place==='adex').at(-1).desc='晚餐与休息，之后去第一滝本館泡汤。';
    d.stops.push(s('takimoto','泡汤','adex inn 住客可免费使用大浴场。',walk('约 2–5 分钟','两家酒店相邻，步行前往第一滝本館。'),'温泉'),s('adex','晚间','回 adex inn 住宿。',walk('约 2–5 分钟')));
  }
  const admission=(price,note,links,label='门票')=>({price,note,links,label});
  places.bear.url='https://bearpark.jp/information/';
  places.bear.admission=admission('¥3,200 / 成人','含往返索道。冬季 09:30–16:30，15:50 停止入场；官网现价，出发前复核。',[link('官方票价 / 购买入口','https://bearpark.jp/information/')]);
  places.date.url='https://edo-trip.jp/information/';
  places.date.admission=admission('¥3,300 / 成人','冬季 09:00–16:00，最晚 15:00 入场。官网手机优惠价 ¥3,150，标示有效至 2027/2/28，以使用条件为准。',[link('票价 / 优惠券','https://edo-trip.jp/information/'),link('官网指向的购票平台','https://www.kkday.com/ja/product/30487')]);
  places.botanical.url='https://hako-eco.com/about';
  places.botanical.admission=admission('¥300 / 成人','现场现金购票。冬季 09:30–16:30；12/29–1/1 休园，本次安排 12/25。',[link('官方门票说明','https://hako-eco.com/about')]);
  places.asahidake.url='https://asahidake.hokkaido.jp/ja/';
  places.asahidake.admission=admission('¥2,800 / 成人往返','官网冬季现价；1/3 具体时刻与当日风雪运行需复核。',[link('官方票价 / 运行','https://asahidake.hokkaido.jp/ja/')],'缆车票');
  places.tengu.url='https://tenguyama.ckk.chuo-bus.co.jp/hours-and-fees/';
  places.tengu.admission=admission('¥2,000 / 成人往返','2026/11/28–2027/3/28 冬季营业已公布。普通日上行至 19:48、下行至 20:00，当天仍以运行公告为准。',[link('官方票价 / 营业','https://tenguyama.ckk.chuo-bus.co.jp/hours-and-fees/')],'缆车票');
  L.shukutsuTengu.status='冬季巴士班次待确认；索道当日运行依天气';L.tenguBack.status='冬季巴士末班待确认';
  places.shiroi.url='https://www.shiroikoibitopark.jp/course/';
  places.shiroi.admission=admission('¥1,200 / 成人有料区','付费参观区域需门票；按所选区域购票，官网现价。',[link('官方参观 / 票价','https://www.shiroikoibitopark.jp/course/'),link('官方购票','https://webket.jp/pc/ticket/index?ac=8015&fc=00453')]);
  places.takimoto.admission=admission('adex 住客免费','无需再买普通日归票。内汤现行时段 04:00–次日 01:00；入场凭证与退房后使用截止到店确认。',[link('adex 住客泡汤说明','https://www.adexinn.com/ja-onsen')],'住客泡汤');
  places.ningle.admission=admission('免费','常规冬季 12:00–20:45，店铺休息日各异，雪天开放以现场为准。',[link('精灵露台官网',places.ningle.url)]);
  // Revision 3: shorter Biei/Furano day and geographically grouped Asahikawa days.
  const addPlace=(id,n,name,lat,lng,query,url)=>places[id]={id,n,name,lat,lng,query,url};
  const zooCalendar='https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/event/event.html';
  const zooAccess='https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/generalinformation/d053767.html';
  const zooTickets='https://www.city.asahikawa.hokkaido.jp/asahiyamazoo/generalinformation/d052849.html';
  addPlace('cheese','62','富良野芝士工厂',43.32062,142.37700,'富良野チーズ工房','https://www.furano-cheese.jp/');
  addPlace('forest','63','外国树种见本林',43.7533863,142.3474492,'外国樹種見本林 旭川','https://www.visit-hokkaido.jp/spot/detail_10232.html');
  addPlace('kagura','64','神乐冈公园',43.7468,142.3742,'神楽岡公園 旭川','https://www.asahikawa-park.or.jp/park/synthesis/kagura.html');
  addPlace('kitasaito','65','北彩都公园 · 站南侧',43.7620,142.3605,'あさひかわ北彩都ガーデン 旭川駅南口','https://www.asahikawa-park.or.jp/kitasaito/');
  addPlace('tokiwa','66','常盘公园',43.7765,142.3550,'常磐公園 旭川','https://www.asahikawa-park.or.jp/park/synthesis/tokiwa.html');
  addPlace('zoo','67','旭山动物园',43.7688,142.4790,'旭山動物園 正門',zooCalendar);
  addPlace('fudo','68','白金不动瀑布',43.479167,142.626389,'白金 不動の滝 美瑛','https://tokachidake-geopark.jp/geoname/247/');
  // Coordinates are the !3d / !4d place marker in the hotel's official Google Maps link.
  addPlace('sapporopark','69','札幌公园酒店',43.0477002,141.356207,'札幌パークホテル 札幌市中央区南10条西3丁目1-1',U.sapporopark);
  places.mori.name='森之时计咖啡屋';
  places.mori.admission=admission('按餐饮消费','不接受预约，17 席；常规 12:00–20:00，19:00 最后点单。年末营业另核，等位长就略过。',[link('咖啡屋官网',places.mori.url)],'咖啡');
  places.cheese.admission=admission('参观免费 · 手作另付','冬季常规 09:00–16:00；12/31–1/3 休馆，12/30 年末具体营业时间待确认。本次留 30–45 分钟参观，不预排手作课。',[link('营业公告',places.cheese.url),link('手作说明','https://www.furano-cheese.jp/html/taiken.html'),link('手作预约','https://reserva.be/furanocheese')]);
  places.zoo.admission=admission('¥1,000 / 成人','1/2 已列入官方冬季开园日，10:30–15:30，15:00 停止入园。12/30–1/1 休园；企鹅散步是否举行和时间看当天公告。',[link('官方票价 / 购票入口',zooTickets),link('开园日历',zooCalendar)]);
  places.forest.admission=admission('免费','只走可通行短段，不承诺林内已除雪。旁边三浦绫子馆 12/28–1/5 休馆，不作为取暖休息点。',[link('官方介绍',places.forest.url),link('附近设施休馆','https://www.hyouten.com/info')]);
  const walkRoute={title:'白金地区 · 雪地徒步',description:'青池、白金不动瀑布、白须瀑布分别保留。自行短线或预约向导待定；不动瀑布冬季步道与耗时尚未确认。景点之间默认乘巴士，不沿雪地公路徒步串联。若选约 2 小时向导活动，需按场次重排工厂与回程；向导活动并不保证经过不动瀑布。',links:[link('不动瀑布 / 步道说明',places.fudo.url),link('本地向导咨询','https://tokachidake-geopark.jp/contactus/'),link('雪鞋活动 / 预约','https://www.biei-hokkaido.jp/ja/facility/forest-snowshoe-tour')]};
  const blueToFudo=revisedLeg('道北巴士＋步道待确认','雪路与耗时待确认','从白金青池入口乘白金温泉方向巴士，在「不動の滝」下车。官网未分别给出站点至入口、入口至观景点的冬季耗时；先向当地确认能否进入，不把下车即到理解为直接站在瀑布旁。','公交无需预约；是否请向导、费用与路线需另询。',[link('官方地点 / 步道',places.fudo.url),link('巴士时刻',U.dohokubus),link('向导咨询','https://tokachidake-geopark.jp/contactus/')],'12/30、1/2 冬季步道开放未确认');
  const fudoToShirahige=revisedLeg('道北巴士＋步行','接续与雪路耗时待确认','若进入不动瀑布，先按原开放步道回公交站，再往「白金温泉」乘车，步行至白须瀑布观景桥。若不动瀑布雪路未开放，就从青池直接乘巴士到白金温泉，不沿公路硬走。','普通公交无需预约，提前核对停站与接续。',[link('道北巴士时刻',U.dohokubus),link('美瑛观光',U.biei)],'冬季接续待确认');
  const bieiFurano=revisedLeg('ラベンダー号','约 1 小时＋候车','美瑛站前乘ラベンダー号直达新富良野プリンスホテル。1/2 工厂休馆，直接去酒店森林区域。','普通路线无需预约，不能订座。',[link('富良野巴士时刻',U.furanobus),link('酒店交通','https://www.princehotels.co.jp/shinfurano/access/')],'冬季接续待确认');
  const bieiToFuranoStation=revisedLeg('JR 富良野线','约 40–50 分钟＋候车','美瑛站乘往富良野方向的普通列车，到富良野站。也可按当日衔接选择ラベンダー号至富良野站前；不可把参考耗时当成已订车次。','普通列车无需订座，现场购票。',jrLinks,'12/30 年末接续待确认');
  L.whiteBiei.steps='白金温泉乘道北巴士回美瑛站前，接 JR 或ラベンダー号去富良野。想下午早点返程，需争取中午前离开白金地区，按实际班次确定。';
  const cheeseAccess=revisedLeg('短途接驳 · 需落实','通常车程约 9 分钟','富良野站至芝士工厂约 3.4 公里。未核到适用的直达定班公交；想保留工厂，需事先落实短途出租车。若坚持全程公共交通，略过工厂，从车站乘ラベンダー号去酒店。','未代订车辆。工厂及下一段车辆接续须提前确认。',[link('工厂官方交通','https://www.furano-cheese.jp/html/access.html'),link('巴士时刻',U.furanobus)],'工厂段无法承诺公交直达');
  const cheeseToHotel=revisedLeg('短途接驳 · 需落实','通常车程约 5–10 分钟','从芝士工厂前往新富良野王子酒店，需与前段一并落实车辆。不把雪地公路步行作为默认衔接。','短途车辆按实际车费支付；未预约。',[link('酒店交通','https://www.princehotels.co.jp/shinfurano/access/')],'冬季车程多留余量');
  const earlyReturn=revisedLeg('ラベンダー号优先','约 1 小时 50 分钟＋候车','优先从新富良野王子酒店乘下午的ラベンダー号回旭川站前。现行直达末班为下午，不等夜景后再找车。若出发日无合适直达班次，核实酒店至富良野站的巴士＋JR；仍接不上时才考虑预订短途车回车站。','普通路线无需预约；先落实返程班次，再决定咖啡停留。',[link('巴士官方时刻',U.furanobus),link('JR 时刻',U.jr),link('酒店交通','https://www.princehotels.co.jp/shinfurano/access/')],'12/30、1/2 冬季班次待确认；晚饭前回旭川只是目标');
  variants.biei={label:'美瑛＋富良野',sub:'青池 · 双瀑布 · 芝士 · 精灵露台',city:'美瑛 / 富良野',summary:'青池 · 双瀑布徒步 → 芝士工厂 → 精灵露台 · 咖啡',alert:'先按短徒步、工厂短访和下午返程安排，不等夜景。不动瀑布需先确认雪路；完整向导活动需重排时间，工厂段需落实短途车辆。',alertUrl:U.furanobus,stops:[
    s('asahikawa','早上','早餐后乘 JR 前往美瑛，出发前同时核对回程。'),s('biei','上午','换乘前往白金的巴士；带一点午餐或简餐。',L.asahiBiei),
    s('blue','上午','在开放步道看青池，雪地短走。',L.blue),
    {...s('fudo','上午','冬季步道先向当地确认；开放后再决定自行短走或请向导。',blueToFudo,'开放后去'),walk:walkRoute},
    s('shirahige','上午','到观景桥看白须瀑布，按实际接续控制停留时间。',fudoToShirahige),
    s('biei','中午前后','按回程巴士接续回到美瑛，午餐在车站附近或带简餐。',L.whiteBiei,'午餐'),
    s('furano','午后前段','接往芝士工厂的车辆；未落实车辆时，直接乘巴士去酒店。',bieiToFuranoStation),
    s('cheese','争取14:00前','留 30–45 分钟看看工厂和商店，不参加手作课。到达太晚或车辆未落实就略过。',cheeseAccess,'接驳落实后去'),
    s('prince','下午','到酒店后步行进森林区域，先记下返程上车点。',cheeseToHotel),
    s('ningle','下午','逛精灵露台，不必等天黑。',walk('约 2–5 分钟')),
    s('mori','有空位再坐','森之时计喝杯咖啡；排队长就略过，先保住回旭川的车。',walk('约 5–10 分钟','沿酒店开放园路前往森之时计，雪天按现场指引走。'),'咖啡'),
    s('prince','下午返程','提前回酒店门前候车，按当天已核实班次离开。',walk('约 5–10 分钟')),
    s('asahikawa','晚饭前目标','回旭川吃晚餐，再回站前酒店。到达时间待班次落实。',earlyReturn,'晚餐')
  ]};
  delete variants.furano;
  const forestOut=walk('雪天约 25–35 分钟','由旭川站东侧，经冰点桥走市区道路至见本林入口。通常步行约 20 分钟，冬季加余量；路滑时先核对至神楽4条8丁目／神楽農協前的公交。');
  const forestBack=walk('雪天约 25–35 分钟','沿原市区道路经冰点桥回站前，不穿越未确认开放的林间小路。');
  variants.asahi={label:'旭川市区',sub:'见本林 · 拉面 · 站前休息',city:'旭川',summary:'见本林 → 站前午餐 → 咖啡与休息',alert:'见本林只走可通行短段；林内冬季除雪未核实，三浦绫子馆年末休馆。',alertUrl:'https://www.hyouten.com/info',stops:[
    s('ys','上午','早餐后出门，不赶早。','', '早餐'),s('forest','10:30前后','短走约 30–45 分钟，路况不好就在入口附近看看。',forestOut),s('asahikawa','午餐','回站前吃午餐，想吃拉面先看当天营业。',forestBack,'餐食'),s('aeon','午后','咖啡、逛店，留出室内休息时间。',walk('约 3–5 分钟')),s('ys','晚些时候','回酒店休息；晚餐选站前营业的店。',walk('约 5–8 分钟'),'晚餐')
  ]};
  const zooOut=revisedLeg('旭川电气轨道 41 / 47 路','车程约 40 分钟＋候车','旭川站前 6 号乘车处，乘旭山动物园方向巴士至终点。按 10:30 开园倒推上车时间，冬季班次出发前复核。','普通公交无需预约；当前成人单程 ¥670，票价出发前复核。',[link('动物园官方交通',zooAccess),link('巴士时刻','https://www.asahikawa-denkikidou.jp/')],'1/2 班次待确认');
  const zooBack=revisedLeg('旭川电气轨道 41 / 47 路','车程约 40 分钟＋候车','从动物园正门乘旭川站方向巴士。看实际发车时间决定何时出园，不以刚好赶末班为目标。','普通公交无需预约。',[link('官方交通',zooAccess)],'1/2 回程时刻待确认');
  variants.zoo={label:'旭山动物园',sub:'上午动物园 · 见本林短走',city:'旭川',summary:'旭山动物园 → 站前午餐 → 见本林（看天色）',alert:'10:30 开园，上午留给动物园。回站较晚或雪大就省略见本林；若 12/30 市区行程已完成，这段会自动省略。',alertUrl:zooCalendar,stops:[
    s('asahikawa','开园前','吃过早餐到 6 号站台，按当日班次候车。','', '早餐'),s('zoo','10:30–13:00参考','按兴趣看园区，企鹅散步只按当天公布的安排。若多留一会儿，下午就不再去见本林。',zooOut),s('asahikawa','回站后','午餐和室内休息，已经饿了可先在园内开放餐饮处吃。',zooBack,'午餐'),s('forest','天亮且不累时','尚未去过再短走 20–30 分钟；回站偏晚、天色暗或路况差就省略。',forestOut,'可省略'),s('ys','傍晚','回酒店取暖，晚饭在站前吃。',forestBack,'晚餐')
  ]};
  findDay('01-02').default='zoo';
  const newYearsEve=findDay('12-31');
  newYearsEve.summary='常盘公园 → 买物公园 → 采购与跨年';
  newYearsEve.stops=[s('ys','上午','早餐后慢慢出门。','', '早餐'),s('tokiwa','午前','走开放园路约 30–45 分钟，不绕整园。',walk('雪天约 30–40 分钟','沿市区人行道向常盘公园走，避开未除雪近道；雪大时可核对常磐公園前方向公交。')),s('heiwa','中午至午后','从北端往站前方向逛，找营业的店吃午餐、喝咖啡。',walk('约 5–10 分钟','从常盘公园东南侧往 8 条通、买物公园北端走。'),'午餐'),s('aeon','15:00前后','买年越荞麦、熟食和元旦早餐；年末店铺可能提早关门。',walk('约 15–25 分钟','沿买物公园往旭川站走，逛街时间另计。')),s('ys','晚上','回酒店吃晚餐、跨年，初诣留给明天。',walk('约 5–8 分钟'),'晚餐')];
  const newYearsDay=findDay('01-01'),shrineOut=newYearsDay.stops.find(x=>x.place==='shrine').via,shrineReturn=newYearsDay.stops.filter(x=>x.place==='ys').at(-1).via;
  shrineReturn.steps='由神乐冈公园入口步行回「上川神社前」，乘旭川站方向巴士回站前酒店。出发前同时确认去程与回程，元旦不依赖普通周日班次。';
  newYearsDay.summary='上川神社 → 神乐冈公园 → 北彩都短散步';
  newYearsDay.alert='元旦神社往返巴士待确认。两处公园只走短段；绿之中心、北彩都花园中心年末休馆，不安排室内设施或器材租借。';
  newYearsDay.alertUrl='https://www.asahikawa-park.or.jp/kitasaito/guide/';
  newYearsDay.stops=[s('ys','晚些时候','吃准备好的早餐，按天气出门。','', '早餐'),s('shrine','午前','去上川神社初诣；先确认往返交通，不临时依赖元旦巴士。',shrineOut),s('kagura','参拜后','神社就在公园一带，只走入口附近可通行园路 20–30 分钟，不走完整林地。',walk('约 5–10 分钟','沿神社与公园开放道路短程散步，结冰坡道不勉强。')),s('ys','午后','回酒店或站前吃午餐、休息。',shrineReturn,'午餐'),s('kitasaito','还有精神时','站南侧看一会儿雪，10–20 分钟即可；不走完整花园。',walk('约 5–10 分钟','从站前酒店经车站通道到南口，附近开放铺装道路短走。'),'可省略'),s('ys','傍晚','回酒店，晚餐选站前营业的店或已备食品。',walk('约 5–10 分钟'),'晚餐')];

  variants.west.summary='北海道神宫 → 白色恋人 → 汤咖喱';variants.city.summary='北大 → 大通 → 狸小路';variants.park.summary='中岛公园 → 汤咖喱 → 机场';
  const summaries={'12-23':'成田机场 → 酒店','12-24':'成田 → 羽田 → 函馆 → 渚亭','12-25':'植物园 → 元町 → 金森仓库','12-26':'函馆 → 洞爷湖 → Kitutuki','12-27':'洞爷湖 → 地狱谷 → 第一滝本館','12-28':'熊牧场 → 伊达时代村 → 泡汤','12-29':'登别 → 札幌 → 旭川 · 大黒屋','12-31':'常盘公园 → 买物公园 → 采购与跨年','01-01':'上川神社 → 神乐冈公园 → 北彩都短散步','01-03':'旭川 → 旭岳 → 大雪山远景酒店','01-05':'堺町 → 运河 → 远端景点择一','01-07':'成田山表参道 → 新胜寺 → 机场'};
  for(const d of days)if(summaries[d.id])d.summary=summaries[d.id];
  const tickets=[
    {id:'hakodate-toya',date:'12-26',from:'函馆',to:'洞爷',service:'JR 特急北斗',url:U.jrbook},
    {id:'nobori-sapporo',date:'12-29',from:'登别温泉',to:'札幌',service:'高速 Onsen 号',url:U.onsenbook},
    {id:'sapporo-asahi',date:'12-29',from:'札幌',to:'旭川',service:'JR Lilac / Kamui',url:U.jrbook},
    {id:'asahi-sapporo',date:'01-04',from:'旭川',to:'札幌',service:'JR Lilac / Kamui',url:U.jrbook}
  ];
  L.hakodateToya.ticketId='hakodate-toya';L.onsen.ticketId='nobori-sapporo';L.sapporoAsahi.ticketId='sapporo-asahi';L.asahiSapporo.ticketId='asahi-sapporo';
  Object.assign(places.garaku,{lat:43.05840859,lng:141.35901922,query:'GARAKU 札幌市中央区南3条東2丁目6-1 プレサント南3東2 B1F',url:'https://www.s-garaku.com/shoplist.php'});
  Object.assign(places.pal,{query:'夜パフェ専門店 Parfaiteria PaL 札幌市中央区南4条西2丁目10-1',url:'https://yoru-parfait-gaku.com/parfait/shop-info/'});
  Object.assign(places.santouka,{query:'らーめん山頭火 旭川本店',url:'https://www.santouka.co.jp/shop-jp/hokkaido/area01-001'});
  variants.west.stops.find(x=>x.place==='garaku').via=subway('约 35–50 分钟','宫之泽站乘东西线至巴士中心前站，步行到二条市场旁新址：南3条東2丁目6-1，地下一层。');
  variants.city.stops.find(x=>x.place==='garaku').via=walk('约 15–20 分钟','从大通向二条市场一带走，GARAKU 现址在南3条東2丁目6-1，地下一层；按新地址导航。');
  variants.park.stops.find(x=>x.place==='garaku').via=subway('约 25–35 分钟','中岛公园站乘南北线至薄野站，再按导航步行到二条市场一带 GARAKU 新址。');
  for(const route of ['west','city','park'])variants[route].stops.find(x=>x.place==='tanuki').via=walk('约 10–15 分钟','从二条市场附近往西，过创成川后进入狸小路。');
  variants.west.stops[0].via=subway('约 35–45 分钟','从札幌公园酒店旁的中岛公园站乘南北线麻生方向至大通，换东西线宫之泽方向至圆山公园站，再步行约 15 分钟入神宫。');
  variants.city.stops[0].via=subway('约 25–35 分钟','从札幌公园酒店旁的中岛公园站乘南北线麻生方向至北12条站，沿开放道路步行进入北海道大学。');
  variants.park.stops[0].via=walk('约 3–5 分钟','札幌公园酒店就在中岛公园旁，步行到开放园路，不绕行札幌站。');
  variants.park.stops.find(x=>x.place==='tanuki').desc='有余裕再短逛，预留返程，13:30 回札幌公园酒店取行李。';
  const otaruDay=findDay('01-05');
  otaruDay.stops[0].desc='换乘 JR 去南小樽；实际班次出发前确认。';
  otaruDay.stops[0].via=parkToStation;
  otaruDay.stops.unshift(s('sapporopark','07:30后','早餐后从酒店出发，按当天 JR 班次调整出门时间。'));
  otaruDay.stops.at(-1).desc='回到 JR 札幌站后换地铁，返回酒店。';
  otaruDay.stops.push(s('sapporopark','回酒店','乘南北线回中岛公园，晚上住札幌公园酒店。',parkFromStation));
  window.TRIP={places,days,variants,links:U,itinerary,tickets};
})();


