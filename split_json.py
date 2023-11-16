import json

# Function to split array into chunks
def split_array(arr, chunk_size):
    for i in range(0, len(arr), chunk_size):
        yield arr[i:i + chunk_size]

# Load the original JSON file
with open('./restaurant_data/restaurant_data.json', 'r') as file:
    data = json.load(file)

# Split the data into 5 chunks
chunk_size = len(data) // 5
chunks = list(split_array(data, chunk_size))

# Write each chunk to a new file
for i, chunk in enumerate(chunks):
    with open(f'data_{i+1}.json', 'w') as file:
        json.dump(chunk, file, indent=4)

print("Splitting completed.")