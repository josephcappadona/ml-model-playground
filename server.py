import os
from flask import Flask, render_template, request, abort, jsonify
from transformers import T5Tokenizer, T5ForConditionalGeneration, AutoModelWithLMHead, AutoTokenizer
import torch

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


t5_tokenizer = T5Tokenizer.from_pretrained('t5-small')
t5_model = T5ForConditionalGeneration.from_pretrained('t5-small')

@app.route('/t5')
def t5():
    return render_template('t5.html')

@app.route('/api/t5', methods=['POST'])
def api_t5():
    data = request.json
    mandatory_args = ['T5QueryType', 'T5Prompt']
    if not data or any(arg not in data for arg in mandatory_args):
        abort(400)
    print(data)
    if data['T5QueryType'] == 'summarize':
        t5_input = f"summarize: {data['T5Prompt']} "
    elif data['T5QueryType'] == 'translate':
        t5_input = f"translate English to German: {data['T5Prompt']} "
    elif data['T5QueryType'] == 'cola':
        t5_input = f"cola sentence: {data['T5Prompt']} "
    elif data['T5QueryType'] == 'stsb':
        sent1, sent2 = data['T5Prompt'].split('\n')[:2]
        t5_input = f"stsb sentence1: {sent1} sentence2: {sent2} "
    else:
        abort(400)
    inputs = t5_tokenizer(t5_input, return_tensors="pt").input_ids
    output = t5_model.generate(inputs)
    result = t5_tokenizer.decode(output[0], skip_special_tokens=True)
    ret = {'data': result}
    return jsonify(ret), 201


gpt2_tokenizer = AutoTokenizer.from_pretrained("gpt2")
gpt2_model = AutoModelWithLMHead.from_pretrained("gpt2")

def enumerate_and_format(sequences):
    lines = []
    for i, sequence in enumerate(sequences):
        line = f"{i}: {sequence}"
        lines.append(line)
    return '\n\n'.join(lines)

@app.route('/gpt2')
def gpt2():
    return render_template('gpt2.html')

@app.route('/api/gpt2', methods=['POST'])
def api_gpt2():
    data = request.json
    mandatory_args = ['GPT2Prompt']
    if not data or any(arg not in data for arg in mandatory_args):
        abort(400)
    print(data)
    inputs = gpt2_tokenizer(data['GPT2Prompt'], return_tensors="pt").input_ids
    output = gpt2_model.generate(
        inputs,
        do_sample=True,
        max_length=100, 
        top_k=50, 
        top_p=0.95, 
        num_return_sequences=3
    )
    result = [gpt2_tokenizer.decode(o, skip_special_tokens=True) for o in output]
    ret = {'data': enumerate_and_format(result)}
    return jsonify(ret), 201


detr_model = torch.hub.load('facebookresearch/detr', 'detr_resnet50', pretrained=True)

@app.route('/detr')
def detr():
    return render_template('detr.html')

@app.route('/api/detr', methods=['POST'])
def api_detr():
    data = request.json
    print(data)
    ret = {'data': 'DETR OUTPUT HERE'}
    return jsonify(ret), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
