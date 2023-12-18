var searched_restaurants = []
var sdk = apigClientFactory.newClient({});
    
function getUserInfo(idToken) {
        var payload = idToken.split('.')[1];
        var decoded = atob(payload); // Base64 decode
        var userProfile = JSON.parse(decoded);
        return userProfile;
    }

    // Function to print tokens and user info to the console
function printTokensAndUserInfo() {
    var accessToken = localStorage.getItem('accessToken');
    var idToken = localStorage.getItem('idToken');
    var refreshToken = localStorage.getItem('refreshToken');

    // Print tokens to the console
    console.log('Access Token:', accessToken);
    console.log('ID Token:', idToken);
    console.log('Refresh Token:', refreshToken);

    // Get and print user info
    if (idToken) {
        var userInfo = getUserInfo(idToken);
        console.log('User Info:', userInfo);
        console.log('Cognito Username:', userInfo['cognito:username']);
    }
}

// Call printTokensAndUserInfo when the page loads
window.onload = printTokensAndUserInfo;


var idToken = localStorage.getItem('idToken');
var tempeID;
var username;
if (idToken) {
    var userInfo = getUserInfo(idToken);
    tempeID = userInfo['cognito:username'];
}


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

    // filterButton.addEventListener('click', function () {
    //     let filtered_restaurants = searched_restaurants.filter(item => item.price == "$$$");
    //     console.log('Filtered restaurants:', filtered_restaurants);
    //     displayRestaurants(filtered_restaurants);
    // });


    document.getElementById('applyFilterButton').addEventListener('click', function () {
        let priceFilterValue = document.getElementById('priceFilter').value;
        let ratingFilterValue = document.getElementById('ratingFilter').value;
    
        let filtered_restaurants = searched_restaurants.filter(restaurant => {
            let matchesPrice = priceFilterValue === "" || restaurant.price === priceFilterValue;
            let matchesRating = ratingFilterValue === "" || restaurant.rating === ratingFilterValue;
            return matchesPrice && matchesRating;
        });
    
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

    // function createRestaurantCard(restaurant) {
    //     var card = document.createElement('div');
    //     card.className = 'restaurant-card';
    

    //     var name = document.createElement('h3');
    //     name.textContent = restaurant.name;
    //     card.appendChild(name);
    

    //     card.onclick = function() {

    //         window.location.href = 'restaurant.html?id=' + restaurant.id;
    //     };
    
    //     return card;
    // }
    
    
    function createRestaurantCard(restaurant) {
        var card = document.createElement('div');
        card.className = 'restaurant-card';
        card.style.cursor = 'pointer';
        card.onclick = function() {
            window.location.href = 'restaurant.html?id=' + restaurant.id;
        };
    
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


    fetchRecommendedRestaurants();

    function fetchRecommendedRestaurants() {
        var params = {
            q: tempeID
        };
        var body = {};
        var additionalParams = {};

        sdk.recommendRestaurantsGet(params, body, additionalParams).then((response) => {
            console.log('Recommendation response:', response['data']['results']);
            searched_restaurants = response['data']['results'];
            displayRestaurants(searched_restaurants);
        }).catch(error => {
            console.error('Error fetching recommended restaurants:', error);
        });
    }

    
    
});