/**
 * Created by clude on 3/23/17.
 */
/**
 * Created with IntelliJ IDEA.
 * User: zhuclude
 * Date: 7/4/13
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
class BaseLookup {
  constructor(){
    this._list = null;
  };

  getList() {
    if(this._lists){
      return this._lists;
    }else{
      this._lists = this.generateList();
      return this._lists;
    }
  };

  generateList() { return []; }

  getListWithEmpty(emptyOption) {
    let list = this.getList();
    let emptySelection = Object.assign({Code: -1, DisplayName: "请选择"}, emptyOption || {});
    list.splice(0, 0, emptySelection);
    return list;
  }

  getEnums() {
    if (this._enums) {
      return this._enums;
    } else {
      this._enums = {};
      var list = this.getList();
      for (var k in list) {
        var item = list[k];
        this._enums[item.Code] = item;
      }
    }
    return this._enums;
  }

  getByCode(code) {
    if (code) {
      return this.getEnums()[code] || null;
    }
    return null;
  }

  getByCodes(codesArray) {
    var results = [];
    for (var k in codesArray) {
      results.push(this.getEnums()[codesArray[k]]);
    }
    return results;
  }

  getByMergedCode(mCode) {
    var rst = [];
    var lists = this.getList();
    lists.forEach((item) => {
      if( (item.Code & mCode) > 0 ){
        rst.push(item);
      }
    });
    return rst;
  }

  getByJoinedCode(mCode) {
    var codes = [];
    if(mCode){
      codes = mCode.split(',');
    }

    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item){
      if( (codes.indexOf(item.Code)) > -1 ){
        rst.push(item);
      }
    });
    return rst;
  }

  getNamesList(codesArray) {
    var enums = this.getEnums();
    var results = [];
    for (var k in codesArray) {
      var code = codesArray[k];
      if (enums[code]) {
        results.push(enums[code].DisplayName)
      }
    }
    return results;
  };

  getNameByMergedCode (mCode) {
    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item){
      if( (item.Code & mCode ) > 0){
        rst.push(item.DisplayName);
      }
    });
    return rst.join(', ');
  }

  getShortNameByMergedCode(mCode) {
    var rst = [];
    var list = this.getList();
    list.forEach(function(item){
      if( (item.Code & mCode ) > 0){
        rst.push(item.ShortName);
      }
    });
    return rst.join(', ');
  }

  getArrayByMergedCode(mCode) {
    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item){
      if( (item.Code & mCode ) > 0){
        rst.push(item);
      }
    });
    return rst;
  }

  getNameByJoinedCode(mCode) {
    var codes = [];
    if(mCode){
      codes = mCode.split(',');
    }

    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item){
      if( (codes.indexOf(item.Code)) > -1 ){
        rst.push(item.DisplayName);
      }
    });

    return rst.join(', ')
  }

  getUISelectionList(inList) {
    var newList = [];

    var list = inList?inList:this.getList();
    for (var i in list) {
      var item = list[i];
      newList.push({
        name: item.DisplayName,
        value: item.Code,
        item: item,
        selected: false
      })
    }

    return newList;
  }

  toCheckSource(lists) {
    return new CheckHelper(lists?lists:this.getList());
  }

}

class CheckHelper extends BaseLookup{
  constructor(lists, initValue) {
    super();
    this._lists = lists;
    if(initValue){
      this.setSelected(initValue);
    }
  }

  setSelected(v){
    this._lists.forEach(function(item){
      if( (item.Code & v) == item.Code){
        item.selected = true;
      }
    });
  }

  setUNSelect(v) {
    this._lists.forEach(function(item){
      if( (item.Code & v) > 0){
        item.selected = false;
      }
    });
  }

  getSelectedNames(v){
    var rst = [];
    var list = this.getSelectedLists(v);
    list.forEach(function(item){
      rst.push(item.DisplayName);
    });
    return rst;
  }

  getSelectedLists(v) {
    var rst = [];
    this._lists.forEach(function(item){
      if(!v && v != 0){
        if( item.selected ){
          rst.push(item);
        }
      }else{
        if( (item.Code & v) > 0 ){
          rst.push(item);
        }
      }

    });
    return rst;
  }

  getSelectedValue(){
    var v = 0;
    this._lists.forEach(function(item){
      if (item.selected) {
        v = v | item.Code;
      }
    });
    return v;
  }
}

// LookUp - DataSourceType
class DataSourceType extends BaseLookup {
  constructor() {
    super();
    this.CONSUMER={Code:'10',id:10,DisplayName:'Consumer '};
    this.BUSINESS={Code:'20',id:20,DisplayName:'Business'};
    this.NEW_MOVER={Code:'30',id:30,DisplayName:'New Mover '};
    this.OCCPUANT={Code:'40',id:40,DisplayName:'Occpuant'};
    this.NEW_HOMEOWNER={Code:'50',id:50,DisplayName:'New Homeowner'};
  };

  generateList(){
    return [
      this.CONSUMER,
      this.BUSINESS,
      this.NEW_MOVER,
      this.OCCPUANT,
      this.NEW_HOMEOWNER
    ];
  }
};

class StatusIntYNType extends BaseLookup{
  generateList(){
    return [
      {Code: 0, DisplayName:'N'},
      {Code: 1, DisplayName:'Y'}
    ];
  }
};

class StatusBoolYNType extends BaseLookup{
  generateList(){
    return [
      {Code: false , DisplayName:'N'},
      {Code: true  , DisplayName:'Y'}
    ];
  }
};

class RoleType extends BaseLookup{
  generateList(){
    return [
      {Code: 1, DisplayName:'系统管理'},
      {Code: 2, DisplayName:'运营维护'}
    ];
  }
};

class BAStatusType extends BaseLookup{
  constructor() {
    super();
    this.ZUOFEI={Code:"0",DisplayName:'作废'};
    this.CAOGAO={Code:"10",DisplayName:'草稿'};
    this.DAISHENHE={Code:"20",DisplayName:'待审核'};
    this.WUXIAO={Code:"28",DisplayName:'无效'};
    this.DAIZHIXIN={Code:"40",DisplayName:'待执行'};
    this.YOUXIAO={Code:"41",DisplayName:'有效'};
    this.ZHIXINZHONG={Code:"50",DisplayName:'执行中'};
    this.ZANTING={Code:"55",DisplayName:'暂停'};
    this.JIESU={Code:"60",DisplayName:'结束'};
    this.GUANBI={Code:"99",DisplayName:'关闭'};
  };

  generateList(){
    return [
      this.ZUOFEI,
      this.CAOGAO,
      this.DAISHENHE,
      this.WUXIAO,
      this.DAIZHIXIN,
      this.YOUXIAO,
      this.ZHIXINZHONG,
      this.ZANTING,
      this.JIESU,
      this.GUANBI
    ];
  }
};

class TPCategoriesType extends BaseLookup{
  generateList(){
    return [
      {Code: "10", DisplayName:'生日关怀'},
      {Code: "20", DisplayName:'里程碑关怀'},
      {Code: "30", DisplayName:'流失挽回'},
      {Code: "40", DisplayName:'荣耀专场'},
      {Code: "50", DisplayName:'新草必拔'},
      {Code: "60", DisplayName:'平日特惠'},
      {Code: "70", DisplayName:'每日撩我'}
    ];
  }
};

class TPType extends BaseLookup{
  generateList(){
    return [
      {Code: "1", DisplayName:'满减'},
      {Code: "2", DisplayName:'满折'},
      {Code: "3", DisplayName:'抵用券'},
      {Code: "4", DisplayName:'一口价'}
    ];
  }
};

class WeekType extends BaseLookup{
  generateList(){
    return [
      {Code: "0", DisplayName:'星期一'},
      {Code: "1", DisplayName:'星期二'},
      {Code: "2", DisplayName:'星期三'},
      {Code: "3", DisplayName:'星期四'},
      {Code: "4", DisplayName:'星期五'},
      {Code: "5", DisplayName:'星期六'},
      {Code: "6", DisplayName:'星期日'}
    ];
  }
};

class PeriodicType extends BaseLookup{
  generateList(){
    return [
      {Code:"0", DisplayName: "一次性活动"},
      {Code:"1", DisplayName: "周期性活动"}
    ];
  }
}

class SendViaType extends BaseLookup{
  generateList(){
    return [
      {Code:"SMS", DisplayName: "短信"},
      {Code:"WeChat", DisplayName: "公众号"},
      {Code:"APP", DisplayName: "APP推送"},
    ];
  }
}

class RegionLevelType extends BaseLookup{
  generateList(){
    return [
      {Code:"1", DisplayName: "大区", ShortName:"REGION"},
      {Code:"2", DisplayName: "省份", ShortName:"PROV"},
      {Code:"3", DisplayName: "城市", ShortName:"CITY"},
      {Code:"4", DisplayName: "区/县", ShortName:"COUNTY"},
      {Code:"5", DisplayName: "门店", ShortName:"OUTLETS"},

    ];
  }
}

class PhoneStatusType extends BaseLookup{
  generateList(){
    return [
      {Code:"0", DisplayName: "未发送"},
      {Code:"1", DisplayName: "发送成功"},
      {Code:"2", DisplayName: "已使用"},
    ];
  }
}

class UserGenreType extends BaseLookup{
  constructor() {
    super();
    this.PTGL={Code:1,DisplayName:'平台管理员'};
    this.PTYY={Code:2,DisplayName:'平台运营专员'};
    this.GSGL={Code:3,DisplayName:'公司管理员'};
    this.GSYY={Code:4,DisplayName:'公司运营专员'};
    this.DQYY={Code:5,DisplayName:'分区运营专员'};
    this.DZ={Code:6,DisplayName:'店长'};
    this.DG={Code:7,DisplayName:'导购'};
  };

  generateList(){
    return [
      this.PTGL,
      this.PTYY,
      this.GSGL,
      this.GSYY,
      this.DQYY,
      this.DZ,
      this.DG
    ];
  }
}


var lookups = {
  BaseLookUp: new BaseLookup(),
  DataSourceType: new DataSourceType(),
  StatusIntYNType: new StatusIntYNType(),
  StatusBoolYNType: new StatusBoolYNType(),
  RoleType: new RoleType(),
  BAStatusType: new BAStatusType(),
  TPCategoriesType: new TPCategoriesType(),
  TPType: new TPType(),
  WeekType: new WeekType(),
  PeriodicType: new PeriodicType(),
  SendViaType: new SendViaType(),
  PhoneStatusType: new PhoneStatusType(),
  UserGenreType: new UserGenreType()
}

// module.exports = lookups;

// Object.assign(exports, lookups);

export default lookups;

// module.exports = lookups;


//export default lookups;

