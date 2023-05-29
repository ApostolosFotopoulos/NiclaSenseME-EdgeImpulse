--  PATIENT QUERIES
--  Get patient with first name, last name and date of birth
SELECT * 
FROM patient 
WHERE first_name='Tolis' AND last_name='Fot' AND date_of_birth='1997-09-03'

-- Insert patient
INSERT INTO patient(first_name, last_name, date_of_birth) 
VALUES ('Tom', 'Jones', '2000-08-11') RETURNING *

-- PREDICTION QUERIES
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
WHERE id = 1 
RETURNING s.id, s.patient_id, s.normal, s.cp1, s.cp2, s.session_date