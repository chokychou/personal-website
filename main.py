import os
from flask import Flask, render_template, request,send_file
from utils.image_tools import save_img

UPLOAD_FOLDER = 'static/images'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route('/image-process', methods=['GET', 'POST'])
def image_process():
    file = request.files['img']
    path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(path)    
    
    data = {'name': file.filename,'url': save_img(path = path)}
    #return render_template("image-process.html", data=data)
    return send_file(file, mimetype='image/gif')

if __name__ == "__main__":
    app.run()