from flask import Flask,request,jsonify
import uuid
from keybert import KeyBERT;
from pypdf import PdfWriter,PdfReader
from tika import parser
import fitz
import requests
kw_model = KeyBERT()
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": "Bearer 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"}
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()
app = Flask(__name__);
@app.route('/')
def hello_world():
    return 'Hello, World';
@app.route('/data',methods = ['POST'])
def sendkeywords():
    if 'pdf' not in request.files:
        return 'No PDF file uploaded',400
    pdf_file = request.files['pdf'];
    file_name = str(uuid.uuid4()) + ".pdf";
    pdf_file.save(file_name);
    pdf_reader = PdfReader(file_name);
    with fitz.open(file_name) as doc:
        text = ""
        for page in doc:
            text += page.get_text()
    summ_text = query({"inputs": text, "parameters": {"min_length": 100, "max_length": 200}})
    keywords = kw_model.extract_keywords(text);
    return {"data" : {"title" : pdf_reader.metadata["/Title"],"summary" : summ_text,"keywords" : keywords}}
if __name__ == '__main__':
    app.run(port = 5000);