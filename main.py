import ftplib

def ftp():
  try:
    ftp_server= "files.000webhost.com"
    ftp_username= "perfectuselits"
    
    ftp_pass = "Hello@me1"
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