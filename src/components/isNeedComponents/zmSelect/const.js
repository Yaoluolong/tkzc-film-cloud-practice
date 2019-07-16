import { getCompanyList } from '@/api/systemSetting'
import { getCustomerList } from '@/api/operationCenter'

// 接口类型,name默认name,id默认value
export const apiType = {
  companyList: { // 公司
    selectApi: getCompanyList
  },
  customerList: { // 客户
    selectApi: getCustomerList
  }
}
