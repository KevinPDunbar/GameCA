# GameCA
My first CA for Advanced Javascript (Year 4)

Make sure MongoDB is running, run MongoDB using the command "C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" || where your MongoDB directory is located.
Open the "server.js" file and on line 23 change the URL to the URL of your database. 
You will need a Database called "CA" and a collection named "scores".

Run the game by running the command "node server.js" inside the directory.
Open "localhost:8080" in your browser.

When the game first launches you will be prompted to enter your name.
Click the onscreen text to play the game.
Use the arrow keys to move around and space to shoot. || move with d-pad on gamepad and shoot with either of the triggers.
NOTE: Connecting a gamepad in Chrome will cause the game to crash.
The objective of the game is to stay alive and kill as many enemies as possible.
Being hit by an enemy or by a bullet will deduct your health by 10.
Hitting an enemy with a bullet will increase your score by 10.

You will notice a leaderboard to the right of the game.
The "submit score" button is disabled, your score can only be submitted after you have died.
You can view the high scores by clicking the "show high scores" button.
You can view the latest scores by clicking the "show latest scores" button.
You can delete all the scores relating to your user name by clicking the "Delete my scores" button.



