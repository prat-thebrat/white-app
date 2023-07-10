from flask import Flask, request, jsonify
from upload_handler import process_csv_files, upload_json_file
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

# Handle file upload and processing


@app.route('/upload', methods=['POST'])
def handle_upload():
    files = request.files.getlist('files')

    if all(file.filename.endswith('.csv') for file in files):
        # Process the CSV files and generate output
        output_data = process_csv_files(files)

        # Upload the output as a JSON file to Firebase Storage
        filename = upload_json_file(output_data)

        return jsonify({'filename': filename})

    return jsonify({'error': 'Invalid file format'})


if __name__ == '__main__':
    app.run()
