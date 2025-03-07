import React from 'react'
import HomeNav from '../../components/Navbar/HomeNav'
import Banner from '../../components/Banner/Banner'
import ProductsPage from '../ProductList/PrductsPage'

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
    </div>
   </div>
        
  )
}

export default HomePage