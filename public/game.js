//Client
let submitScore = function(newUsername, newScore) //function to submit a new score to the database
{
    console.log("Submit: " + newUsername + " " + newScore);

    let d = new Date(); //create a new date object.


    //send fetch request to server, using PUT method, include the function parameters in the request body
    fetch('/score', {
        method: 'PUT',
        body: JSON.stringify({username: newUsername, score: newScore, date: d}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
      if(response.ok) {
        console.log('score submitted');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });

    getScores(); //run the getScores function to update the leaderboard

}

let deleteMyScores = function(newUsername) //function used to delete a score from the database. 
{


    //console.log("TO SUBMIT :" + username + " " + score);
    console.log("Submit: " + newUsername);


    //send fetch request to sever, using PUT method, include function parameters in the request body
    fetch('/deleteMyScores', {
        method: 'PUT',
        body: JSON.stringify({username: newUsername}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
      if(response.ok) {
        console.log('score deleted');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });

    getScores(); //run the getScores function to update the leaderboard

}

let getScores = function() //the function used to retrieve the scores from the database.
{
    let list = document.getElementById("myList"); //get the element with the id "myList"
    while(list.hasChildNodes()) //while the list element has children 
    {
        list.removeChild(list.firstChild); //remove the first child, this will remove every <li> element
    }


  //send a fetch request, using the GET method.
  fetch('/getScores', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) { //run this function, taking the data response from the server as a parameter
      
      let length = data.length;

      for(let i = 0; i < 10; i++) //loop to run 10 times
      {
        console.log("Player: " + data[i].username + " Score: " + data[i].score);
        let node = document.createElement("li");                 // Create a <li> node
        let textnode = document.createTextNode("Player: " + data[i].username + "      Score: " + data[i].score);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById("myList").appendChild(node);     // Append <li> to <ul> with id="myList"

      }

    })
    .catch(function(error) {
      console.log(error);
    });
}

getScores(); //run the getScores function when the game first opens.

let getLatestScores = function()
{
    
    let list = document.getElementById("myList");
    while(list.hasChildNodes())
    {
        list.removeChild(list.firstChild);
    }
    
  
  fetch('/latestScores', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {

      let length = data.length;

      for(let i = 0; i < 10; i++)
      {

        let d = new Date(data[i].date);
        let month = d.getUTCMonth() + 1; //months from 1-12
        let day = d.getUTCDate();
        let year = d.getUTCFullYear();

        let newDate = year + "/" + day + "/" + month; 

        console.log("Player: " + data[i].username + " Score: " + data[i].score);
        let node = document.createElement("li");                 // Create a <li> node
        let textnode = document.createTextNode("Player: " + data[i].username + "      Score: " + data[i].score + "      Date: " + newDate);         // Create a text node
        node.appendChild(textnode);                              // Append the text to <li>
        document.getElementById("myList").appendChild(node);     // Append <li> to <ul> with id="myList"

      }
      
    })
    .catch(function(error) {
      console.log(error);
    });
}

let playerHighestScoreText = document.getElementById("playerHighestScoreText"); //accessing the dom
let playerHighestScore = 0;

let submitScoreButton = document.getElementById("submitScoreButton"); //accessing the dom
submitScoreButton.disabled = true;



//Game
const canvas = document.createElement("canvas"); //setting up the canvas
const ctx = canvas.getContext("2d"); 
const canvasWidth = 640;
const canvasHeight = 480;
canvas.width = canvasWidth; 
canvas.height = canvasHeight; 
document.body.appendChild(canvas); 

const inGameMusic = new Audio("sounds/inGame.wav"); //importing the various music tracks and sound effects
const gameOverMusic = new Audio("sounds/gameOver.wav"); 
const shootSound = new Audio("sounds/shoot.wav"); 
const explosionSound = new Audio("sounds/explosion.wav"); 
const bossHit = new Audio("sounds/hitBoss.wav"); 
const bossShoot = new Audio("sounds/bossShoot.wav"); 
const bossExplosion = new Audio("sounds/bossExplosion.mp3");
const bossMusic = new Audio("sounds/bossMusic.wav");

inGameMusic.loop = true; //setting the in game music to loop
inGameMusic.play(); //playing the in game music

shootSound.volume = 0.5; //adjusting the volume of the sound effects
explosionSound.volume = 0.5;
bossHit.volume = 0.5;
bossShoot.volume = 0.5;
bossExplosion.volume = 0.5;

let vy = 0; //variable to hold the y position of the background image

let username = prompt("Enter your name") || "Unknown"; //prompt the user to enter a name, if they don't set it to unknown.

let mainMenu = true;

let enemyAcceleration = 0; //variable to hold value of acceleration for the enemy spaceship
let meteorAcceleration = 0; //varibale to hold value of acceleration for the meteor

let gamepads;
let gamepad;
let triggerPressed = false;

// Background image
let bgReady = false; //creating a boolean to signal if the background image is ready to be drawn
let bgImage = new Image(); //adding the background image
bgImage.onload = function () { //when the background image loads set bgReady to true
	bgReady = true;
};
bgImage.src = "images/starBackground.png"; //setting the source for the background image

// player spaceship image
let spaceshipReady = false; //creating a boolean to signal if the spaceship image is ready to be drawn
let spaceshipImage = new Image(); //adding the spaceship image
spaceshipImage.onload = function () { //when the spaceship image loads set spaceshipReady to true
	spaceshipReady = true;
};
spaceshipImage.src = "images/spaceship.png"; //setting the source for the spaceship image

// enemy spaceship image
let enemySpaceshipReady = false; //creating a boolean to signal if the enemy spaceship image is ready to be  drawn
let enemySpaceshipImage = new Image(); //adding the enemy ship image
enemySpaceshipImage.onload = function () { //when the enemy ship image loads set enemySpaceshipReady to true
	enemySpaceshipReady = true;
};
enemySpaceshipImage.src = "images/enemySpaceship.png"; //setting the source for the enemy ship image

// boss spaceship image
let bossReady = false; //creating a boolean to signal if the enemy spaceship image is ready to be  drawn
let bossImage = new Image(); //adding the enemy ship image
bossImage.onload = function () { //when the enemy ship image loads set enemySpaceshipReady to true
    bossReady = true;
};
bossImage.src = "images/boss.png"; //setting the source for the enemy ship image

// boss spaceship image
let bossBulletImageReady = false; //creating a boolean to signal if the enemy spaceship image is ready to be  drawn
let bossBulletImage = new Image(); //adding the enemy ship image
bossBulletImage.onload = function () { //when the enemy ship image loads set enemySpaceshipReady to true
    bossBulletImageReady = true;
};
bossBulletImage.src = "images/bossBullet.png"; //setting the source for the enemy ship image

// meteor image
let meteorReady = false; //creating a boolean to signal if the meteor image is ready to be drawn
let meteorImage = new Image(); //adding the meteor image
meteorImage.onload = function () { //when the meteor image loads set meteorReady to true
	meteorReady = true;
};
meteorImage.src = "images/meteor.png"; //setting the source for the meteor image

// bullet image
let bulletReady = false; //creating a boolean to signal if the bullet image is ready to be drawn
let bulletImage = new Image(); //adding the bullet image
bulletImage.onload = function () { //when the bullet image loads set bulletReady to true
	bulletReady = true;
};
bulletImage.src = "images/bullet.png"; //setting the source for the bullet image

window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);

    let guide = document.getElementById("guide");
    guide.innerHTML = "Use the d-pad to move left or right, use the triggers to shoot";


});

