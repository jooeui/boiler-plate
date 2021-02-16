const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');  // 설치했던 body-parser 가져옴
const cookieParser = require('cookie-parser');  // 설치했던 cookie-parser 가져옴
const config = require('./config/key');
const { auth } = require('./middleware/auth')
const { User } = require("./models/User");  // 생성했던 User 모델을 가져옴

// bodyParser 옵션을 줌
// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));
// application/json 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json());

// cookie-parser를 사용할 수 있도록 함
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
   // 에러 뜨는 것 방지
   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')) // 연결이 잘 되었나 확인, 연결되었다면 Connected 출력
  .catch(err => console.log(err)) // 연결 실패하였으면 err 출력

app.get('/', (req, res) => {
  res.send('안녕하세요!')
})

app.post('/api/users/register', (req, res) => {  //Post 메서드. Route의 end point - register. 콜백 함수 - req, res
  //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어줌
  const user = new User(req.body)  //bodyParser를 이용하여 req.body에 클라이언트에 보내는 정보를 받아줌

  user.save((err, userInfo) => {
    // 만약 저장할 때 err가 있다면 클라이언트에게 json 형식으로 err 전달
    if(err) return res.json({ success: false, err})
    // 성공 시 json 형식으로 전달
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 DB에 있는지 찾음
  User.findOne({email: req.body.email}, (err, userInfo) =>{
    if(!userInfo){
      return res.json({
        loginSuccess: false,
        message: "입력하신 이메일과 일치하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 DB에 있다면 비밀번호가 올바른지 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {  // isMatch를 사용하여 일치하는 경우 true 반환, 아니면 false 반환
      if(!isMatch){
        return res.json({ loginSuccess: false, message: "비밀번호가 올바르지 않습니다." })
      }

      //올바른 비밀번호라면 토큰 생성
      userInfo.generateToken((err, userInfo) =>{
        if(err) return res.status(400).send(err);
        
        // userInfo에 저장되어 있는 토큰을 쿠키 or 로컬스토리지에 저장(해당 영상에서는 쿠키에 저장)
        res.cookie("x_auth", userInfo.token)
        .status(200)  // 성공
        .json({ loginSuccess: true, userId: userInfo._id })
      })
    })  
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,  // role 0 - 일반유저, 0이 아니면 관리자 (변경 가능)
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  // 유저를 찾아서 업데이트
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if(err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  }) 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
