const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function (){
    uptadeCartModal();
    cartModal.style.display = "flex"
    
})

// fechar o modal clicando no botão de fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//fechar o modal clicando fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})


menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

//Função para adicionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe, aumenta somente a quantidade + 1
        existingItem.quantity += 1;
    }else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    uptadeCartModal();

}

//Função para atualizar carrinho
function uptadeCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");

        cartItemElement.innerHTML = `
        
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                    <p>Qtd: ${item.quantity}</p>
                </div>

                <div> 
                    <button class="remove-btn" data-name="${item.name}">
                    Remover
                    </button>
                </div>
            </div>
        `
        
        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index != -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            uptadeCartModal();
            return;
        }
        cart.splice(index, 1);
        uptadeCartModal();
    }
}


//Verificar se o usúario preencheu o endereço de entrega
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    
    if(inputValue !== ""){
        addressInput.classList.add("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){


    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }
    //Enviar para API do WhatsApp
    const cartItems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "41991957254"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
})


//Verificar se o restaurante está aberto
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}