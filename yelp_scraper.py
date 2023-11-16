import requests
import json
from datetime import datetime
import time

cuisine_list = ["american", "middle eastern", "southern", "mexican", "italian", "japanese", "greek", "hawaiian", "french",
                "chinese", "cuban", "indian", "korean", "thai"]
api_key = "rR2M-8h1eLm_h_TKnkGQHGm9megbxg9TLPWXpqM-affo4I9A4bQBFkqu5XDF4ME-ZpcLiHJTIzydf2h83LWbTB-oVH-NcEjslVWGguVOThBTxhEYwtnUz3x3eIAqZXYx"
restaurant_set = set()
all_restaurant_list = []
all_restaurant_list_partial = []
index = [1]

def yelp_scrap(cuisine):
    limit = 50
    offset = 0
    restaurant_list = []
    restaurant_list_partial = []
    
    while True:
        endpoint = "https://api.yelp.com/v3/businesses/search"
        
        params = {
            "term": f"{cuisine} restaurants",
            "location": "New York City",
            "limit": 50,
            "offset": offset
        }

        # Set the Authorization header with your API key
        headers = {
            "Authorization": f"Bearer {api_key}"
        }

        # Send the GET request
        response = requests.get(endpoint, params=params, headers=headers)

        # Check the response
        if response.status_code == 200:
            data = response.json()
            for restaurant in data['businesses']:
                if restaurant['id'] in restaurant_set:
                    continue
                restaurant_set.add(restaurant['id'])

                categories = []
                for cat in restaurant['categories']:
                    categories.append(cat['title'])
                address = " ".join(restaurant['location']['display_address'])
                price_level = "Unavailable"
                if 'price' in restaurant:
                    price_level = restaurant['price']

                # DynamoDB data model
                restaurant_obj = {
                    "id": restaurant['id'],
                    "name": restaurant['name'],
                    "categories": categories,
                    "imageUrl": restaurant['image_url'],
                    "price": price_level,
                    "address": address,
                    "rating": str(restaurant['rating']),
                    "numberOfReviews": str(restaurant['review_count']),
                    "reviews": {},
                    "phone": restaurant['display_phone'],
                    "insertedAtTimestamp": str(datetime.now())    
                }

                # OpenSearch data model
                restaurant_obj_partial = {
                    "RestaurantID": restaurant['id'],
                    "Name": restaurant['name'],
                    "Price": price_level,
                    "Address": restaurant['location']['address1'],
                    "Categories": categories,
                    "Rating": str(restaurant['rating']),
                }
                index_obj = {"index": {"_index": "restaurants", "_id": index[0]}}

                index[0] = index[0] + 1
                restaurant_list.append(restaurant_obj)
                restaurant_list_partial.append(index_obj)
                restaurant_list_partial.append(restaurant_obj_partial)

            offset += limit
            print(len(restaurant_list))
            if len(restaurant_list) >= 1000:
                return restaurant_list, restaurant_list_partial
        else:
            print("Error:", response.json())
            return restaurant_list, restaurant_list_partial
        
        time.sleep(1) # Sleep to respect rate limits

for cuisine in cuisine_list:
    list1, list2 = yelp_scrap(cuisine)
    all_restaurant_list.extend(list1)
    all_restaurant_list_partial.extend(list2)

file_name = "./restaurant_data/restaurant_data.json"
with open(file_name, "w") as file:
    json.dump(all_restaurant_list, file)

file_name2 = "./restaurant_data/restaurant_partial_data.json"
with open(file_name2, "a") as json_file:
    for obj in all_restaurant_list_partial:
        json_string = json.dumps(obj)
        json_file.write(json_string + "\n")
