/**
 * Created by gavin on 17/8/17.
 */

  var _rpt_setting_ = {};

  _rpt_setting_['rptOutletSale'] = {
    rptId: 'rptOutletSale',
    rptTitle: '门店经营',
    columns: [
      {'field': 'rpt_date' , 'title': '日期'},
      {'field': 'region_name' , 'title': '大区'},
      {'field': 'province_name' , 'title': '省份'},
      {'field': 'city_name' , 'title': '城市'},
      {'field': 'county_name' , 'title': '区县'},
      {'field': 'outlet_name' , 'title': '门店'},
      {'field': 'total_fans_cnt' , 'title': '总粉丝数'},
      {'field': 'new_fans_cnt' , 'title': '新增粉丝数'},
      {'field': 'net_fans_cnt	' , 'title': '净增粉丝数'},
      {'field': 'non_brand_fans_cnt' , 'title': '非品牌会员粉丝数'},
      {'field': 'non_brand_new_fans_cnt' , 'title': '非品牌会员新增粉丝数'},
      {'field': 'total_sale_amt' , 'title': '销售额'},
      {'field': 'total_sale_amt_ratio' , 'title': '环比'},
      {'field': 'total_gross_profit' , 'title': '毛利额'},
      {'field': 'total_gross_profit_ratio', 'title': '环比'},
      {'field': 'total_pos_cnt', 'title': 'POS数'},
      {'field': 'total_pos_cnt_ratio' , 'title': '环比'},
      {'field': 'total_per_price' , 'title': '客单价'},
      {'field': 'total_per_price_ratio' , 'title': '环比'},
      {'field': 'new_sale_amt' , 'title': '销售额'},
      {'field': 'new_sale_amt_ratio' , 'title': '环比'},
      {'field': 'new_vip_sale_prop' , 'title': '会员销售占比'},
      {'field': 'new_vip_sale_prop_lst_week', 'title': '上周占比' },
      {'field': 'new_pos_cnt' , 'title': 'POS数'},
      {'field': 'new_pos_cnt_ratio' , 'title': 'POS数环比'},
      {'field': 'new_pos_prop' , 'title': 'POS占比'},
      {'field': 'new_pos_prop_lst_week' , 'title': '上周POS占比'},
      {'field': 'new_per_price' , 'title': '客单价'},
      {'field': 'new_per_price_ratio', 'title': '客单环比' },
      {'field': 'old_sale_amt' , 'title': '销售额'},
      {'field': 'old_sale_amt_ratio', 'title': '环比'},
      {'field': 'old_vip_sale_prop', 'title': '会员销售占比'},
      {'field': 'old_vip_sale_prop_lst_week', 'title': '上周占比'},
      {'field': 'old_pos_cnt', 'title': 'POS数'},
      {'field': 'old_pos_cnt_ratio', 'title': 'POS数环比'},
      {'field': 'old_pos_prop', 'title': 'POS占比'},
      {'field': 'old_pos_prop_lst_week', 'title': '上周POS占比'},
      {'field': 'old_per_price', 'title': '客单价'},
      {'field': 'old_per_price_ratio', 'title': '客单环比'},
    ],
    filters: [
      /* {field: 'order_date', title:'日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]},
      {field: 'order_code', title:'相关订单号', type: 1},
      {field: 'buyer_code', title:'客户代码', type: 1},
      {field: 'key_value', title:'客户所在区域', type: 1},
      {field: 'provider_code', title:'供应商代码', type: 1},
      {field: 'provider_keyvalue', title:'供应商所在区域', type: 1},
      {field: 'isbigtraders', title:'是否大贸易商', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
      {field: 'isrelatedtransaction', title:'是否关联交易', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
      {field: 'salemodel', title:'是否钢厂资源', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]} */
    ]
  };
