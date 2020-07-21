const excelRouter = {
  route: null,
  name: null,
  title: 'Excel',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-table1',
  filePath: 'view/excel/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: 'excel上传',
      type: 'view',
      name: 'ExcelUpload',
      route: '/excel/upload',
      filePath: 'view/excel/excel-upload.vue',
      inNav: true,
      icon: 'iconfont icon-table1',
    },
  ],
}

export default excelRouter
