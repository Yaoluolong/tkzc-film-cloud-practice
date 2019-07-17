import { getCompanyList } from '@/api/systemSetting'
import { getCustomerList, getMemberList } from '@/api/operationCenter'
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
    selectApi: getMemberList
  },
  channelList: { // 商家
    selectApi: getChannelList
  }
}
