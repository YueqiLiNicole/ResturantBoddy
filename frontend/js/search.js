var username = 'eric';
var userID = 'cd2445';
var restaurantID = 'XjeGryxde-tQZF_Ewu7NCw';
var searched_restaurants = []

$(document).ready(function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const rateInput = document.getElementById('rate-input');
    const rateButton = document.getElementById('rate-button');
    const commentInput = document.getElementById('comment-input');
    const commentButton = document.getElementById('comment-button');
    const likeButton = document.getElementById('like-button');
    const filterButton = document.getElementById('filter-button');

    searchButton.addEventListener('click', function () {
        var params = {
            q: searchInput.value
        };
        console.log('Sending the following parameters to Lambda:', params);
        var body = {};
        var additionalParams = {};
        sdk.searchRestaurantGet(params, body, additionalParams).then((response) => {
            console.log('Search response:', response['data']['results']);
            searched_restaurants = response['data']['results'];
            displayRestaurants(searched_restaurants);
        });
    });

    filterButton.addEventListener('click', function () {
        let filtered_restaurants = searched_restaurants.filter(item => item.price == "$$$");
        console.log('Filtered restaurants:', filtered_restaurants);
        displayRestaurants(filtered_restaurants);
    });

    // rateButton.addEventListener('click', function () {
    //     var body = {
    //         restaurantID: restaurantID,
    //         rating: rateInput.value
    //     };
    //     sdk.rateRestaurantPost({}, body, {}).then((response) => {
    //         console.log('Rate response:', response['data']['body']);
    //     });
    // });

    // commentButton.addEventListener('click', function () {
    //     let today = new Date();

    //     // Format the date as 'YYYY-MM-DD'
    //     let dateString = today.getFullYear() + '-' + 
    //         ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
    //         ('0' + today.getDate()).slice(-2);

    //     var body = {
    //         restaurantID: restaurantID,
    //         username: username,
    //         comment: commentInput.value,
    //         date: dateString
    //     };
    //     sdk.commentRestaurantPost({}, body, {}).then((response) => {
    //         console.log('Comment response:', response['data']['body']);
    //     });
    // });

    // likeButton.addEventListener('click', function () {
    //     var body = {
    //         restaurantID: restaurantID,
    //         userID: userID
    //     };
    //     sdk.likeRestaurantPost({}, body, {}).then((response) => {
    //         console.log('Like response:', response['data']['body']);
    //     });
    // });



    function displayRestaurants(restaurants) {
        var restaurantList = document.getElementById('restaurantDisplay');
        restaurantList.innerHTML = ''; 
    
        restaurants.forEach(function(restaurant) {
            var card = createRestaurantCard(restaurant);
            restaurantList.appendChild(card);
        });
    }
    
    function createRestaurantCard(restaurant) {
        var card = document.createElement('div');
        card.className = 'restaurant-card';
    
        var image = document.createElement('img');
        image.src = restaurant.imageUrl ? restaurant.imageUrl : './img/default_restaurant_image.jpg';
        image.alt = restaurant.name;
        image.className = 'restaurant-image';
    
        var name = document.createElement('h4');
        name.textContent = restaurant.name;
        name.className = 'restaurant-name';
    
        card.appendChild(image);
        card.appendChild(name);
    
        return card;
    }
    
});