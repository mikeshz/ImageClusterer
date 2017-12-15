from flask import Flask, jsonify
from flask_cors import CORS
import base64


app = Flask(__name__)
CORS(app)

# TODO: Put image encoding and creating the image array below into a real method
with open("./test.jpg", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

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
        },
        ]}), 200

@app.route('/api/moveview')
def serve_move_view():
    pass

@app.route('/api/recluster')
def serve_recluster():
    pass


if __name__ == '__main__':
    app.run(debug=True, port=3001)

