import React from 'react'
import './loader.css'
import logo from "../../assets/skillup-logoicon.png"

function Loader() {
    
  return (
    <div className='loader'>
        <img src={logo} alt="brand logo" />
    </div>
  )
}

export default Loader;