(() => {
  'use strict';
  // Official product-page image references checked on 2026-09-29.
  // These are packaging / product references; the current store package may differ.
  // Unidentified cheeseRoll and unverified potato photos are deliberately omitted.
  window.SNACK_IMAGES = {
    rice: {
      src:'https://www.seicomart.co.jp/images/instore/rb/rice_2_1.jpg',
      source:'https://www.seicomart.co.jp/instore/rb/rb05_rice.html',
      label:'Seicomart 鲑鱼饭团包装参考；明太子款以店内实物为准',
      alt:'Seicomart 手卷鲑鱼饭团官方商品图'
    },
    zangi: {
      src:'https://www.seicomart.co.jp/images/instore/new/20260907_12.jpg',
      source:'https://www.seicomart.co.jp/instore/hotchef.html?mode=pc',
      label:'HOT CHEF ザンギ炸鸡 · 官方商品参考',
      alt:'Seicomart HOT CHEF 四块装炸鸡官方商品图'
    },
    milk: {
      src:'https://www.seicomart.co.jp/images/instore/randing/milk/img_7.png',
      source:'https://www.seicomart.co.jp/instore/milk.html',
      label:'Secoma 北海道牛乳 · 官方包装参考',
      alt:'Secoma 北海道牛乳纸盒官方包装图'
    },
    yogurt: {
      src:'https://www.seicomart.co.jp/images/instore/rb/dailyt_1_7.jpg',
      source:'https://www.seicomart.co.jp/instore/rb/rb03_dailyt.html',
      label:'Secoma 丰富牛乳酸奶 120g · 官方包装参考',
      alt:'Secoma 北海道とよとみ生乳95%酸奶120g官方包装图'
    },
    hakodateMilk: {
      src:'https://www.e-milk.co.jp/milk/img/01_01.jpg',
      source:'https://www.e-milk.co.jp/milk/01.html',
      label:'函馆牛乳 · 橙色纸盒包装参考',
      alt:'函馆牛乳橙色纸盒官方包装图'
    },
    pudding: {
      src:'https://www.seicomart.co.jp/images/instore/rb/bread_5_12.jpg',
      source:'https://www.seicomart.co.jp/instore/rb/rb07_bread.html',
      label:'Secoma たまごプリン · 鸡蛋布丁包装参考',
      alt:'Secoma 鸡蛋布丁官方商品图'
    },
    icecream: {
      src:'https://www.seicomart.co.jp/images/instore/rb/candy_1_1.jpg',
      source:'https://www.seicomart.co.jp/instore/rb/rb08_candy.html',
      label:'Secoma 北海道牛乳软冰淇淋 · 包装参考',
      alt:'Secoma 北海道牛乳软冰淇淋官方商品图'
    },
    melonSour: {
      src:'https://online.seicomart.co.jp/imgresize/imageresize.php?h=350&image=%2Fimages%2Fgoods%2F760600000001_1_5.jpg&w=350',
      source:'https://online.seicomart.co.jp/delivery/goods_list/goods_list_3.php?o_no=760600000001',
      label:'Secoma 哈密瓜气泡酒 · 酒精 3%',
      alt:'Secoma 北海道哈密瓜气泡酒350ml官方罐装图'
    },
    melonJelly: {
      src:'https://www.seicomart.co.jp/images/instore/rb/bread_5_10.jpg',
      source:'https://www.seicomart.co.jp/instore/rb/rb07_bread.html',
      label:'Secoma 北海道哈密瓜果冻 · 包装参考',
      alt:'Secoma 北海道哈密瓜果冻官方商品图'
    },
    salmonCorn: {
      src:'https://online.seicomart.co.jp/imgresize/imageresize.php?h=350&image=%2Fimages%2Fgoods%2F742800000001-1.jpg&w=350',
      source:'https://online.seicomart.co.jp/delivery/goods_list/goods_list_3.php?o_no=742800000001',
      label:'鮭とばコーンチップス · 鲑鱼干风味玉米片',
      alt:'Seicomart 限定鲑鱼干风味玉米片官方包装图'
    },
    butterChips: {
      src:'https://www.calbee.co.jp/common/utility/binout.php?db=products&f=5851',
      source:'https://www.calbee.co.jp/products/detail/?p=20260604161954',
      label:'Calbee 北海道黄油酱油薯片 · 包装参考',
      alt:'Calbee 北海道バターしょうゆ味薯片官方包装图'
    },
    milkNoodle: {
      src:'https://cdn.nissin.com/gr-documents/attachments/articles/65604/ffa3ea944497d9ef/limited/20251125-1_1.png?1763632123=',
      source:'https://www.nissin.com/jp/company/news/13556/',
      label:'2025 冬季牛奶海鲜杯面包装；2026 冬季供应待确认',
      alt:'日清2025冬季浓厚牛奶海鲜杯面官方包装图'
    },
    cheeseTara: {
      src:'https://www.natori.co.jp/dcms_media/image/cheese_0534490.png',
      source:'https://www.natori.co.jp/joy/cheese.html',
      label:'鳕鱼芝士条参考：なとり常温款；品牌与规格可按货架选',
      alt:'なとり鳕鱼芝士条常温款官方包装图'
    },
    egg: {
      src:'https://img-afd.7api-01.dp1.sej.co.jp/item-image/053738/249D7E0F80E38E08DA6785E3771C20CE.jpg',
      source:'https://www.sej.co.jp/products/a/item/053738/',
      label:'7-Eleven 鸡蛋三明治 · 官方商品参考',
      alt:'7-Eleven THE たまごサンド鸡蛋三明治官方商品图'
    },
    chicken: {
      src:'https://www.lawson.co.jp/recommend/original/detail/img/l456071_8.png',
      source:'https://www.lawson.co.jp/recommend/original/detail/1390563_1996.html',
      label:'Lawson からあげクン原味 · 官方商品参考',
      alt:'Lawson からあげクン原味鸡块官方商品图'
    },
    royce: {
      src:'https://www.royce.com/images/pc/goods/special/contents-body-potetochip_230905_s6.jpg',
      source:'https://www.royce.com/contents/potatochip',
      label:'ROYCE 巧克力薯片 · 原味包装参考',
      alt:'ROYCE 原味巧克力薯片官方商品图'
    },
    rokkatei: {
      src:'https://www.rokkatei-eshop.com/store/images/products/10050.jpg',
      source:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=10050',
      label:'六花亭 マルセイバターサンド · 葡萄干黄油夹心',
      alt:'六花亭葡萄干黄油夹心官方包装图'
    },
    taiheigen: {
      src:'https://www.rokkatei-eshop.com/store/images/products/11768.jpg',
      source:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=11768',
      label:'六花亭 大平原 · 三个装包装参考',
      alt:'六花亭大平原三个装官方包装图'
    },
    walnut: {
      src:'https://www.rokkatei-eshop.com/store/images/products/11770.jpg',
      source:'https://www.rokkatei-eshop.com/store/ProductDetail.aspx?pcd=11770',
      label:'六花亭 マルセイバターケーキ · 核桃夹心蛋糕',
      alt:'六花亭核桃黄油夹心蛋糕三个装官方包装图'
    },
    roastCorn: {
      src:'https://www.yoshimi-ism.com/product/images/product/oh_yakitoukibi/image_6_1.jpg',
      source:'https://www.yoshimi-ism.com/product/oh_yakitoukibi.php',
      label:'YOSHIMI Oh!焼とうきび · 六小袋装参考',
      alt:'YOSHIMI 烤玉米米果六小袋装官方包装图'
    },
    currySenbei: {
      src:'https://yoshimishop.itembox.design/product/001/000000000186/000000000186-03-l.jpg?t=20230412190421',
      source:'https://www.yoshimi-ism.co.jp/c/gr1/gd186',
      label:'YOSHIMI カリカリまだある？ · 汤咖喱仙贝',
      alt:'YOSHIMI 汤咖喱仙贝独立小袋官方包装图'
    },
    calbee: {
      src:'https://www.calbee.co.jp/jagapokkuru/assets/img/products_jagapokkuru-pkg-sm.png',
      source:'https://www.calbee.co.jp/jagapokkuru/products/jagapokkuru/',
      label:'Calbee じゃがポックル · 盐味六小袋装参考',
      alt:'Calbee じゃがポックル鄂霍次克盐味六小袋装官方包装图'
    },
    shiroi: {
      src:'https://shop.ishiya.co.jp/cdn/shop/files/ic-ranking-06.png?v=1737715531909290762',
      source:'https://shop.ishiya.co.jp/',
      label:'白色恋人 · 12 枚装包装参考',
      alt:'ISHIYA 白色恋人12枚装官方包装图'
    }
  };
})();