let bossFight = false;

function Spaceship(x = (canvas.width / 2) - 32, y = 400, speed = 1000, health = 100, score = 0, playerName = "unknown") {
    this.x = x,
    this.y = y,
    this.speed = speed,
    this.health = health,
    this.score = score,
    this.playerName = playerName,

    this.resetSpaceship = function() {
    this.health = 100; //resseting the players health
    this.score = 0; //resetting the players score
    meteorReady = true; //allowing the meteors to be drawn
    enemySpaceshipReady = true; //allowing the enemy ships to be drawn
    this.x = (canvas.width / 2) - 32; //sets the players x position in the center of the canvas
    this.y = y; //sets the player at 400 on the y-axis
    }

}

let spaceship = new Spaceship();

function Boss(x = (canvas.width /2) -32, y = 40, speed = 5, health = 100, moveLeft = true, shootAgain = true) {

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
    this.moveLeft = moveLeft;
    this.shootAgain = shootAgain;

    this.bossBulletX;
    this.bossBulletY;

    this.resetBoss = function() {
        this.x = x;
        this.y = y;
        this.health = health; 
        this.moveLeft = moveLeft;
        this.shootAgain = shootAgain;

    }

    this.move = function() {


        if(moveLeft === true)
        {
            this.x = this.x - speed;
            if(this.x <= 0)
            {
                moveLeft = false;
            }
        }
        else if(moveLeft === false)
        {
            this.x = this.x + speed;
            if(this.x >= 550)
            {
                moveLeft = true;
            }
        }
    }

    this.shoot = function () { //function that runs when the player wants to shoot

        this.bossBulletX = bossSpaceship.x;
        this.bossBulletY = bossSpaceship.y;
    
    while(shootAgain == true) //if the player is allowed to shoot run the below code
    {
        
        console.log("shoot");
        this.bossBulletY = this.bossBulletY;
        //bossBulletX = 50; //sets the x position of the bullet to the x position to the ship
        //bossBulletY = 50; //the bullet will always have this fixed y starting position
        shootSound.play(); //play the shoot sound effect       
        shootAgain = false; //set shoot again back to false, so the player cannot shoot again
             
    }
};
}; 

