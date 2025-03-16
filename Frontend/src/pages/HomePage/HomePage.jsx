import React from 'react'
import HomeNav from '../../components/Navbar/HomeNav'
import Banner from '../../components/Banner/Banner'
import ProductsPage from '../ProductList/PrductsPage'
import Footer from '../../components/Footer/Footer'

const HomePage = () => {
  return (
   <div>
    <HomeNav/>
    <div className="container mt-4 ">
      <div className="">
        <Banner />
      </div>
      <div>
        <ProductsPage/>
      </div>
      <div className='p-3 mt-5 border-top'>
        <Footer/>
      </div>
    </div>
   </div>
        
  )
}

export default HomePage