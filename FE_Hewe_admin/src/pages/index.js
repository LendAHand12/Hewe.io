import React from 'react'

import LoginSection from '../components/LoginSection'
import { loginObjOne } from '../components/LoginSection/Data'


const Home = () => {

    return (
        <>
            <LoginSection {...loginObjOne}/>
        </>
    )
}

export default Home;