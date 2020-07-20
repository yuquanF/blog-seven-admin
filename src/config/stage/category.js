const categoryRouter = {
  route: null,
  name: null,
  title: '分类管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-zidingyi',
  filePath: 'view/category/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      name: 'CategoryList',
      route: '/category/list',
      filePath: 'view/category/category-list.vue',
      inNav: true,
      icon: 'iconfont icon-zidingyi',
    },
    {
      title: '添加分类',
      type: 'view',
      name: 'CategoryCreate',
      route: '/category/add',
      filePath: 'view/category/category-create.vue',
      inNav: true,
      icon: 'iconfont icon-zidingyi',
    },
  ],
}

export default categoryRouter
