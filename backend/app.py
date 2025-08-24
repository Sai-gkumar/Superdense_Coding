from flask import Flask, request, jsonify
from flask_cors import CORS
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

app = Flask(__name__)
CORS(app)

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    bit1 = data.get('bit1')
    bit2 = data.get('bit2')

    qc = QuantumCircuit(2, 2)

    qc.h(0)
    qc.cx(0, 1)

    if bit1 == '1':
        qc.x(0)
    if bit2 == '1':
        qc.z(0)

    qc.cx(0, 1)
    qc.h(0)
    qc.measure([0, 1], [0, 1])

    simulator = AerSimulator()
    compiled_circuit = transpile(qc, simulator)
    result = simulator.run(compiled_circuit).result()
    counts = result.get_counts()
    measured_bits = list(counts.keys())[0]

    return jsonify({
        'original_bits': bit1 + bit2,
        'measured_bits': measured_bits
    })

if __name__ == '__main__':
    app.run(debug=True)
