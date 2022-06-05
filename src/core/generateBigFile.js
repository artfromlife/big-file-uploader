const fs = require('fs')
const path = require('path')
const filePath = path.resolve(__dirname, '../../assets')
// 判断文件夹是否存在
fs.access(filePath, fs.constants.F_OK, err => {
  err ? console.log(`${filePath} does not exist`)
    :
    // 异步创建文件夹
    fs.mkdir(filePath, {recursive: true}, err => {
      err ? console.log(`${filePath} 创建失败`)
        :
        // 创建一个 1 G 的垃圾文件
        fs.appendFile(path.resolve(filePath, './bigFile.txt'), Buffer.alloc(1024 * 1024 * 1024 , 'x'), err => {
          err ? console.log('文件创建失败')
            :
            fs.stat(path.resolve(filePath, './bigFile.txt'),(err,stats) => {
              console.log(stats)
            })
        })
    })
})