_rpt_setting_['rptUserSalePerformance'] = {
  rptId: 'rptUserSalePerformance',
  rptTitle: '导购业绩',
  columns: [
    {'field': 'rpt_date' , 'title': '日期'},
    {'field': 'region_name' , 'title': '大区'},
    {'field': 'province_name' , 'title': '省份'},
    {'field': 'city_name' , 'title': '城市'},
    {'field': 'county_name' , 'title': '区县'},
    {'field': 'outlet_name' , 'title': '门店'},
    {'field': 'user_id' , 'title': '导购ID'},
    {'field': 'user_name' , 'title': '导购姓名'},
    {'field': 'total_fans_cnt' , 'title': '总粉丝数'},
    {'field': 'new_fans_cnt' , 'title': '新增粉丝数'},
    {'field': 'new_fans_cnt_frm_scan' , 'title': '扫码新增粉丝数'},
    {'field': 'new_fans_cnt_frm_usrs' , 'title': '交接新增粉丝数'},
    {'field': 'non_brand_new_fans_cnt' , 'title': '非品牌会员新增粉丝数'},
    {'field': 'old_vip_cnt' , 'title': '老会员人数'},
    {'field': 'old_vip_sale_amt' , 'title': '老会员销售额'},
    {'field': 'new_vip_sale_amt' , 'title': '新会员销售额'},
    {'field': 'new_vip_amt_rank_country', 'title': '新会员销售额排名（全国）'},
    {'field': 'new_vip_amt_rank_province', 'title': '新会员销售额排名（全省）'},
    {'field': 'new_vip_amt_rank_city' , 'title': '新会员销售额排名（全市）'},
    {'field': 'per_rebuy_amt' , 'title': '人均复购额'},
    {'field': 'per_rebuy_amt_rank_country' , 'title': '人均复购额排名（全国）'},
    {'field': 'per_rebuy_amt_rank_province' , 'title': '人均复购额排名（全省）'},
    {'field': 'per_rebuy_amt_rank_city' , 'title': '人均复购额排名（全市）'},
    {'field': 'overall_rank_country' , 'title': '综合排名（全国）'},
    {'field': 'overall_rank_province', 'title': '综合排名（全省）' },
    {'field': 'overall_rank_city' , 'title': '综合排名（全市）'},
  ],
  filters: [
    /* {field: 'order_date', title:'日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]},
     {field: 'order_code', title:'相关订单号', type: 1},
     {field: 'buyer_code', title:'客户代码', type: 1},
     {field: 'key_value', title:'客户所在区域', type: 1},
     {field: 'provider_code', title:'供应商代码', type: 1},
     {field: 'provider_keyvalue', title:'供应商所在区域', type: 1},
     {field: 'isbigtraders', title:'是否大贸易商', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'isrelatedtransaction', title:'是否关联交易', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'salemodel', title:'是否钢厂资源', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]} */
  ]
};
_rpt_setting_['rptAudienceComposition'] = {
  rptId: 'rptAudienceComposition',
  rptTitle: '会员结构',
  columns: [
    {'field': 'rpt_date' , 'title': '日期'},
    {'field': 'outlet_name' , 'title': '门店'},
    {'field': 'audience_type' , 'title': '会员类型'},
    {'field': 'vip_cnt_1013' , 'title': '高频高价值'},
    {'field': 'vip_cnt_1014' , 'title': '中频中价值'},
    {'field': 'vip_cnt_1015' , 'title': '低价值'},
    {'field': 'vip_cnt_1016' , 'title': '低频高价值'},
    {'field': 'vip_cnt_1017' , 'title': '0次购买'},
    {'field': 'vip_cnt_1035' , 'title': '活跃'},
    {'field': 'vip_cnt_1018' , 'title': '不活跃'},
    {'field': 'vip_cnt_1019' , 'title': '沉睡'},
    {'field': 'vip_cnt_1020' , 'title': '流失'},
    {'field': 'vip_cnt_1034' , 'title': '未购买'}
  ],
  filters: [
    /* {field: 'order_date', title:'日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]},
     {field: 'order_code', title:'相关订单号', type: 1},
     {field: 'buyer_code', title:'客户代码', type: 1},
     {field: 'key_value', title:'客户所在区域', type: 1},
     {field: 'provider_code', title:'供应商代码', type: 1},
     {field: 'provider_keyvalue', title:'供应商所在区域', type: 1},
     {field: 'isbigtraders', title:'是否大贸易商', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'isrelatedtransaction', title:'是否关联交易', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'salemodel', title:'是否钢厂资源', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]} */
  ]
};
_rpt_setting_['rptReturnRatio'] = {
  rptId: 'rptReturnRatio',
  rptTitle: '回头率分析',
  columns: [
    {'field': 'rpt_date' , 'title': '日期'},
    {'field': 'region_name' , 'title': '大区'},
    {'field': 'province_name' , 'title': '省份'},
    {'field': 'city_name' , 'title': '城市'},
    {'field': 'county_name' , 'title': '区县'},
    {'field': 'outlet_name' , 'title': '门店'},
    {'field': 'new_old_vip_sale_amt' , 'title': '老会员销售额'},
    {'field': 'new_sale_amt' , 'title': '总销售额'},
    {'field': 'new_return_ratio' , 'title': '回头率'},
    {'field': 'old_old_vip_sale_amt' , 'title': '老会员销售额'},
    {'field': 'old_sale_amt' , 'title': '总销售额'},
    {'field': 'old_return_ratio' , 'title': '回头率'}
  ],
  filters: [
    /* {field: 'order_date', title:'日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]},
     {field: 'order_code', title:'相关订单号', type: 1},
     {field: 'buyer_code', title:'客户代码', type: 1},
     {field: 'key_value', title:'客户所在区域', type: 1},
     {field: 'provider_code', title:'供应商代码', type: 1},
     {field: 'provider_keyvalue', title:'供应商所在区域', type: 1},
     {field: 'isbigtraders', title:'是否大贸易商', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'isrelatedtransaction', title:'是否关联交易', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'salemodel', title:'是否钢厂资源', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]} */
  ]
};
_rpt_setting_['rptCampaignEffect'] = {
  rptId: 'rptCampaignEffect',
  rptTitle: '活动效果',
  columns: [
    {'field': 'rpt_date' , 'title': '日期'},
    {'field': 'campaign_id' , 'title': '活动ID'},
    {'field': 'campaign_name' , 'title': '活动名称'},
    {'field': 'coverage_cnt' , 'title': '覆盖人数'},
    {'field': 'contact_cnt' , 'title': '触达人数'},
    {'field': 'coupon_cnt' , 'title': '领券人数'},
    {'field': 'user_cnt' , 'title': '用券人数'},
    {'field': 'pos_cnt' , 'title': 'POS数'},
    {'field': 'pos_vip_cnt' , 'title': 'POS人数'},
    {'field': 'pos_amt' , 'title': 'POS金额'},
    {'field': 'per_price' , 'title': '客单价'},
    {'field': 'discount_amt' , 'title': '折扣金额'}
  ],
  filters: [
    /* {field: 'order_date', title:'日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]},
     {field: 'order_code', title:'相关订单号', type: 1},
     {field: 'buyer_code', title:'客户代码', type: 1},
     {field: 'key_value', title:'客户所在区域', type: 1},
     {field: 'provider_code', title:'供应商代码', type: 1},
     {field: 'provider_keyvalue', title:'供应商所在区域', type: 1},
     {field: 'isbigtraders', title:'是否大贸易商', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'isrelatedtransaction', title:'是否关联交易', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'salemodel', title:'是否钢厂资源', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]} */
  ]
};
_rpt_setting_['rptCampaignListEffect'] = {
  rptId: 'rptCampaignListEffect',
  rptTitle: '人群效果',
  columns: [
    {'field': 'rpt_date' , 'title': '日期'},
    {'field': 'campaign_id' , 'title': '活动ID'},
    {'field': 'campaign_name' , 'title': '活动名称'},
    {'field': 'touch_type' , 'title': '触达手段'},
    {'field': 'target_rule' , 'title': '定向人群'},
    {'field': 'coverage_cnt' , 'title': '覆盖人数'},
    {'field': 'contact_cnt' , 'title': '触达人数'},
    {'field': 'coupon_cnt' , 'title': '领券人数'},
    {'field': 'direct_trans_cnt' , 'title': '直接转化人数'},
    {'field': 'direct_trans_pos_cnt' , 'title': '直接转化POS数'},
    {'field': 'direct_trans_pos_amt' , 'title': '直接转化POS金额'},
    {'field': 'direct_trans_per_price' , 'title': '直接转化客单价'},
    {'field': 'direct_trans_discount_amt' , 'title': '直接转化折扣金额'},
    {'field': 'indirect_trans_cnt' , 'title': '间接转化人数'},
    {'field': 'indirect_trans_pos_amt' , 'title': '间接转化金额'}
  ],
  filters: [
    /* {field: 'order_date', title:'日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]},
     {field: 'order_code', title:'相关订单号', type: 1},
     {field: 'buyer_code', title:'客户代码', type: 1},
     {field: 'key_value', title:'客户所在区域', type: 1},
     {field: 'provider_code', title:'供应商代码', type: 1},
     {field: 'provider_keyvalue', title:'供应商所在区域', type: 1},
     {field: 'isbigtraders', title:'是否大贸易商', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'isrelatedtransaction', title:'是否关联交易', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]},
     {field: 'salemodel', title:'是否钢厂资源', type: 4, options:[{Code:null, DisplayName:'---'}, {Code:2, DisplayName:'否'},{Code:1, DisplayName:'是'}]} */
  ]
};

