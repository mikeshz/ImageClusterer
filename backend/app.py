from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import base64

app = Flask(__name__)
CORS(app, resources=r'/api/*')
app.config['CORS_HEADERS'] = 'Content-Type'

# TODO: Put image encoding and creating the image array below into a real method
with open("./test.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
with open("./heckert_gnu.small.png", "rb") as image_file2:
    encoded_string2 = base64.b64encode(image_file2.read()).decode('utf-8')

@app.route('/api/getimages')
def serve_images():
    return jsonify({"images": [
        {
            "src": encoded_string,
            "thumbnail": encoded_string
        },
        {
            "src": encoded_string,
            "thumbnail": encoded_string
        },
        {
            "src": encoded_string,
            "thumbnail": encoded_string
        }
        ]}), 200

@app.route('/api/moveview')
def serve_move_view():
    pass

@app.route('/api/recluster', methods=['POST'])
def serve_recluster():
    print("selected images: " + request.json['selectedImages'])
    return jsonify({"images": [
        {
            "src": encoded_string2,
            "thumbnail": encoded_string2
        },
        {
            "src": encoded_string2,
            "thumbnail": encoded_string2
        },
        {
            "src": encoded_string2,
            "thumbnail": encoded_string2
        }
        ]}), 200


if __name__ == '__main__':
    app.run(debug=True, port=3001)

