import React, { useState, useEffect } from "react";

export default function QuantumSimulator() {
  const [bit1, setBit1] = useState(null);
  const [bit2, setBit2] = useState(null);
  const [cutGates, setCutGates] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [receivedBits, setReceivedBits] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    { title: "Entanglement", description: "Create Bell state Φ⁺" },
    { title: "Encoding", description: "Apply X/Z gates based on bits" },
    { title: "Transmission", description: "Send qubit A to receiver" },
    { title: "Decoding", description: "Perform Bell measurement" },
  ];

  // Reset simulation states on bit choices change
  useEffect(() => {
    setCurrentStep(-1);
    setReceivedBits(null);
    setError(null);
  }, [bit1, bit2, cutGates]);

  // Simulate process steps with timer and update results accordingly
  const simulate = () => {
    if (bit1 === null || bit2 === null) {
      setError("Please select both Classical Bits!");
      return;
    }
    setError(null);
    setReceivedBits(null);
    setCurrentStep(0);

    let stepIndex = 0;
    const timer = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      } else {
        clearInterval(timer);

        // Simulate received bits with or without gate cutting influence
        if (cutGates) {
          const successRate = 0.75; // 75% chance success if gates are cut
          if (Math.random() < successRate) {
            setReceivedBits(`${bit1}${bit2}`);
            setError(null);
          } else {
            setReceivedBits(null);
            setError("Transmission Error due to gate usage cut.");
          }
        } else {
          setReceivedBits(`${bit1}${bit2}`);
          setError(null);
        }
        setCurrentStep(-1);
      }
    }, 2000);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: 900, margin: "auto", padding: "2em" }}>
      <h1 style={{ color: "#003366", textAlign: "center", marginBottom: "1rem" }}>
        Superdense Coding Simulation & Tutorial
      </h1>

      {/* Bit Selection */}
      <section style={{ marginBottom: 30 }}>
        <h2>Choose Classical Bits to Transmit</h2>
        <p>
          <strong>Current Selection:</strong> {bit1 !== null && bit2 !== null ? `${bit1}${bit2}` : "--"}
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <label>
            First Bit:
            <select
              value={bit1 ?? ""}
              onChange={e => setBit1(e.target.value)}
              style={{ marginLeft: 12, padding: "4px 8px", fontSize: "1rem", borderRadius: 4 }}
            >
              <option value="" disabled>--Select--</option>
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </label>
          <label>
            Second Bit:
            <select
              value={bit2 ?? ""}
              onChange={e => setBit2(e.target.value)}
              style={{ marginLeft: 12, padding: "4px 8px", fontSize: "1rem", borderRadius: 4 }}
            >
              <option value="" disabled>--Select--</option>
              <option value="0">0</option>
              <option value="1">1</option>
            </select>
          </label>
        </div>
      </section>

      {/* Visual Process Representation */}
      <section style={{ marginBottom: 40 }}>
        <h2>Visual Process Representation</h2>

        {/* Qubit States */}
        <div style={{ marginBottom: 20 }}>
          <h3>Qubit States</h3>
          <div style={{fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '0.2rem'}}>
            |0⟩ &nbsp;&nbsp;&nbsp;&nbsp; |0⟩
          </div>
        </div>

        {/* Circuit Diagram */}
        <div
          style={{
            border: "2px solid #0073e6",
            borderRadius: 12,
            backgroundColor: "#e6f2ff",
            padding: 20,
            marginBottom: 30,
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 24,
            textAlign: "center",
          }}
        >
          <div>
            <h4>Qubit A</h4>
            <p>H</p>
            <p>{cutGates ? <s>X</s> : "X"}</p>
            <p>{cutGates ? <s>Z</s> : "Z"}</p>
          </div>
          <div>
            <h4>Qubit B</h4>
            <p>Measurement</p>
            <p>Bell Basis</p>
          </div>
        </div>

        {/* Process Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16 }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                padding: 16,
                borderRadius: 6,
                border: "1.5px solid #0073e6",
                backgroundColor: idx === currentStep ? "#b3d1ff" : "#f0f8ff",
                boxShadow: idx === currentStep ? "0 0 12px #0059b3" : "none",
                transition: "background-color 0.3s, box-shadow 0.3s",
              }}
            >
              <h4>{idx + 1}. {step.title}</h4>
              <p>{step.description}</p>
              <p>
                <em>Status: </em>
                {idx === currentStep ? "In Progress..." : idx < currentStep ? "Done" : "Waiting..."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Cut Gate Usage Toggle */}
      <section style={{ marginBottom: 30 }}>
        <label style={{ cursor: "pointer", userSelect: "none", fontWeight: "600" }}>
          <input
            type="checkbox"
            checked={cutGates}
            onChange={e => setCutGates(e.target.checked)}
            style={{ marginRight: 12, transform: "scale(1.3)", verticalAlign: "middle" }}
          />
          Cut Gate Usage (simulate fewer quantum gates)
        </label>
      </section>

      {/* Simulation Control */}
      <section>
        <button
          onClick={simulate}
          disabled={currentStep !== -1}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#0073e6",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: "1.25rem",
            cursor: currentStep === -1 ? "pointer" : "not-allowed",
            transition: "background-color 0.3s",
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = currentStep === -1 ? "#005bb5" : "#0073e6"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#0073e6"}
        >
          {currentStep === -1 ? "Start Simulation" : "Simulating..."}
        </button>
      </section>

      {/* Results & Errors */}
      <section style={{ marginTop: 40 }}>
        <h2>Results</h2>
        <p><strong>Original Bits:</strong> {bit1 !== null && bit2 !== null ? `${bit1}${bit2}` : "--"}</p>
        <p>
          <strong>Received Bits:</strong>{" "}
          {error ? <span style={{ color: "red", fontWeight: "bold" }}>{error}</span> : (receivedBits ?? "--")}
        </p>
      </section>

      {/* Educational Section */}
      <section style={{ marginTop: 40 }}>
        <h2>How Superdense Coding Works</h2>
        <p>
          Superdense coding leverages quantum entanglement to transmit two classical bits through one quantum particle.
          Entangled qubits exist in superposition states where operations on one instantly affect the other, enabling
          communication beyond classical limits. The Bell measurement decodes the transmitted information.
        </p>
        <ul style={{ marginLeft: 20 }}>
          <li>Entangled qubits exist in superposition</li>
          <li>Operations on one qubit affect the other instantly</li>
          <li>Bell measurement reveals the encoded information</li>
          <li>No-cloning theorem ensures security</li>
        </ul>

        {/* Gate Operations Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontSize: "1rem" }}>
          <thead style={{ backgroundColor: "#0073e6", color: "white", textAlign: "left" }}>
            <tr>
              <th style={{ padding: 10, border: "1px solid #ddd" }}>Bits</th>
              <th style={{ padding: 10, border: "1px solid #ddd" }}>X Gate</th>
              <th style={{ padding: 10, border: "1px solid #ddd" }}>Z Gate</th>
              <th style={{ padding: 10, border: "1px solid #ddd" }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              { bits: "00", x: "No", z: "No", result: "Φ⁺" },
              { bits: "01", x: "Yes", z: "No", result: "Ψ⁺" },
              { bits: "10", x: "No", z: "Yes", result: "Φ⁻" },
              { bits: "11", x: "Yes", z: "Yes", result: "Ψ⁻" },
            ].map(row => (
              <tr key={row.bits} style={{ backgroundColor: "#f9f9f9" }}>
                <td style={{ padding: 10, border: "1px solid #ddd" }}>{row.bits}</td>
                <td style={{ padding: 10, border: "1px solid #ddd" }}>{row.x}</td>
                <td style={{ padding: 10, border: "1px solid #ddd" }}>{row.z}</td>
                <td style={{ padding: 10, border: "1px solid #ddd" }}>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
