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
handle.sendEmail = (msg, type = 'error') => {
  const data = {
    message: msg,
    type
  }
  const newMessage = new Message(data)
  newMessage.save()
}




module.exports = handle
