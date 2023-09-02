// modal script
var modal = document.getElementsByClassName('korzine-modal')[0];
var openModalBtn = document.getElementById('open-korzinka');
var closeModalBtn = document.getElementsByClassName('close')[0];
var cartItems = document.getElementsByClassName('korzine-modal-items')[0];
function openModal(){
    var cartPayment = document.getElementsByClassName('korzine-modal-payment')[0]
    var currentAmount = parseInt(totalAmount.textContent)
    modal.style.display = 'block';
    overlay.style.display = 'block';
    if (currentAmount === 0){
        var dogImage = document.createElement('img')
        var dogImageLabel = document.createElement('h2')
        cartItems.innerText = ''
        cartPayment.innerText = ''
        dogImage.setAttribute('src', '../static/main/img/nothing.svg')
        dogImage.setAttribute('style', 'margin-top: 50px;')
        dogImageLabel.textContent = 'Корзина пуста'
        dogImageLabel.setAttribute('style', 'font-weight: 800; color: #E90C4E')
        cartItems.appendChild(dogImageLabel)
        cartItems.appendChild(dogImage)
    }else{  // если есть товары в корзине сработает эта функция
            cartItems.innerText = '' // чистим cartItems чтобы список продуктов не дублировался

            var hiddenInput = document.createElement('input') // скрытый input для отправки цены в python
            hiddenInput.setAttribute('style', 'display: none;')
            hiddenInput.setAttribute('name', 'totalPrice')
            hiddenInput.value = parseInt(totalAmount.textContent)
            cartItems.appendChild(hiddenInput)

            for(i = 0; i < products.length; i++){
                cartPayment.innerText = '' // тоже самое с payment, но внутри цикла потому что buyButton у нас 4 кнопки в цикле выше
                if(products[i].quantity > 0){ // если продукта больше чем 1
                    var itemDiv = document.createElement('div')
                    var itemSpan = document.createElement('span')
                    var closeBtn = document.createElement('span')
                    hiddenInput.value = parseInt(totalAmount.textContent)
                    closeBtn.textContent = '❌' // кнопка удаляющая продукт
                    closeBtn.setAttribute('style', 'cursor: pointer; font-size: .8em; margin-left: 5px;')
                    closeBtn.setAttribute('data-product-name', products[i].name)
                    closeBtn.addEventListener('click', delProduct)
                    itemSpan.setAttribute('style', 'font-weight: 800;')
                    itemSpan.textContent = products[i].name + ", кол-во:" + " " + products[i].quantity
                    cartItems.appendChild(itemDiv)
                    itemDiv.appendChild(itemSpan)
                    itemDiv.appendChild(closeBtn)
                }


                // payment
                var paymentItemSpan = document.createElement('span')
                var paymentItemBtn = document.createElement('button')
                paymentItemSpan.textContent = 'Итого сумма заказа: ' + totalAmount.textContent
                paymentItemSpan.setAttribute('style', 'color: #999999; font-weight: 600;')
                paymentItemBtn.innerText = 'Заказать'
                paymentItemBtn.setAttribute('class', 'btn btn-success')
                paymentItemBtn.setAttribute('style', 'font-weight: 800; margin-top: 20px;')
                paymentItemBtn.setAttribute('type', 'submit')
                paymentItemBtn.setAttribute('name', 'successOrder')
                paymentItemBtn.addEventListener('click', function(){
                    jsonProducts = JSON.stringify(products)
                    localStorage.setItem('product-list', jsonProducts)
                    window.document.location = './success.html'
                })
                cartPayment.appendChild(paymentItemSpan)
                cartPayment.appendChild(paymentItemBtn)
            }
    }

}


function closeModal(){
    modal.style.display = 'none';
    overlay.style.display = 'none';
}
closeModalBtn.addEventListener('click', closeModal)
openModalBtn.addEventListener('click', openModal)


// korzina script
var buyButtons = document.getElementsByClassName('buy-btn');
var totalAmount = document.getElementById('totalAmount'); // span с общей суммой
var finallyAmount = 0
var products = []
for(var i = 0; i < buyButtons.length; i++){
    buyButtons[i].addEventListener('click', funcBuyBtn)
}
function funcBuyBtn(){
        var product = this.parentNode
        var productPrice = product.getAttribute('data-price') // стоимость товара
        var productName = product.getAttribute('data-name') // имя товара
        var intProductPrice = parseInt(productPrice) // парсим в INT стоимость товара


        var existingProducts = products.find(function(item){
            return item.name === productName
        })
        if(existingProducts){ // проверяем на наличие продукта
            existingProducts.quantity ++
            existingProducts.price = intProductPrice * existingProducts.quantity
        }else{ // если нет в наличии добавляем
            products.push({name: productName, price: intProductPrice, quantity: 1})
        }
        // notification
        var notification = document.getElementById('notification')
        notification.style.display = 'flex'
        notification.textContent = productName + ' добавлен в корзину'
        setTimeout(function(){
        notification.style.display = 'none'
        }, 5000)

        // вызываем функцию для изменения quantity
        var activeButton = this; // получаем активную кнопку экземпляром // this - отслеживает элемент на который нажали
        var btnAttr = parseInt(activeButton.getAttribute('btn-numb')) // получаем аттрибут из кнопки с index div-элемента
        changeQuantity(activeButton, productName, productPrice, btnAttr) // передаем актив кнопку в функцию
    }

