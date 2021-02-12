const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//salt 생성 후 salt를 이용하여 비밀번호 암호화해야 함
//saltRounds는 salt가 몇 글자인지 나타냄
const saltRounds = 10

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백이 있을 경우 제거
        unique: 1   //중복 x
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 관리자, 일반 유저 나누기 위함 
        type: Number,
        default: 0
    },
    image: String,
    token: {   //유효성 관리
        type: String
    },
    tokenExp: { //토큰 유효기간
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this;    // user 모델을 가져옴

    // 모델 안의 password가 변환이 되었을 때만 비밀번호 암호화 변경
    if(user.isModified('password')){    
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){  // salt를 만듦
            if(err) return next(err)    // 에러 시 바로 save 부분으로 보냄
            
            //user의 password를 가져온 후 위에서 생성한 salt를 가져옴
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)    //비밀번호 암호화 중 에러 시 바로 save 부분으로
                user.password = hash    // 입력한 비밀번호를 hash 된 비밀번호로 바꾸어 줌
                next()
            })
        })
    }
})
    
// mongoose.model('모델 이름', 스키마)
const User = mongoose.model('User', userSchema)

// 해당 모델을 다른 곳에서도 쓸 수 있게 함
module.exports = { User }