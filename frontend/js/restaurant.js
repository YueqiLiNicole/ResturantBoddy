// console.log(sdk);

var username = 'xie';
var restaurantId;
var userID = '29f78211-2096-41a3-92a7-ee2f35f12747';

var originalValues = {};
var fields = [
    "restaurantName",
    "restaurantImage",
    "restaurantCategories",
    "restaurantPrice",
    "restaurantRating",
    "restaurantAddress",
    "restaurantPhone"
];


// Function to store original values
function storeOriginalValues() {
    fields.forEach(function(field) {
        var element = document.getElementById(field);
        if (field === "restaurantImage") {
            originalValues[field] = element.src; 
        } else {
            originalValues[field] = element.textContent;
        }
    });
}




document.addEventListener('DOMContentLoaded', function() {
    var queryParams = new URLSearchParams(window.location.search);
    restaurantId = queryParams.get('id');

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
        // displayRestaurantDetails(response.data);
        fillRestaurantData(response.data);
        displayRating(response.data.rating);
    }).catch(error => {
        console.error('Error fetching restaurant details:', error);
    });
}



// function fillRestaurantData(restaurant) {
//     if (restaurant) {

//         document.getElementById('restaurantName').textContent = restaurant.name;

//         if (restaurant.imageUrl) {
//             document.getElementById('restaurantImage').src = restaurant.imageUrl;
//             document.getElementById('restaurantImage').alt = restaurant.name;
//         }

//         document.getElementById('restaurantCategories').textContent = 'Categories: ' + (restaurant.categories);

//         document.getElementById('restaurantPrice').textContent = 'Price: ' + (restaurant.price);

//         document.getElementById('restaurantRating').textContent = 'Rating: ' + (restaurant.rating);

//         document.getElementById('restaurantAddress').textContent = 'Address: ' + (restaurant.address);

//         document.getElementById('restaurantPhone').textContent = 'Phone: ' + (restaurant.phone);

//         if (restaurant.reviews) {
//             document.getElementById('numberOfReviews').textContent = restaurant.reviews.length;
//             document.getElementById('reviewsTrigger').addEventListener('click', function() {
//                 showReviewsPopup(restaurant.reviews);
//             });
//         }
//     }
// }

// function displayRating(rating) {
//     const ratingStars = document.getElementById('ratingStars');
//     ratingStars.innerHTML = ''; // Clear previous stars

//     // Loop to display full, half, and empty stars
//     for (let i = 1; i <= 5; i++) {
//         if (i <= rating) {
//             ratingStars.innerHTML += '<i class="fa-solid fa-star"></i>'; // Full star
//         } else if (i - 0.5 <= rating) {
//             ratingStars.innerHTML += '<i class="fa-solid fa-star-half-stroke"></i>'; // Half star
//         } else {
//             ratingStars.innerHTML += '<i class="fa-regular fa-star"></i>'; // Empty star
//         }
//     }
// }


function displayRestaurantDetails(restaurant) {
    var detailsContainer = document.getElementById('restaurantDetails');
    detailsContainer.innerHTML = ''; 
    var nameElement = document.createElement('div');
    nameElement.textContent = restaurant.name;
    detailsContainer.appendChild(nameElement);


    if (restaurant.imageUrl) {
        var imageElement = document.createElement('img');
        imageElement.src = restaurant.imageUrl;
        imageElement.alt = restaurant.name;
        detailsContainer.appendChild(imageElement);
    }


    var addressElement = document.createElement('div');
    addressElement.textContent = restaurant.address;
    detailsContainer.appendChild(addressElement);

    var contactElement = document.createElement('div');
    contactElement.textContent = restaurant.phone;
    detailsContainer.appendChild(contactElement);


    var ratingElement = document.createElement('div');
    ratingElement.textContent = `Rating: ${restaurant.rating}`;
    detailsContainer.appendChild(ratingElement);


}

