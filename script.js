'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//~* old way of writing AJAX call
const renderError = (msg) => {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
};
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
            // (err) => alert(err); // catching error with prompt window
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
        })
        .catch((err) => {
            console.error(`${err}`);
            renderError(`Something went wromg ${err.message}, try again later`);
        })
        .finally(() => {
            countriesContainer.style.opacity = 1; //' it will happen no matter what, and will only happen when catch(previous)  returns a promise
        });
};
btn.addEventListener('click', () => {
    getCountryData('nepal');
});

//> event loop

console.log('Start'); //1st
setTimeout(() => {
    return console.log('0 sec timer'), 0;
}); //4th
Promise.resolve('resolve promise1').then((res) => {
    console.log(res);
}); // microstack 3rd
console.log('test end'); //2nd

//> build a simple promise
const lotteryPromise = new Promise(function (resolve, reject) {
    setTimeout(() => {
        if (Math.random() >= 0.5) {
            resolve('won'); //. fullfilled state
        } else {
            reject(new Error('didnt win')); //. rejected state
        }
    }, 2000);
});

lotteryPromise.then((res) => console.log(res)).catch((err) => console.log(err));

//> promisifying set timeout
const wait = (seconds) => {
    return new Promise(function (resolve, _reject) {
        setTimeout(resolve, seconds * 1000);
    });
};

wait(2).then(() => {
    // create a promise waits for 2 seconds then resolves
    console.log('waited two second'); // can be any code
    return wait(1);
});

Promise.resolve('immediate resolve').then((el) => console.log(el));
Promise.reject(new Error('immediate reject')).catch((el) => console.error(el));

//> promisify getolocation

const getLocation = () => {
    return new Promise((resolve, reject) => {
        // navigator.geolocation.getCurrentPosition(
        //     (position) => resolve(position),
        //     (err) => reject(err),
        // );
        navigator.geolocation.getCurrentPosition(resolve, reject); //? if the parameter is the only parameter pass in to the resolve/reject funtion
    });
};

getLocation().then((pos) => console.log(pos));


