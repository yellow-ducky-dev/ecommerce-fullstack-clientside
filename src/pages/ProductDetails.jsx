import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight as Next, Check, Info, Award, Clock } from 'lucide-react';
import { productService } from '../api/services';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating, size = 18 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= Math.floor(rating)
              ? 'fill-accent text-accent'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const { data } = await productService.getProduct(id);
        setProduct(data);
        
        // Fetch related products
        const { data: related } = await productService.getProducts({ 
          category: data.category,
          limit: 4 
        });
        setRelatedProducts(related.products.filter(p => p._id !== id));
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="space-y-6">
          <div className="aspect-square bg-gray-200 rounded-3xl"></div>
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 w-20 bg-gray-200 rounded-xl"></div>)}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
          <div className="h-14 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="container py-24 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h2 className="text-3xl font-bold text-dark mb-4">Product not found</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find the product you're looking for. It might have been removed or the link is incorrect.</p>
      <Link to="/products" className="btn btn-primary px-8 py-3">Back to Shop</Link>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</Link>
        <ChevronRight size={14} className="flex-shrink-0" />
        <span className="text-dark font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-5 space-y-6">
          <div 
            className="relative bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden group cursor-zoom-in aspect-square"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              src={images[activeImage]}
              alt={product.name}
              className={`w-full h-full object-contain p-8 transition-transform duration-700 ${isZoomed ? 'scale-125' : 'scale-100'}`}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=Product+Image'; }}
            />
            
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <ChevronLeft size={22} className="text-dark" />
                </button>
                <button onClick={() => setActiveImage(i => (i + 1) % images.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <Next size={22} className="text-dark" />
                </button>
              </>
            )}

            {discount && (
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="badge-danger text-white px-3 py-1 rounded-full text-sm font-black shadow-lg">-{discount}% OFF</span>
              </div>
            )}
            
            <button className="absolute top-6 right-6 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:text-red-500 transition-all">
              <Heart size={22} />
            </button>
          </div>

          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-2 px-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 p-2 bg-white ${i === activeImage ? 'border-primary ring-4 ring-primary-light ring-opacity-50' : 'border-gray-100 hover:border-gray-300 shadow-sm'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=img'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary-light text-primary text-xs font-black uppercase tracking-wider rounded-full ring-1 ring-primary/20">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1.5 text-success text-xs font-bold bg-success-light px-3 py-1 rounded-full">
                  <Check size={14} /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-danger text-xs font-bold bg-danger-light px-3 py-1 rounded-full">
                  <Clock size={14} /> Out of Stock
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-dark leading-[1.15]">{product.name}</h1>
            
            <div className="flex items-center gap-6 py-2">
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} />
                <span className="text-sm font-bold text-dark">{product.rating.toFixed(1)}</span>
              </div>
              <div className="h-4 w-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-medium">{product.numReviews} Verified Reviews</span>
              <div className="h-4 w-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-medium">{product.brand || 'Premium Brand'}</span>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-black text-dark tracking-tighter">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through font-medium">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium mb-6">Estimated tax and shipping calculated at checkout.</p>
              
              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                {[
                  { icon: <Award className="text-accent" size={18} />, text: 'Top-rated Item' },
                  { icon: <Shield className="text-blue-500" size={18} />, text: '2-Year Warranty' },
                  { icon: <RotateCcw className="text-orange-500" size={18} />, text: 'Free 30-Day Returns' },
                  { icon: <Truck className="text-green-500" size={18} />, text: 'Free Global Shipping' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
                    {item.icon} {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Quantity</label>
                <div className="flex items-center bg-white border-2 border-gray-100 rounded-2xl p-1 shadow-sm">
                  <button 
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-xl font-bold text-gray-400"
                  >−</button>
                  <input 
                    type="number" 
                    value={qty} 
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center font-black text-dark bg-transparent border-none focus:outline-none"
                  />
                  <button 
                    onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-xl font-bold text-gray-400"
                  >+</button>
                </div>
              </div>
              <div className="flex-1 space-y-2 pt-6 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-[2] h-14 btn rounded-2xl flex items-center justify-center gap-2 text-base font-black transition-all ${
                    added ? 'bg-success text-white' : 'bg-dark text-white hover:bg-black hover:scale-[1.02] active:scale-100 shadow-xl shadow-dark/10'
                  }`}
                >
                  <ShoppingCart size={22} strokeWidth={2.5} />
                  {added ? 'ADDED TO CART!' : 'ADD TO CART'}
                </button>
                <button 
                  onClick={() => { handleAddToCart(); navigate('/cart'); }}
                  disabled={product.stock === 0}
                  className="flex-1 h-14 btn bg-primary text-white hover:bg-primary-dark rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100"
                >
                  BUY NOW
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-6 border-t-2 border-gray-50">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors">
                  <Share2 size={18} /> Share Product
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-dark transition-colors">
                  <Info size={18} /> Ask Question
                </button>
              </div>
              <div className="flex gap-2">
                {['fb', 'tw', 'wa', 'ig'].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 cursor-pointer hover:bg-gray-200 hover:text-dark transition-colors uppercase">{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-20">
        <div className="flex gap-8 border-b-2 border-gray-100 mb-10 overflow-x-auto scrollbar-hide">
          {['description', 'specifications', 'reviews', 'shipping'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-base font-black capitalize transition-all border-b-4 -mb-[2px] whitespace-nowrap ${
                tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-dark'
              }`}
            >
              {t} {t === 'reviews' && `(${product.numReviews})`}
            </button>
          ))}
        </div>
        
        <div className="max-w-4xl">
          {tab === 'description' && (
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                  <h4 className="text-lg font-black text-dark mb-4">Why you'll love it</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-600 font-bold"><Check className="text-primary" size={18}/> Premium high-quality materials</li>
                    <li className="flex items-center gap-3 text-gray-600 font-bold"><Check className="text-primary" size={18}/> Exceptional durability and style</li>
                    <li className="flex items-center gap-3 text-gray-600 font-bold"><Check className="text-primary" size={18}/> Ergonomic modern design</li>
                  </ul>
                </div>
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <h4 className="text-lg font-black text-dark mb-4">Product Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags?.map(tag => (
                      <span key={tag} className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm font-bold border border-gray-200"># {tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {tab === 'specifications' && (
            <div className="grid grid-cols-1 gap-px bg-gray-100 border border-gray-100 rounded-[2rem] overflow-hidden">
              {[
                { label: 'Category', value: product.category },
                { label: 'Brand', value: product.brand || 'Premium' },
                { label: 'SKU', value: `PROD-${id.slice(-6).toUpperCase()}` },
                { label: 'Stock Status', value: product.stock > 0 ? 'In Stock' : 'Out of Stock' },
                { label: 'Material', value: 'Commercial Grade' },
                { label: 'Country of Origin', value: 'USA' },
              ].map((spec, i) => (
                <div key={i} className="grid grid-cols-2 bg-white p-5">
                  <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">{spec.label}</span>
                  <span className="text-dark font-black">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-10 items-center p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <div className="text-center">
                  <div className="text-7xl font-black text-dark mb-2">{product.rating.toFixed(1)}</div>
                  <StarRating rating={product.rating} size={24} />
                  <p className="text-sm font-bold text-gray-400 mt-3 uppercase tracking-widest">Global Rating</p>
                </div>
                <div className="flex-1 w-full space-y-3">
                  {[5, 4, 3, 2, 1].map(num => (
                    <div key={num} className="flex items-center gap-4">
                      <span className="w-12 text-sm font-black text-gray-400">{num} Star</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: num === 5 ? '75%' : num === 4 ? '15%' : '5%' }}></div>
                      </div>
                      <span className="w-12 text-right text-sm font-black text-gray-400">{num === 5 ? '75%' : num === 4 ? '15%' : '5%'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {product.reviews?.map((review, i) => (
                  <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center font-black text-xl border-4 border-white shadow-md">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-dark text-lg">{review.name}</p>
                          <StarRating rating={review.rating} size={14} />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full">{new Date().toLocaleDateString()}</span>
                    </div>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'shipping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Standard Courier', detail: 'Estimated 5-10 working days', price: 'Free', icon: <Truck size={24} className="text-primary" /> },
                  { title: 'Express Flash', detail: 'Next day delivery available', price: '$12.99', icon: <Clock size={24} className="text-accent" /> },
                  { title: 'Local Pickup', detail: 'Available in 1200+ outlets', price: 'Free', icon: <Award size={24} className="text-success" /> },
                  { title: 'Global Air', detail: 'Available for 150+ countries', price: '$24.99', icon: <Shield size={24} className="text-blue-500" /> },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex gap-5 items-start">
                    <div className="p-4 bg-gray-50 rounded-2xl">{item.icon}</div>
                    <div>
                      <h5 className="text-lg font-black text-dark mb-1">{item.title}</h5>
                      <p className="text-sm text-gray-500 font-bold mb-3">{item.detail}</p>
                      <span className="text-sm px-4 py-2 bg-gray-50 text-primary font-black rounded-full">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-gray-900 text-white rounded-[2.5rem] mt-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black">Hassle-Free Returns</h4>
                    <p className="text-gray-400 font-medium">Not satisfied? Return within 30 days for a full refund, no questions asked.</p>
                  </div>
                  <button className="btn bg-white text-dark hover:bg-gray-100 rounded-2xl px-10 py-4 font-black whitespace-nowrap">VIEW RETURN POLICY</button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      {relatedProducts.length > 0 && (
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-dark tracking-tighter mb-2">Customers Also Viewed</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Picked just for you based on current item</p>
            </div>
            <Link to="/products" className="hidden md:flex btn btn-light rounded-2xl px-8 font-black gap-2">View All Results <Next size={16}/></Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <Link key={rel._id} to={`/products/${rel._id}`} className="group bg-white rounded-[2rem] border border-gray-100 p-4 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="aspect-square bg-gray-50 rounded-[1.5rem] overflow-hidden mb-6 p-6">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Product'; }} />
                </div>
                <div className="space-y-3">
                  <h3 className="font-black text-dark line-clamp-1 group-hover:text-primary transition-colors">{rel.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-dark tracking-tighter">${rel.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-accent text-accent" />
                      <span className="text-sm font-bold text-gray-500">{rel.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
