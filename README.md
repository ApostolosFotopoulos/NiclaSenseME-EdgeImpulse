<div align='center'><h1>About the project</h1></div>

<p><b>CPwatcher</b> was created in order to be able to measure how healthy a person walks. Three categories were created <b>Normal</b>, <b>CP1</b> and <b>CP2</b> with CP2 being the worst and normal the best. In order to achieve this classification, a sensor had to be used and a model to be created. The chosen sensor was <a href='https://docs.arduino.cc/hardware/nicla-sense-me'>Nicla Sense ME</a> and the chosen platform to build the model was <a href='https://edgeimpulse.com/'>Edge Impulse</a>. After the model was built, it got deployed on the sensor so that live classification can happen. All the sensor programming happened with the help of <a href=''>Arduino IDE</a> and <a href='https://platformio.org/'>PlatformIO IDE</a>.</p>

<p>In order to view and collect the data a web app was created. This was created by using the PERN (PostgreSQL, Express, React and Node.js) stack. The connection between the app and the sensor happens via BLE (Bluetooth Low Energy). The app lets the user create an account, add patients, collect data for each patient and track their improvement over time.</p>

👉 Live Demo: <a href='http://3.76.38.238/'>CPwatcher</a> <br> <br>

<p>In order to test the app enter the credentials below:</p>
<p><b>User: testSim</b></p> 
<p><b>Password: bgddgnQQ1!</b> (Watch out when copying the password)</p> 
<p>This account will let you test the app without having to connect the sensor. This is done by a script that returns similar values to the ones the sensor would return. For a patient search and select "test sim". Choosing a different patient is fine, "test sim" already has some historical data. Then press "CONNECT CPWATCHER", followed by "GATHER DATA". When you are ready, stop gathering data by pressing the button again. An average of your measurements now appears on the graph below. If you collect more measurements, that average will get updated. The entries on the graph are the averages of a single day-session of measurements. Basically to get a new entry in the graph, you need to collect data on a different day (UTC time).</p> <br>

<h3>Built with:</h3>
» Arduino <br>
» PlatformIO <br>
» Edge Impulse <br>
» PostgreSQL <br>
» Express <br>
» React <br>
» Redux <br>
» Node.js <br> <br>

<h3>Deployed with:</h3>
» AWS <br>
» Ubuntu 22.04 LTS <br>
» Nginx <br> <br>

<h3>Useful Links:</h3>

<a href='https://docs.arduino.cc/tutorials/nicla-sense-me/getting-started'>Getting Started with Nicla Sense ME</a> <br>
<a href='https://docs.edgeimpulse.com/docs/edge-impulse-cli/cli-data-forwarder'>Edge Impulse Data Forwarder</a> <br>
<a href='https://docs.arduino.cc/tutorials/nicla-sense-me/web-ble-dashboard'>Displaying Sensor Values on a WebBLE Dashboard</a> <br>
<a href='https://docs.edgeimpulse.com/experts/featured-machine-learning-projects/arduino-kway-outdoor-activity-tracker'>Arduino x K-Way - Outdoor Activity Tracker</a>