let bossSpaceship = new Boss();


let enemySpaceship = {

    x: 0,
    y: 0,


    resetEnemySpaceship: function() {
        enemySpaceship.x = (Math.random() * (canvas.width - 64));
        enemySpaceship.y = -64;
        enemyAcceleration = 0; 
    }
}; //creating the enemySpaceship object



let meteor = {

    x: 0,
    y: 0,

    resetMeteor: function() {
        meteor.x =(Math.random() * (canvas.width - 64));
        meteor.y = -128;
        meteorAcceleration = 0; //sets the acceleration to 0
    }
};


let bullet = {}; //creating the bullet object
let shootAgain = true; //setting shoot again to true so the player is able to shoot

let keysDown = {}; //this variable will hold the key code for the button the user has pressed

addEventListener("keydown", function (e) { //adding an event listener for when the user presses a key
	keysDown[e.keyCode] = true; //setting the keycode of this key to be the value of the keysDown variable
}, false);

addEventListener("keyup", function (e) { //adding an event listener for when the user releases a key
	delete keysDown[e.keyCode]; //deletes the previous value from the keysDown variable
}, false);


const reset = function () { //the reset function is used to reset the game, when the player wants to play again
    
    spaceship.resetSpaceship();
    enemySpaceship.resetEnemySpaceship(); //resetting the enemy ships
    meteor.resetMeteor(); //resettting the meteors
    
    gameOverMusic.pause(); //pauses the in game music
    gameOverMusic.currentTime = 0.0; //sets it back to the start

    bossMusic.pause(); //pause the boss music
    bossFight = false; //set boss fight to false
    bossSpaceship.resetBoss(); //run the boss's reset function
    
    mainMenu = false;
    inGameMusic.play(); //plays the in game music
     
    submitScoreButton.disabled = true; //disable the submit score button
	
    
};

const shoot = function () { //function that runs when the player wants to shoot
	
	if(shootAgain == true) //if the player is allowed to shoot run the below code
    {
        console.log("shoot");
        bullet.x = spaceship.x; //sets the x position of the bullet to the x position to the ship
        bullet.y = 380; //the bullet will always have this fixed y starting position
        shootSound.play(); //play the shoot sound effect
        shootAgain = false; //set shoot again back to false, so the player cannot shoot again
    }
};

const BossShoot = function () { //function that runs when the player wants to shoot
    
    if(bossSpaceship.shootAgain == true) //if the player is allowed to shoot run the below code
    {
        console.log(" boss shoot");
        bossSpaceship.bossBulletX = bossSpaceship.x; //sets the x position of the bullet to the x position to the ship
        bossSpaceship.bossBulletY = 40; //the bullet will always have this fixed y starting position
        bossShoot.play(); //play the shoot sound effect
        bossSpaceship.shootAgain = false; //set shoot again back to false, so the player cannot shoot again
    }
};

