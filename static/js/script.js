let shoppingCart = document.querySelector(".shopping-cart");
let cartContainer = document.querySelector("#cartContainer");
let userCart = [];

class ProductDeciphering {
  async getProductById() {
    try {
      let data = await fetch("static/data/data.json");
      let initResults = await data.json();
      let decipheredResults = initResults.items.map((product) => {
        let { id } = product.sys;
        let { title, price } = product.fields;
        let image = product.fields.image.fields.file.url;

        return { id, title, price, image };
      });
      return decipheredResults
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  addItemsToProductSection(product){
    let productSectionFirstDiv = document.createElement('div');
    productSectionFirstDiv.classList.add('col-12', 'col-ms-6', 'col-md-4', 'col-lg-3');
    productSectionFirstDiv.innerHTML = `
          <div class="card border-0 bg-transparent">
            <div class="img-card img-container">
              <img src=${product.image} alt="" class="img-fluid">
              <button class="fs-5 custome-shopping-icon" data-id=${product.id}><i class="fa-solid fa-cart-plus" ></i> ADD TO CART</button>
            </div>
            <div class="card-body my-2">
              <h1 class="fs-5 fw-bold">${product.title}</h1>
              <h3 class="fs-6 text-warning">$ ${product.price}</h3>
            </div>
          </div>
    `;
    document.querySelector("#productSectionRow").appendChild(productSectionFirstDiv);
  }
  addingItemToCartFromProductSection(){
    const addToCartBtns = [...document.querySelectorAll('.custome-shopping-icon')];
    addToCartBtns.forEach(btn => {
      let productId = btn.dataset.id;
      let inCartBtn = userCart.find(item => item.id === productId);
      if (inCartBtn) {
        btn.innerText = "IN CART";
        btn.disabled = true;
      }
      btn.addEventListener('click', (event) =>{
        event.target.innerText = "IN CART";
        event.target.disabled = true;
        let productDetails = Storage.getProductById(productId);
        Storage.userProducts(productDetails);
        UI.updatingUserCartDisplayAndIcon();
      });
      
    });

  }
  static addItemsToShoppingCart(product, counter) {
    let shoppingFirstDiv = document.createElement("div");
    shoppingFirstDiv.classList.add("row", "shoppingItems", "my-2");
    shoppingFirstDiv.innerHTML = `
     <div class="col-12">
        <div class="card py-1 px-2 border-0">
          <div class="card-body">
            <div class="row">
              <div class="col-3">
                <img src=${product.image} alt="" class="img-fluid w-100">
              </div>
              <div class="col-6">
                <h1 class="fs-5 my-0 ">${product.title}</h1>
                <h1 class="fs-6 text-warning my-0">${product.price} $</h1>
                <h2 class="fs-5 text-secondary remove-key my-0" data-id=${product.id}>remove</h2>
              </div>
              <div class="col-2 offset-1">
                <h1 class="custome-arrow fs-6 my-0 text-center"><i class="fa-solid fa-angle-up" data-id=${product.id}></i></h1>
                <h1 class="text-center fs-6 my-0">${counter}</h1>
                <h1 class="custome-arrow fs-6 my-0 text-center"><i class="fa-solid fa-angle-down" data-id=${product.id}></i></h1>

              </div>
            </div>
          </div>
        </div>
      </div>`;
    cartContainer.appendChild(shoppingFirstDiv);
    shoppingCart.classList.add("active");
  }
  openCartWithUserCartBtn(){
    document.querySelector("#cartIcon").addEventListener("click", () => {
      shoppingCart.classList.add("active");
    });
  }
  closeCartWithXmarkBtn(){
    document.querySelector("#xmarkIcon").addEventListener("click", () => {
      shoppingCart.classList.remove("active");
    });
  }

  clearCartWithEmptyBtn(){
    document.querySelector("#emptyCart").addEventListener("click", () => {
      document.querySelectorAll(".row.shoppingItems").forEach((element) => {
        element.innerHTML = "";
      });

      const removefromCartBtns = [
        ...document.querySelectorAll(".custome-shopping-icon"),
      ];
      removefromCartBtns.forEach((btn) => {
        btn.innerHTML = `<i class="fa-solid fa-cart-plus" ></i> ADD TO CART`;
        btn.disabled = false;
      });

      Storage.clearUserCart();
      document.querySelector("#totalPrice").innerText = `0`;
      shoppingCart.classList.remove("active");
      document.querySelector('.counter').innerText = 0;
    });
  }

  static updatingUserCartDisplayAndIcon(){
    document.querySelectorAll(".row.shoppingItems").forEach((element) => {
      element.innerHTML = "";
    });
    userCart = Storage.getUserCart();
    document.querySelector(".counter").innerText = userCart.length;
    let elementIds = [];
    userCart.forEach(element => elementIds.push(element.id));
    const counts = elementIds.reduce(
      (acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1,
      }),
      {}
    );
    for (const [key, value] of Object.entries(counts)){
      let product = Storage.getProductById(key);
      UI.addItemsToShoppingCart(product, value);
    }
    let totalPrice = 0;
    userCart.forEach((element) => {
      totalPrice += element.price;
    });
    document.querySelector("#totalPrice").innerText = `${totalPrice}`;
  }
  removingItemsWithRemoveBtn(){
    document.querySelectorAll('.remove-key').forEach(removeKey =>{
      removeKey.addEventListener('click', () => {
        console.log(removeKey.dataset.id);
      });
    });
  }
}

class Storage{
  static allProduct(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProductById(productId){
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === productId);
  }
  static userProducts(product){
    let UserProducts = JSON.parse(localStorage.getItem('userProducts'));
    if (UserProducts === null) {
      localStorage.setItem("userProducts", JSON.stringify([]));
    }
    UserProducts.push(product);
    localStorage.setItem('userProducts', JSON.stringify(UserProducts));
  }
  static clearUserCart(){
    localStorage.setItem('userProducts', JSON.stringify([]));
  }
  static getUserCart(){
    return JSON.parse(localStorage.getItem('userProducts'));
  }
  static removeProductFromUserCartById(productId){
    let products = JSON.parse(localStorage.getItem('userProduct'));
    
  }
}




// main 
window.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new ProductDeciphering();

  products.getProductById().then(products => {
    products.forEach(product => {
      ui.addItemsToProductSection(product);
    });
    Storage.allProduct(products);
    UI.updatingUserCartDisplayAndIcon();
  }).then( () => {
    ui.addingItemToCartFromProductSection();
    ui.openCartWithUserCartBtn();
    ui.closeCartWithXmarkBtn();
    ui.clearCartWithEmptyBtn();
    ui.removingItemsWithRemoveBtn();
    



    window.onscroll = () => {
      let shoppingCartClassList = Object.values(shoppingCart.classList);
      if (shoppingCartClassList.includes("active")) {
        shoppingCart.classList.remove("active");
      }
    };
  }).then( () => {
    
  });
});

// document.querySelector("#addingToCartIcon").addEventListener("click", () => {
//   shoppingCart.classList.add("active");
//   ui.addItemsToShoppingCart();
// });








