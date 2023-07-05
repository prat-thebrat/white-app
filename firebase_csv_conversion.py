import pandas as pd
from firebase_admin import storage
import firebase_admin
from firebase_admin import credentials

# Initialize Firebase Admin SDK
# Replace the path_to_service_account_key.json with the path to your own service account key file
cred = credentials.Certificate('path_to_service_account_key.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'your_storage_bucket_name.appspot.com'
})


def read_csv_from_firebase(filename):
    # Get a reference to the file
    bucket = storage.bucket()
    blob = bucket.blob('files/' + filename)

    # Download the file to a local temporary location
    temp_file = '/path/to/temp/' + filename
    blob.download_to_filename(temp_file)

    # Read the CSV file into a DataFrame
    df = pd.read_csv(temp_file)

    # Convert DataFrame to TXT format
    txt_data = df.to_string(index=False)

    # Save the DataFrame as a TXT file in Firebase Storage
    txt_filename = filename.split('.')[0] + '.txt'
    txt_blob = bucket.blob('files/' + txt_filename)
    txt_blob.upload_from_string(txt_data, content_type='text/plain')

    # Delete the temporary file
    os.remove(temp_file)

    print(f'{filename} converted to {txt_filename} and saved on Firebase Storage.')


# Usage example
filename = 'example.csv'
read_csv_from_firebase(filename)
