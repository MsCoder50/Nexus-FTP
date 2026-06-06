from flask import Flask,jsonify,request
import ftplib
import os
from flask_cors import CORS


#defining variables
app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'tmp')
MAX_FILE_SIZE_MB = 1024

#app configuration
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE_MB * 1024 * 1024

#making directory if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def upload(file_path, SERVER,USERNAME,PASSWORD):
    filename = os.path.basename(file_path)
    with ftplib.FTP(SERVER, USERNAME, PASSWORD) as ftp:
        with open(file_path, "rb") as file_object:
            # Use 'STOR' command followed by the target filename on the server
            ftp.storbinary(f"STOR {filename}", file_object)



#api routes
@app.route("/health",methods=["GET"])
def health():
    return "Server Running Perfectly... Grab some Coffee"

@app.route("/get-file",methods=["POST"])
def get_file():
    
    host = request.form.get("host")
    user = request.form.get("user")
    password = request.form.get("password")
    
    if not host or not user or not password:
        return jsonify({"error": "FTP credentials missing"}), 400
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    try:
        upload(filepath, host, user, password)
        return jsonify({"message": "File received and uploaded successfully", "file_path": filepath}), 200
    except Exception as e:
        return jsonify({"error": f"FTP upload failed: {str(e)}"}), 500

@app.route("/test-ftp",methods=["POST"])
def test_ftp():
    host = request.form.get("host")
    user = request.form.get("user")
    password = request.form.get("password")

    if not host or not user or not password:
        return jsonify({"error": "FTP credentials missing"}), 400

    ftp = ftplib.FTP()
    try:
        ftp.connect(host,21)
        ftp.login(user,password)
        ftp.quit()
        return jsonify({"message": "FTP connection successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if(__name__ == "__main__"):
    app.run(debug=True,port=8080)
