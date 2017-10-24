import multer from 'koa-multer'
//文件上传 配置
const storage = multer.diskStorage({
  //文件保存路径
  destination: `../http/upload/${new Date().getFullYear()}/${new Date().getMonth() + 1}`,
  //修改文件名称
  filename (req, file, cb) {
    const fileFormat = (file.originalname).split(".")
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1])
  }
})
//加载配置
export default multer({ storage })
