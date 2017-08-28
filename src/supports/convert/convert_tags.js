/**
 * Created by Dragon on 4/11/17.
 */
import $vx from '../util/vx'
import * as filtersApi from '../filter/filters'

import * as provinceCityCountyData from '../../assets/json/province_city_county.json'
import * as tagValues from '../../assets/json/tag_values.json'
import commonApi from '../../api/common'

let companyValues = {}, regionValues = {}, outletValues= {}, listsValues = {};

let companyMenuList = $vx.sessionStorage.getItem('sessionCompanyMenu');
if (companyMenuList) {
  companyMenuList.forEach((company) =>{
    companyValues[(company.id).toString()] = company.companyName;
  });
}else {
  commonApi.getCompanies().then(res =>{
    res.data.forEach((company) =>{
      companyValues[(company.id).toString()] = company.companyName;
    })
  })
}

const converts = {

  convertBase:(source, k , v=null)=>{
    if (!v)
      return source.hasOwnProperty(k) ? source[k] : '';
    return source.hasOwnProperty(k) && source[k].hasOwnProperty(v) ? source[k][v] : '';
  },

  convertNothing:(k,v) =>{
    return v;
  },

  convertFloat:(k, v) =>{
    return v == null ? '' : parseFloat(v).toFixed(2);
  },

  convertTagValueMult:(k, vs) =>{
    return vs.map(v=>{
      return converts.convertTagValue(k,v);
    }).join("、");
  },

  //转换tag_value表的desc
  convertTagValue:(k, v) =>{
    return converts.convertBase(tagValues, k, v);
  },

  //转换日期
  convertDate:(k, v, formatter='yyyy-MM-dd') =>{
    return v == null ? '' :$vx.date.format(new Date(v), formatter);
  },

  //转换公司 ArrayLit
  covertCompanyMult:(k,vs) =>{
    return vs.map(v=>{
      return converts.covertCompany(k,v);
    }).join("、");
  },

  //转换公司
  covertCompany:(k,v) =>{
    return converts.convertBase(companyValues, v);
  },

  //转换大区 ArrayLit
  convertRegionMult:(k,vs) =>{
    return vs.map(v=>{
      return converts.convertRegion(k,v);
    }).join("、");
  },

  //转换大区
  convertRegion:(k,v) =>{
    return converts.convertBase(regionValues, k, v);
  },

  //转换省份 ArrayLit
  convertProvinceMult:(k,vs) =>{
    return vs.map(v=>{
      return converts.convertProvince(k,v);
    }).join("、");
  },

  //转换省份
  convertProvince:(k, v) =>{
    return converts.convertBase(provinceCityCountyData, v);
  },

  //转换城市 ArrayLit
  convertCityMult:(k,vs) =>{
    return vs.map(v=>{
      return converts.convertCity(k,v);
    }).join("、");
  },

  //转换城市
  convertCity:(k, v) =>{
    return converts.convertBase(provinceCityCountyData, v);
  },

  //转换区县 ArrayLit
  convertCountyMult:(k,vs) =>{
    return vs.map(v=>{
      return converts.convertCity(k,v);
    }).join("、");
  },

  //转换区县
  convertCounty:(k,v) =>{
    return converts.convertBase(provinceCityCountyData, v);
  },

  //转换门店 ArrayLit
  convertOutletMult:(k,vs) =>{
    return vs.map(v=>{
      return converts.convertOutlet(k,v);
    }).join("、");
  },

  //转换门店
  convertOutlet:(k,v) =>{
    return converts.convertBase(outletValues, k, v);
  },

  //转换货币
  convertCurrency:(k,v) =>{
    return filtersApi.currency(v);
  },

  //转换人群
  convertLists:(k,v) =>{
    return converts.convertBase(listsValues, k, v);
  }





};

export default converts;



