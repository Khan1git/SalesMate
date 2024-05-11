import React from 'react'
import Navbar from '../componentes/Navbar'
import './css/analytics.css'
import Areagraph from '../componentes/Areagraph'


const Analytics = () => {
  return (
    <>
    <Navbar/>
    <section id="analytics">
        <h1>PROFIT AND LOSS</h1>
      <div className="profit">
        <Areagraph/>
      </div>
      <div className="side_table">
        <dv className="tble">
          THIS IS THE TABLE
        </dv>
      </div>
    </section>
    </>
  )
}

export default Analytics
