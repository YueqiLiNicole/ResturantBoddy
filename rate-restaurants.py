import json
import boto3
from botocore.exceptions import ClientError
import time
import json

def lambda_handler(event, context):

    restaurant_id = "j8nnY0ySne_OPxsIWh3pNw"
    rate = 4.5

    restaurant_data = lookup_data({'id': restaurant_id})
    number_of_ratings = int(restaurant_data['numberOfReviews'])
    rating = float(restaurant_data['rating'])
    new_rating = (rating * number_of_ratings + rate) / (number_of_ratings + 1)
    
    update_item({'id': restaurant_id}, str(new_rating), str(number_of_ratings + 1))
    
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully add rating!')
    }


def lookup_data(key, db=None, table='6998project-restaurant-info'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
    try:
        response = table.get_item(Key=key)
    except ClientError as e:
        print('Error', e.response['Error']['Message'])
    else:
        print(response['Item'])
        return response['Item']


def update_item(key, rating, number_of_ratings, db=None, table='6998project-restaurant-info'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
   
    response = table.update_item(
        Key=key,
        UpdateExpression="set #feature1=:f1, #feature2=:f2",
        ExpressionAttributeValues={
            ':f1': rating,
            ':f2': number_of_ratings
        },
        ExpressionAttributeNames={
            "#feature1": "rating",
            "#feature2": "numberOfReviews"
        },
        ReturnValues="UPDATED_NEW"
    )
    print(response)
    return response