// _rpt_setting_['allTraders'] = {
  //   rptId: 'allTraders',
  //   rptTitle: '全部贸易商报表',
  //   columns: [
  //     {'field': '区域' },
  //     {'field': '当日销售量' },
  //     {'field': '当日成交供应商量' },
  //     {'field': '本月累计销售量' },
  //     {'field': '本月累计供应商量' },
  //     {'field': '一年累计销量' },
  //     {'field': '一年累计供应商量' },
  //     {'field': '当日挂货量' },
  //     {'field': '挂货供应商量'}
  //   ],
  //   filters: [
  //     {field: 'current_date', title:'选择日期', type: 3, range:false, default: VX.date.pureDay(new Date())},
  //   ]
  // };
  // _rpt_setting_['natureTraders'] = {
  //   rptId: 'natureTraders',
  //   rptTitle: '自然成交贸易商报表',
  //   columns: [
  //     {'field': '区域' },
  //     {'field': '当日销售量' },
  //     {'field': '当日成交供应商量' },
  //     {'field': '本月累计销售量' },
  //     {'field': '本月累计供应商量' },
  //     {'field': '一年累计销量' },
  //     {'field': '一年累计供应商量' },
  //     {'field': '当日挂货量' },
  //     {'field': '挂货供应商量'}
  //   ],
  //   filters: [
  //     {field: 'current_date', title:'选择日期', type: 3, range:false, default: VX.date.pureDay(new Date())},
  //   ]
  // };
  // _rpt_setting_['everydaynewusers'] = {
  //   rptId: 'everydaynewusers',
  //   rptTitle: '每日新用户报表',
  //   columns: [
  //     {'field': '订单号' },
  //     {'field': '买家代码' },
  //     {'field': '买家名称' },
  //     {'field': '购买账号' },
  //     {'field': '卖家代码' },
  //     {'field': '卖家名称' },
  //     {'field': '订单类型' },
  //     {'field': '订单量' }
  //   ],
  //   filters: [
  //     {field: 'current_date', title:'选择日期', type: 3, range:false, default: VX.date.pureDay(new Date())},
  //     {field: 'type', title:'买家/卖家', type: 4, range:false, default:1,  options:[{Code:1, DisplayName:'买家'},{Code:2, DisplayName:'卖家'}]},
  //   ]
  // };
  // _rpt_setting_['lbquery'] = {
  //   rptId: 'lbquery',
  //   rptTitle: '欧冶联邦数据查询',
  //   columns: [
  //     {'field': '相关订单号' },
  //     {'field': '客户代码' },
  //     {'field': '客户名称' },
  //     {'field': '资源供应商代码' },
  //     {'field': '资源供应商名称' },
  //     {'field': '销售模块' },
  //     {'field': '负责人' },
  //     {'field': '负责人部门' },
  //     {'field': '品名' },
  //     {'field': '重量' },
  //     {'field': '件数' },
  //     {'field': '订单类型' },
  //     {'field': '创建日期' }
  //   ],
  //   filters: [
  //     {field: 'order_date', title:'选择日期', type: 3, range: true, default: [VX.date.pureDay(new Date()), VX.date.pureDay(new Date())]}
  //   ]
  // };
  // _rpt_setting_['gfztwrk'] = {
  //   rptId: 'gfztwrk',
  //   rptTitle: '股份在途未入库',
  //   columns: [
  //     {'field': '订单生成时间' },
  //     {'field': '订单号' },
  //     {'field': '买家' },
  //     {'field': '捆包号' },
  //     {'field': '灯' },
  //     {'field': '钢厂资源号' },
  //     {'field': '规格' },
  //     {'field': '捆包重量' },
  //     {'field': '订单重量' },
  //     {'field': '仓库代码' },
  //     {'field': '仓库名称' },
  //     {'field': '品名' }
  //   ]
  // };
 export default _rpt_setting_

