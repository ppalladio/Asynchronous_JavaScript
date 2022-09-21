'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//~* old way of writing AJAX call

const renderCountry = function (data) {
    const html = `
    <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
                data.population / 1000000
            ).toFixed(2)} Mil</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
                data.currencies[0].name
            }</p>
          </div>
        </article> `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
};
const getCountryCards = function (country) {
    const req = new XMLHttpRequest();
    req.open('GET', `https://restcountries.com/v2/name/${country}`);
    req.send();

    req.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        // console.log(data);

        //. renderCountry 1
        renderCountry(data);

        //get neighbour country

        // const neighbour = data.borders;
        // // console.log(neighbour);
        // if (!neighbour) return;
        // neighbour.forEach((data) => {
        //     let req = new XMLHttpRequest();
        //     req.open('GET', `https://restcountries.com/v2/alpha/${data}`);
        //     req.send();

        //     req.addEventListener('load', function () {
        //         const data = JSON.parse(this.responseText);
        //         console.log(data);
        //         renderCountry(data);
        //     });
        // });
    });
};

// getCountryCards('germany');

//~* modern way of AJAX

const getCountryData = function (country) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then((res, req) => {
            return res.json();
        })
        .then((data) => {
            renderCountry(data[0]);
            const neighbour = data[0].borders?.[0];
            if (!neighbour) return;

            //' get the first neighbour country
            return fetch(`https://restcountries.com/v2/alpha/${neighbour}`) //. this returns a new promise
                .then((res, req) => {
                    return res.json();
                })
                .then((data) => {
                    renderCountry(data);
                });
        });
};
// getCountryData('nepal')
