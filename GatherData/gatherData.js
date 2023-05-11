// const str = "cp1,0.01953,cp2,0.71094,idle,0.24609,";

var maxRecords = 64;
var NiclaSenseME = {
  predictions: {
    uuid: "2d2f88c4-f244-5a80-21f1-ee0224e80658",
    properties: ["BLERead"],
    structure: ["Float32"],
    data: { predictions: [] },
  },
};

const sensors = Object.keys(NiclaSenseME);
const SERVICE_UUID = "9a48ecba-2e92-082f-c079-9e75aae428b1";
var bytesReceived = 0;
var bytesPrevious = 0;

// UI elements
const pairButton = document.getElementById("pairButton");
const BLEstatus = document.getElementById("bluetooth");

if ("bluetooth" in navigator) {
  pairButton.addEventListener("click", function (event) {
    connect();
  });
  // else the browser doesn't support bluetooth
} else {
  msg("browser not supported"); /*pairButton.style.backgroundColor = "red";*/
}

// Top middle information label
function msg(m) {
  BLEstatus.innerHTML = m;
}

async function connect() {
  pairButton.style.backgroundColor = "grey";
  pairButton.style.color = "black";
  pairButton.innerHTML = "PAIRING";
  msg("requesting device ...");

  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [SERVICE_UUID], // SERVICE_UUID
        },
      ],
    });

    msg("connecting to device ...");
    device.addEventListener("gattserverdisconnected", onDisconnected);
    const server = await device.gatt.connect();

    msg("getting primary service ...");
    const service = await server.getPrimaryService(SERVICE_UUID);

    // Set up the characteristics
    for (const sensor of sensors) {
      msg("characteristic " + sensor + "...");
      NiclaSenseME[sensor].characteristic = await service.getCharacteristic(NiclaSenseME[sensor].uuid);
      // Set up notification
      if (NiclaSenseME[sensor].properties.includes("BLENotify")) {
        NiclaSenseME[sensor].characteristic.addEventListener("characteristicvaluechanged", function (event) {
          handleIncoming(NiclaSenseME[sensor], event.target.value);
        });
        await NiclaSenseME[sensor].characteristic.startNotifications();
      }
      // Set up polling for read
      if (NiclaSenseME[sensor].properties.includes("BLERead")) {
        NiclaSenseME[sensor].polling = setInterval(function () {
          NiclaSenseME[sensor].characteristic
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
              console.log(predictions);
            })
            .catch((e) => {
              // console.log(e);
            });
        }, 1000);
      }
    }
    pairButton.style.backgroundColor = "green";
    pairButton.style.color = "white";
    pairButton.innerHTML = "PAIRED";
    msg("Characteristics configured");
  } catch (e) {
    // console.log(e);
  }
}

function onDisconnected(event) {
  let device = event.target;
  pairButton.style.backgroundColor = "red";
  pairButton.innerHTML = "PAIR NICLA";
  // clear read polling
  for (const sensor of sensors) {
    if (typeof NiclaSenseME[sensor].polling !== "undefined") {
      clearInterval(NiclaSenseME[sensor].polling);
    }
  }
  msg("Disconnected");
}
