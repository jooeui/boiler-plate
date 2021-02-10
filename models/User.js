const mongoose = require('mongoose');

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
    role: { // 관리자, 일반유저 나누기 위함 
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

// mongoose.model('모델 이름', 스키마)
const User = mongoose.model('User', userSchema)

// 해당 모델을 다른 곳에서도 쓸 수 있게 함
module.exports = { User }