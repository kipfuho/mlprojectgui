from flask import Flask, request, flash, jsonify
from flask_cors import CORS

import torch
from torch.utils.model_zoo import load_url
from PIL import Image
from scipy.special import expit

import sys
sys.path.append('..')

from blazeface import FaceExtractor, BlazeFace, VideoReader
from architectures import fornet,weights
from isplutils import utils

net_model = 'EfficientNetAutoAttB4'
train_db = 'DFDC'

device = torch.device('cuda:0') if torch.cuda.is_available() else torch.device('cpu')
face_policy = 'scale'
face_size = 224
frames_per_video = 32

model_url = weights.weight_url['{:s}_{:s}'.format(net_model,train_db)]
net = getattr(fornet,net_model)().eval().to(device)
net.load_state_dict(load_url(model_url,map_location=device,check_hash=True))

transf = utils.get_transformer(face_policy, face_size, net.get_normalizer(), train=False)

facedet = BlazeFace().to(device)
facedet.load_weights("../blazeface/blazeface.pth")
facedet.load_anchors("../blazeface/anchors.npy")
videoreader = VideoReader(verbose=False)
video_read_fn = lambda x: videoreader.read_frames(x, num_frames=frames_per_video)
face_extractor = FaceExtractor(video_read_fn=video_read_fn,facedet=facedet)

app = Flask(__name__)
CORS(app)
app.secret_key = "super secret key"

@app.post("/")
def hello_world():
    data = request.json
    return jsonify(data)

@app.post("/image")
def eval_image():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return jsonify(status=200, message="No file attached!")
        f = request.files['file'] 
        f.save(f.filename)
        im = Image.open(f.filename)
        im_faces = face_extractor.process_image(img=im)
        faces_t = torch.stack( [ transf(image=im_faces['faces'][0])['image'] ] )

        with torch.no_grad():
            faces_pred = torch.sigmoid(net(faces_t.to(device))).cpu().numpy().flatten()
        return jsonify(status=200, message="Processed successfully!", score=str(faces_pred[0]))
    return jsonify(status=405, message="Method not allowed!")

@app.route("/video", methods=['POST'])
def eval_video():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return jsonify(status=200, message="No file attached!")
        f = request.files['file'] 
        f.save(f.filename)
        vid_faces = face_extractor.process_video(f.filename)
        faces_t = torch.stack( [ transf(image=frame['faces'][0])['image'] for frame in vid_faces if len(frame['faces'])] )
        with torch.no_grad():
            faces_pred = net(faces_t.to(device)).cpu().numpy().flatten()
        return jsonify(status=200, message="Processed successfully!", score=str(expit(faces_pred.mean())))
    return jsonify(status=405, message="Method not allowed!")