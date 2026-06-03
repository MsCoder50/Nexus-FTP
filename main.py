import ftplib
import os

def ftp():
  try:
    ftp_server= os.getenv(SERVER_NAME)
    ftp_username= os.getenv(USER_NAME)
    
    ftp_pass = os.getenv(PASS)
    ssl = 0
    filename = r"file.pdf"
    out_dir = "public_html/Report"
    ft = ftplib.FTP(ftp_server,ftp_username,ftp_pass)
    ft.cwd(out_dir)
    fp = open(filename,'rb')
    cmd = 'STOR'+' '+filename
    ft.storbinary(cmd,fp)
    ft.quit()
    fp.close()
  except Exception as e:
    print(e)
    
ftp()
