# dl_server.py (Minimal Python Server using Flask)

import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from torchvision import models, transforms
from PIL import Image
import io
import requests

app = Flask(__name__)

# --- Configuration and Model Loading ---
MODEL_PATH = 'resnet.pth'  # Ensure this file is in the same directory
BREED_LABELS = [
    "Ayrshire", "Beefalo", "Beefmaster", "Belgian Blue", "Black Baldy",
    "Brahman", "Braunvieh", "Brangus", "Charolais", "Chianina",
    "Corriente", "Devon", "Dexter", "Droughtmaster", "Galloway",
    "Gelbvieh", "Guernsey", "Hanwoo", "Highland", "Holstein Friesian",
    "Jersey", "Limousin", "Lowline", "Maine Anjou", "Marchigiana",
    "Milking Shorthorn", "Murray Grey", "Nellore", "Normande", "Piedmontese",
    "Pinzgauer", "Red Angus", "Red Poll", "Romagnola", "Shorthorn",
    "Simmental", "South Devon", "Speckle Park", "Texas Longhorn", "Wagyu",
    "White Park"
]  # Example labels


# Function to load the model (adjust architecture if necessary)
def load_model(path):
    try:
        # Load the base ResNet model structure
        model = models.resnet50(weights=None)

        # Get the number of input features for the final layer
        num_ftrs = model.fc.in_features

        # Set the final layer's output count to match the 41 breed labels
        model.fc = nn.Linear(num_ftrs, len(BREED_LABELS))  # len(BREED_LABELS) must be 41

        # Load the saved state dictionary. Since the structure now matches, use strict=True
        # Note: torch.load will load the weights, including the fc layer weights (41 output)
        model.load_state_dict(torch.load(path, map_location=torch.device('cpu')))

        model.eval()  # Set model to evaluation mode
        print(f"DL Model loaded successfully with {len(BREED_LABELS)} output classes.")
        return model
    except Exception as e:
        print(f"Error loading model weights: {e}")
        return None


DL_MODEL = load_model(MODEL_PATH)

# Image preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def predict_image(image_bytes):
    if DL_MODEL is None:
        return {'breed': 'Model Load Error', 'confidence': 0.0}

    # 1. Load image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # 2. Preprocess
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)  # Add a batch dimension

    # 3. Predict
    with torch.no_grad():
        output = DL_MODEL(input_batch)

    probabilities = torch.nn.functional.softmax(output[0], dim=0)
    top_prob, top_class = torch.topk(probabilities, 1)

    # 4. Format result
    result = {
        'breed': BREED_LABELS[top_class.item()],
        'confidence': round(top_prob.item(), 4)
    }
    return result


# --- Endpoint 1: For Livestock Management (Takes URL) ---
@app.route('/analyze-url', methods=['POST'])
def analyze_url():
    data = request.get_json()
    image_url = data.get('imageUrl')
    if not image_url:
        return jsonify({'error': 'No imageUrl provided'}), 400

    try:
        # Fetch image from URL
        image_response = requests.get(image_url)
        image_response.raise_for_status()

        # Predict
        result = predict_image(image_response.content)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': f'URL analysis failed: {str(e)}'}), 500


# --- Endpoint 2: For DL Model Studio (Takes File Upload) ---
@app.route('/studio-analyze', methods=['POST'])
def studio_analyze():
    # Expects the file key to be 'file' as sent by Spring Boot's RestTemplate
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request (expected key: "file")'}), 400

    file = request.files['file']

    try:
        # Predict using the file data bytes
        result = predict_image(file.read())
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': f'File analysis failed: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)