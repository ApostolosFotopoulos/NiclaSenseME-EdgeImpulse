import React, { useState } from "react";

export default function Status({ selectedPatientName, isGatheringData }) {
  const [msg, setMsg] = useState("Click the connect button to connect Nicla Sense ME");
  const [buttonText, setButtonText] = useState("CONNECT");
  const [isConnecting, setConnectingState] = useState(false);
  const [isConnected, setConnectedState] = useState(false);

  const SERVICE_UUID = "9a48ecba-2e92-082f-c079-9e75aae428b1";
  const NiclaSenseME = {
    predictions: {
      uuid: "2d2f88c4-f244-5a80-21f1-ee0224e80658",
      properties: ["BLERead"],
      structure: ["Float32"],
      data: { predictions: [] },
    },
  };

  const sensors = Object.keys(NiclaSenseME);

  function toggleIsConnectingClass() {
    setConnectingState(!isConnecting);
    setButtonText("PAIRING");
  }

  function toggleIsConnectedClass() {
    setConnectedState(!isConnected);
    setButtonText("PAIRED");
  }

  function removeStatusButtonStyles() {
    setConnectingState(false);
    setConnectedState(false);
    setButtonText("CONNECT");
    setMsg("Click the connect button to connect Nicla Sense ME");
  }

  function onDisconnected(event) {
    removeStatusButtonStyles();
    // clear read polling
    for (const sensor of sensors) {
      if (typeof NiclaSenseME[sensor].polling !== "undefined") {
        clearInterval(NiclaSenseME[sensor].polling);
      }
    }
    msg("Disconnected");
  }

  async function connect() {
    toggleIsConnectingClass();

    setMsg("Requesting device ...");

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [SERVICE_UUID], // SERVICE_UUID
          },
        ],
      });

      setMsg("Connecting to device ...");
      device.addEventListener("gattserverdisconnected", onDisconnected);
      const server = await device.gatt.connect();

      setMsg("Getting primary service ...");
      const service = await server.getPrimaryService(SERVICE_UUID);

      // Set up the characteristics
      for (const sensor of sensors) {
        setMsg("Characteristic " + sensor + "...");
        NiclaSenseME[sensor].characteristic = await service.getCharacteristic(NiclaSenseME[sensor].uuid);
        // Set up polling for read
        if (NiclaSenseME[sensor].properties.includes("BLERead")) {
          NiclaSenseME[sensor].polling = setInterval(function () {
            NiclaSenseME[sensor].characteristic
              .readValue()
              .then(async function (data) {
                const decodedData = new TextDecoder().decode(data);
                const elements = decodedData.split(",");
                const predictions = [];

                for (let i = 0; i < elements.length - 1; i = i + 2) {
                  const pr = {
                    id: elements[i],
                    value: elements[i + 1],
                  };
                  predictions.push(pr);
                }
                console.log(predictions);

                selectedPatientName = "Tolis";
                // console.log(isGatheringData);
                const res = await fetch(`http://localhost:5000/patient/${selectedPatientName}`);
                const patient = await res.json();
                console.log(patient);
                const { patient_id: patientId } = patient;
                const body = {
                  patientId: patientId,
                  normal: parseFloat(predictions[3].value),
                  cp1: parseFloat(predictions[0].value),
                  cp2: parseFloat(predictions[1].value),
                };
                console.log(JSON.stringify(body));

                res = await fetch(`http://localhost:5000/prediction`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                });
              })
              .catch((e) => {
                // console.log(e);
              });
          }, 1000);
        }
      }
      toggleIsConnectingClass();
      toggleIsConnectedClass();
      setMsg("Characteristics configured");
    } catch (e) {
      //   console.log(e);
      removeStatusButtonStyles();
    }
  }

  return (
    <div className="col-container">
      <div className="status">
        <button
          className={`status__button ${isConnecting ? "status__button--connecting" : ""} ${isConnected ? "status__button--connected" : ""}`}
          onClick={connect}
        >
          {buttonText}
        </button>
        <div className="status__msg">{msg}</div>
      </div>
    </div>
  );
}