// Update
let update = function (modifier) { //this function is for things that are constantly changing or being checked

    

    playerHighestScoreText.innerHTML = "Your Highest Score: " + playerHighestScore;

    

    if (spaceship.score > 100 /*500*/)
    {
        inGameMusic.pause();
        bossMusic.play();
        if(spaceship.score === 500)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 1000)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 1500)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 2000)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 2500)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 3000)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 3500)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 4000)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 4500)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        if(spaceship.score === 5000)
        {
            bossSpaceship.resetBoss();
            spaceship.score += 10;
        }
        bossFight = true;
        bossSpaceship.bossBulletY += 10;
        if (
        bullet.x <= (bossSpaceship.x + 50) //if all these conditions are true, a bullet and a meteor have collided.
        && bossSpaceship.x <= (bullet.x + 50)
        && bullet.y <= (bossSpaceship.y + 50)
        && bossSpaceship.y <= (bullet.y + 50)
        && spaceship.health > 0 && bossSpaceship.health > 0
        ) {
            spaceship.score += 10; //increase the players score by 10
            bullet.y = -100;
            bossHit.play(); //play the explosion sound effect
            shootAgain = true; //set shootAgain back to true.
            console.log("Hit the boss");
            bossSpaceship.health -= 10;
            if(bossSpaceship.health === 0)
            {
                bossExplosion.play();
            }
            console.log("BOSS HEALTH: " + bossSpaceship.health);
        }

        if (
            bossSpaceship.bossBulletX <= (spaceship.x + 32) //if all these conditions are true, a bullet and an enemy ship have collided
            && spaceship.x <= (bossSpaceship.bossBulletX + 32)
            && bossSpaceship.bossBulletY <= (spaceship.y + 32)
            && spaceship.y <= (bossSpaceship.bossBulletY + 32)
            && spaceship.health > 0 && bossSpaceship.health > 0
        ) {
            //spaceship.score += 10; //increase the players score by 10
            bossHit.play(); //play the explosion sound effect
            console.log("BOSS HIT PLAYER");
            bossSpaceship.bossBulletY = 500;
            spaceship.health -= 10;
            //enemySpaceship.resetEnemySpaceship(); //run the resetEnemy function
            //shootAgain = true; //set shoot again back to true
        }
        if(bossSpaceship.health > 0 && spaceship.health > 0)
        {
            bossSpaceship.move();
            BossShoot();
        }

        if(spaceship.health <= 0)
        {
            bossFight = false; 
            bossMusic.pause();
            bossMusic.currentTime = 0.0;
        }
       

        if(bossSpaceship.bossBulletY >=480)
        {
            bossSpaceship.shootAgain = true;
        }

        if(bossSpaceship.health <= 0 && bossFight === true)
        {
            console.log("BOSS DEAD");
            bossMusic.pause();
            //bossExplosion.play();
            //bossSpaceship.resetBoss();    
            bossFight = false;
            inGameMusic.play();
        }
    }
    

    //GAMEPAD
   gamepads = navigator.getGamepads(); //set gamepad to the connected gamepad
    for (let playerIndex = 0; playerIndex < gamepads.length; playerIndex++) { //for every connected gamepad
         gamepad = gamepads[playerIndex];
        if (gamepad) {

          if (gamepad.buttons[6].pressed || gamepad.buttons[7].pressed) {
            // If the right or left trigger is pressed.
            triggerPressed = true; //set the triggerPressed boolean to true
            shoot(); //run the spaceships shoot function
          }
          else if (gamepad.buttons[14].pressed && spaceship.x > 0 + 16) { //if left on the d-pad is pressed
                   
            spaceship.x -= spaceship.speed * modifier; //move the player to the right
          }
          else if (gamepad.buttons[15].pressed && spaceship.x < 580 - 16) { //if right on the d-pad is pressed
            
            
            spaceship.x += spaceship.speed * modifier; //move the player to the left
          }
          
        }
      }
	
	if (37 in keysDown && spaceship.x > 0 + 16) { // if the player is holding left
		spaceship.x -= spaceship.speed * modifier; //move the spaceship to the left
	}
	if (39 in keysDown && spaceship.x < 580 - 16) { // if the player is holding right
		spaceship.x += spaceship.speed * modifier; //move the spaceship to the right
	}
    if (32 in keysDown) { // if the player presses spacebar run the shoot function
        shoot();
	}

	// Collision Detection
	if (
		spaceship.x <= (enemySpaceship.x + 32) //if all of these conditions are true, the player and an enemy ship have collided
		&& enemySpaceship.x <= (spaceship.x + 32)
		&& spaceship.y <= (enemySpaceship.y + 32)
		&& enemySpaceship.y <= (spaceship.y + 32)
        && spaceship.health > 0
	) {
        spaceship.health = spaceship.health - 10; //decrease the players health by 10
        explosionSound.play(); //play the explosion sound effect
		enemySpaceship.resetEnemySpaceship(); //run the resetEnemy function
	}
    
    if (
		spaceship.x <= (meteor.x + 64) //if all of these condtions are true, the player and a meteor have collided
		&& meteor.x <= (spaceship.x + 64)
		&& spaceship.y <= (meteor.y + 64)
		&& meteor.y <= (spaceship.y + 64)
        && spaceship.health > 0
	) {
        spaceship.health = spaceship.health - 10; //decrease the players health by 10
        explosionSound.play(); //play the exlposion sound effect
		meteor.resetMeteor(); //run the resetMeteor function
	}
    
    if (
		bullet.x <= (enemySpaceship.x + 32) //if all these conditions are true, a bullet and an enemy ship have collided
		&& enemySpaceship.x <= (bullet.x + 32)
		&& bullet.y <= (enemySpaceship.y + 32)
		&& enemySpaceship.y <= (bullet.y + 32)
        && spaceship.health > 0
	) {
        spaceship.score += 10; //increase the players score by 10
        explosionSound.play(); //play the explosion sound effect
		enemySpaceship.resetEnemySpaceship(); //run the resetEnemy function
        shootAgain = true; //set shoot again back to true
	}
    
     if (
		bullet.x <= (meteor.x + 64) //if all these conditions are true, a bullet and a meteor have collided.
		&& meteor.x <= (bullet.x + 64)
		&& bullet.y <= (meteor.y + 64)
		&& meteor.y <= (bullet.y + 64)
        && spaceship.health > 0
	) {
        spaceship.score += 10; //increase the players score by 10
        explosionSound.play(); //play the explosion sound effect
		meteor.resetMeteor(); //run the resetMeteor function
        shootAgain = true; //set shootAgain back to true.
	}

    if(bullet.y < 0) //if the bullet has left the canvas set shoot again back to true
    {
        shootAgain = true;        
    }
    
    if(enemySpaceship.y > canvas.height) //f the enemy ship has left the canvas reset it
        {
            enemySpaceship.resetEnemySpaceship();
        }
    
    if(meteor.y > canvas.height)
        {
            meteor.resetMeteor(); //if the meteor has left the canvas reset it
        }
    
    if (bgReady) //if bgReady is true
    {    
        ctx.drawImage(bgImage, 0, vy); //draw one instance of the background at a fixed x position and vy as its y position
        ctx.drawImage(bgImage, 0, bgImage.height-Math.abs(vy)); //draw it again directly after the first instance
	
	   if (Math.abs(vy) > bgImage.height) //once the image has left the screen restart the process
       {
            vy = 0;
	   }
	
	   vy -= 2;	//move downwards at 2 pixels per second
    }
    
    
    enemyAcceleration = enemyAcceleration + 0.15; //increase the enemy ships acceleration by 0.15 each second
    enemySpaceship.y = enemySpaceship.y + enemyAcceleration; //add this acceleration onto the ships speed
    
    meteorAcceleration = meteorAcceleration + 0.15; //increase the meteors acceration by 0.15 each second
    meteor.y = meteor.y + meteorAcceleration; //add this acceleration onto the ships speed
    
    bullet.y -= 10; //move the bullet upwards by 10 pixels per second

    

    
};


