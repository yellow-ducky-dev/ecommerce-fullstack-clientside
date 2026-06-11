import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingCart, LayoutGrid, List, X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { productService } from '../api/services';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  'All', 'Automobiles', 'Clothes and wear', 'Home interiors', 'Computer and tech',
  'Tools, equipments', 'Sports and outdoor', 'Animal and pets', 'Machinery',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex-between mb-2 text-sm font-bold text-gray-800"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} mt-3`}>
        {children}
      </div>
    </div>
  );
};

const ProductCard = ({ product, view = 'grid' }) => {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (view === 'list') {
    return (
      <div className="card group flex flex-col sm:flex-row gap-6 p-5 hover:shadow-md transition-shadow">
        <Link to={`/product/${product._id}`} className="w-full sm:w-48 h-48 sm:h-40 flex-shrink-0 bg-gray-50 rounded-lg flex-center overflow-hidden">
          <img src={product.image} alt={product.name} className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-bold text-dark mb-2 hover:text-primary transition-colors leading-tight">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-bold text-xl text-dark">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-gray-200'} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.numReviews} reviews)</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
          <button onClick={() => addToCart(product, 1)} className="btn btn-primary flex items-center gap-2 w-fit">
            <ShoppingCart size={16} /> Add to cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/product/${product._id}`} className="card group flex flex-col">
      <div className="relative mb-3 h-48 bg-gray-50 rounded-lg flex-center overflow-hidden border border-gray-50 group-hover:border-primary-light transition-colors">
        <img src={product.image} alt={product.name} className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
        {discount && <span className="absolute top-2 left-2 badge badge-orange text-[10px]">-{discount}%</span>}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-xl font-bold text-dark">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.numReviews})</span>
        </div>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary transition-colors leading-snug">{product.name}</h3>
        <button 
          onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
          className="mt-3 w-full border border-primary text-primary hover:bg-primary hover:text-white transition-all py-1.5 rounded-lg text-xs font-bold flex-center gap-2"
        >
          <ShoppingCart size={14} /> Add to cart
        </button>
      </div>
    </Link>
  );
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [priceMinInput, setPriceMinInput] = useState(minPrice);
  const [priceMaxInput, setPriceMaxInput] = useState(maxPrice);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sort };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await productService.getProducts(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  }, [search, category, sort, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handlePriceApply = () => {
    const next = new URLSearchParams(searchParams);
    if (priceMinInput) next.set('minPrice', priceMinInput); else next.delete('minPrice');
    if (priceMaxInput) next.set('maxPrice', priceMaxInput); else next.delete('maxPrice');
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="container py-6">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`fixed inset-0 z-50 md:relative md:inset-auto md:z-0 md:block w-72 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="absolute inset-0 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative bg-white h-full md:h-auto overflow-y-auto md:overflow-visible w-64 md:w-full p-6 md:p-0 rounded-none md:rounded-xl">
            <div className="flex-between md:hidden mb-6">
              <h3 className="font-bold">Filters</h3>
              <button onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
            </div>

            <FilterSection title="Category">
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                        category === cat || (cat === 'All' && !category)
                          ? 'text-primary font-bold bg-primary-light'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection title="Price range">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceMinInput}
                    onChange={e => setPriceMinInput(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded text-sm" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceMaxInput}
                    onChange={e => setPriceMaxInput(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded text-sm" 
                  />
                </div>
                <button onClick={handlePriceApply} className="w-full bg-white border border-gray-200 py-2 rounded text-primary text-sm font-bold shadow-sm hover:bg-primary-light transition-colors">
                  Apply
                </button>
              </div>
            </FilterSection>

            <FilterSection title="Condition">
              <div className="space-y-2">
                {['Any', 'Refurbished', 'Brand new', 'Old items'].map(c => (
                  <label key={c} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
                    <input type="radio" value={c} name="condition" className="accent-primary" /> {c}
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb / Current State */}
          <div className="bg-white border border-border-color rounded-xl p-4 mb-6 shadow-sm">
             <div className="flex-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                   <h2 className="text-lg font-bold">{total} items in <span className="text-primary">{category}</span></h2>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Sort by:</span>
                      <select 
                        value={sort}
                        onChange={e => updateParam('sort', e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg text-sm bg-white outline-none"
                      >
                         {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                   </div>
                   <div className="flex bg-gray-100 p-1 rounded-lg">
                      <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}>
                        <LayoutGrid size={18} />
                      </button>
                      <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}>
                        <List size={18} />
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Mobile Filter Toggle */}
          <button 
             onClick={() => setIsSidebarOpen(true)}
             className="md:hidden w-full mb-6 py-3 bg-white border border-border-color rounded-xl flex-center gap-2 font-bold text-sm"
          >
             <Filter size={18} /> Filters
          </button>

          {/* Items Display */}
          {loading ? (
            <div className={view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-gray-50"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-border-color rounded-2xl p-20 text-center">
               <div className="flex-center mb-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex-center text-gray-300">
                    <Search size={40} />
                  </div>
               </div>
               <h3 className="text-xl font-bold mb-2">No items found</h3>
               <p className="text-gray-500 mb-6">Try clearing your filters or searching for something else.</p>
               <button onClick={() => setSearchParams({})} className="btn btn-primary">Clear all filters</button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
              {products.map(p => <ProductCard key={p._id} product={p} view={view} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-12 flex justify-end">
              <div className="flex bg-white border border-border-color rounded-xl overflow-hidden shadow-sm">
                <button 
                  disabled={page === 1}
                  onClick={() => updateParam('page', page - 1)}
                  className="px-4 py-2 border-r border-gray-100 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronDown className="rotate-90" size={18} />
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateParam('page', i + 1)}
                    className={`px-4 py-2 border-r border-gray-100 font-bold text-sm transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={page === pages}
                  onClick={() => updateParam('page', page + 1)}
                  className="px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronDown className="-rotate-90" size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
