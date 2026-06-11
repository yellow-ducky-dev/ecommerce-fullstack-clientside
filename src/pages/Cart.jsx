import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight, ShieldCheck, Truck, RotateCcw, CreditCard, ArrowLeft, Box, Zap, Heart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : (subtotal > 0 ? 15.00 : 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="container py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="relative inline-block">
            <div className="w-40 h-40 mx-auto bg-primary-light rounded-full flex items-center justify-center animate-pulse">
              <ShoppingCart size={64} className="text-primary" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg animate-bounce">
              <Zap size={20} fill="currentColor" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-dark tracking-tighter">Your cart is currently empty</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto italic">"A journey of a thousand miles begins with a single click." Start your shopping journey now!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/products" className="btn bg-dark text-white hover:bg-black rounded-2xl px-10 py-5 font-black text-lg transition-all hover:scale-[1.05] shadow-xl shadow-dark/20">
              EXPLORE OUR SHOP
            </Link>
            <Link to="/" className="btn btn-light border-2 border-gray-100 rounded-2xl px-10 py-5 font-black text-lg hover:bg-gray-50 transition-all">
              GO TO HOME
            </Link>
          </div>

          <div className="pt-12 border-t-2 border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Home Decor', 'Beauty'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} className="p-4 rounded-2xl bg-gray-50 hover:bg-primary-light hover:text-primary transition-all text-sm font-black text-gray-400 uppercase tracking-widest text-center">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={12} />
            <span className="text-dark">Shopping Cart</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-dark tracking-tighter">Your Bag</h1>
            <span className="bg-primary text-white text-sm font-black px-4 py-1 rounded-full shadow-lg shadow-primary/20">
              {cartCount} ITEMS
            </span>
          </div>
        </div>
        <button 
          onClick={clearCart} 
          className="btn text-sm font-black text-gray-400 hover:text-danger flex items-center gap-2 transition-colors group"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> 
          EMPTY CART
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart items List */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="relative bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col sm:flex-row gap-8 hover:shadow-2xl hover:shadow-gray-100 transition-all group overflow-hidden">
              {/* Item Image */}
              <div className="relative w-full sm:w-44 h-44 bg-gray-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain p-6"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Product'; }}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/products/${item._id}`}>
                      <h3 className="text-xl font-black text-dark group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 hover:bg-danger-light hover:text-danger flex items-center justify-center transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                    <span className="flex items-center gap-1"><Box size={14}/> {item.brand || 'Premium'}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-success flex items-center gap-1"><Zap size={14} fill="currentColor"/> In Stock</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-6 pt-4 border-t border-gray-50">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Quantity</label>
                    <div className="flex items-center bg-gray-50 rounded-2xl p-1 border-2 border-transparent hover:border-gray-100 transition-all">
                      <button 
                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-black text-gray-400 hover:text-dark hover:shadow-sm"
                      >−</button>
                      <span className="w-10 text-center font-black text-dark">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all font-black text-gray-400 hover:text-dark hover:shadow-sm"
                      >+</button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Price</div>
                    <div className="text-2xl font-black text-dark tracking-tighter">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Actions / Trust */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            {[
              { icon: <ShieldCheck className="text-blue-500" />, title: 'Premium Security', desc: 'Bank-level encyrption' },
              { icon: <Truck className="text-green-500" />, title: 'Express Delivery', desc: 'Free over $100 orders' },
              { icon: <RotateCcw className="text-orange-500" />, title: 'Flexible Returns', desc: '30-day money back' },
            ].map((badge, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 group hover:shadow-xl hover:shadow-gray-100 transition-all">
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary-light transition-colors">{badge.icon}</div>
                <div>
                  <h4 className="text-sm font-black text-dark leading-none mb-1">{badge.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-dark text-white rounded-[3rem] p-10 sticky top-24 shadow-2xl shadow-dark/30 overflow-hidden relative group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
            
            <div className="relative z-10 space-y-8">
              <h3 className="text-2xl font-black tracking-tighter">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <span>Bag Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <span>Shipping Fee</span>
                  <span className={shipping === 0 ? 'text-success' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <span>Sales Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                
                <div className="h-px bg-white/10 my-6"></div>
                
                <div className="flex justify-between items-end">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Grand Total</span>
                  <div className="text-4xl font-black tracking-tighter">${total.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white hover:bg-primary-dark rounded-[1.5rem] py-5 font-black text-lg transition-all hover:scale-[1.02] shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
                >
                  <CreditCard size={22} strokeWidth={2.5} />
                  CHECKOUT NOW
                </button>
                <Link to="/products" className="w-full btn bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] py-4 font-black transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> CONTINUE SHOPPING
                </Link>
              </div>

              <div className="pt-8 space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Accepted Payment Methods</p>
                <div className="flex justify-center gap-2 saturate-0 opacity-50 hover:saturate-100 hover:opacity-100 transition-all cursor-pointer">
                  {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(p => (
                    <span key={p} className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-black">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-8 bg-accent-light rounded-[2.5rem] border border-accent/20 flex gap-5 items-start">
            <Info className="text-accent flex-shrink-0" size={24} />
            <div className="space-y-1">
              <h4 className="text-sm font-black text-accent uppercase tracking-widest leading-none">Free Shipping Alert!</h4>
              <p className="text-xs font-bold text-accent/80">Orders above $100 qualify for our premium express shipping at no extra cost. Add <span className="underline">${Math.max(0, 100 - subtotal).toFixed(2)}</span> more to qualify!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
