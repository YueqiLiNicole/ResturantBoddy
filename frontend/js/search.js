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
        card.style.cursor = 'pointer';
        card.onclick = function() {
            console.log('restaurant id', restaurant.id, 'user id', tempeID)
            updateSearchHistory(restaurant.id, tempeID);
            setTimeout(function() {
                window.location.href = 'restaurant.html?id=' + restaurant.id;
            }, 3000); 
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

    function updateSearchHistory(restaurantId, userId) {
        var params = {}; 
        var body = {
            restaurantID: restaurantId,
            userID: userId
        };
        var additionalParams = {};
    
        sdk.updateSearchHistoryPut(params, body, additionalParams).then(response => {
            console.log('Search history updated:', response);
        }).catch(error => {
            console.error('Error updating search history:', error);
        });
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