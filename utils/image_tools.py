'''
source: https://deepai.org/machine-learning-model/torch-srgan
'''

import os
import PIL
import requests
from werkzeug.utils import secure_filename
from PIL import Image 

def save_img(img = None, path = None):
    r = requests.post(
    "https://api.deepai.org/api/torch-srgan",
    files={
        'image': open(path, 'rb'),
    },
    headers={'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'}
    )
    return r.json()['output_url']
    
if __name__ == "__main__":
    pass

