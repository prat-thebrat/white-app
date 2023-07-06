import firebase_admin
from firebase_admin import credentials, storage
import pandas as pd
import openai

openai.api_key = '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'

# Initialize Firebase Admin SDK
# Update with your own service account key path
cred = credentials.Certificate(
    './white-9a82b-firebase-adminsdk-8h87g-4dd23eab66.json')
firebase_admin.initialize_app(cred, {
    # Update with your own Firebase Storage bucket
    'storageBucket': 'white-9a82b.appspot.com'
})

# Process the uploaded CSV files, collect column names with table references, and save as a combined string


def process_csv_files(files):
    combined_columns = ""
    for i, file in enumerate(files, start=1):
        df = pd.read_csv(file)
        columns = df.columns.tolist()
        table_name = f"Table {i}"
        combined_columns += f"{table_name} has following columns: {', '.join(columns)}\n"

    try:
        prompt = "I have multiple tables. The column names of all these tables are as follows: " + \
                 combined_columns + ". Generate appropriate relations between these tables. Name the primary key and foreign key. Draw lines between relations. Mention if it's a one-to-one relation or the type of relationship."

        response = openai.Completion.create(
            engine='text-davinci-003',
            prompt=prompt,
            max_tokens=1000,
            temperature=0.5,
            n=1,
            stop=None,
        )

        out = response.choices[0].text.strip()
    except Exception as e:
        print('Error generating relations:', str(e))
        out = 'Error generating relations'

    return out

# Upload the combined columns string as a text file to Firebase Storage


def upload_text_file(text):
    bucket = storage.bucket()
    # Update with the desired path for the output text file in Firebase Storage
    blob = bucket.blob('files/output.txt')
    blob.upload_from_string(text, content_type='text/plain')
    blob.make_public()
    download_url = blob.public_url
    return download_url
