//Swiper
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//Inputmask
import Inputmask from "inputmask";

//Fancybox
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
Fancybox.bind("[data-fancybox]", {
	on: {
		done: (fancybox, slide) => {
			if(document.querySelector('.popup-window')){
				document.querySelector('.popup-window').classList.remove('hide');
			}
		},
		close: (fancybox, slide) => {
			if(document.querySelector('.popup-window')){
				document.querySelector('.popup-window').classList.add('hide');
			}
		}
	}
});

// Маска для телефона
document.addEventListener("DOMContentLoaded", function(){
	if(document.querySelector('.js-phone')){
		Inputmask('+7 (999) 999-9999').mask('.js-phone');
	}
});

// Табуляция
if(document.querySelector('.js-tabs-page')){
	document.querySelectorAll('.js-tabs-page').forEach(function(tabs){
		let firstTab = tabs.querySelector('.js-tabs-page-item:first-child');
		let firstTabContent = tabs.querySelector('.js-tabs-page-content-item:first-child');

		//Активируем пункты по умолчанию
		firstTab.classList.add('active');
		firstTabContent.classList.add('active');
	});

	//Переключение табов
	document.querySelectorAll('.js-tabs-page-item').forEach(function(elem){
		elem.addEventListener('click', function(){
			toggleTabs(elem);
		})
	});

	function toggleTabs(elem) {
		let idTab = elem.getAttribute('data-item');
		let tabContent = document.querySelector('.js-tabs-page-content-item[id="'+idTab+'"]');
		let tabDesc = tabContent.querySelector('.js-tabs-page-desc-item');
		let parent = elem.closest('.js-tabs-page');

		parent.querySelectorAll('.js-tabs-page-item').forEach(function(item){
			item.classList.remove('active');
		});

		parent.querySelectorAll('.js-tabs-page-content-item').forEach(function(item){
			item.classList.remove('active');
			item.style.maxHeight = "0px";
		});
		
		elem.classList.add("active");
		tabContent.classList.add("active");
		
		if ( tabContent.classList.contains("active") ) {
			tabContent.style.maxHeight = `${tabDesc.clientHeight}px`;
		} else {
			tabContent.style.maxHeight = "0px";
		}
	}
}

// Валидация форм

//Функция добавления ошибки
const generateError = function (text) {
	var error = document.createElement('div')
	error.className = 'error-msg'
	// error.style.color = 'red'
	error.innerHTML = text
	return error
}

document.querySelectorAll(".js-btn-submit").forEach(function(btn){
	btn.onclick = function(e){
		e.preventDefault();

		var form =  e.target.closest('form');
		var patternEmail = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,6}\.)?[a-z]{2,6}$/i;

		//Очистка ошибок
		form.querySelectorAll('.error').forEach(function(err){
			if(err.querySelector('.error-msg')){
				err.querySelector('.error-msg').remove();
			}
			err.querySelector('input').setAttribute('placeholder', '');
			err.classList.remove('error');
		});
	  
		//Проверка полей на пустоту
		form.querySelectorAll('.js-form-site-item input').forEach(function(field){
			//Проверка email
			// if(field.type == 'email' && field.value !== ''){
			if(field.type == 'email'){
				if (!patternEmail.test(field.value)) {
					var errorMsg =  generateError('Укажите корректный E-mail');
					field.parentElement.classList.add('error');
					// field.parentElement.append(errorMsg);
				}
			}else{
				//Проверка всех полей
				if (field.value === '' &&  field.hasAttribute('required')) {
					var errorMsg = generateError('Заполните поле');
					field.parentElement.classList.add('error');
					// field.parentElement.append(errorMsg);
				}
			}
		});

		//Проверка checkbox на checked
		form.querySelectorAll('.js-form-site-check input').forEach(function(field){
			if(!field.checked && field.hasAttribute('required')){
				var errorMsg = generateError('Заполните поле');
				field.closest('.js-form-site-check').classList.add('error');
				field.parentElement.after(errorMsg);
			}
		});

		// var idRecaptcha = btn.closest('form').querySelector('.g-recaptcha').getAttribute('data-widget');

		// console.log('idRecaptcha = ', idRecaptcha);
		// var response = grecaptcha.getResponse(idRecaptcha);
		// var captcha = btn.closest('form').querySelector('.js-form-site-captcha');

		// if(response.length == 0) {
		// 	var errorMsg = generateError('Пройдите проверку');
		// 	captcha.classList.add('error');
		// 	captcha.append(errorMsg);
		// }

		if(form.querySelectorAll('.error').length === 0){
			form.reset();
			Fancybox.close();
			Fancybox.show([{ src: "#msg-success", type: "inline" }]);
			// let url = form.getAttribute('action');
			// const formData=new FormData(form);
			// formData.append('web_form_submit', 'Отправить');

			// sendForm(url, formData, function(){
			// 	form.reset();
			// });

		}
	};
});

