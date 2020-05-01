'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');


const getData = async function(url) {

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка по адресу ${url},
			статус ошибка ${response.status}!`);
	}

	return await response.json();
	

};

const toggleModal = function() {
	modal.classList.toggle("is-open");
};

const toogleModalAuth = function() {
	modalAuth.classList.toggle('is-open');
};

function returnMain() {
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
}

function authorized() {

	function logOut() {
		login = null;
		localStorage.removeItem('gloDelivery');
		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
		returnMain();
	}

	console.log('Авторизован');
	userName.textContent = login;
	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';
	buttonOut.addEventListener('click', logOut)

}

function notAuthorized() {
	console.log('Не авторизован');

	function logIn(event) {
		event.preventDefault();
		if (loginInput.value) {
			loginInput.style.borderColor = '';
			login = loginInput.value;
			localStorage.setItem('gloDelivery', login);
			toogleModalAuth();
			buttonAuth.removeEventListener('click', toogleModalAuth);
			closeAuth.removeEventListener('click', toogleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			logInForm.reset();
			checkAuth();
		} else {
			loginInput.style.borderColor = 'red';
		}
	}
	buttonAuth.addEventListener('click', toogleModalAuth);
	closeAuth.addEventListener('click', toogleModalAuth);
	logInForm.addEventListener('submit', logIn)
}

function checkAuth() {
	if (login) {
		authorized();
	} else {
		notAuthorized();
	}
}

function createCardRestaurant({ image, kitchen, name, price, stars, products, 
	time_of_delivery: timeOfDelivery }) {
	

	const card = `
		<a class="card card-restaurant" data-products="${products}">
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery} мин</span>
				</div>
				<div class="card-info">
					<div class="rating">
						${stars}
					</div>
					<div class="price">От ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
		</a>
	`;
	cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood({ description, image, name, price }) {

	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', `
			<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title card-title-reg">Пицца Классика</h3>
				</div>
				<div class="card-info">
					<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
											грибы.
					</div>
				</div>
				<div class="card-buttons">
					<button class="button button-primary button-add-cart">
						<span class="button-card-text">В корзину</span>
						<span class="button-cart-svg"></span>
					</button>
					<strong class="card-price-bold">510 ₽</strong>
				</div>
			</div>
	`);
	cardsMenu.insertAdjacentElement('beforeend', card);

}

function openGoods(event) {
	const target = event.target;
	if (login) {

		const restaurant = target.closest('.card-restaurant');
		if (restaurant) {
			cardsMenu.textContent = '';
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');
			getData(`./db/${restaurant.dataset.products}`).then(function(data){
				data.forEach(createCardGood);
			});
		}
	} else {
		toogleModalAuth();

	}
}

function init() {
	getData('./db/partners.json').then(function(data){
		data.forEach(createCardRestaurant)
	});
	
	cartButton.addEventListener("click", toggleModal);
	
	close.addEventListener("click", toggleModal);
	
	cardsRestaurants.addEventListener('click', openGoods);
	
	logo.addEventListener('click', returnMain);
	
	checkAuth();
	
	
	
	new Swiper('.swiper-container', {
		loop: true,
		sliderPerView: 1,
		//autoplay: true
	});
}

init();
