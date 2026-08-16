const products = [
  {id:1,name:'Milk Shakti Bread',category:'Breads',price:45,image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85'},
  {id:2,name:'Multi Grain Bread',category:'Healthy Breads',price:60,image:'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=85'},
  {id:3,name:'Brown Bread',category:'Healthy Breads',price:50,image:'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=85'},
  {id:4,name:'Atta Shakti Bread',category:'Healthy Breads',price:50,image:'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=85'},
  {id:5,name:'Kulcha Bread',category:'Breads',price:55,image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'},
  {id:6,name:'Fun Time Bun',category:'Buns',price:40,image:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85'},
  {id:7,name:'Cream Bread Vanilla',category:'Breads',price:55,image:'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=85'},
  {id:8,name:'Sweet Bread',category:'Breads',price:45,image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85'},
  {id:9,name:'Sandwich Bread',category:'Breads',price:45,image:'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=85'},
  {id:10,name:'Fun Slice Fruit Bread',category:'Breads',price:55,image:'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=85'},
  {id:11,name:'Prime Time Bread',category:'Breads',price:40,image:'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=85'},
  {id:12,name:'Tea Time Rusk',category:'Rusks',price:70,image:'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=85'}
];

let cart = JSON.parse(localStorage.getItem('homa-cart') || '[]');
let activeCategory = 'All';

const grid = document.querySelector('#productGrid');
const count = document.querySelector('#cartCount');
const drawer = document.querySelector('#cartDrawer');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');

function money(value){ return `₹${value.toLocaleString('en-IN')}`; }
function save(){ localStorage.setItem('homa-cart', JSON.stringify(cart)); }
function renderProducts(){
  const visible = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
  grid.innerHTML = visible.map(p => `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.category}</span></div><div class="product-info"><div><h3>${p.name}</h3><p>Freshly baked everyday</p></div><strong>${money(p.price)}</strong></div><button class="add" data-add="${p.id}">ADD TO CART <span>+</span></button></article>`).join('');
  grid.querySelectorAll('[data-add]').forEach(b => b.onclick = () => add(Number(b.dataset.add)));
}
function add(id){ const item = cart.find(x=>x.id===id); if(item) item.qty++; else cart.push({id,qty:1}); save(); renderCart(); openCart(); }
function change(id,delta){ const item=cart.find(x=>x.id===id); if(!item)return; item.qty+=delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id); save(); renderCart(); }
function renderCart(){
  const totalQty=cart.reduce((s,x)=>s+x.qty,0); count.textContent=totalQty;
  cartItems.innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-minus="${p.id}">−</button><b>${x.qty}</b><button data-plus="${p.id}">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join(''):`<div class="empty"><span>◎</span><p>Your basket is empty.</p><small>Add something freshly baked.</small></div>`;
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0); cartTotal.textContent=money(total);
  cartItems.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>change(Number(b.dataset.minus),-1));
  cartItems.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>change(Number(b.dataset.plus),1));
}
function openCart(){drawer.classList.add('open');document.body.classList.add('locked');}
function closeCart(){drawer.classList.remove('open');document.body.classList.remove('locked');}

document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{activeCategory=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===b));renderProducts();});
document.querySelector('#cartButton').onclick=openCart;
document.querySelector('#closeCart').onclick=closeCart;
document.querySelector('#cartBackdrop').onclick=closeCart;
document.querySelector('#checkout').onclick=()=>alert(cart.length?'Demo checkout — connect a real payment/order system only after HOMA approves the project.':'Your basket is empty.');
document.querySelector('#search').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.product-card').forEach(card=>card.style.display=card.textContent.toLowerCase().includes(q)?'':'none');};
renderProducts();renderCart();