let render = function () { //the render function is where everything is drawn
	

	if (spaceshipReady && !mainMenu) //if the spaceship has loaded draw it
    {
		ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y);
	}

	if (enemySpaceshipReady && !mainMenu) //if the enemy ship has loaded draw it
    {
		ctx.drawImage(enemySpaceshipImage, enemySpaceship.x, enemySpaceship.y);
	}
    
    if (meteorReady && !mainMenu) //if the meteor has loaded draw it
    {
		ctx.drawImage(meteorImage, meteor.x, meteor.y);
	}
    
    if(bulletReady && !mainMenu) //if the bullet has loaded draw it
    {
        ctx.drawImage(bulletImage, bullet.x, bullet.y);
    }

    if(bossReady && bossFight && !mainMenu) //if the boss  has loaded draw it
    {
        ctx.drawImage(bossImage, bossSpaceship.x, bossSpaceship.y);
    }

    if(bossBulletImageReady  && bossFight) //if the bullet has loaded draw it
    {
        ctx.drawImage(bossBulletImage, bossSpaceship.bossBulletX + 18, bossSpaceship.bossBulletY + 50);
    }

	if(!mainMenu)
    {
        ctx.fillStyle = "yellow";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.fillText("Score: " + spaceship.score, 32, 32); //display the users score
        
     
        ctx.fillStyle = "yellow";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "right";
        ctx.fillText("Health: " + spaceship.health, 608, 32); //display the users health
    }