function delProduct(event){
    finallyAmount = 0 // обнуляем при каждом нажатии на кнопку чтобы ниже заново рассчитать
    var productName = event.target.getAttribute('data-product-name');
    var existingProducts = products.find(function(item){
            return item.name === productName
    })
    existingProducts.quantity = 0
    existingProducts.price = 0
    products.forEach(function(product){
    finallyAmount += product.price
    })
    totalAmount.textContent = finallyAmount

    var productElements = document.getElementsByClassName('product'); // обновляем элемент на странице после удаления его из корзины
    for(var i = 0; i < productElements.length; i++){
        var productName = productElements[i].getAttribute('data-name')
        if (existingProducts.name === productName){
            var changeQuantity = productElements[i].querySelector('.change-quantity')
            var buyBtn = productElements[i].querySelector('.buy-btn')
            changeQuantity.style.display = 'none'
            buyBtn.style.display = 'block'
        }
    }

    openModal() // обновляем модальное окно для нью данных
}


function changeQuantity(buyButtons, productName, productPrice, btnAttr){
    var currentAmount = parseInt(totalAmount.textContent) // парсим в INT текущее число из span
    var intProductPrice = parseInt(productPrice) // парсим в INT стоимость товара
    finallyAmount = currentAmount + intProductPrice // складываем стоимость + текущее число в spane
    totalAmount.textContent = finallyAmount
    var divQuantity = document.getElementsByClassName('change-quantity');
    var currentDiv = divQuantity[btnAttr] // создаем переменную которая принимает текущий активный div по аттрибуту из нажатой кнопки

    currentDiv.innerText = ''
    var minusQuantity = document.createElement('button');
    var pluseQuantity = document.createElement('button');
    var spanQuantity = document.createElement('span');
    minusQuantity.setAttribute('class', 'btn btn-dark btn-quantity')
    minusQuantity.textContent = '-'
    minusQuantity.setAttribute('style', 'margin: 0')
    pluseQuantity.setAttribute('class', 'btn btn-dark btn-quantity')
    pluseQuantity.textContent = '+'
    buyButtons.style.display = 'none';
    currentDiv.style.display = 'flex';
    spanQuantity.setAttribute('id', 'span-quantity')
    currentDiv.appendChild(minusQuantity);
    currentDiv.appendChild(spanQuantity);
    currentDiv.appendChild(pluseQuantity);
    var existingProducts = products.find(function(item){
            return item.name === productName
    })
    existingProducts.price = intProductPrice * existingProducts.quantity

    spanQuantity.textContent = existingProducts.quantity // span Text

    pluseQuantity.addEventListener('click', function(){
        existingProducts.quantity ++
        existingProducts.price += parseInt(productPrice)
        spanQuantity.textContent = existingProducts.quantity
        var totalPrice = 0 // обнуляем цену перед входом в цикл forEach
        products.forEach(function(product){
            totalPrice += product.price // перебираем элементы массива для получения общего price

        }) // актуальная цена
        totalAmount.textContent = totalPrice
    })
     minusQuantity.addEventListener('click', function(){
        if (parseInt(existingProducts.quantity) == 1 || parseInt(existingProducts.quantity) > 1){
            existingProducts.quantity --
            existingProducts.price -= parseInt(productPrice)
            spanQuantity.textContent = existingProducts.quantity
            var totalPrice = 0 // обнуляем цену перед входом в цикл forEach
            products.forEach(function(product){
                totalPrice += product.price // перебираем элементы массива для получения общего price
            }) // актуальная цена
            totalAmount.textContent = totalPrice
        }
        if(parseInt(existingProducts.quantity) == 0){
            currentDiv.style.display = 'none';
            buyButtons.style.display = 'block';
            spanQuantity.textContent = existingProducts.quantity
        }
    })
}


// прокрутка до footer
link = document.getElementById('scroll-footer')
footer = document.querySelector('footer')
link.addEventListener('click', function(event){
    event.preventDefault(); // убирает значения с ссылки типо href="#"
    footer.scrollIntoView({behavior: 'smooth'}); // делаем скролл
})
// прокрутка в reviews
modalButton = document.getElementById('reviewsBtn')
makeReviewBlock = document.querySelector('.create-review')
modalButton.addEventListener('click', function(event){
    setTimeout(function(){
        makeReviewBlock.scrollIntoView({behavior: 'smooth'});
    }, 900)
})