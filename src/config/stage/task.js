const taskRouter = {
  route: null,
  name: null,
  title: '任务管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/task/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '任务列表',
      type: 'view',
      name: 'TaskCreate',
      route: '/task/list',
      filePath: 'view/task/task-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '添加任务',
      type: 'view',
      name: 'TaskCreate',
      route: '/task/add',
      filePath: 'view/task/task-create.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '任务文件列表',
      type: 'view',
      name: 'TaskFileList',
      route: '/task/filelist/:id',
      filePath: 'view/task/task-file-list.vue',
      inNav: false,
      noHistory: true,
    },
  ],
}

export default taskRouter