var successTitle = document.querySelector('.js-success-alert-title').innerHTML;
var successText = document.querySelector('.js-success-alert-text').innerHTML;

document.addEventListener('openSuccessPopupForm',function(e){
	let curSuccessTitle = e.target.activeElement.closest('.js-valid-form').getAttribute('data-title');
	let curSsuccessText = e.target.activeElement.closest('.js-valid-form').getAttribute('data-text');

	if(curSuccessTitle){
		document.querySelector('.js-success-alert-title').innerHTML = curSuccessTitle;
	}else{
		document.querySelector('.js-success-alert-title').innerHTML = successTitle;
	}

	if(curSsuccessText){
		document.querySelector('.js-success-alert-text').innerHTML = curSsuccessText;
	}else{
		document.querySelector('.js-success-alert-text').innerHTML = successText;
	}

	Fancybox.close();
	Fancybox.show([{ src: "#msg-success", type: "inline" }]);
});

async function sendForm(url, data, functionSuccess){
	let response = await fetch(url,{
		method: 'POST',
		body: data
	});
	
	if (response.ok){
		let text = await response.text();
		let event = new Event("openSuccessPopupForm");
		document.dispatchEvent(event);
		functionSuccess();
	} else {
		alert("Ошибка HTTP: " + response.status);
	}
}

// Yandex карта
if(document.querySelector('#map')){
	// Иницилизация карты
	ymaps.ready(init);
	var myMap;

	function init(){
		
		let latitudeCenter = document.querySelector('.js-branche-item').getAttribute('data-lat');
		let longitudeCenter = document.querySelector('.js-branche-item').getAttribute('data-long');
		
		myMap = new ymaps.Map("map", {
			center: [latitudeCenter, longitudeCenter],
			zoom: 14,
			controls: [],
		});

		//Задаем метки
		document.querySelectorAll('.js-branche-item').forEach(function(item){
			let latitude = item.getAttribute('data-lat');
			let longitude = item.getAttribute('data-long');
			let address = item.getAttribute('data-address');

			placemark(latitude, longitude, address);
		});

		function placemark(lat, long, text) {
			var myPlacemark = new ymaps.Placemark([lat, long] , 
				{
					balloonContentBody: text,
					hintContent: text
				},
				{
					iconLayout: 'default#image',
					iconImageHref: '/img/marker.svg',
					iconImageSize: [26, 39],
					iconImageOffset: [-13, -17],
				});
	
			myMap.geoObjects.add(myPlacemark);
		}
	}

	document.querySelectorAll('.js-branche-item').forEach(function(elem){
		elem.addEventListener('click', function(){
			let latitude = Number(elem.getAttribute('data-lat'));
			let longitude = Number(elem.getAttribute('data-long'));

			myMap.panTo(
				// Координаты нового центра карты
				[latitude, longitude], {
					flying: true
				}
			)
		})
	});
}

// Слайдер инструкторов
const certificateSlider = new Swiper('.js-instructors-slider',
{
	modules: [Navigation],
	slidesPerView: 1.5,
	spaceBetween: 20,
	loop:true,
	navigation: {
		nextEl: '.js-instructors-slider-next',
		prevEl: '.js-instructors-slider-prev',
	},
	breakpoints: {
		992: {
			slidesPerView: 4,
		},
		768: {
			slidesPerView: 3,
		},
		479: {
			slidesPerView: 2,
		},
	},
});
	
// Слайдер автопарка
const carsSlider = new Swiper('.js-cars-slider',
{
	modules: [Navigation],
	slidesPerView: 1.5,
	spaceBetween: 10,
	loop:true,
	navigation: {
		nextEl: '.js-cars-slider-next',
		prevEl: '.js-cars-slider-prev',
	},
	breakpoints: {
		992: {
			spaceBetween: 20,
			slidesPerView: 3,
		},
		768: {
			spaceBetween: 20,
			slidesPerView: 2,
		},
		479: {
			spaceBetween: 10,
			slidesPerView: 2,
		},
	},
});
	
// Слайдер отзывов
const reviewsSlider = new Swiper('.js-reviews-slider',
{
	modules: [Navigation],
	slidesPerView: 2,
	spaceBetween: 20,
	loop:true,
	navigation: {
		nextEl: '.js-reviews-slider-next',
		prevEl: '.js-reviews-slider-prev',
	},
	breakpoints: {
		992: {
			slidesPerView: 3,
		},
	},
});
	
// Закрыть/Открыть мобильное меню
document.querySelector('.js-btn-main-menu').addEventListener('click', function(){
	this.classList.toggle("active");
	document.querySelector('.js-main-menu').classList.toggle("active");
});

// Закрыть/Открыть мобильное контакты в шапке
document.querySelector('.js-header-phone-btn').addEventListener('click', function(){
	this.classList.toggle("active");
	document.querySelector('.js-header-phone-content').classList.toggle("active");
});

