from flask import Flask, request, jsonify
from upload_handler import process_csv_files, upload_text_file
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

# Handle file upload and processing


@app.route('/upload', methods=['POST'])
def handle_upload():
    files = request.files.getlist('files')

    if all(file.filename.endswith('.csv') for file in files):
        # Process the CSV files, collect column names, and save as a combined string
        out = process_csv_files(files)

        # Upload the combined columns string as a text file to Firebase Storage
        download_url = upload_text_file(out)

        return jsonify({'download_url': download_url})

    return jsonify({'error': 'Invalid file format'})


if __name__ == '__main__':
    app.run()
