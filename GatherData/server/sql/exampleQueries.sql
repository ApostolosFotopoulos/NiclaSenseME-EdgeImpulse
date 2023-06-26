-- DOCTOR QUERIES
-- Select doctor with user name
SELECT *
FROM doctor
WHERE user_name='John'

-- Select doctor with doctor id
SELECT doctor_id, user_name, first_name, last_name
FROM doctor
WHERE doctor_id = 10

-- Insert doctor
INSERT INTO doctor(user_name, first_name, last_name, passhash) 
VALUES ('John', 'John', 'Mime', 'xxx') RETURNING doctor_id

-- PATIENT QUERIES
-- Get patient with first name, last name and date of birth
SELECT * 
FROM patient 
WHERE doctor_id=11 AND first_name='Tolis' AND last_name='Fot' AND date_of_birth='1997-09-03'

-- Insert patient
INSERT INTO patient(doctor_id, first_name, last_name, date_of_birth) 
VALUES (11, 'Tom', 'Jones', '2000-08-11') RETURNING *

-- PREDICTION QUERIES
-- Get predictions count with patient id and prediction date
SELECT COUNT(prediction_id) AS prediction_count
FROM prediction
WHERE patient_id=26 AND prediction_date='2023-05-28'

-- Insert prediction
INSERT INTO prediction (patient_id, normal, cp1, cp2, prediction_date) 
VALUES (26, 0.10, 0.10, 0.80, '2023-05-01') RETURNING *

-- SESSION QUERIES
-- Get session with patient id and session date
SELECT * FROM session WHERE patient_id=26 AND session_date='2023-05-28'

-- Insert session
INSERT INTO session (patient_id, normal, cp1 ,cp2, session_date)
SELECT patient_id, ROUND(AVG(normal)::numeric, 5), ROUND(AVG(cp1)::numeric, 5), ROUND(AVG(cp2)::numeric, 5), prediction_date
FROM prediction
WHERE patient_id=26 AND prediction_date='2023-05-28'
GROUP BY patient_id, prediction_date
RETURNING *

-- Update session
UPDATE session as s
SET normal=new_avg.normal, cp1=new_avg.cp1, cp2=new_avg.cp2
FROM 	(SELECT ROUND(AVG(normal)::numeric, 5) as normal, ROUND(AVG(cp1)::numeric, 5) as cp1, ROUND(AVG(cp2)::numeric, 5) as cp2
        FROM prediction
        WHERE patient_id=26 AND prediction_date='2023-05-28') AS new_avg
WHERE session_id = 1 
RETURNING s.session_id, s.patient_id, s.normal, s.cp1, s.cp2, s.session_date