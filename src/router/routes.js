/**
 * Created by clude on 3/16/17.
 */
import Login from '../pages/auth/Login.vue'
import NotFound from '../pages/sys/404.vue'
import Home from '../pages/_layouts/Main.vue'
import Main from '../pages/Main.vue'
import Table from '../pages/demo/Table.vue'
import Form from '../pages/demo/Form.vue'
import user from '../pages/demo/user.vue'
import echarts from '../pages/rpt/echarts.vue'
import User from '../pages/sys/user/User.vue'
import Download from '../pages/sys/download/Download.vue';

import AudienceList from '../pages/audience/AudienceList.vue'
import AudienceManager from '../pages/audience/AudienceManager.vue'
import AudienceDemography from  '../pages/audience/Demography.vue'

import PromoTrace from '../pages/promo/CampaignTrace.vue'
import PromoCampaignList from '../pages/promo/CampaignList.vue'
import SmsList from '../pages/sys/sms/SmsList.vue'
import ShortLink from '../pages/sys/short/ShortLink.vue'
import CustomerManage from '../pages/sys/customer/customerManage.vue';
import editWxFrontPage from '../pages/sys/customer/editWxFrontPage.vue';
import FormReport from '../pages/rpt/report.vue'
const SmsTemplate = resolve => require(['../pages/sys/sms/sms_template_list.vue'], resolve);
const CampaignNew = resolve => require(['../pages/promo/CampaignNew.vue'], resolve);

import TaskList from '../pages/task/tasklist/taskList.vue';
import CreateTask from '../pages/task/tasklist/createTask.vue';
import TaskDetail from '../pages/task/tasklist/taskDetail.vue';
// import RoleList from '../pages/sys/roles/RoleList.vue'

import ItemList from '../pages/items/ItemList.vue';
import ItemDetail from '../pages/items/ItemDetail.vue';

import TreeDemo from '../pages/demo/tree.vue'
import FilterDemo from '../pages/demo/FilterDemo.vue'
import ShoppingGuide from '../pages/sys/user/ShoppingGuide.vue';

import StoresList from '../pages/sys/stores/StoresList.vue';
// 异步加载
const RoleList = resolve => require(['../pages/sys/roles/RoleList.vue'], resolve);

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '系统管理',
    iconcls: 'el-icon-message',//图标样式class
    children: [
      {path: '/main', component: Main, name: '主页', hidden: true},
      { path: '/sys/user', component: User, name: '用户列表',hidden: true },
      { path: '/sms/list', component: SmsList,  name: '短信列表' },
      { path: '/short-link/list', component: ShortLink,  name: '短链列表' },
      { path: '/sys/customer', component: CustomerManage,  name: '客户管理'},
      { path: '/sys/customer/editWxFrontPage/:id', component: editWxFrontPage, name: '修改公众号主页', hidden: true },
      { path: '/sys/guide', component: ShoppingGuide, name: '导购管理',hidden: true },
      { path: '/ba/outlets/list', component: StoresList, name: '门店管理',hidden: true }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '会员',
    iconcls: 'el-icon-message',//图标样式class
    children: [
      { path: '/audience/list', component: AudienceList, name: '会员管理' },
      { path: '/audience/manager', component: AudienceManager, name: '会员概览' },
      { path: '/audience/demography', component: AudienceDemography, name: '人群管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '活动',
    iconcls: 'el-icon-message',//图标样式class
    children: [
      { path: '/promo/list', component: PromoCampaignList, name: '促销活动列表'},
      { path: '/promo/trace/:id', component: PromoTrace, name: '促销活动跟踪' },
      { path: '/promo/campaign', component: CampaignNew, name: '发起促销活动'},
      { path: '/promo/campaign/:id', component: CampaignNew, name: '编辑出活动'},
    ]
  },
  {
    path: '/',
    component: Home,
    name: '报表',
    iconcls: 'fa fa-bar-chart',
    children: [
      { path: '/echarts', component: FormReport, name: 'echarts' },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '短信',
    iconcls: 'el-icon-message',
    children: [
      { path: '/sms/list', component: SmsList,  name: '短信列表' },
      { path: '/sms/template', component: SmsTemplate,  name: '短信模板' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '任务管理',
    iconcls: 'el-icon-message',
    children: [
      { path: '/pa/task-plan/list', component: TaskList,  name: '任务列表' },
      { path: '/pa/task-plan/create', component: CreateTask,  name: '创建推送任务' },
      { path: '/pa/task-plan/detail', component: TaskDetail,  name: '任务详情' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '商品管理',
    iconcls: 'el-icon-message',
    children: [
      { path: 'sp/items/list', component: ItemList,  name: '商品列表' },
      { path: 'sp/items/detail', component: ItemDetail,  name: '修改商品' }
    ]
  },
  {
    isDemo: true,  // 方便开发，isDemo为true后， 在开发模式下，不管后台有无配置，该菜单都会自动在总导航菜单上出现
    path: '/',
    component: Home,
    name: '测试页面',
    iconcls: 'el-icon-message',//图标样式class
    children: [
      { path: '/demo/table', component: Table, name: 'Table' },
      { path: '/demo/form', component: Form, name: 'Form' },
      { path: '/demo/user', component: user, name: '列表' },
      { path: '/sys/roles', component: RoleList, name: '角色列表' },
      { path: '/demo/tree', component: TreeDemo, name: '树型结构' },
      { path: '/demo/filters', component: FilterDemo, name: 'Filters显示' },
    ]
  },
  {
    path: '/download',
    component: Download,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '活动',
    iconcls: 'el-icon-message',
    children: [
      { path: '/campaign/v2', component: CampaignNew,  name: '创建活动' },
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
];

export default routes;
