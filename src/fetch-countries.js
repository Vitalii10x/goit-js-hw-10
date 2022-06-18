export function fetchCountries(name) {
    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
    return fetch(url).then(response => {
    if (response.status !== 200) {
        throw new Error(response.status);
    }
    return response.json();
  });
}