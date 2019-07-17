import Layout from '../views/layout/Layout'
export default [
  {
    path: 'user_mgr',
    component: Layout,
    meta: { title: '会员管理', icon: 'huiyuan' },
    children: [
      {
        path: 'member_list',
        name: 'member_list',
        component: () => import('@/views/operation_center/user_mgr/member_list'),
        meta: { title: '线上会员', icon: '' }
      },
      {
        path: 'member_list/edit',
        name: 'edit_member',
        hidden: true,
        component: () => import('@/views/operation_center/user_mgr/member_list/EditMember'),
        meta: { title: '编辑会员', icon: '' }
      },
      {
        path: 'member_list/detail',
        name: 'member_detail',
        hidden: true,
        component: () => import('@/views/operation_center/user_mgr/member_list/MemberDetail'),
        meta: { title: '会员详情', icon: '' }
      }
    ]
  },
  {
    path: 'advertising',
    component: Layout,
    meta: { title: '广告管理', icon: 'coupon' },
    children: [
      {
        path: 'banner_list',
        name: 'banner_list',
        component: () => import('@/views/operation_center/advertising/banner_list'),
        meta: { title: 'Banner管理', icon: '' }
      },
      {
        path: 'banner_list/:operType',
        name: 'edit_banner',
        hidden: true,
        component: () => import('@/views/operation_center/advertising/banner_list/EditBanner'),
        meta: { title: 'Banner', icon: '' }
      }
    ]
  },
  {
    path: 'activity_mgr',
    component: Layout,
    meta: { title: '活动管理', icon: 'news' },
    children: [
      {
        path: 'activity_list',
        name: 'activity_list',
        component: () => import('@/views/operation_center/activity_mgr/activity_list'),
        meta: { title: '活动管理', icon: '' }
      }, {
        path: 'activity_list/:operType',
        name: 'edit_activity',
        hidden: true,
        component: () => import('@/views/operation_center/activity_mgr/activity_list/EditActivity'),
        meta: { title: '活动管理', icon: '' }
      }, {
        path: 'view_activity_detail',
        name: 'view_activity_detail',
        hidden: true,
        component: () => import('@/views/operation_center/activity_mgr/activity_list/ViewActivityDetail'),
        meta: { title: '活动明细', icon: '' }
      }, {
        path: 'view_activity_approval_detail',
        name: 'view_activity_approval_detail',
        hidden: true,
        component: () => import('@/views/operation_center/activity_mgr/activity_list/ViewActivityApprovalDetail'),
        meta: { title: '活动规则配置明细', icon: '' }
      }, {
        path: 'activity_approval_list',
        name: 'activity_approval_list',
        component: () => import('@/views/operation_center/activity_mgr/activity_approval_list'),
        meta: { title: '活动审核列表', icon: '' }
      }, {
        path: 'activity_approval_detail',
        name: 'activity_approval_detail',
        hidden: true,
        component: () => import('@/views/operation_center/activity_mgr/activity_approval_list/ActivityApprovalDetail'),
        meta: { title: '活动明细', icon: '' }
      }
    ]
  },
  {
    path: 'coupon_mgr',
    component: Layout,
    meta: { title: '电影券管理', icon: 'coupon' },
    children: [
      {
        path: 'coupon_order',
        name: 'coupon_order',
        component: () => import('@/views/operation_center/coupon_mgr/coupon_order'),
        meta: { title: '销售电影券', icon: '' }
      },
      {
        path: 'coupon_order/:operType',
        name: 'create_coupon_order',
        hidden: true,
        component: () => import('@/views/operation_center/coupon_mgr/coupon_order/CreateOrder'),
        meta: { title: '生成订单', icon: '' }
      },
      {
        path: 'sell_register',
        name: 'coupon_sell_register',
        hidden: true,
        component: () => import('@/views/operation_center/coupon_mgr/coupon_order/SellRegister'),
        meta: { title: '销售登记', icon: '' }
      },
      {
        path: 'sell_detail',
        name: 'coupon_sell_detail',
        hidden: true,
        component: () => import('@/views/operation_center/coupon_mgr/coupon_order/SellDetail'),
        meta: { title: '销售明细', icon: '' }
      },
      {
        path: 'unsold_coupon_list',
        name: 'unsold_coupon_list',
        component: () => import('@/views/operation_center/coupon_mgr/unsold_coupon_list'),
        meta: { title: '未销售券库', icon: '' }
      },
      {
        path: 'unsold_coupon_detail',
        name: 'unsold_coupon_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/unsold_coupon_list/UnsoldCouponDetail'),
        meta: { title: '查看明细', icon: '' }
      },
      {
        path: 'sold_coupon_list',
        name: 'sold_coupon_list',
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list'),
        meta: { title: '销售电影券列表', icon: '' }
      },
      {
        path: 'sold_coupon_list/:operType',
        name: 'sold_coupon',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list/SoldCoupon'),
        meta: { title: '销售电影券', icon: '' }
      },
      /* {
        path: 'sold_coupon_list/create_sold_coupon_order',
        name: 'create_sold_coupon_order',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list/CreateOrder'),
        meta: { title: '销售电影券', icon: '' }
      },*/
      /* {
        path: 'sold_coupon_list/:operType',
        name: 'edit_coupon_order',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list/EditOrder'),
        meta: { title: '未审核电影券', icon: '' }
      },*/
      {
        path: 'get_sale_coupon_list',
        name: 'get_sale_coupon_list',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list/SoldCouponDetail'),
        meta: { title: '销售单明细', icon: '' }
      },
      {
        path: 'submit_audit',
        name: 'submit_audit',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list/SubmitAudit'),
        meta: { title: '提出审核', icon: '' }
      },
      {
        path: 'progress_details',
        name: 'progress_details',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/sold_coupon_list/ProgressDetails'),
        meta: { title: '审核明细', icon: '' }
      },
      {
        path: 'progress_order',
        name: 'progress_order',
        component: () => import('@/views/operation_center/coupon_mgr/progress_order'),
        meta: { title: '审核销售单', icon: '' }
      },
      {
        path: 'progress_order_submit',
        name: 'progress_order_submit',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/progress_order/ProgressOrder'),
        meta: { title: '审核信息', icon: '' }
      },
      {
        path: 'progress_sell_register',
        name: 'progress_sell_register',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/progress_order/SellRegister'),
        meta: { title: '订单信息', icon: '' }
      },
      {
        path: 'coupon_list',
        name: 'coupon_list',
        component: () => import('@/views/operation_center/coupon_mgr/coupon_list'),
        meta: { title: '已销售电影券列表', icon: '' }
      },
      {
        path: 'coupon_detail',
        name: 'coupon_detail',
        hidden: true,
        component: () => import('@/views/operation_center/coupon_mgr/coupon_list/CouponDetail'),
        meta: { title: '电影券详情', icon: '' }
      },
      {
        path: 'coupon_program',
        name: 'coupon_program',
        component: () => import('@/views/operation_center/coupon_mgr/coupon_program'),
        meta: { title: '电影券线上使用规则', icon: '' }
      },
      {
        path: 'coupon_program/:operType',
        name: 'edit_coupon_program',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/coupon_program/EditCouponProgram'),
        meta: { title: '电影券线上使用规则', icon: '' }
      },
      {
        path: 'view_program',
        name: 'view_program',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/coupon_mgr/coupon_program/ViewProgram'),
        meta: { title: '查看已审核规则', icon: '' }
      },
      {
        path: 'coupon_apply',
        name: 'coupon_apply',
        component: () => import('@/views/operation_center/coupon_mgr/coupon_apply'),
        meta: { title: '分销商券申请', icon: '' }
      }
    ]
  },
  {
    path: 'gift_card',
    component: Layout,
    meta: { title: '礼品卡/电影卡管理', icon: 'gift_card' },
    children: [
      /* --------------------------------------  修改 ------------------------------------------ */
      {
        path: 'unsold_card_list',
        name: 'gift_card_unsold_card_list',
        component: () => import('@/views/operation_center/gift_card/unsold_card_list'),
        meta: { title: '未销售卡库', icon: '' }
      },
      {
        path: 'unsold_card_detail',
        name: 'gift_card_unsold_card_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/unsold_card_list/UnsoldCardDetail'),
        meta: { title: '未销售卡明细', icon: '' }
      },
      // -----------------------
      {
        path: 'sold_card_list',
        name: 'gift_card_sold_card_list',
        component: () => import('@/views/operation_center/gift_card/sold_card_list'),
        meta: { title: '销售电影卡', icon: '' }
      },
      {
        path: 'sold_card_list/:operType',
        name: 'sold_card',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/sold_card_list/SoldCard'),
        meta: { title: '销售电影卡', icon: '' }
      },
      /* {
        path: 'create_sold_card_order',
        name: 'gift_card_create_sold_card_order',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/sold_card_list/CreateOrder'),
        meta: { title: '销售电影卡', icon: '' }
      },*/
      {
        path: 'edit_card_order',
        name: 'gift_card_edit_card_order',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/sold_card_list/EditOrder'),
        meta: { title: '编辑未审核电影卡', icon: '' }
      },
      {
        path: 'submit_audit',
        name: 'gift_card_submit_audit',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/sold_card_list/SubmitAudit'),
        meta: { title: '提交审核', icon: '' }
      },
      {
        path: 'progress_details',
        name: 'gift_card_progress_details',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/sold_card_list/ProgressDetails'),
        meta: { title: '电影卡审核明细', icon: '' }
      },
      {
        path: 'get_sale_card_list',
        name: 'get_sale_card_list',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/sold_card_list/SoldCardDetail'),
        meta: { title: '销售电影卡单明细', icon: '' }
      },
      // -----------------------
      {
        path: 'progress_order',
        name: 'card_progress_order',
        component: () => import('@/views/operation_center/gift_card/progress_order'),
        meta: { title: '审核销卡售单', icon: '' }
      },
      {
        path: 'progress_order_submit',
        name: 'card_progress_order_submit',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/progress_order/ProgressOrder'),
        meta: { title: '审核信息', icon: '' }
      },
      {
        path: 'progress_sell_register',
        name: 'card_progress_sell_register',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/gift_card/progress_order/SellRegister'),
        meta: { title: '财务复审', icon: '' }
      },
      /* --------------------------------------  修改 end ------------------------------------------ */
      /* {
        path: 'gift_card_category',
        name: 'gift_card_category',
        component: () => import('@/views/operation_center/gift_card/gift_card_category'),
        meta: { title: '卡品类', icon: '' }
      },
      {
        path: 'gift_card_category/:operType',
        name: 'edit_gift_card_category',
        hidden: true,
        component: () => import('@/views/operation_center/gift_card/gift_card_category/EditGiftCardCategory'),
        meta: { title: '卡品类', icon: '' }
      },
      {
        path: 'sell_card',
        name: 'sell_card',
        component: () => import('@/views/operation_center/gift_card/sell_card'),
        meta: { title: '销售卡', icon: '' }
      },
      {
        path: 'sell_card/:operType',
        name: 'create_card_order',
        hidden: true,
        component: () => import('@/views/operation_center/gift_card/sell_card/CreateOrder'),
        meta: { title: '生成订单', icon: '' }
      },

      {
        path: 'sell_register',
        name: 'sell_register',
        hidden: true,
        component: () => import('@/views/operation_center/gift_card/progress_order/SellRegister'),
        meta: { title: '财务复审', icon: '' }
      },
      {
        path: 'sell_detail',
        name: 'sell_detail',
        hidden: true,
        component: () => import('@/views/operation_center/gift_card/sell_card/SellDetail'),
        meta: { title: '销售明细', icon: '' }
      },*/
      {
        path: 'card_list',
        name: 'card_list',
        component: () => import('@/views/operation_center/gift_card/card_list'),
        meta: { title: '礼品卡/电影卡列表', icon: '' }
      },
      {
        path: 'card_detail',
        name: 'card_detail',
        hidden: true,
        component: () => import('@/views/operation_center/gift_card/card_list/CardDetail'),
        meta: { title: '卡详情', icon: '' }
      },
      {
        path: 'card_recharge_program',
        name: 'card_recharge_program',
        component: () => import('@/views/operation_center/gift_card/card_program'),
        meta: { title: '电影卡充值规则', icon: '' }
      },
      {
        path: 'card_recharge_program/:operType',
        name: 'card_recharge_create',
        hidden: true,
        component: () => import('@/views/operation_center/gift_card/card_program/CreateCardProgram'),
        meta: { title: '电影卡充值规则', icon: '' }
      }
    ]
  },
  {
    path: 'paltform_trading_alerts_mgr',
    component: Layout,
    meta: { title: '平台预警管理', icon: 'warning' },
    children: [
      {
        path: 'channel_trading_alerts',
        name: 'channel_trading_alerts',
        component: () => import('@/views/operation_center/tradingAlerts_mgr/channelTradingAlerts'),
        meta: { title: '平台预警管理', icon: '' }
      },
      {
        path: 'channel_trading',
        name: 'channel_trading',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/tradingAlerts_mgr/channelTradingAlerts/ChannelTrading'),
        meta: { title: '设置平台商家交易预警', icon: '' }
      },
      {
        path: 'not_in_force_trading',
        name: 'not_in_force_trading',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/tradingAlerts_mgr/channelTradingAlerts/NotInForceTrading'),
        meta: { title: '预警未生效', icon: '' }
      },
      {
        path: 'reach_alerts',
        name: 'reach_alerts',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/tradingAlerts_mgr/channelTradingAlerts/ReachAlerts'),
        meta: { title: '触警', icon: '' }
      },
      {
        path: 'view_account_detail',
        name: 'view_account_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/tradingAlerts_mgr/channelTradingAlerts/ViewAccountDetail'),
        meta: { title: '触警', icon: '' }
      }
    ]
  },
  {
    path: 'marketing_activities',
    component: Layout,
    meta: { title: '营销活动', icon: 'huiyuan' },
    children: [
      {
        path: 'activities_mgr',
        name: 'activities_mgr',
        component: () => import('@/views/operation_center/marketing_activities/activities_mgr'),
        meta: { title: '营销活动管理', icon: '' }
      },
      {
        path: 'activities_mgr/:operType',
        name: 'edit_activities',
        hidden: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_mgr/EditActivities'),
        meta: { title: '营销活动', icon: '' }
      },
      {
        path: 'activities_Detail',
        name: 'activities_Detail',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_mgr/activitiesDetail'),
        meta: { title: '活动明细', icon: '' }
      },
      {
        path: 'view_activities_Details',
        name: 'view_activities_Details',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_mgr/ViewActivitiesDetails'),
        meta: { title: '活动详情', icon: '' }
      },
      {
        path: 'activities_approval',
        name: 'activities_approval',
        component: () => import('@/views/operation_center/marketing_activities/activities_approval'),
        meta: { title: '营销审批管理', icon: '' }
      },
      {
        path: 'activities_approval_edit',
        name: 'activities_approval_edit',
        hidden: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_approval/ActivitiesApprovalEdit'),
        meta: { title: '审核页面', icon: '' }
      },
      {
        path: 'activities_warn',
        name: 'activities_warn',
        component: () => import('@/views/operation_center/marketing_activities/activities_warn'),
        meta: { title: '活动预警列表', icon: '' }
      },
      {
        path: 'activities_warn_setting',
        name: 'activities_warn_setting',
        hidden: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_warn/WarningSetting'),
        meta: { title: '设置预警', icon: '' }
      },
      {
        path: 'view_check_account',
        name: 'view_check_account',
        hidden: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_warn/ViewCheckAccount'),
        meta: { title: '营销活动对账', icon: '' }
      },
      {
        path: 'activities_accounts',
        name: 'activities_accounts',
        component: () => import('@/views/operation_center/marketing_activities/activities_accounts'),
        meta: { title: '活动对账列表', icon: '' }
      },
      {
        path: 'check_accounts',
        name: 'check_accounts',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_accounts/CheckAccounts'),
        meta: { title: '对账', icon: '' }
      },
      {
        path: 'suppl_advance_pay',
        name: 'suppl_advance_pay',
        hidden: true,
        props: true,
        component: () => import('@/views/operation_center/marketing_activities/activities_accounts/SupplAdvancePay'),
        meta: { title: '补充活动款对账', icon: '' }
      }
    ]
  }

]
