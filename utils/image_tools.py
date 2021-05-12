import os
import PIL
from werkzeug.utils import secure_filename
from PIL import Image 

def save_img(img, path = None):
    print("\n")
    
    filename = secure_filename(img.filename)
    data = img.read()
    
    img.save('./')
    print(img)    
    
if __name__ == "__main__":
    im1 = Image.open("example.png") 
    im1 = im1.save("temp.png")