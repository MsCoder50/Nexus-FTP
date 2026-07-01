# Contributing to Nexus FTP 🌐

First off, thank you for considering contributing to Nexus FTP! It's people like you that make open-source tools better for everyone. We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, and code changes.

## 🤝 Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to maintain a respectful, welcoming, and inclusive environment.

## 🚀 How Can I Contribute?

### 1. Reporting Bugs
If you find a bug, please open an issue in the repository. Make sure to include:
- A clear and descriptive title.
- Steps to reproduce the issue.
- Details about your environment (OS, Python version, Node.js version, browser).
- Any relevant logs or screenshots (especially for connection or UI errors).

### 2. Requesting Features
Have an idea to make Nexus FTP better? Open an issue describing your feature request. Explain *why* this feature would be useful and how it aligns with the project's goals of secure and automated FTP file transfers.

### 3. Improving Documentation
Documentation is crucial! If you find a typo, unclear explanation, or missing information in the `README.md` or this guide, feel free to submit a pull request (PR) with corrections.

### 4. Contributing Code
Whether it's fixing a bug or adding a new feature, we love code contributions!

#### 🛠️ Project Structure
Nexus FTP is a full-stack application:
- **Backend**: Python (Flask). Handles FTP connections, file processing, and API routes.
- **Frontend**: React. Handles the user interface, credential management, and file selection.

#### 📝 Development Workflow
1. **Fork the repository** to your own GitHub account.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/nexus-ftp.git
   cd nexus-ftp
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bugfix-name
   ```
4. **Make your changes** following the project structure.
5. **Test your changes** locally.
   - *Backend*: Ensure APIs (`/test-ftp`, `/get-file`) work correctly using cURL or Postman.
   - *Frontend*: Ensure the UI looks good and functions as expected.
6. **Commit your changes** using clear and descriptive commit messages:
   ```bash
   git commit -m "Add feature: support for SFTP connections"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Submit a Pull Request** to the `main` branch of the original repository. Provide a clear description of what your PR does.

## 🏗️ Setting Up Your Local Environment

Please refer to the `README.md` for complete setup instructions. As a quick recap:

### Backend (Python/Flask)
```bash
pip install -r requirements.txt
python3 app.py
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## ✅ Pull Request Guidelines
- Keep your PR focused on a single issue or feature.
- Ensure your code follows the existing style and conventions of the project.
- Test your changes thoroughly before submitting.
- Avoid committing sensitive information or temporary files (e.g., test files in the `tmp/` directory).

Thank you for contributing and helping make Nexus FTP an awesome tool!
