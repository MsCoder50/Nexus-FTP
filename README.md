# FTP File Upload Utility 🌐

## 📖 Overview
The **FTP File Upload** utility is a purpose-built Python script designed to automate the transfer of files to remote servers over the File Transfer Protocol (FTP). It streamlines what is normally a manual process into a quick, programmatic execution.

## 💡 Concept & Architecture
File transfer over networks involves establishing authenticated connections and managing binary streams.
- **Protocol Implementation**: This script utilizes Python's built-in `ftplib` (or similar network libraries) to initiate a TCP connection on port 21.
- **Authentication & Handshake**: Handles the login process securely with the remote server.
- **Binary Transfer**: Opens a local file (like the included `file.pdf` test file) in binary read mode and pipes that data directly to the server, ensuring file integrity is maintained during network transit.

## ✨ Key Features
- **Automated Uploads**: Ideal for CI/CD pipelines, backups, or scheduled tasks where files need to be pushed to a remote server without human intervention.
- **Binary File Support**: Capable of handling complex files (like PDFs, images, or archives) without data corruption.
- **Lightweight footprint**: Achieves complex network operations in a highly concise script (`main.py`).

## 🚀 Getting Started
Before running, you must open `main.py` and configure your FTP server credentials (Host, Username, Password, and Target Directory).
```bash
# Execute the upload script
python main.py
```
Ensure your firewall allows outgoing connections on FTP ports (21 and passive ranges).
