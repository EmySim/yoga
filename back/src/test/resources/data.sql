-- Insertion des enseignants
INSERT INTO TEACHERS (first_name, last_name)
VALUES
  ('Margot', 'DELAHAYE'),
  ('Hélène', 'THIERCELIN');

-- Insertion d'un utilisateur admin
INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES
  ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

-- Insertion d'un utilisateur non admin
INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES
  ('zaza', 'zaza', false, 'zaza@zaza.com', '$2a$10$qQRcfMmEGh1MEZ3crqqoXuEwYnHAiIBRoQA8AfgAGmABdI.iQvEGu');
