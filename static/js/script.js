let shoppingCart = document.querySelector(".shopping-cart");
let cartContainer = document.querySelector("#cartContainer");

class ProductDeciphering {
  async getProduct() {
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
              <h1 class="fs-5 custome-shopping-icon" id="addingToCartIcon"><i class="fa-solid fa-cart-plus" data-id=${product.id}></i> ADD TO CART</h1>
            </div>
            <div class="card-body my-2">
              <h1 class="fs-5 fw-bold">${product.title}</h1>
              <h3 class="fs-6 text-warning">$ ${product.price}</h3>
            </div>
          </div>
    `;
    document.querySelector("#productSectionRow").appendChild(productSectionFirstDiv);
  }

  addItemsToShoppingCart() {
    let shoppingFirstDiv = document.createElement("div");
    shoppingFirstDiv.classList.add("row", "shoppingItems", "my-2");
    shoppingFirstDiv.innerHTML = `
     <div class="col-12">
        <div class="card py-1 px-2 border-0">
          <div class="card-body">
            <div class="row">
              <div class="col-3">
                <img src="static/images/kaboompics_Grey long sofa with pillows.jpg" alt="" class="img-fluid w-100">
              </div>
              <div class="col-6">
                <h1 class="fs-5 my-0 ">Couch</h1>
                <h1 class="fs-6 text-warning my-0">10.99$</h1>
                <h2 class="fs-5 text-secondary remove-key my-0">remove</h2>
              </div>
              <div class="col-2 offset-1">
                <h1 class="custome-arrow fs-6 my-0 text-center"><i class="fa-solid fa-angle-up"></i></h1>
                <h1 class="text-center fs-6 my-0">0</h1>
                <h1 class="custome-arrow fs-6 my-0 text-center"><i class="fa-solid fa-angle-down"></i></h1>

              </div>
            </div>
          </div>
        </div>
      </div>`;
    cartContainer.appendChild(shoppingFirstDiv);
  }
}

class Storage{
  static allProduct() {
    localStorage
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new ProductDeciphering();

  products.getProduct().then(products => products.forEach(product => {
    ui.addItemsToProductSection(product);
  }))
});

// document.querySelector("#addingToCartIcon").addEventListener("click", () => {
//   shoppingCart.classList.add("active");
//   ui.addItemsToShoppingCart();
// });

// document.querySelector("#cartIcon").addEventListener("click", () => {
//   shoppingCart.classList.add("active");
// });

// document.querySelector("#xmarkIcon").addEventListener("click", () => {
//   shoppingCart.classList.remove("active");
// });

// document.querySelector("#emptyCart").addEventListener("click", () => {
//   document.querySelectorAll(".row.shoppingItems").forEach((element) => {
//     element.innerHTML = "";
//   });
// });

// window.onscroll = () => {
//   let shoppingCartClassList = Object.values(shoppingCart.classList);
//   if (shoppingCartClassList.includes("active")) {
//     shoppingCart.classList.remove("active");
//   }
// };
