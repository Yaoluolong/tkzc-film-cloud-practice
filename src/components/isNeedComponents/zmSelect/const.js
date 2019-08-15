import { getCompanyList } from '@/api/systemSetting'
import { getCustomerList, getMemberList, getResellerList } from '@/api/operationCenter'
import { getChannelList } from '@/api/mallCenter'
// 接口类型,name默认name,id默认value
export const apiType = {
  companyList: { // 公司
    selectApi: getCompanyList
  },
  customerList: { // 客户
    selectApi: getCustomerList
  },
  memberList: { // 业务员
    id: 'id',
    name: 'realName',
    selectApi: getMemberList
  },
  channelList: { // 商家
    selectApi: getChannelList
  },
  getResellerList: { // 分销商下拉列表
    selectApi: getResellerList
  }
}
