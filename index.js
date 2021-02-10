const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://eui:1230v_v@v-v0web1.tydjd.mongodb.net/<dbname>?retryWrites=true&w=majority', {
   // 에러 뜨는 것 방지
   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')) // 연결이 잘 되었나 확인, 연결되었다면 Connected 출력
  .catch(err => console.log(err)) // 연결 실패하였으면 err 출력

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
