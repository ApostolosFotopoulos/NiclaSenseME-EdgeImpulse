import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Utils
import constants from "utils/constants";
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
  addData,
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
  const dispatch = useDispatch();
  const msg = useSelector(selectMsg);
  const connectButtonText = useSelector(selectConnectButtonText);
  const isConnecting = useSelector(selectIsConnecting);
  const isConnected = useSelector(selectIsConnected);
  const isGatheringData = useSelector(selectIsGatheringData);
  const selectedPatient = useSelector(selectSelectedPatient);

  //Queries
  const [insertPrediction] = usePostPredictionMutation();

  // Set local variables
  useEffect(() => {
    refs.NiclaSenseME = {
      predictions: {
        uuid: constants.CHARACTERISTIC_UUID,
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
    // console.log("Disconnected");
    stopConnection();
  }

  // Connect with nicla via bluetooth
  async function connectNicla() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [constants.SERVICE_UUID], // SERVICE_UUID
        },
      ],
    });

    dispatch(setStatus("Connecting to device ..."));
    device.addEventListener("gattserverdisconnected", onDisconnected);
    const server = await device.gatt.connect();

    dispatch(setStatus("Getting primary service ..."));
    const service = await server.getPrimaryService(constants.SERVICE_UUID);

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

            // const bestPrediction = predictions.reduce((a, b) => {
            //   if (parseFloat(a.value) > parseFloat(b.value)) {
            //     return a;
            //   }
            //   return b;
            // });

            const idle = parseFloat(predictions.find((el) => el.id === "idle").value);
            let normal = parseFloat(predictions.find((el) => el.id === "normal").value);
            normal = normal + idle;

            if (idle < 0.99) {
              setPredictionsBody({
                normal: normal,
                cp1: parseFloat(predictions.find((el) => el.id === "cp1").value),
                cp2: parseFloat(predictions.find((el) => el.id === "cp2").value),
              });
            }
          })
          .catch((err) => {});
      }, constants.SET_INTERVAL_TIME);
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

      const max = 1;
      const x1 = getRandomFloat(0, max, 5);
      const x2 = getRandomFloat(0, max - x1, 5);
      const x3 = parseFloat((max - x1 - x2).toFixed(5));

      setPredictionsBody({
        normal: x1,
        cp1: x2,
        cp2: x3,
      });
    }, constants.SET_INTERVAL_TIME);
  }

  //Run on unmount
  useEffect(() => {
    return () => {
      clearInterval(refs.NiclaSenseME[refs.sensor].polling);
    };
  }, [refs]);

  useEffect(() => {
    async function postPrediction() {
      try {
        //console.log(predictionsBody);
        await insertPrediction({
          jwtToken: localStorage.accessToken,
          patientId: selectedPatient.patientId,
          ...predictionsBody,
          predictionDate: getCurrentDate(),
        }).unwrap();
      } catch (err) {
        if (err?.data) {
          dispatch(setStatus(err.data.errMsg));
        } else {
          dispatch(setStatus("No server response"));
        }
      }
    }

    if (isGatheringData && !isEmptyObj(predictionsBody)) {
      dispatch(addData({ ...predictionsBody }));
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
      if (constants.DEBUG) {
        imitateConnection();
      } else {
        await connectNicla();
      }

      dispatch(disableIsConnecting());
      dispatch(enableIsConnected());
    } catch (err) {
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
        <div className="status__msg">
          {Array.isArray(msg) ? (
            <p>
              <span className="status__normal-msg">{msg[0]}</span>,
              <span className="status__cp-msg">{msg[1]}</span>
            </p>
          ) : (
            msg
          )}
        </div>
        <DoctorProfile />
      </div>
    </div>
  );
}
