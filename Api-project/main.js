import './style.css';
const searchInput = document.getElementById('search');
const countryList = document.getElementById('country-list');
const card = document.getElementById('card');
const previous = document.getElementById('pre');
const next = document.getElementById('next');
const sort = document.getElementById('sort');
let BASE_URL = 'http://localhost:3000';
let URL = BASE_URL + '/countries?';
let isSorted = false;
let page = 1;
let endPoint = `?_page=1&_limit=5`;
async function getdata(url, endpoint) {
  try {
    let resronse = await fetch(`${url}/${endpoint}`);
    resronse = await resronse.json();
    return resronse;
  } catch (error) {
    console.log(error);
  }
}
let data = getdata(URL, endPoint);
data.then((response) => renderAside(response));

function renderAside(params) {
  countryList.innerHTML = '';
  params.map((item) => {
    let li = `<li data-name=${item.name.common.split(' ').join('-')} 
      class="bg-[#7F8487] rounded-r-md py-2 hover:shadow-sm hover:shadow-white flex gap-8 items-center justify-between px-4 cursor-pointer text-center"
      >
        <span>${item.name.common}</span>
        <div class="w-24 h-16">
          <img class= "h-full"
            src=${item.flags.png}
           alt=""
          />
          </div>
          </li>`;
    countryList.innerHTML += li;
  });
}
function handleSearch(e) {
  const inputSearch = e.target.value.tolowercase();
  data.then((response) => {
    const filterItem = response.filter(
      (item) =>
        item.name.common.tolowercase().includes(inputSearch) ||
        item.region.tolowercase().includes(inputSearch)
    );
    renderAside(filterItem);
  });
}
function handleCard(e) {
  let target = e.target;
  if (!target.closest('li')) return;
  data.then((response) => {
    const targetItem = response.find(
      (item) => item.name.common.split(' ').join('-') === target.dataset.name
    );
    console.log(targetItem);
    console.log(target.dataset.name);
    card.innerHTML = `
    <figure class="absolute top-[-50px] -translate-x-1/2 left-1/2">
              <img
                class="rounded-full w-24 h-24"
                src=${
                  targetItem.flags.png ||
                  './assets/img/Flag-United-States-of-America.webp'
                }
                alt=""
                srcset=""
              />
            </figure>
            <div class="flex flex-col items-center justify-center py-16 gap-5">
              <div>
                <h2 class="font-bold text-xl">${targetItem.name.common}</h2>
                <p class="font-semibold text-gray-700">${targetItem.region}</p>
              </div>
              <div>
                <p class="font-bold">Capital :</p>
                <span>${targetItem.capital[0]}</span>
              </div>
              <div>
                <p class="font-bold">Area code :</p>
                <span>${targetItem.idd.root + targetItem.idd.suffixes[0]}</span>
              </div>
              <div>
                <p class="font-bold">Neighbors :</p>
                <span>${targetItem.borders?.join(' , ') || ''}</span>
              </div>
            </div>
    `;
  });
}
countryList.addEventListener('click', handleCard);
searchInput.addEventListener('keyup', handleSearch);
previous.addEventListener('click', () => {
  --page < 1 ? 1 : page;
  endPoint = `&_page=${page}&_limit=5`;
  data = getdata(URL, endPoint);
  data.then((response) => {
    renderAside(response);
  });
});
next.addEventListener('click', () => {
  ++page > 50 ? 50 : page;
  endPoint = `&_page=${page}&_limit=5`;
  data = getdata(URL, endPoint);
  data.then((response) => {
    renderAside(response);
  });
});
sort.addEventListener('click', () => {
  SortRevers = SortRevers === 'asc' ? 'desc' : 'asc'
  isSorted = !isSorted;
  URL = isSorted
    ? BASE_URL + '/countries?' + `_sort=name.common&_order=asc`
    : BASE_URL + '/countries?'
  data = getdata(URL, endPoint);
  data.then((response) => {
    renderAside(response);
  });
});
