from flask import Flask, request
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)


@app.route('/api/process-csv', methods=['POST'])
def process_csv():
    data = request.get_json()
    download_url = data['downloadURL']

    # Run the Python code using subprocess
    cmd = ['python', './client/firebase-csv2relations.py', download_url]
    subprocess.run(cmd, check=True)

    return 'Python code executed successfully'


if __name__ == '__main__':
    app.run()
