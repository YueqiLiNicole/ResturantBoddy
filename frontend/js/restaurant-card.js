document.getElementById('searchButton').addEventListener('click', function() {
    var searchValue = document.getElementById('searchInput').value;
    searchRestaurants(searchValue);
});

function searchRestaurants(searchValue) {
    // Assuming 'data_1.json' is the local JSON file under the 'restaurant-data' folder
    fetch('../../restaurant_data/data_1.json')
        .then(response => response.json())
        .then(restaurants => {
            // Filter restaurants based on searchValue if necessary
            const filteredRestaurants = restaurants.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            displayRestaurants(filteredRestaurants);
        })
        .catch(error => console.error('Error:', error));
}

function displayRestaurants(restaurants) {
    var restaurantList = document.getElementById('restaurantList');
    restaurantList.innerHTML = ''; // Clear current results

    restaurants.forEach(function(restaurant) {
        var card = createRestaurantCard(restaurant);
        restaurantList.appendChild(card);
    });
}

function createRestaurantCard(restaurant) {
    var card = document.createElement('div');
    card.className = 'restaurant-card';

    var image = document.createElement('img');
    image.src = restaurant.imageUrl;
    image.alt = 'Image of ' + restaurant.name;

    var name = document.createElement('h3');
    name.textContent = restaurant.name;

    var categories = document.createElement('p');
    categories.textContent = restaurant.categories.join(', ');

    var price = document.createElement('p');
    price.textContent = restaurant.price;

    var address = document.createElement('p');
    address.textContent = restaurant.address;

    var rating = document.createElement('p');
    rating.textContent = `Rating: ${restaurant.rating} (${restaurant.numberOfReviews} reviews)`;

    // Append details to the card
    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(categories);
    card.appendChild(price);
    card.appendChild(address);
    card.appendChild(rating);

    return card;
}
