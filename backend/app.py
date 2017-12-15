from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pickle
import os
import base64

app = Flask(__name__)
CORS(app, resources=r'/api/*')
app.config['CORS_HEADERS'] = 'Content-Type'
current_location = [0, 0]

n_row = 31
n_col = 31
n_row_view = 5
n_col_view = 5
image_space = [[None for i in range(n_col)] for j in range(n_row)]

# TODO: Put image encoding and creating the image array below into a real method
with open("./test.jpg", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
with open("./white.jpg", "rb") as image_file2:
    encoded_string2 = base64.b64encode(image_file2.read()).decode('utf-8')

@app.route('/api/getimages')
def serve_images():
    return jsonify({"images": get_images_view("none")}), 200

@app.route('/api/moveview', methods=['POST'])
def serve_move_view():
    print("Movement: " + request.json['movement'])
    return jsonify({"images": get_images_view(request.json['movement'])}), 200

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

def get_images_view(movement):
    global current_location
    movement = movement.lower()
    if movement == "right" and current_location[1] + n_col_view < n_col:
            current_location[1] += 1
    elif movement == "left" and current_location[1] > 0:
        current_location[1] -= 1
    elif movement == "up" and current_location[0] > 0:
        current_location[0] -= 1
    elif movement == "down" and current_location[0] + n_row_view < n_row:
        current_location[0] += 1
    elif movement == "none":
        pass
    else:
        pass
    images_array = []
    for row in range(current_location[0], current_location[0] + n_row_view):
        for col in range(current_location[1], current_location[1] + n_col_view):
            image = image_space[row][col]
            images_array.append({
                "src": image,
                "thumbnail": image
            })
    #for image in image_space[current_location:9 + current_location]:
    #    images_array.append({
    #        "src": image,
    #        "thumbnail": image
    #    })
    return images_array

def load_images():
    global current_location
    global n_row
    global n_col
    with open("./pic_paths_by_loc.pickle", "rb") as handle:
        images_fp = pickle.load(handle)
    for row in range(n_row):
        for col in range(n_col):
            if not images_fp[row][col]:
                image_space[row][col] = encoded_string2
            else:
                with open(os.path.join("./pictures/", images_fp[row][col][0].rsplit("\\", 1)[-1]), "rb") as image_file:
                    image_space[row][col] = (base64.b64encode(image_file.read()).decode('utf-8'))


if __name__ == '__main__':
    load_images()
    app.run(debug=True, port=3001)