ctx.fillStyle = "yellow"; //set the text color to yellow
    ctx.font = "24px Helvetica"; //set its size to 24 pixels and its font to helvetica
    ctx.textAlign = "center"; //allign the text to its center
    ctx.fillText(username, canvas.width/2, 0 + 24); //game over text
    
    if(spaceship.health <= 0 && !mainMenu) //run this code if the players health reaches 0 or less
    {
        console.log("dead");
        inGameMusic.pause(); //pauses the in game music
        inGameMusic.currentTime = 0.0; //sets it back to the start
        gameOverMusic.play(); //play the game over music
        meteorReady = false; //stop the meteors from being drawn
        enemySpaceshipReady = false; //stop the enemy ship from being drawn

        

        submitScoreButton.disabled = false;

        ctx.fillStyle = "yellow"; //set the text color to yellow
        ctx.font = "24px Helvetica"; //set its size to 24 pixels and its font to helvetica
        ctx.textAlign = "center"; //allign the text to its center
        ctx.fillText("Game Over", canvas.width/2, canvas.height/2); //game over text
        ctx.fillText("Your score was " + spaceship.score, canvas.width/2, (canvas.height/2)+24); //present user with their score
        ctx.fillText("Play again?", canvas.width/2, (canvas.height/2)+48); //play again text

        

        if(spaceship.score > playerHighestScore)
        {
            playerHighestScore = spaceship.score;
        }

        //canvas.addEventListener("mousedown", reset, false); //if the user clicks the canvas the reset function is run

        canvas.addEventListener('mousedown', function(ev)
        {    
            mouseX = ev.clientX;
            mouseY = ev.clientY;

            if (
            mouseX <= (canvasWidth/2 + 100) //if all these conditions are true, a bullet and an enemy ship have collided
            && canvasWidth/2 <= (mouseX + 100)
            && mouseY <= (canvasHeight/2 + 25)
            && canvasHeight/2 <= (mouseY + 25)
            ){
                console.log("CLICKED THE GAME OVER TEXT");
                mainMenu = true;
            }

        });
        
    }

    if(mainMenu)
    {
        inGameMusic.pause(); //pauses the in game music
        inGameMusic.currentTime = 0.0; //sets it back to the start
        gameOverMusic.play(); //play the game over music
        meteorReady = false; //stop the meteors from being drawn
        enemySpaceshipReady = false; //stop the enemy ship from being drawn

        ctx.fillStyle = "yellow"; //set the text color to yellow
        ctx.font = "24px Helvetica"; //set its size to 24 pixels and its font to helvetica
        ctx.textAlign = "center"; //allign the text to its center
        let startGameTextX = canvas.width/2;
        let startGameTextY = canvas.height/2;
        ctx.fillText("Start Game", canvas.width/2, canvas.height/2); //game over text
        //ctx.fillText("Your score was " + spaceship.score, canvas.width/2, (canvas.height/2)+24); //present user with their score
        //ctx.fillText("Play again?", canvas.width/2, (canvas.height/2)+48); //play again text


        canvas.addEventListener('mousedown', function(ev)
        {    
            mouseX = ev.clientX;
            mouseY = ev.clientY;

            if (
            mouseX <= (startGameTextX + 32) //if all these conditions are true, a bullet and an enemy ship have collided
            && startGameTextX <= (mouseX + 32)
            && mouseY <= (startGameTextY + 32)
            && startGameTextY <= (mouseY + 32)
        ) {
                console.log("CLICKED THE TEXT");
                // /mainMenu = false;
                reset();

        }

        });

    }


	
};

// The main game loop
const main = function () {
	let now = Date.now();
	let delta = now - then;

	update(delta / 1000);
	render();

	then = now;


	requestAnimationFrame(main);
};

let then = Date.now();
main();