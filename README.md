# Nexus FTP File Upload 🌐

## 📖 Overview
Nexus FTP is a robust file transfer solution featuring a Python Flask backend. It automates secure file uploads to a remote FTP server through a clean REST API architecture.

### 📸 App Interface
![Screenshot 1](./screenshots/1.png)
![Screenshot 2](./screenshots/2.png)
![Screenshot 3](./screenshots/3.png)
![Screenshot 4](./screenshots/4.png)
![Screenshot 5](./screenshots/5.png)

## 💡 Workflow of the App
1. **Client Request**: The client (or API testing tool) sends a `POST` request to the backend containing the target FTP credentials (`host`, `user`, `password`) and the `file` to be uploaded.
2. **Local Staging**: The Flask backend receives the file and temporarily saves it in a local `tmp/` directory to ensure data integrity.
3. **FTP Authentication**: The backend connects to the specified FTP server on port 21 and authenticates the user.
4. **Binary Transfer**: The backend pipes the saved binary file directly to the FTP server using the `STOR` command in Passive Mode.
5. **Response**: Upon successful transfer, the backend returns a `200 OK` JSON response and cleans up the connection.

```mermaid
sequenceDiagram
    participant C as Client (React UI / cURL)
    participant B as Flask Backend
    participant FS as Local Filesystem (tmp/)
    participant S as FTP Server

    C->>B: POST /get-file (File + Credentials)
    B->>FS: Save File Temporarily
    FS-->>B: Confirmation
    B->>S: Connect (Port 21) & Authenticate
    S-->>B: Auth Success
    B->>S: STOR filename (Binary Transfer)
    S-->>B: Transfer Complete
    B->>C: 200 OK (JSON Response)
```

## 🚀 How to Setup the App

### 1. Install Dependencies
Ensure you have Python installed, then install the required backend dependencies:
```bash
pip install -r requirements.txt
```

### 2. Run the Backend Server
Start the Flask API server:
```bash
python3 app.py
```
The backend server will run continuously on `http://127.0.0.1:8080`.

---

## ⚠️ Important FTP Server Configuration (e.g., FileZilla Server)
If you are hosting the FTP server yourself, you **must** configure it correctly for the backend to communicate with it, otherwise you will encounter `550 Permission Denied` or connection errors:

1. **Protocol Configuration**: 
   Ensure your FTP server's protocol is set to **"explicit FTP over TLS"** or **"insecure plain FTP"**. Ensure your Python code (`FTP()` vs `FTP_TLS()`) matches the server's requirement. *Note: Python's standard `ftplib` does not support TLS session resumption, so if your server enforces that, you must use insecure plain FTP or disable session resumption.*
2. **Directory Permissions (OS Level)**: 
   Ensure the system user running the FTP Server has actual OS-level **Write** permissions to the target native directory (e.g., `chmod 777 /path/to/ftp`).
3. **Parent Directory Traversal**: 
   If your FTP folder is nested inside a restricted user directory (like `/home/username/FTP`), ensure the parent directory (`/home/username`) has execute/traversal permissions (`chmod a+x /home/username`). Otherwise, the FTP service cannot physically reach the folder, regardless of virtual permissions.

---

## 🧪 How to Test the API

You can easily test the backend APIs using `cURL`, Postman, or any API client.

### 1. Test FTP Connection (`/test-ftp`)
Validates your credentials and connection without actually uploading a file.
```bash
curl -X POST http://127.0.0.1:8080/test-ftp \
  -F "host=127.0.0.1" \
  -F "user=your_username" \
  -F "password=your_password"
```

### 2. Test File Upload (`/get-file`)
Uploads a file to the FTP server.
```bash
curl -X POST http://127.0.0.1:8080/get-file \
  -F "host=127.0.0.1" \
  -F "user=your_username" \
  -F "password=your_password" \
  -F "file=@/path/to/your/local/test_file.txt"
```
