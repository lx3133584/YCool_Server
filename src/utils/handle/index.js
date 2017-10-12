//全局函数
import Message from '../../models/message.js'

const handle = {}

handle.success = (data = {}) => {
  return {
    success: true,
    code: 0,
    data: data
  }
}

//报错时，保存信息到数据库
handle.sendEmail = (msg) => {
  const data = {
    message: msg,
    date: new Date
  }
  const newMessage = new Message(data)
  newMessage.save()
}




module.exports = handle