function fillRestaurantData(restaurant) {
    if (restaurant) {


        document.getElementById('restaurantName').textContent = restaurant.name;


        if (restaurant.imageUrl) {
            var imageElement = document.getElementById('restaurantImage');
            imageElement.src = restaurant.imageUrl;
            imageElement.alt = restaurant.name;
        }


        document.getElementById('restaurantAddress').textContent = 'Address: ' + (restaurant.address);

        document.getElementById('restaurantContact').textContent = 'Contact: ' + (restaurant.phone);



        // document.getElementById('restaurantRating').textContent = 'Rating: ' + (restaurant.rating);


        if (restaurant.reviews) {
            var reviewCount = Array.isArray(restaurant.reviews) ? restaurant.reviews.length : 0;
            document.getElementById('numberOfReviews').textContent = reviewCount
            // document.getElementById('numberOfReviews').textContent = restaurant.reviews.length;
            document.getElementById('reviewsTrigger').addEventListener('click', function() {
                console.log('reviews', restaurant.reviews)
                showReviewsPopup(restaurant.reviews);
            });
        }


    }
}

// function fillRestaurantData(restaurant) {
//     if (restaurant) {

//         document.getElementById('restaurantName').textContent = restaurant.name;

//         if (restaurant.imageUrl) {
//             var imageElement = document.getElementById('restaurantImage');
//             imageElement.src = restaurant.imageUrl;
//             imageElement.alt = restaurant.name;
//         }

//         document.getElementById('restaurantAddress').textContent = 'Address: ' + (restaurant.address);
//         document.getElementById('restaurantContact').textContent = 'Contact: ' + (restaurant.phone);

//         var reviewCount = Array.isArray(restaurant.reviews) ? restaurant.reviews.length : 0;
//         document.getElementById('numberOfReviews').textContent = reviewCount;
        
//         var reviewsTrigger = document.getElementById('reviewsTrigger');
//         if (reviewsTrigger && reviewCount > 0) {
//             reviewsTrigger.addEventListener('click', function() {
//                 console.log('reviews', restaurant.reviews);
//                 showReviewsPopup(restaurant.reviews);
//             });
//         }
//     }
// }





document.getElementById('rateRestaurantButton').addEventListener('click', function() {
    document.getElementById('rateRestaurantPopup').style.display = 'block';
    // Add logic for the rating system here
});

document.getElementById('writeReviewButton').addEventListener('click', function() {
    document.getElementById('writeReviewPopup').style.display = 'block';
    // Add logic for writing a review here
});

document.getElementById('submitReviewButton').addEventListener('click', function() {
    let today = new Date();
    let dateString = today.getFullYear() + '-' + 
        ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
        ('0' + today.getDate()).slice(-2);

    var body = {
        restaurantID: restaurantId,
        username: username,
        comment: document.getElementById('reviewText').value, // Assuming 'reviewText' is the ID of your review textarea
        date: dateString
    };

    console.log('review restaurant', body)

    sdk.commentRestaurantPost({}, body, {}).then((response) => {
        console.log('Comment restaurant response:', response['data']['body']);
        document.getElementById('writeReviewPopup').style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll("#rateRestaurantPopup .stars i");
    let selectedRating = 0; // To keep track of the selected rating

    stars.forEach((star, index1) => {
        star.addEventListener("click", () => {
            stars.forEach((star, index2) => {
                index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
            });
            selectedRating = index1 + 1; // Update the selected rating
        });
    });

    document.getElementById('submitRatingButton').addEventListener('click', function() {
        // Prepare the data to be sent
        var body = {
            restaurantID: restaurantId,
            rating: selectedRating
        };




        // Call the SDK function to submit the rating
        sdk.rateRestaurantPost({}, body, {}).then((response) => {
            console.log('Rate restaurant response:', response['data']['body']);

            // Close the popup after submission
            document.getElementById('rateRestaurantPopup').style.display = 'none';
        }).catch(function(error) {
            console.error('Error submitting rating:', error);
            // Handle any errors here
        });
    });
});




// document.addEventListener('DOMContentLoaded', function() {
//     // Update the number of reviews
//     document.getElementById('numberOfReviews').textContent = restaurant.numberOfReviews;

//     // Event listener to open the reviews pop-up
//     document.getElementById('reviewsTrigger').addEventListener('click', function() {
//         showReviewsPopup(restaurant.reviews);
//     });
// });

function showReviewsPopup(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = ''; // Clear existing content

    // Check if reviews is actually an array and has at least one review
    if (Array.isArray(reviews) && reviews.length > 0) {
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review-item');
            reviewElement.innerHTML = `
                <div class="review-date">${review.date}</div>
                <div class="review-comment">${review.comment}</div>
                <div class="review-username">- ${review.username}</div>
            `;
            reviewsList.appendChild(reviewElement);
        });
    } else {
        // Handle the case where there are no reviews
        const noReviewsElement = document.createElement('div');
        noReviewsElement.classList.add('review-item');
        noReviewsElement.textContent = "No reviews yet.";
        reviewsList.appendChild(noReviewsElement);
    }

    document.getElementById('reviewsPopup').style.display = 'block';
}


