// sales page logic
document.addEventListener('DOMContentLoaded', ()=>{
  const productList = document.getElementById('productList');
  const cartList = document.getElementById('cartList');
  const cartCount = document.getElementById('cartCount');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');
  const salesSearch = document.getElementById('salesSearch');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearCart = document.getElementById('clearCart');

  function renderProducts(filter=''){
    const products = readProducts();
    productList.innerHTML = '';
    const shown = products.filter(p=>{
      const q = (filter||'').toLowerCase();
      return !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q);
    });

    if(shown.length === 0){
      productList.classList.add('list-empty');
      productList.textContent = 'No products available';
      return;
    }
    productList.classList.remove('list-empty');

    shown.forEach((p, idx)=>{
      const el = document.createElement('div');
      el.className = 'sale-item';
      el.style.display='flex'; el.style.justifyContent='space-between'; el.style.alignItems='center';
      el.style.padding='8px 4px'; el.style.borderBottom='1px dashed #f1f1f1';
      el.innerHTML = `<div>
                        <div><strong>${p.name}</strong> <span class="muted">(${p.sku})</span></div>
                        <div class="muted">${p.category} • Stock: ${p.stock} • ₱${Number(p.price).toFixed(2)}</div>
                      </div>
                      <div>
                        <button class="btn-dark add" data-idx="${idx}">Add</button>
                      </div>`;
      productList.appendChild(el);
    });

    productList.querySelectorAll('.add').forEach(b=>{
      b.addEventListener('click', ()=>{
        addToCart(Number(b.getAttribute('data-idx')));
      });
    });
  }

  function addToCart(idx){
    const products = readProducts();
    const p = products[idx];
    if(!p) return;
    const cart = readCart();
    const existing = cart.find(c=>c.sku === p.sku);
    if(existing){
      if(existing.qty >= p.stock){
        alert('Not enough stock');
        return;
      }
      existing.qty++;
    } else {
      cart.push({ ...p, qty: 1 });
    }
    writeCart(cart);
    renderCart();
  }

  function renderCart(){
    const cart = readCart();
    if(cart.length === 0){
      cartList.classList.add('list-empty');
      cartList.textContent = 'Cart is empty';
      cartFooter.classList.add('hidden');
      cartCount.textContent = '0';
      cartTotalEl.textContent = '₱0.00';
      return;
    }
    cartList.classList.remove('list-empty');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((c, i)=>{
      total += Number(c.price) * c.qty;
      const item = document.createElement('div');
      item.style.display='flex'; item.style.justifyContent='space-between'; item.style.alignItems='center';
      item.style.padding='6px 0';
      item.innerHTML = `<div><strong>${c.name}</strong> <div class="muted">₱${Number(c.price).toFixed(2)} x ${c.qty}</div></div>
                        <div>
                          <button class="btn-outline dec" data-i="${i}">-</button>
                          <button class="btn-outline inc" data-i="${i}">+</button>
                          <button class="btn-outline del" data-i="${i}">Remove</button>
                        </div>`;
      cartList.appendChild(item);
    });

    cartFooter.classList.remove('hidden');
    cartCount.textContent = cart.reduce((s,c)=>s+c.qty,0);
    cartTotalEl.textContent = '₱' + total.toFixed(2);

    // attach buttons
    cartList.querySelectorAll('.inc').forEach(b=> b.addEventListener('click', ()=>{
      const i = Number(b.dataset.i); const cart = readCart(); const p = readProducts().find(x=>x.sku===cart[i].sku);
      if(cart[i].qty < (p ? p.stock : 9999)){ cart[i].qty++; writeCart(cart); renderCart(); } else alert('Not enough stock');
    }));
    cartList.querySelectorAll('.dec').forEach(b=> b.addEventListener('click', ()=>{
      const i = Number(b.dataset.i); const cart = readCart();
      if(cart[i].qty > 1){ cart[i].qty--; writeCart(cart); renderCart(); } else { cart.splice(i,1); writeCart(cart); renderCart();}
    }));
    cartList.querySelectorAll('.del').forEach(b=> b.addEventListener('click', ()=>{
      const i = Number(b.dataset.i); const cart = readCart();
      cart.splice(i,1); writeCart(cart); renderCart();
    }));
  }

  checkoutBtn && checkoutBtn.addEventListener('click', ()=>{
    const cart = readCart();
    if(cart.length === 0) return alert('Cart is empty');
    // reduce inventory stock
    const products = readProducts();
    cart.forEach(ci=>{
      const p = products.find(x=>x.sku === ci.sku);
      if(p) p.stock = Math.max(0, Number(p.stock) - Number(ci.qty));
    });
    writeProducts(products);
    writeCart([]);
    renderProducts(salesSearch.value);
    renderCart();
    updateDashboardFromStorage();
    alert('Checkout success (demo). Inventory updated.');
  });

  clearCart && clearCart.addEventListener('click', ()=>{
    if(confirm('Clear cart?')){ writeCart([]); renderCart(); }
  });

  salesSearch && salesSearch.addEventListener('input', ()=> renderProducts(salesSearch.value));

  // initial
  renderProducts();
  renderCart();
  updateDashboardFromStorage();
});
