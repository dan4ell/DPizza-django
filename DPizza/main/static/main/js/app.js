var buyAssorti = document.getElementById('assorti')
var buyVetchina = document.getElementById('vetchina')
var buyHavai = document.getElementById('havai')
var buyPepperoni = document.getElementById('pepperoni')
var totalAmount = document.getElementById('totalAmount')
var notification = document.getElementById('notification')
var openModalButton = document.getElementById('open-korzinka')
var closeModalButton = document.getElementsByClassName('close')[0];
var modal = document.getElementById('korzine-modal')
var overlay = document.getElementById('overlay')
var cartItems = document.getElementsByClassName('korzine-modal-items')[0];
var modalPayment = document.getElementsByClassName('korzine-modal-payment')[0];
var changeQuantityDiv = document.getElementsByClassName('change-quantity')[0];
var products = []
var newAmount = 0


// Главная функция для подсчёта денег в корзинке
function buyProduct(price, productName, activeButton){
var currentAmount = parseInt(totalAmount.textContent);
newAmount = currentAmount + price;
totalAmount.textContent = newAmount

var existingProduct = products.find(function(item){
    return item.name === productName
})
if (existingProduct){ // это условия для добавления элементов в массив
    existingProduct.quantity++;
    existingProduct.price += price;
}else{
    products.push({name: productName, quantity: 1, price: price})
}

var productPayment = document.createElement('span') // добавляем span с суммой
var productPaymentBtn = document.createElement('button') // добавляем кнопку оплаты
productPaymentBtn.setAttribute("class", "btn btn-success") // добавляем атрибуты для кнопки
productPaymentBtn.setAttribute("style", "margin-top: 15px;")
productPaymentBtn.setAttribute("id", "btn-order")
productPayment.setAttribute("id", 'payment-price')
productPayment.innerText = 'К оплате: ' + newAmount + ' руб.'
productPaymentBtn.innerText =  'Оплатить' // текст для кнопки
modalPayment.innerHTML = ''; // убираем предыдущие записи, чтобы они не стакнулись вместе в классе korzine-modal-payment
modalPayment.appendChild(productPayment); // добавляем productPayment (Сумма к оплате) в модальное окно
modalPayment.appendChild(productPaymentBtn); // добавляем кнопку в модальное окно
cartItems.innerHTML = ''; // убираем надпись 'корзина пуста' из cardItems
notification.textContent = productName + ' добавлен в корзину'
notification.style.display = 'block'
setTimeout(function(){
notification.style.display = 'none';
}, 2000)
}

function removeProduct(productName){
    var index = products.findIndex(function(item){
        return item.name === productName
    })
    if (index !== -1){
        products.splice(index, 1)
    }
    removePrice(totalAmount)
}

function removePrice(totalAmount){
    var productPayment = document.getElementById('payment-price')
    var currentAmount = parseInt(totalAmount.textContent)
    var finishAmount = 0
    products.forEach(function(product) {
      finishAmount += product.price // forEach перебирает по каждому индексу элементы массива, берет .price из объектов и прибавляет их
    });
    totalAmount.textContent =  finishAmount // в корзинке изменяем число.
    productPayment.innerText = 'К оплате: ' + finishAmount + ' руб.' // изменяем число в модальном окне
    if(finishAmount === 0){
        var orderButton = document.getElementById('btn-order') // кнопка из модального окна
        var dogImage = document.createElement('img')
        var dogImageLabel = document.createElement('h2')
        productPayment.style.display = 'none' // убираем сумму если сумма заказа равна нулю
        orderButton.style.display = 'none' // убираем кнопку если сумма заказа равна нулю
        dogImage.setAttribute('src', '../static/main/img/nothing.svg')
        dogImage.setAttribute('style', 'margin-top: 50px;')
        dogImageLabel.innerText = 'Корзина пуста 😭'
        modalPayment.appendChild(dogImageLabel)
        modalPayment.appendChild(dogImage)
    }
}

//добавляем ценники для продуктов и используем функцию корзинки
buyAssorti.addEventListener('click', function(){
buyProduct(700, 'Ассорти', buyAssorti);
})
buyVetchina.addEventListener('click', function(){
buyProduct(650, 'Ветчина и сыр', buyVetchina);
})
buyHavai.addEventListener('click', function(){
buyProduct(550, 'Гавайская', buyHavai);
})
buyPepperoni.addEventListener('click', function(){
buyProduct(650, 'Пепперони', buyPepperoni);
})

// функция модального окна корзинки
function openModal(){
modal.style.display = 'block';
overlay.style.display = 'block';
if(products.length === 0){
    let a //просто ничего не делаем если в массиве нет продуктов
}else{
    cartItems.innerHTML = ''; // важная штука, чистит перед каждым открытием модального окна список продуктов от коллизии
}

for(var i = 0; i < products.length; i++){
    var productItem = document.createElement('span');
    var closeButton = document.createElement('button');
    productItem.innerText = products[i].name + " : " + products[i].quantity // перебираем список по индексам именно поэтому список не повторяется
    closeButton.setAttribute('data-product-name', products[i].name)
    closeButton.innerText = '❌'
    closeButton.addEventListener('click', handleRemoveFromCart)
    closeButton.setAttribute('class', "close-button")

    productItem.appendChild(closeButton);
    cartItems.appendChild(productItem);
}
}

function handleRemoveFromCart(event){
    var productName = event.target.getAttribute('data-product-name');
    removeProduct(productName); // вызов функции removeProduct
    event.target.parentNode.remove(); // удаление элемента из DOM
}

function closeModal(){
modal.style.display = 'none';
overlay.style.display = 'none';
}
openModalButton.addEventListener('click', openModal)
closeModalButton.addEventListener('click', closeModal)


