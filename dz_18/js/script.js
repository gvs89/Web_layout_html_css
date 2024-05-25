// Корзина
const cartArray = [];

// Элемент корзины (массива cartArray)
class itemCard {
    constructor(card, quantity = 1) {
        this.card = card;
        this.quantity = quantity;
    }
}

// Сбор элементов сайта для обращения к ним
const pack = document.getElementById("pack");
const children = pack.children;

const take = document.getElementById("take");
const take__container = document.getElementById("take__container");

const addToCart = document.querySelectorAll(".card__button");

const cartCounter = document.getElementById("parent");

// Прячем div пустой корзины
hide();

// Раздаем индексы карточкам товара в блоке Featured Items
for (let index = 0; index < children.length; index++) {
    children[index].setAttribute("data-index", index);
}

// При клике на карточку товара: если его не было в корзине — добавляем, если был, увеличиваем количество на 1.
[].forEach.call(addToCart, function (el) {
    el.onclick = function () {
        const parentCard = el.closest(".card");
        let cardNumber = parentCard.getAttribute("data-index");
        let probe = findCard(cartArray, cardNumber);
        if (probe === -1) {
            const newCard = new itemCard(cardNumber, 1);
            cartArray.push(newCard);
        }
        if (probe >= 0) {
            cartArray[probe].quantity++;
        }
        render();
    };
});

// Добавляем слушатель событий блоку take, так, чтобы он реагировал на клик по созданным в нем объектам cartitem__remove
take.addEventListener("click", function (e) {
    if (e.target.classList.contains("cartitem__remove")) {
        const card = e.target.getAttribute("data-index");
        let probe = findCard(cartArray, card);
        let checkQuantity = cartArray[probe].quantity;
        if (checkQuantity > 1) {
            cartArray[probe].quantity--;
        }
        if (checkQuantity <= 1) {
            cartArray.splice(probe, 1);
        }
        render();
    }
});

// Перевыводим измененный take
function render() {
    hide();
    take__container.innerHTML = ``;
    cartArray.forEach((element) => {
        take__container.innerHTML += cardBuild(element.card, element.quantity);
    });
    take.innerHTML = `
	    <div class="take__header">
	        <h2 class="goods__header text__center">Cart Items</h2>
	    </div>
	    <div class="take__container">
	        ${take__container.innerHTML}
	    </div>
    `;
}

// Прячем take и круг с количеством товара на иконке корзины, если корзина пуста
function hide() {
    if (cartArray.length === 0) {
        take.style.display = "none";
        // cartCounter.setAttribute("count", 1337);
        // При трех и более знаках в сумме товаров в корзине число криво сидит в кружке иконки
        // Вариант: делать кружок дивом, а не псевдоэлементом
        cartCounter.classList.remove("parent__info");
    }
    if (cartArray.length > 0) {
        take.style.display = "block";
        cartCounter.setAttribute("count", countCart(cartArray));
        cartCounter.classList.add("parent__info");
    }
}

// Создаем карточку товара
function cardBuild(number, quantity) {
    number = parseInt(number) + 1;
    let cardHTML = `
            <div class="cartitem">
                <div class="cartitem__imagebox">
                    <img
                        class="cartitem__img"
                        src="img/goods0${number}.png"
                        alt="goods01"
                    />
                </div>
                <div class="cartitem__box">
                <div class="text__container">
                    <h3 class="cartitem__header">MANGO PEOPLE T&#8209SHIRT</h3>
                    <p class="cartitem__info">
                        Price: <span class="cartitem__info_price">$300</span>
                    </p>
                    <p class="cartitem__info">Color: Red</p>
                    <p class="cartitem__info">Size: Xl</p>
                    <div class="cart__quantity">
                        <p class="cartitem__info">Quantity:</p>
                        <p class="cartitem__number">${quantity}</p>
                    </div>
                    </div>
					<div class="cartitem__remove" data-index="${number - 1}">
						<img class="remove__img" src="img/remove.svg" alt="remove">
					</div>
                </div>
            </div>
            `;
    return cardHTML;
}

// Ищем товар в корзине
function findCard(arr, item) {
    return arr.findIndex((e) => e.card === item);
}

// Считаем общее количество товаров в корзине
function countCart(arr) {
    return arr.reduce((a, b) => a + b.quantity, 0);
}
