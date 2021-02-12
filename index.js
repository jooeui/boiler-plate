const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');  // 설치했던 body-parser 가져옴

const config = require('./config/key');
const { User } = require("./models/User");  // 생성했던 User 모델을 가져옴

// bodyParser 옵션을 줌
// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));
// application/json 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
   // 에러 뜨는 것 방지
   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')) // 연결이 잘 되었나 확인, 연결되었다면 Connected 출력
  .catch(err => console.log(err)) // 연결 실패하였으면 err 출력

app.get('/', (req, res) => {
  res.send('안녕하세요!')
})

app.post('/register', (req, res) => {  //Post 메서드. Route의 end point - register. 콜백 함수 - req, res
  //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어줌
  const user = new User(req.body)  //bodyParser를 이용하여 req.body에 클라이언트에 보내는 정보를 받아줌

  user.save(err => {
    // 만약 저장할 때 err가 있다면 클라이언트에게 json 형식으로 err 전달
    if(err) return res.json({ success: false, err})
    // 성공 시 json 형식으로 전달
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
