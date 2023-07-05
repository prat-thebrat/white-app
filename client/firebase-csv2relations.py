import pandas as pd
from firebase_admin import initialize_app, storage
import sys
import os

# Initialize Firebase app
initialize_app()


def download_csv_from_storage(firebase_url):
    bucket = storage.bucket()
    blob = bucket.blob(firebase_url)

    # Download CSV file from Firebase Storage
    local_folder = './client/public/downCSV'
    os.makedirs(local_folder, exist_ok=True)

    local_path = os.path.join(local_folder, 'file.csv')
    blob.download_to_filename(local_path)

    return local_path


def convert_csv_to_dataframe(csv_file):
    # Read CSV file into a DataFrame
    df = pd.read_csv(csv_file)

    return df


def save_dataframe_as_text(df, text_file):
    # Save DataFrame as a text file
    df.to_csv(text_file, sep='\t', index=False)


def upload_text_to_storage(text_file, firebase_url):
    bucket = storage.bucket()
    blob = bucket.blob(firebase_url)

    # Upload text file to Firebase Storage
    blob.upload_from_filename(text_file)

    print("Text file uploaded successfully")


if __name__ == "__main__":
    # Get the Firebase storage URL as a command line argument
    firebase_url = sys.argv[1]

    # Download CSV file from Firebase Storage
    csv_file = download_csv_from_storage(firebase_url)

    # Convert CSV to DataFrame
    df = convert_csv_to_dataframe(csv_file)

    # Save DataFrame as a text file
    text_folder = './client/public/txtFiles'
    os.makedirs(text_folder, exist_ok=True)

    text_file = os.path.join(text_folder, 'file.txt')
    save_dataframe_as_text(df, text_file)

    # Upload text file to Firebase Storage
    upload_text_to_storage(text_file, firebase_url)