function closeReviewsPopup() {
    document.getElementById('reviewsPopup').style.display = 'none';
}
function displayRating(rating) {
    const ratingStars = document.getElementById('ratingStars');
    ratingStars.innerHTML = ''; // Clear previous stars

    // Loop to display full, half, and empty stars
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            ratingStars.innerHTML += '<i class="fa-solid fa-star"></i>'; // Full star
        } else if (i - 0.5 <= rating) {
            ratingStars.innerHTML += '<i class="fa-solid fa-star-half-stroke"></i>'; // Half star
        } else {
            ratingStars.innerHTML += '<i class="fa-regular fa-star"></i>'; // Empty star
        }
    }
}



document.getElementById('likeButton').addEventListener('click', function () {
    var body = {
        restaurantID: restaurantId,
        userID: userID
    };
    sdk.likeRestaurantPost({}, body, {}).then((response) => {
        console.log('Like response:', response['data']['body']);
        
        // Change the heart icon to the filled version
        var likeButton = document.getElementById('likeButton');
        likeButton.src = 'img/heart-1.svg';


        document.getElementById('eat-together').classList.remove('eat-together-hidden');

        // Check if 'other_interested_users' exists before trying to use it
        const otherInterestedUsers = response['data']['body']['other_interested_users'];
        if (otherInterestedUsers) {
            // Call a function to update the liked users' avatars
            updateLikedUsersAvatars(otherInterestedUsers);
        } else {
            // Handle the case where there are no other interested users
            console.log('No other interested users.');
        }
    }).catch(function(error) {
        console.error('Error submitting like:', error);
        // Handle any errors here
    });
});



function updateLikedUsersAvatars(likedUsers) {

    console.log('likedUsers',likedUsers)
    const container = document.getElementById('likedUsersContainer');
    container.innerHTML = '';

    likedUsers.forEach(userId => {
        var params = {
            q: userId
        };
        var body = {};
        var additionalParams = {};
        sdk.getUserByIdGet(params, body, additionalParams).then((response) => {
            console.log('User response:', response);
            const userData = response.data;

            const userButton = document.createElement('button');
            userButton.className = 'user-button'; 
            userButton.onclick = function() {
                // edit here for accessing specific user page
                window.location.href = 'buddy.html'; 
            };

            const img = document.createElement('img');
            img.src = userData.imageUrl;
            img.alt = userData.name;
            img.className = 'liked-user-avatar';

            userButton.appendChild(img); 
            container.appendChild(userButton); 
        }).catch(function(error) {
            console.error('Error fetching user data:', error);
        });
    });
}





// document.addEventListener('DOMContentLoaded', function() {
//     // 从 sessionStorage 获取餐厅详细信息
//     var restaurantDetails = JSON.parse(sessionStorage.getItem('restaurantDetails'));
//     if (restaurantDetails) {
//         displayRestaurantDetails(restaurantDetails);
//     } else {
//         console.error('No restaurant details found in sessionStorage.');
//     }
// });

// function displayRestaurantDetails(restaurant) {
//     var detailsContainer = document.getElementById('restaurantDetails');
//     // 创建并添加餐馆详细信息的HTML元素
//     // ...
//     detailsContainer.innerHTML = '';
// }
