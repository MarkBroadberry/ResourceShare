Development of a Community Mediated Resource Sharing Platform with Assigned Trust Scores.

This project is a proof of concept for a reosurce sharing platform with assigned trust scores. 
It is built using Django, a python web development framework; React, a JavaScript web development framework; and a postgreSQL database. 

To run the project, follow the instructions below:

Clone the repository.

--Install python dependencies:
Ensure you have python installed.
Change directory into ProjectResourceShare
Run the command: pip install requirements.txt

--Install JavaScript dependencies
Ensure you have Node.js and Node Package Manager(npm) installed
Change directory into ProjectResourceShare/reactDisplay
Run the command: npm install $(<packages.txt)
You will now have the npm packages installed.

--Setup PostgreSQL database:
Ensure you have postgreSQL installed
Create the posgreSQL database using the database_backup.sql file.
Ensure that the Database Name,  Username, Password, Host and Port are correct in the \ProjectResourceShare\.env file
The database is now set up.

--Run application
Navigate to \ProjectResourceShare and run the command python manage.py runserver
Visit http:localhost:8000 in your web browser.
The application should be running.