const path = require('path')
const http = require('http')
const fs = require('fs')
const fsPromises = require('fs/promises')
const formidable = require('formidable')
const crypto = require('crypto')
const app = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('./client.html', (err, data) => {
      if (err) {
      
      } else {
        res.end(data)
      }
    })
  } else if (req.url === '/upload' && req.method === 'POST') {
    const form = formidable({})
    form.parse(req, (err, fields, files) => {
      if (err) {
      
      } else {
        fsPromises.copyFile(files.file.filepath, path.resolve(__dirname, `../../files/${fields.fileName}`)).then(() => {
          console.log(files.file.filepath)
          res.end('got it')
        }).catch(console.log)
      }
    })
  } else if (req.url === '/merge') {
    let data = ''
    req.on('data', chunk => {
      data += chunk.toString()
    })
    req.on('end', () => {
      let fileName = JSON.parse(data).fileName
      fs.readdir(path.resolve(__dirname, '../../files'), (err, files) => {
        if (err) {
        
        } else {
          files.sort((a, b) => a - b)
          let index = 0
          const merge = (file) => {
            return fsPromises.readFile(path.resolve(__dirname, `../../files/${file}`)).then(data => {
              fsPromises.appendFile(path.resolve(__dirname, `../../big/${fileName}`), data).then(() => {
                if (index < files.length)
                  merge(files[index++]).then()
              })
            })
          }
          merge(files[index++]).then(() => {
            const hash = crypto.createHash('md5')
            const hash2 = crypto.createHash('md5')
            fsPromises.readFile(path.resolve(__dirname, `../../big/${fileName}`)).then(data => {
              hash.update(data)
              let md51 = hash.digest('hex')
              fsPromises.readFile(path.resolve(__dirname, `../../assets/pdf.pdf`)).then(data => {
                hash2.update(data)
                let md5 = hash2.digest('hex')
                console.log(md5 === md51)
                res.end('merging!')
              })
            })
          })
        }
      })
    })
  }
})
app.listen(3000)
console.log(`App is running at http://localhost:3000/`)
