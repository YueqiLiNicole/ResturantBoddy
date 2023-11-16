import json
import boto3
from botocore.exceptions import ClientError
import time
import json

def lambda_handler(event, context):

    restaurant_id = "j8nnY0ySne_OPxsIWh3pNw"
    user_id = "liuqiya2"

    restaurant_data = lookup_data({'id': restaurant_id})
    interested_users = []
    
    if 'interestedUsers' in restaurant_data:
        interested_users = restaurant_data['interestedUsers']
    
    interested_users.append(user_id)
    update_item({'id': restaurant_id}, interested_users)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully add interested user!')
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


def update_item(key, interested_users, db=None, table='6998project-restaurant-info'):
    if not db:
        db = boto3.resource('dynamodb')
    table = db.Table(table)
   
    response = table.update_item(
        Key=key,
        UpdateExpression="set #feature1=:f1",
        ExpressionAttributeValues={
            ':f1': interested_users
        },
        ExpressionAttributeNames={
            "#feature1": "interestedUsers"
        },
        ReturnValues="UPDATED_NEW"
    )
    print(response)
    return response