import json
import boto3
from botocore.exceptions import ClientError
import time
import json

def lambda_handler(event, context):

    restaurant_id = "j8nnY0ySne_OPxsIWh3pNw"
    username = "kevin"
    comment = "bad restaurant"

    restaurant_data = lookup_data({'id': restaurant_id})
    reviews = restaurant_data['reviews']
    reviews[username] = comment
    print(reviews)
    update_item({'id': restaurant_id}, reviews)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully add comment!')
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


def update_item(key, reviews, db=None, table='6998project-restaurant-info'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
   
    response = table.update_item(
        Key=key,
        UpdateExpression="set #feature1=:f1",
        ExpressionAttributeValues={
            ':f1': reviews
        },
        ExpressionAttributeNames={
            "#feature1": "reviews"
        },
        ReturnValues="UPDATED_NEW"
    )
    print(response)
    return response