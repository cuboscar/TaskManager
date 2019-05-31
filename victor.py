import json, argparse, time

import sys
import png
import base64
import tensorflow as tf
import numpy as np
import cv2
from load import load_graph, load_image_into_numpy_array

from PIL import Image
from flask import Flask, request
from flask_cors import CORS

sys.path.append("./models/../object_detection/")
from object_detection.utils import label_map_util 
from object_detection.utils import visualization_utils as vis_util

##################################################
# API part
##################################################
app = Flask(__name__)
cors = CORS(app)
@app.route("/api/predict", methods=['POST'])
def predict():
    start = time.time()

    image = Image.open(request.files.get("file").stream)
    image_np = load_image_into_numpy_array(image)

    ##################################################
    # Tensorflow part
    ##################################################
    print('tensrof')
    # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
    image_np_expanded = np.expand_dims(image_np, axis=0)
      
    # Actual detection.
    (boxes, scores, classes, num) = persistent_sess.run(
          [detection_boxes, detection_scores, detection_classes, num_detections],
          feed_dict={image_tensor: image_np_expanded})
    ##################################################
    # END Tensorflow part
    ##################################################

    image_vis = vis_util.visualize_boxes_and_labels_on_image_array(image_np, np.squeeze(boxes), np.squeeze(classes).astype(np.int32), np.squeeze(scores), category_index, use_normalized_coordinates=True, line_thickness=8)
    png_vis = Image.fromarray(image_vis, 'RGB')
    png_vis.save("test_detection.jpeg")

    json_data = json.dumps({'classes': classes.tolist(), 'scores': scores.tolist(), 'boxes': boxes.tolist(), "new": base64.b64encode(png_vis.tobytes())})
    print("Time spent handling the request: %f" % (time.time() - start))
    
    return json_data
##################################################
# END API part
##################################################

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--frozen_model_filename", default="frozen_model.pb", type=str, help="Frozen model file to import")
    parser.add_argument("--gpu_memory", default=.2, type=float, help="GPU memory per process")
    args = parser.parse_args()

    NUM_CLASSES = 2
    label_map = label_map_util.load_labelmap("material_label_map.pbtxt")
    categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)
    ##################################################
    # Tensorflow part
    ##################################################
    print('Loading the model')
    graph = load_graph(args.frozen_model_filename)
    image_tensor = graph.get_tensor_by_name('image_tensor:0')
    detection_boxes = graph.get_tensor_by_name('detection_boxes:0')
    detection_scores = graph.get_tensor_by_name('detection_scores:0')
    detection_classes = graph.get_tensor_by_name('detection_classes:0')
    num_detections = graph.get_tensor_by_name('num_detections:0')

    print('Starting Session, setting the GPU memory usage to %f' % args.gpu_memory)
    gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=args.gpu_memory)
    sess_config = tf.ConfigProto(gpu_options=gpu_options)
    persistent_sess = tf.Session(graph=graph, config=sess_config)
    ##################################################
    # END Tensorflow part
    ##################################################

    print('Starting the API')
    app.run()