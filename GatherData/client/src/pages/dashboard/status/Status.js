import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Utils
import { DEBUG, SERVICE_UUID, CHARACTERISTIC_UUID, SET_INTERVAL_TIME } from "utils/constants";
import { getCurrentDate } from "utils/utils";
import { isEmptyObj } from "utils/validateData";

// Redux selectors
import {
  selectMsg,
  selectConnectButtonText,
  selectIsConnecting,
  selectIsConnected,
} from "pages/dashboard/status/statusSlice";
import { selectIsGatheringData, selectSelectedPatient } from "pages/dashboard/patientInfo/patientInfoSlice";

// Redux reducers
import {
  setStatus,
  enableIsConnected,
  disableIsConnected,
  disableIsConnecting,
  enableIsConnecting,
} from "pages/dashboard/status/statusSlice";

// Queries
import { usePostPredictionMutation } from "api/apiSlice";

// Components
import DoctorProfile from "pages/dashboard/status/doctorProfile/DoctorProfile";

export default function Status() {
  // Refs
  const compRef = useRef({});
  const { current: refs } = compRef;

  // Local state
  const [predictionsBody, setPredictionsBody] = useState({});

  // Redux state
  const msg = useSelector(selectMsg);
  const connectButtonText = useSelector(selectConnectButtonText);
  const isConnecting = useSelector(selectIsConnecting);
  const isConnected = useSelector(selectIsConnected);
  const isGatheringData = useSelector(selectIsGatheringData);
  const selectedPatient = useSelector(selectSelectedPatient);
  const dispatch = useDispatch();

  //Queries
  const [insertPrediction] = usePostPredictionMutation();

  // Set local variables
  useEffect(() => {
    refs.NiclaSenseME = {
      predictions: {
        uuid: CHARACTERISTIC_UUID,
        properties: ["BLERead"],
        structure: ["Float32"],
        data: { predictions: [] },
      },
    };

    const sensors = Object.keys(refs.NiclaSenseME);
    [refs.sensor] = sensors;
  }, [refs]);

  // Remove connect button styles
  function stopConnection() {
    clearInterval(refs.NiclaSenseME[refs.sensor].polling);
    dispatch(disableIsConnected());
  }

  // Stop polling when nicla disconnects
  function onDisconnected() {
    console.log("Disconnected");
    stopConnection();
  }

  // Connect with nicla via bluetooth
  async function connectNicla() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [SERVICE_UUID], // SERVICE_UUID
        },
      ],
    });

    dispatch(setStatus("Connecting to device ..."));
    device.addEventListener("gattserverdisconnected", onDisconnected);
    const server = await device.gatt.connect();

    dispatch(setStatus("Getting primary service ..."));
    const service = await server.getPrimaryService(SERVICE_UUID);

    // Set up the characteristics
    dispatch(setStatus("Characteristic " + refs.sensor + "..."));
    refs.NiclaSenseME[refs.sensor].characteristic = await service.getCharacteristic(
      refs.NiclaSenseME[refs.sensor].uuid
    );
    // Set up polling for read
    if (refs.NiclaSenseME[refs.sensor].properties.includes("BLERead")) {
      refs.NiclaSenseME[refs.sensor].polling = setInterval(function () {
        refs.NiclaSenseME[refs.sensor].characteristic
          .readValue()
          .then(function (data) {
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

            const bestPrediction = predictions.reduce((a, b) => {
              if (parseFloat(a.value) > parseFloat(b.value)) {
                return a;
              }
              return b;
            });

            console.log(predictions);
            if (bestPrediction.id !== "idle") {
              setPredictionsBody({
                normal: parseFloat(predictions.find((el) => el.id === "normal").value),
                cp1: parseFloat(predictions.find((el) => el.id === "cp1").value),
                cp2: parseFloat(predictions.find((el) => el.id === "cp2").value),
              });
            }
          })
          .catch((e) => {
            // console.log(e);
          });
      }, SET_INTERVAL_TIME);
    }
  }

  // Imitate nicla data gathering for debugging
  function imitateConnection() {
    clearInterval(refs.NiclaSenseME[refs.sensor].polling);
    refs.NiclaSenseME[refs.sensor].polling = setInterval(function () {
      function getRandomFloat(min, max, decimals) {
        const str = (Math.random() * (max - min) + min).toFixed(decimals);

        return parseFloat(str);
      }

      setPredictionsBody({
        normal: getRandomFloat(0, 1, 5),
        cp1: getRandomFloat(0, 1, 5),
        cp2: getRandomFloat(0, 1, 5),
      });
    }, SET_INTERVAL_TIME);
  }

  //Run on unmount
  useEffect(() => {
    return () => {
      clearInterval(refs.NiclaSenseME[refs.sensor].polling);
    };
  }, [refs]);

  useEffect(() => {
    console.log("Run use effect for gathering");
    async function postPrediction() {
      try {
        const body = {
          patientId: selectedPatient.patientId,
          ...predictionsBody,
          predictionDate: getCurrentDate(),
        };
        await insertPrediction(body).unwrap();
      } catch (err) {
        console.log(err);
        if (err?.data) {
          dispatch(setStatus(err.data.errMsg));
        } else {
          dispatch(setStatus("No server response"));
        }
      }
    }

    if (isGatheringData && !isEmptyObj(predictionsBody)) {
      postPrediction();
    }
  }, [predictionsBody, isGatheringData, selectedPatient, insertPrediction, dispatch]);

  // Start the connection
  async function connect() {
    if (isGatheringData) {
      dispatch(setStatus("Can't disconnect Nicla while gathering data"));
      return;
    }

    if (isConnected) {
      stopConnection();
      return;
    }

    dispatch(enableIsConnecting());
    try {
      if (DEBUG) {
        imitateConnection();
      } else {
        await connectNicla();
      }

      dispatch(disableIsConnecting());
      dispatch(enableIsConnected());
    } catch (e) {
      stopConnection();
    }
  }

  return (
    <div className="col-container">
      <div className="status">
        <button
          className={`status__button ${isConnecting ? "button-loading" : ""} ${
            isConnected ? "button-success" : ""
          }`}
          onClick={connect}
          disabled={isConnecting}
        >
          {connectButtonText}
        </button>
        <div className="status__msg">{msg}</div>
        <DoctorProfile />
      </div>
    </div>
  );
}
