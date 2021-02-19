import React,  {useEffect} from 'react'
import axios from 'axios';

function LandingPage() {
    // LandingPage에 들어오면 바로 실행
    useEffect(() => {
        // get 요청을 서버로 전달. end point가 /api/hello
        axios.get('/api/hello')
        // 서버에서 돌아오는 response를 콘솔 창에 보여줌
        .then(response => console.log(response.data))
    }, [])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage
