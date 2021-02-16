const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//salt 생성 후 salt를 이용하여 비밀번호 암호화해야 함
//saltRounds는 salt가 몇 글자인지 나타냄
const saltRounds = 10

const jwt = require('jsonwebtoken');

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
    } else {
        next()
    }
})

// comparePassword 메서드 생성
userSchema.methods.comparePassword = function (plainPassword, cb){    //plainPassword - 입력한 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

// generateToken 메서드 생성
userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용해서 token 생성. 임의로 값을 넣어주면 됨
    var token = jwt.sign(user._id.toHexString(), 'secretToken')   

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

// findByToken 메서드 생성
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰 decode
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용하여 유저를 찾은 후
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

// mongoose.model('모델 이름', 스키마)
const User = mongoose.model('User', userSchema)

// 해당 모델을 다른 곳에서도 쓸 수 있게 함
module.exports = { User }