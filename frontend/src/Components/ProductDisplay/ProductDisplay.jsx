import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon  from '../Assets/star_icon.png'
import star_dull_icon  from '../Assets/star_dull_icon.png'
import {ShopContext} from '../../Context/ShopContext'

const ProductDisplay = (props) => {
    const {product} = props; 
    const {addToCart} = useContext(ShopContext);
  return (
    <div className='productdisplay'>
        <div className="productdisplay-left">
            <div className="productdisplay-img-list">
                <img src= {product.image}/>
                <img src= {product.image}/>
                <img src= {product.image}/>
                <img src= {product.image}/>
            </div>
            <div className="productdisplay-img">
                <img className='productdisplay-main-img' src={product.image}/>
            </div>
        </div>
        <div className="productdisplay-right">
            <h1> {product.name}</h1>
            <div className="productdisplay-right-star">
                <img src={star_icon}/>
                <img src={star_icon}/>
                <img src={star_icon}/>
                <img src={star_icon}/>
                <img src={star_dull_icon}/>
                <p>122</p>
            </div>
            <div className="productdisplay-right-prices">
                <div className="productdisplay-right-price-old">${product.old_price}</div>
                <div className="productdisplay-right-price-new">${product.new_price}</div>
            </div>
            <div className="productdisplay-right-description">
                just a static description nt really about the product, just to occupy the space and let me know that evrything is in place.
            </div>
            <div className="productdisplay-right-size">
                <h1>Select size</h1>
                <div className="productdisplay-right-sizes">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(product.id)}}>Add to Cart</button>
            <p className='productdisplay-right-category'><span>Category:</span>Women, T-shirt, Crop Top</p>
            <p className='productdisplay-right-category'><span>Category:</span>Modern, latest</p>
        </div>
    </div>
  )
}

export default ProductDisplay
