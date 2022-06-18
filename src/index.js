// Задание - поиск стран
// Создай фронтенд часть приложения поиска данных о стране по её частичному или полному имени.

// HTTP-запросы
// Используй публичный API Rest Countries, а именно ресурс name, возвращающий массив объектов стран удовлетворивших критерий поиска. Добавь минимальное оформление элементов интерфейса.
// Напиши функцию fetchCountries(name) которая делает HTTP - запрос на ресурс name и возвращает промис с массивом стран - результатом запроса.Вынеси её в отдельный файл fetchCountries.js и сделай именованный экспорт.
    
// Интерфейс
// Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным.Для уведомлений используй библиотеку notiflix и выводи такую строку "Too many matches found. Please enter a more specific name.".
// Если бэкенд вернул от 2 - х до 10 - х стран, под тестовым полем отображается список найденных стран.Каждый элемент списка состоит из флага и имени страны.
// Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.
      
// Обработка ошибки
// Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, а ошибку со статус кодом 404 - не найдено. Если это не обработать, то пользователь никогда не узнает о том, что поиск не дал результатов. Добавь уведомление "Oops, there is no country with that name" в случае ошибки используя библиотеку notiflix.

import './css/styles.css';
import { fetchCountries } from './fetch-countries'; 
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
let country;

const refs = {
    search: document.querySelector('#search-box'),
    countriesInfo: document.querySelector('.country-info'),
    countriesList: document.querySelector('.country-list'),
}

refs.search.addEventListener("input", debounce(inputSearch, DEBOUNCE_DELAY));

function clearData() {
    refs.countriesInfo.innerHTML = '';
    refs.countriesList.innerHTML = ''; 
}

function inputSearch(e) {
    const inputValue = e.target.value.trim();

    if (inputValue === '') {
        clearData();
        return;
    }

fetchCountries(inputValue)
    .then(countries => {
        if (countries.length > 10) {
            clearData();
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
            return;
        } else if (countries.length === 1) {
            clearData();
            renderCountry(countries[0]);
            return;
        }
        renderCountries(countries);
    }
    )
    .catch(error => {
        clearData();
        Notiflix.Notify.failure("Oops, there is no country with that name.");
        return;
    });

    function renderCountry(country) {
    const countryMarkup = `
    <div class = "info">
    <img src = "${country.flags.svg}" alt = Flag of"${country.name}" class="flag"><h1>${country.name.official}</h1> 
    </div>
    <p><span>Capital:</span> ${country.capital}</p>
    <p><span>Population:</span> ${country.population}</p>
    <p><span>Languages:</span> ${Object.values(country.languages).join(',')}</p>`;
        
    refs.countriesInfo.innerHTML = countryMarkup;
    }
    
    function renderCountries(countries) {
        clearData();
        const markup = countries.map((country) => {
        return `<li>
            <img
            src = "${country.flags.svg}"
            alt = Flag of"${country.name.official}"
            />
            <span>${country.name.official}</span>
            </li>`
            }).join("");
        
        refs.countriesList.innerHTML = markup;
    }
}