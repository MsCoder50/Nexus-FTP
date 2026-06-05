from flask import Flask,jsonify,request
import ftplib
import os


#defining variables
app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'tmp')
MAX_FILE_SIZE_MB = 1024

#app configuration
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE_MB * 1024 * 1024

#making directory if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#api routes
@app.route("/health",methods=["GET"])
def health():
    return "Server Running Perfectly... Grab some Coffee"

@app.route("/get-file",methods=["POST"])
def get_file():
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    return jsonify({"message": "File received successfully", "file_path": filepath}), 200


if(__name__ == "__main__"):
    app.run(debug=True,port=8080)
