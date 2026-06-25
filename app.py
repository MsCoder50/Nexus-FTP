from flask import Flask, jsonify, request, render_template
from ftplib import FTP
import os
from flask_cors import CORS

#defining variables
app = Flask(__name__, static_folder='frontend/dist/assets', template_folder='frontend/dist')
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'tmp')
MAX_FILE_SIZE_MB = 1024

#app configuration
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE_MB * 1024 * 1024

#making directory if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

def upload(file_path, SERVER,USERNAME,PASSWORD, remote_dir=None):
    filename = os.path.basename(file_path)
    with FTP() as ftp:
        ftp.connect(SERVER, 21, timeout=30)
        ftp.login(USERNAME, PASSWORD)
        ftp.set_pasv(True)        # ensure passive mode for data transfers

        if remote_dir:
            ftp.cwd(remote_dir)

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
    remote_dir = request.form.get("remote_dir")
    
    try:
        upload(filepath, host, user, password, remote_dir=remote_dir)
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"message": "File received and uploaded successfully", "file_path": filepath}), 200
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"FTP upload failed: {str(e)}"}), 500

@app.route("/test-ftp",methods=["POST"])
def test_ftp():
    host = request.form.get("host")
    user = request.form.get("user")
    password = request.form.get("password")
    remote_dir = request.form.get("remote_dir")

    if not host or not user or not password:
        return jsonify({"error": "FTP credentials missing"}), 400

    ftp = FTP()
    try:
        ftp.connect(host, 21, timeout=30)
        ftp.login(user, password)
        ftp.set_pasv(True)

        if remote_dir:
            ftp.cwd(remote_dir)

        ftp.quit()
        return jsonify({"message": "FTP connection successful"}), 200
    except Exception as e:
        return jsonify({"error": e}), 500

if(__name__ == "__main__"):
    app.run(debug=True,port=8080)
