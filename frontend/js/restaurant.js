document.addEventListener('DOMContentLoaded', function() {
    var queryParams = new URLSearchParams(window.location.search);
    var restaurantId = queryParams.get('id');

    // 假设你有一个函数来获取餐馆详细信息
    if (restaurantId) {
        // 从API获取餐厅详细信息
        getRestaurantDetails(restaurantId);
        // 你可能还需要获取评论、评分等信息
    } else {
        // 如果没有找到ID，可能需要处理错误或重定向
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
    detailsContainer.innerHTML = ''; // 清除已有内容

    // 创建餐馆详细信息的 HTML 元素并添加到页面上
    var nameElement = document.createElement('h2');
    nameElement.textContent = restaurant.name;
    detailsContainer.appendChild(nameElement);

    // 根据需要添加更多元素，如图片、地址等
    // ...

    // 如果有餐馆图片，添加图片元素
    if (restaurant.imageUrl) {
        var imageElement = document.createElement('img');
        imageElement.src = restaurant.imageUrl;
        imageElement.alt = restaurant.name;
        detailsContainer.appendChild(imageElement);
    }

    // 添加餐馆地址
    var addressElement = document.createElement('p');
    addressElement.textContent = restaurant.address;
    detailsContainer.appendChild(addressElement);

    // 添加餐馆评分
    var ratingElement = document.createElement('p');
    ratingElement.textContent = `Rating: ${restaurant.rating}`;
    detailsContainer.appendChild(ratingElement);

    // ... 继续添加其他信息 ...
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
