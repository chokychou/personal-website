import os
from flask import Flask, render_template, request
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
    path = os.path.join(app.config['UPLOAD_FOLDER'], 'saved'+file.filename)
    file.save(path)
    return 'ok'

if __name__ == "__main__":
    app.run()