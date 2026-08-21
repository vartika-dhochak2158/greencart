import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {

    const {products, searchQuery } = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(()=>{
        if(searchQuery.length > 0){
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))}else{
                setFilteredProducts(products)
            }
    },[products, searchQuery])

  return (
    <div className='space-y-5 py-8'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-black'>Explore fresh picks</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

        <p className='text-xs font-bold text-muted-foreground'>{filteredProducts.filter((product)=> product.inStock).length} items found</p>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
           {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
            <ProductCard key={index} product={product}/>
           ))}
        </div>

    </div>
  )
}

export default AllProducts
