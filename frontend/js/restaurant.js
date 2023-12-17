document.addEventListener('DOMContentLoaded', function() {
    var queryParams = new URLSearchParams(window.location.search);
    var restaurantId = queryParams.get('id');

    if (restaurantId) {

        getRestaurantDetails(restaurantId);

    } else {

        console.error('No restaurant ID provided in the URL');
    }
});

function getRestaurantDetails(restaurantId) {
    var params = {
        q: restaurantId
    };
    var body = {};
    var additionalParams = {};

    sdk.getRestaurantByIdGet(params, body, additionalParams).then((response) => {
        console.log('Restaurant response:', response);
        displayRestaurantDetails(response.data);
    }).catch(error => {
        console.error('Error fetching restaurant details:', error);
    });
}

function displayRestaurantDetails(restaurant) {
    var detailsContainer = document.getElementById('restaurantDetails');
    detailsContainer.innerHTML = ''; 
    var nameElement = document.createElement('h2');
    nameElement.textContent = restaurant.name;
    detailsContainer.appendChild(nameElement);


    if (restaurant.imageUrl) {
        var imageElement = document.createElement('img');
        imageElement.src = restaurant.imageUrl;
        imageElement.alt = restaurant.name;
        detailsContainer.appendChild(imageElement);
    }


    var addressElement = document.createElement('p');
    addressElement.textContent = restaurant.address;
    detailsContainer.appendChild(addressElement);


    var ratingElement = document.createElement('p');
    ratingElement.textContent = `Rating: ${restaurant.rating}`;
    detailsContainer.appendChild(ratingElement);


}

