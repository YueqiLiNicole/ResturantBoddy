var username = 'eric';
var userID = '29f78211-2096-41a3-92a7-ee2f35f12747';
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

    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const nameInput = document.getElementById('name-input');
    const signupButton = document.getElementById('signup-button');

    const emailInput2 = document.getElementById('email-input2');
    const nameInput2 = document.getElementById('name-input2');
    const phoneInput = document.getElementById('phone-input');
    const cuisineInput = document.getElementById('cuisine-input');
    const locationInput = document.getElementById('location-input');
    const edituserButton = document.getElementById('edit-user-button');

    const restaurantButton = document.getElementById('restaurant-button');
    const userButton = document.getElementById('user-button');

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
        });
    });

    filterButton.addEventListener('click', function () {
        let filtered_restaurants = searched_restaurants.filter(item => item.price == "$$$");
        console.log('Filtered restaurants:', filtered_restaurants);
    });

    rateButton.addEventListener('click', function () {
        var body = {
            restaurantID: restaurantID,
            rating: rateInput.value
        };
        sdk.rateRestaurantPost({}, body, {}).then((response) => {
            console.log('Rate response:', response['data']['body']);
        });
    });

    commentButton.addEventListener('click', function () {
        let today = new Date();

        // Format the date as 'YYYY-MM-DD'
        let dateString = today.getFullYear() + '-' + 
            ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
            ('0' + today.getDate()).slice(-2);

        var body = {
            restaurantID: restaurantID,
            username: username,
            comment: commentInput.value,
            date: dateString
        };
        sdk.commentRestaurantPost({}, body, {}).then((response) => {
            console.log('Comment response:', response['data']['body']);
        });
    });

    likeButton.addEventListener('click', function () {
        var body = {
            restaurantID: restaurantID,
            userID: userID
        };
        sdk.likeRestaurantPost({}, body, {}).then((response) => {
            console.log('Like response:', response['data']['body']);
        });
    });

    signupButton.addEventListener('click', function () {
        var body = {
            email: emailInput.value,
            username: nameInput.value,
            password: passwordInput.value
        };
        sdk.createUserPost({}, body, {}).then((response) => {
            console.log('Signup response:', response);
        });
    });

    edituserButton.addEventListener('click', function () {
        var body = {
            userID: userID,
            email: emailInput2.value,
            username: nameInput2.value,
            phone: phoneInput.value,
            cuisine: cuisineInput.value,
            location: locationInput.value,
        };
        sdk.editUserPut({}, body, {}).then((response) => {
            console.log('Edit profile response:', response);
        });
    });

    restaurantButton.addEventListener('click', function () {
        var params = {
            q: restaurantID
        };
        console.log('Sending the following parameters to Lambda:', params);
        var body = {};
        var additionalParams = {};
        sdk.getRestaurantByIdGet(params, body, additionalParams).then((response) => {
            console.log('Restaurant response:', response);
        });
    });

    userButton.addEventListener('click', function () {
        var params = {
            q: userID
        };
        console.log('Sending the following parameters to Lambda:', params);
        var body = {};
        var additionalParams = {};
        sdk.getUserByIdGet(params, body, additionalParams).then((response) => {
            console.log('User response:', response);
        });
    });
});