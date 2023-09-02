var jsonProducts = localStorage.getItem('product-list');
var products = JSON.parse(jsonProducts)

var productsFunc = function(){
    for(i = 0; i < products.length; i++){
        ul = document.getElementById('order-list')
        img = document.createElement('img')
        li = document.createElement('li')
        h4 = document.createElement('h4')
        h5 = document.createElement('h5')
        img.setAttribute('src', '../static/main/img/pizza.png')
        img.setAttribute('style', 'width: 64px;')
        if (products[i].quantity === 1){
            h4.textContent = products[i].name
            h5.textContent = products[i].price + " " + "₽"
            ul.appendChild(li)
            li.appendChild(img)
            li.appendChild(h4)
            li.appendChild(h5)
        }
        if(products[i].quantity != 0 && products[i].quantity != 1){
            h4.textContent = products[i].name + " " + "(" + products[i].quantity + ")"
            h5.textContent = products[i].price + " " + "₽"
            ul.appendChild(li)
            li.appendChild(img)
            li.appendChild(h4)
            li.appendChild(h5)
        }

    }
}
var scrollFunc = function(){
total = document.getElementsByClassName('total')[0]
total.scrollIntoView({behavior: 'smooth'});
}

// scroll
var scrollBtnFunc = function(){
    var scrollBtn = document.getElementById('goPayBtn');
    scrollBtn.addEventListener('click', function(){
    upperElement = document.getElementsByClassName('subject')[0];
    upperElement.scrollIntoView({behavior: 'smooth'});
    })
}



window.addEventListener('load', scrollFunc)
window.addEventListener('load', productsFunc)
window.addEventListener('load', scrollBtnFunc)

