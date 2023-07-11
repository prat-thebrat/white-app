import firebase_admin
from firebase_admin import credentials, storage
import pandas as pd
import openai
import datetime
import json
import re
import psycopg2
from io import StringIO

openai.api_key = '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'

# Initialize Firebase Admin SDK
# Update with your own service account key path
cred = credentials.Certificate(
    './white-9a82b-firebase-adminsdk-8h87g-4dd23eab66.json')
firebase_admin.initialize_app(cred, {
    # Update with your own Firebase Storage bucket
    'storageBucket': 'white-9a82b.appspot.com'
})

# Process the uploaded CSV files and generate output data


def process_csv_files(files):
    combined_columns = ""
    tables = []

    for i, file in enumerate(files, start=1):
        df = pd.read_csv(file)
        columns = df.columns.tolist()
        table_name = f"Table_{i}"
        combined_columns += f"{table_name} has following columns: {', '.join(columns)}\n"

        tables.append({
            'name': table_name,
            'columns': columns,
            'data': df
        })

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

        output = response.choices[0].text.strip()
    except Exception as e:
        print('Error generating relations:', str(e))
        output = 'Error generating relations'

    data = {
        'Name': 'user',
        'Time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'output': output
    }

    # Store tables in PostgreSQL database
    store_tables_in_database(tables)

    return data

# Store the tables in the PostgreSQL database


def store_tables_in_database(tables):
    # Update the PostgreSQL connection details as per your database configuration
    conn = psycopg2.connect(
        host='trumpet.db.elephantsql.com',
        database='dykrojjj',
        user='dykrojjj',
        password='x0tLUyYZUdP3jmM4borqLnMMH2S-Lc7q'
    )

    try:
        cursor = conn.cursor()

        for table in tables:
            table_name = table['name']
            columns = table['columns']
            data = table['data']

            # Create the table with the same column names as CSV
            create_table_query = f"CREATE TABLE {table_name} ({', '.join([f'{col} VARCHAR(255)' for col in columns])});"
            cursor.execute(create_table_query)

            # Prepare the data for bulk insertion
            data_buffer = StringIO()
            data.to_csv(data_buffer, index=False, header=False)
            data_buffer.seek(0)

            # Copy the data into the table
            copy_query = f"COPY {table_name} FROM STDIN WITH (FORMAT CSV, HEADER FALSE);"
            cursor.copy_expert(copy_query, data_buffer)

        conn.commit()
    except Exception as e:
        print('Error storing tables in the database:', str(e))
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Upload the output data as a JSON file to Firebase Storage


def upload_json_file(data):
    bucket = storage.bucket()
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f'files/output_{timestamp}.json'
    blob = bucket.blob(filename)
    blob.upload_from_string(json.dumps(data), content_type='application/json')
    blob.make_public()
    return filename


def retrieve_output_text():
    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix='files/output_')

    latest_blob = None
    latest_timestamp = None

    for blob in blobs:
        match = re.search(
            r"output_(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})\.json", blob.name)
        if match:
            timestamp = match.group(1)
            if latest_timestamp is None or timestamp > latest_timestamp:
                latest_blob = blob
                latest_timestamp = timestamp

    if latest_blob is not None:
        try:
            text = latest_blob.download_as_text()
            return text
        except Exception as e:
            print('Error retrieving output text:', str(e))

    return None
