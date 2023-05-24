import React, { useEffect, useRef, useState } from "react";
import { DEBUG, SERVICE_UUID, CHARACTERISTIC_UUID, SET_INTERVAL_TIME } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setStatus, toggleIsConnected, setIsConnected } from "./statusSlice";
import { selectMsg, selectIsConnected } from "./statusSlice";
import { stopGatheringData, setGatherButtonText } from "features/patientInfo/patientInfoSlice";
import { selectIsGatheringData } from "features/patientInfo/patientInfoSlice";

export default function Status() {
  // Local variables
  const compRef = useRef({});
  const { current: my } = compRef;

  // Local state
  const [buttonText, setButtonText] = useState("CONNECT NICLA");
  const [isConnecting, setIsConnecting] = useState(false);
  const [body, setBody] = useState({});

  // Redux state
  const msg = useSelector(selectMsg);
  const isConnected = useSelector(selectIsConnected);
  const isGatheringData = useSelector(selectIsGatheringData);

  const dispatch = useDispatch();

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

  // Nicla service
  function toggleIsConnectingClass() {
    if (!isConnecting) {
      setButtonText("PAIRING");
    }
    setIsConnecting(!isConnecting);
  }

  function toggleIsConnectedClass() {
    if (!isConnected) {
      setButtonText("PAIRED");
    } else {
      setButtonText("CONNECT NICLA");
    }
    dispatch(toggleIsConnected());
  }

  // Remove connect button styles
  function removeStatusButtonStyles() {
    setIsConnecting(false);
    dispatch(setIsConnected(false));
    setButtonText("CONNECT NICLA");
    dispatch(setStatus("Waiting..."));
    dispatch(stopGatheringData());
    dispatch(setGatherButtonText("GATHER DATA"));
  }

  // Stop polling when nicla disconnects
  function onDisconnected(event) {
    removeStatusButtonStyles();
    dispatch(setStatus("Disconnected"));
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

            const body = {
              //patientId: patientId,
              normal: parseFloat(predictions[3].value),
              cp1: parseFloat(predictions[0].value),
              cp2: parseFloat(predictions[1].value),
            };
            console.log(JSON.stringify(body));
          })
          .catch((e) => {
            // console.log(e);
          });
      }, SET_INTERVAL_TIME);
    }
    toggleIsConnectingClass();
    toggleIsConnectedClass();
    dispatch(setStatus("Characteristics configured"));
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
      setBody({
        patientId: 1,
        normal: getRandomFloat(0, 1, 2),
        cp1: getRandomFloat(0, 1, 2),
        cp2: getRandomFloat(0, 1, 2),
      });
    }, SET_INTERVAL_TIME);
    toggleIsConnectedClass();
  }

  //Stop polling if user disconnects stops collecting with nicla
  useEffect(() => {
    if (!isConnected) {
      clearInterval(my.NiclaSenseME[my.sensor].polling);
    }
  }, [my, isConnected]);

  //Run on unmount
  useEffect(() => {
    return () => {
      clearInterval(my.NiclaSenseME[my.sensor].polling);
    };
  }, [my]);

  useEffect(() => {
    if (isGatheringData) {
      console.log("Gathering");
    } else {
      console.log("Not Gathering");
    }
  }, [body, isGatheringData]);

  // Start the connection
  async function connect() {
    if (isConnected) {
      removeStatusButtonStyles();
      return;
    }

    toggleIsConnectingClass();
    dispatch(setStatus("Requesting device ..."));

    try {
      if (DEBUG) {
        imitateConnection();
      } else {
        connectNicla();
      }
    } catch (e) {
      removeStatusButtonStyles();
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
          {buttonText}
        </button>
        <div className="status__msg">{msg}</div>
      </div>
    </div>
  );
}
