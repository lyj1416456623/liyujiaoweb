import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/courseList'
    },
    {
      path: '/managelogin',
      name: 'login',
      component: resolve => require(['../views/login/Index'],resolve),
      meta: {
        title: '登录-子曰语文'
      }
    },
    {
      path: '/dinglogin',
      name: 'dinglogin',
      component: resolve => require(['../views/login/DingLogin'],resolve),
      meta: {
        title: '首页-子曰语文'
      }
    },
    {
      path: '/manageIndex',
      component: resolve => require(['../views/manage/Index'],resolve),
      children: [
        {
          path: '',
          name: '首页',
          component: resolve => require(['../views/home/Index'],resolve),
          meta: {
            title: '首页-子曰语文'
          }
        },
        {
          path: '/manage',
          name: '身份与权限',
          component: resolve => require(['../views/authority/Index'],resolve),
          meta: {
            title: '身份与权限-子曰语文'
          }
        },
        {
          path: '/classManage',
          name: '我的班级',
          component: resolve => require(['../views/classmanage/Index'],resolve),
          meta: {
            title: '我的班级-子曰语文'
          }
        },
        {
          path: '/classDetail/:id',  //班级id
          name: '班级详情',
          component: resolve => require(['../views/classmanage/Detail'],resolve),
          meta: {
            title: '班级详情-子曰语文'
          }
        },
        {
          path: '/classHomework/:classId/:homeworkRecordId/:lessonName/:studentName/:teacherName',  // 班级详情中,查看作业详情
          name: '班级详情中查看作业',
          component: resolve => require(['../views/classmanage/HomeworkDetail'],resolve),
          meta: {
            title: '学生作业-子曰语文'
          }
        },
        {
          path: '/courseManage',
          name: '课程管理',
          component: resolve => require(['../views/coursemanage/Index'],resolve),
          meta: {
            title: '课程管理-子曰语文'
          }
        },
        {
          path: '/courseDetail/:id',
          name: '课程详情',
          component: resolve => require(['../views/coursemanage/Detail'],resolve),
          meta: {
            title: '课程详情-子曰语文'
          }
        },
        {
          path: '/lessonList/:course/:class/:className',  // course--courseid ; class--classId ;className;
          name: '课节列表',
          component: resolve => require(['../views/coursemanage/LessonList'],resolve),
          meta: {
            title: '课节列表-子曰语文'
          }
        },
        {
          path: '/lessonAdd/:class/:lesson',  // class--classId ; lesson--lessonId,-1表示新建,其他值表示编辑;
          name: '添加课节',
          component: resolve => require(['../views/coursemanage/LessonAdd'],resolve),
          meta: {
            title: '添加课节-子曰语文'
          }
        },
        {
          path: '/studentManage',
          name: '学生管理',
          component: resolve => require(['../views/studentmanage/Index'],resolve),
          meta: {
            title: '学生管理-子曰语文'
          }
        },
        {
          name: '员工管理',
          path: '/management',
          component: resolve => require(['../views/management/Index'],resolve),
          meta: {
            title: '员工管理-子曰语文'
          }
        },
        {
          path: '/library',
          name: '套题',
          component: resolve => require(['../views/library/Index'],resolve),
          meta: {
            title: '套题-子曰语文'
          }
        },
        {
          path: '/libraryDetail/:type/:courseId/:idx/:coursename/:grade', //  PREVIEW课前预习  SUMMARY课后总结  EXPAND课后拓展  idx第几课
          name: '课前预习',
          component: resolve => require(['../views/library/detail'],resolve),
          meta: {
            title: '课前预习-子曰语文'
          }
        },
        {
          path: '/libraryHomework/:courseId/:idx/:coursename/:grade',
          name: '课后作业',
          component: resolve => require(['../views/library/detailHomework'],resolve),
          meta: {
            title: '课后作业-子曰语文'
          }
        },
        {
          path: '/inputHomework/:courseId/:idx/:grade/:page/:editId',//courseId,lessonIdx,page--从哪个页面过来套题课后作业(libraryhw)or题库(warehouse)
          name: '录入题目', //grade--年级;editId--编辑时的题目id
          component: resolve => require(['../views/library/InputHomework'],resolve),
          meta: {
            title: '录入题目-子曰语文'
          }
        },
        {
          path: '/inputImageText/:type/:courseId/:idx/:grade/:page/:editId',
          name: '录入图文',
          component: resolve => require(['../views/library/AddImageAndText'],resolve),
          meta: {
            title: '录入图文-子曰语文'
          }
        },
        {
          path: '/warehouse',
          name: '题库',
          component: resolve => require(['../views/warehouse/Index'],resolve),
          meta: {
            title: '题库-子曰语文'
          }
        },
        {
          path: '/exportLesson', //导出课表
          name: 'exportLesson',
          component: resolve => require(['../views/export/Index'],resolve),
          meta: {
            title: '导出课表'
          }
        },
        {
          path: '/timetable', //我的课程表
          name: 'TimeTableCourse',
          component: resolve => require(['../views/timetable/Index'],resolve),
          meta: {
            title: '我的课程表'
          }
        },
        {
          path: '/correcting', //批改页面
          name: 'correcting',
          component: resolve => require(['../views/correcting/Index'],resolve),
          meta: {
            title: '批改'
          }
        },
        {
          path: '/correctDetail/:recordId/:studentName/:courseName', //批改某个作业页面 homeworkRecordId
          name: 'correctDetail',
          component: resolve => require(['../views/correcting/Detail'],resolve),
          meta: {
            title: '批改作业'
          }
        },
        {
          path: '/productManage',
          name: '商品管理',
          component: resolve => require(['../views/productmanage/Index'],resolve),
          meta: {
            title: '商品管理-子曰语文'
          }
        },
        {
          path: '/productAdd/:id/:type', //id--商品id; type--copy、edit、add
          name: '添加商品',
          component: resolve => require(['../views/productmanage/ProductAdd'],resolve),
          meta: {
            title: '添加商品-子曰语文'
          }
        },
        {
          path: '/orderManage',
          name: '订单管理',
          component: resolve => require(['../views/ordermanage/Index'],resolve),
          meta: {
            title: '订单管理-子曰语文'
          }
        },
        {
          path: '/couponManage',
          name: '优惠券',
          component: resolve => require(['../views/couponmanage/Index'],resolve),
          meta: {
            title: '优惠券-子曰语文'
          }
        },
      ]
    },
    {
      path: '/courseList',
      name: 'courseList',
      component: resolve => require(['../views/wechat/course/Index'],resolve),
      meta: {
        title: '我的课程'
      }
    },
    {
      path: '/course/detail/:classId/:subjectId',
      name: 'courseDetail',
      component: resolve => require(['../views/wechat/course/Detail'],resolve),
      meta: {
        title: '课程详情'
      }
    },
    {
      path: '/lesson/detail/:lessonId/:subjectId',
      name: 'lessonDetail',
      component: resolve => require(['../views/wechat/course/lessonDetail'],resolve),
      meta: {
        title: '课节详情'
      }
    },
    {
      path: '/starthomework/:lessonId/:subjectId/:homeworkIndex',
      name: 'StartHomework',
      component: resolve => require(['../views/wechat/homework/StartHomework'],resolve),
      meta: {
        title: '课后作业'
      }
    },
    {
      path: '/beforeclass/:subjectId/:homeworkIndex/:lessonId/:classId',
      name: 'beforeclass',
      component: resolve => require(['../views/wechat/homework/BeforeClass'],resolve),
      meta: {
        title: '课前预习'
      }
    },
    {
      path: '/homework/:lessonId/:subjectId/:homeworkIndex', //套题的id; 第几次作业--从1开始
      name: 'homework',
      component: resolve => require(['../views/wechat/homework/ClassHomework'],resolve),
      meta: {
        title: '课后作业'
      }
    },
    {
      path: '/classconclusion/:subjectId/:homeworkIndex/:lessonId/:classId',
      name: 'classconclusion',
      component: resolve => require(['../views/wechat/homework/ClassConclusion'],resolve),
      meta: {
        title: '课后总结'
      }
    },
    {
      path: '/classexpand/:subjectId/:homeworkIndex/:lessonId/:classId',
      name: 'classexpand',
      component: resolve => require(['../views/wechat/homework/ClassExpand'],resolve),
      meta: {
        title: '课后拓展'
      }
    },{
      path: '/homeworkReport/:lessonId/:subjectId/:homeworkIndex/:from', //debug 要加个参数,区分是刚做完作业过来,还是从消息通知过来;
      // 刚做完作业过来的话,需要播放一个动画
      name: 'homeworkReport',
      component: resolve => require(['../views/wechat/homework/HomeworkReport'],resolve),
      meta: {
        title: '课后作业报告'
      }
    },{
      path: '/bindwechat',
      name: 'bindwechat',
      component: resolve => require(['../views/wechat/bindwechat/Index'],resolve),
      meta: {
        title: '设置学习微信'
      }
    },{
      path: '/mobileAudio',
      name: 'mobileAudio',
      component: resolve => require(['../views/test/mobileAudio'],resolve),
      meta: {
        title: 'audio测试'
      }
    },{
      path: '/productList',
      name: 'productList',
      component: resolve => require(['../views/wechat/product/Index'],resolve),
      meta: {
        title: '子曰课程'
      }
    },{
      path: '/classList/:courseId',
      name: 'classList',
      component: resolve => require(['../views/wechat/product/ClassList'],resolve),
      meta: {
        title: '商品列表'
      }
    },{
      path: '/productDetail/:id', //售卖的商品 id
      name: 'productDetail',
      component: resolve => require(['../views/wechat/product/Detail'],resolve),
      meta: {
        title: '商品详情'
      }
    },{
      path: '/confirmOrder/:id', //商品id
      name: 'confirmOrder',
      component: resolve => require(['../views/wechat/product/ConfirmOrder'],resolve),
      meta: {
        title: '确认订单'
      }
    },{
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: resolve => require(['../views/wechat/product/OrderSuccess'],resolve),
      meta: {
        title: '报名成功'
      }
    },
    {
      path: '/addressList',
      name: 'address',
      component: resolve => require(['../views/wechat/product/AddressIndex'],resolve),
      meta: {
        title: '教材寄送地址'
      }
    },
    {
      path: '/addAddress/:addressId',//地址id  如果是新建  则为-1
      name: 'addAddress',
      component: resolve => require(['../views/wechat/product/AddAddress'],resolve),
      meta: {
        title: '编辑地址'
      }
    }
    ]
})

