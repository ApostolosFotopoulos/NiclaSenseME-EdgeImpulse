import React, { useEffect, useRef, useState } from "react";
import { DEBUG, SERVICE_UUID, CHARACTERISTIC_UUID, SET_INTERVAL_TIME } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { checkRes, getCurrentDate } from "utils/utils";
import {
  setStatus,
  enableIsConnected,
  disableIsConnected,
  disableIsConnecting,
  enableIsConnecting,
} from "./statusSlice";
import { selectMsg, selectConnectButtonText, selectIsConnecting, selectIsConnected } from "./statusSlice";
import { disableIsGatheringData } from "features/patientInfo/patientInfoSlice";
import { selectIsGatheringData, selectSelectedPatient } from "features/patientInfo/patientInfoSlice";
import { usePostPredictionMutation } from "features/api/apiSlice";

export default function Status() {
  // Local variables
  const compRef = useRef({});
  const { current: my } = compRef;

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
    my.NiclaSenseME = {
      predictions: {
        uuid: CHARACTERISTIC_UUID,
        properties: ["BLERead"],
        structure: ["Float32"],
        data: { predictions: [] },
      },
    };

    const sensors = Object.keys(my.NiclaSenseME);
    [my.sensor] = sensors;

    my.initialRender = true;
  }, [my]);

  // Remove connect button styles
  function stopConnection() {
    clearInterval(my.NiclaSenseME[my.sensor].polling);
    dispatch(disableIsConnected());
    dispatch(disableIsGatheringData());
  }

  // Stop polling when nicla disconnects
  function onDisconnected(event) {
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
    dispatch(setStatus("Characteristic " + my.sensor + "..."));
    my.NiclaSenseME[my.sensor].characteristic = await service.getCharacteristic(
      my.NiclaSenseME[my.sensor].uuid
    );
    // Set up polling for read
    if (my.NiclaSenseME[my.sensor].properties.includes("BLERead")) {
      my.NiclaSenseME[my.sensor].polling = setInterval(function () {
        my.NiclaSenseME[my.sensor].characteristic
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

            setPredictionsBody({
              normal: parseFloat(predictions[3].value),
              cp1: parseFloat(predictions[0].value),
              cp2: parseFloat(predictions[1].value),
            });
          })
          .catch((e) => {
            // console.log(e);
          });
      }, SET_INTERVAL_TIME);
    }
  }

  // Imitate nicla data gathering for debugging

  async function imitateConnection() {
    clearInterval(my.NiclaSenseME[my.sensor].polling);
    my.NiclaSenseME[my.sensor].polling = setInterval(async function () {
      function getRandomFloat(min, max, decimals) {
        const str = (Math.random() * (max - min) + min).toFixed(decimals);

        return parseFloat(str);
      }
      console.log("1");
      setPredictionsBody({
        normal: getRandomFloat(0, 1, 2),
        cp1: getRandomFloat(0, 1, 2),
        cp2: getRandomFloat(0, 1, 2),
      });
    }, SET_INTERVAL_TIME);
  }

  //Run on unmount
  useEffect(() => {
    return () => {
      clearInterval(my.NiclaSenseME[my.sensor].polling);
    };
  }, [my]);

  useEffect(() => {
    console.log("Run use effect");
    async function postPrediction() {
      try {
        const body = {
          patientId: selectedPatient.patientId,
          ...predictionsBody,
          predictionDate: getCurrentDate(),
        };
        let res = await insertPrediction(body).unwrap();
        checkRes(res);
      } catch (e) {
        dispatch(setStatus("Error communicating with the database"));
      }
    }

    if (isGatheringData) {
      postPrediction();
    } else {
      console.log("Not Gathering");
    }
  }, [predictionsBody, isGatheringData, selectedPatient, insertPrediction, dispatch]);

  // Start the connection
  async function connect() {
    if (isConnected) {
      stopConnection();
      return;
    }

    dispatch(enableIsConnecting());

    try {
      if (DEBUG) {
        imitateConnection();
      } else {
        connectNicla();
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
          className={`status__button ${isConnecting ? "status__button--connecting" : ""} ${
            isConnected ? "status__button--connected" : ""
          }`}
          onClick={connect}
        >
          {connectButtonText}
        </button>
        <div className="status__msg">{msg}</div>
      </div>
    </div>
  );
}
