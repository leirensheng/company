import supports from '../supports'
const $fetch = supports.$fetch;

class paApi {
  getTaskPlanList(userId,params,pager) {
    var param = {userId: userId};
    var postData = {
      noPager: true,
      page: {
      current: 1,
        size: 10,
        orderByField:"id",
        asc:false
    },
      params: {
      ownerType: params.excuteObj,
      status: params.taskStatus,
      taskType: params.taskType,
      companyCode:params.companyCode
    }
    };
    if(pager && pager.pageSize){
      postData.page.size = pager.pageSize;
    };
    if(pager && pager.currentPage){
      postData.page.current = pager.currentPage;
    };
    return $fetch.post("/crm/api/pa/task-plan/list", postData, {params:param});
  }

  getTaskType(params){
    return $fetch.get("/crm/api/pa/task-types/list",params)
  }

  getPartition(params){
    return $fetch.get("/crm/api/ba/regions/list-by-user-id",params)
  }

  deleteTaskPlan(id){
    let postData = {
      id:id
    };
    return $fetch.delete("/crm/api/pa/task-plan",{params:postData})
  }

  confirmTask(id){
    let postData = {
      id:id
    };
    return $fetch.get("/crm/api/pa/task-plan/confirm-task", {params:postData});
  }

  cancelTask(id){
    let postData = {
      id:id
    };
    return $fetch.get("/crm/api/pa/task-plan/cancel-task", {params:postData});
  }

  finishTask(id){
    let postData = {
      id:id
    };
    return $fetch.get("/crm/api/pa/task-plan/finish-task", {params:postData});
  }

  getTaskDetail(id){
    let postData = {
      id:id
    };
    return $fetch.get("/crm/api/pa/task-plan/detail", {params:postData});
  }

  uploadShareImg(params){
    return $fetch.postForm("/crm/api/pa/uploadImg", {params:params});
  }

  submitTaskForm(params){
    return $fetch.post("/crm/api/pa/task-plan/add", params);
  }

  updateTaskForm(params){
    return $fetch.post("/crm/api/pa/task-plan/update", params);
  }
}

export default new paApi;
