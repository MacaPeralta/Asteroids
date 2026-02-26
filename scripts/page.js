/* ------------- Winter 2024 EECS 493 Assignment 3 Starter Code ------------ */



/* ------------------------ GLOBAL HELPER VARAIBLES ------------------------ */
// Difficulty Helpers
let astProjectileSpeed = 3;            // easy: 1, norm: 3, hard: 5
let spawnRate = 800;
let volumeSlider = 0.5; 
let score = 0;
let danger = 20; 
let level = 1;
let Difficulty = 2;
let tutorial = false;
let paused = false;
// Set intervals for spawning shields and portals

let spawnAsteroidIntervalID;
let spawnPortalIntervalID;
let spawnShieldIntervalID;
let scoreIncrementIntervalID;

// Game Object Helpers
let currentAsteroid = 1;
const AST_OBJECT_REFRESH_RATE = 15;
const maxPersonPosX = 1218;
const maxPersonPosY = 658;
const PERSON_SPEED = 5;                // #pixels each time player moves by
const portalOccurrence = 15000;        // portal spawns every 15 seconds
const portalGone = 5000;               // portal disappears in 5 seconds
const shieldOccurrence = 10000;        // shield spawns every 10 seconds
const shieldGone = 5000;               // shield disappears in 5 seconds

// Movement Helpers
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;

// TODO: ADD YOUR GLOBAL HELPER VARIABLES (IF NEEDED)


var gameWindow; 







/* --------------------------------- MAIN ---------------------------------- */
$(document).ready(function () {
  // jQuery selectors
  gameWindow = $('.game-window');
  game_screen = $('#actual-game');
  asteroid_section = $('.asteroidSection');
  game_screen.hide();

  /* -------------------- ASSIGNMENT 2 SELECTORS BEGIN -------------------- */

   

  // Toggle settings panel
  $('button:contains("Settings")').click(function() {
    $('#settings-panel').fadeIn();
});

// Close settings panel
$('#close-settings').click(function() {
    $('#settings-panel').fadeOut();
});

// Update volume
$('#volume-slider').on('input', function() {
    $('#volume-value').text(this.value);
    volumeSlider = $(this).val() / 100;
});

// Change difficulty
$('.difficulty-button').click(function() {
    $('.difficulty-button').removeClass('selected');
    $(this).addClass('selected');

    if(this.id === "easy"){
      astProjectileSpeed = 1;
      spawnRate = 1000;
      Difficulty =1;
    }
    if(this.id === "normal"){
      astProjectileSpeed = 3;
      spawnRate = 800;
      Difficulty =3;
    }
    if(this.id === "hard"){
      astProjectileSpeed = 5;
      spawnRate = 500;
      Difficulty =5;
    }
});
  /* --------------------- ASSIGNMENT 2 SELECTORS END --------------------- */

  $("#play-game").on("click", function () {
    $('#landing-page').addClass('hidden');
    if (tutorial) {
      //console.log("playing game bc tutorial was already shown");

      playGame();
    }
    else {
      //console.log("show the tutorial, it was not shown yet");
      $('#tutorial-page').removeClass('hidden').css({'visibility': 'visible', 'z-index': '100'});
    }
  });

  $('#start-game').click(function() {
    $('#tutorial-page').hide();
    tutorial = true;
    playGame();

  });

  $("#start-over").click(() => {
    $("#game-over-page").hide();
    $('#landing-page').removeClass('hidden');
    $('#asteroidSection').addClass('hidden');

  });

  
});


/* ---------------------------- EVENT HANDLERS ----------------------------- */
// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {

  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

/* ------------------ ASSIGNMENT 2 EVENT HANDLERS BEGIN ------------------ */

/* ------------------- ASSIGNMENT 2 EVENT HANDLERS END ------------------- */

// TODO: ADD MORE FUNCTIONS OR EVENT HANDLERS (FOR ASSIGNMENT 3) HERE

function playGame() {
  resetGame();
  //console.log("Playing Game");
 
  $('#asteroidSection').removeClass('hidden');
  game_screen.show();

  $('#splash-screen').removeClass('hidden');
  $('#scoreboard').show();

  // Set a timeout to hide the splash screen after 3 seconds
  setTimeout(function() {
    $('#splash-screen').addClass('hidden');
    // Here you can redirect to a new page or display new content
    
    
    let spaceship = new Spaceship();
    spaceship.move();

    spawnAsteroidIntervalID = setInterval(spawn, spawnRate);
    spawnPortalIntervalID = setInterval(spawnPortal, 15000);
    spawnShieldIntervalID = setInterval(spawnShield, 10000);
    scoreIncrementIntervalID = startScoreIncrement(); 
  
  
    
  }, 3000); 
}

function resetGame() {
  clearInterval(spawnAsteroidIntervalID);
  clearInterval(spawnPortalIntervalID);
  clearInterval(spawnShieldIntervalID);
  clearInterval(scoreIncrementIntervalID);
  score = 0;
  level = 1;
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  isPaused = false;
  if (savedDifficulty == 1) {
    danger = 10;
    astProjectileSpeed = 1;
  } else if (savedDifficulty == 3) {
    danger = 20;
    astProjectileSpeed = 3;
  } else if (savedDifficulty == 5) {
    danger = 30;
    astProjectileSpeed = 5;
  }
  updateScore();
}


function playSound(soundFile) {
  let audio = new Audio(soundFile);
  audio.volume = volumeSlider;
  audio.play();
}

function startScoreIncrement() {
  //console.log("start score increment");
  return setInterval(() => {
    score += 40;
    updateScore();
  }, 500);
}

function updateScore() {
  $("#score").text(score);
  $("#danger").text(danger);
  $("#level").text(level);
  //console.log("Updating Scoreboard");
}


function showGameOverPage() {
  game_screen.hide(); 
  //$("#landing-page").show();
  $("#game-over-page").show();
  $("#game-over-score").text(`${score}`);
}
function pause() { 
  paused = true;
  LEFT = RIGHT = UP = DOWN = false;
  clearInterval(spawnAsteroidIntervalID);
  clearInterval(spawnPortalIntervalID);
  clearInterval(spawnShieldIntervalID);
  clearInterval(scoreIncrementIntervalID);
  astProjectileSpeed = 0;
  
}

function clearGameScreen() {
  $("#spaceship").remove();
  $(".curAsteroid").remove();
  $(".portal").remove();
  $(".shield").remove();
  //console.log("clearing the game stuff??");
}  

function resetGame() {
 
  score = 0;
  level = 1;
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  isPaused = false;
  if (Difficulty == 1) {
    danger = 10;
    astProjectileSpeed = 1;
  } else if (Difficulty == 3) {
    danger = 20;
    astProjectileSpeed = 3;
  } else if (Difficulty == 5) {
    danger = 30;
    astProjectileSpeed = 5;
  }
  updateScore();
}

class Spaceship {
  constructor() {
    this.initSpaceship();
    this.hasShield = false;
    this.playerTouched = false; 
  }

  initSpaceship() {
    
    this.element = $("<div id='spaceship'><img src='src/player/player.gif'></div>");
    gameWindow.append(this.element);
    this.x = (gameWindow.width() - this.element.outerWidth()) / 2;
    this.y = gameWindow.height() - this.element.outerHeight() - 20; 
    this.updatePosition();
    //console.log("Inititalized the spaceship");
  }

  updatePosition() {
   
    this.element.css({ top: this.y + "px", left: this.x + "px" });
    this.updateImage();
    //console.log("Updated Position");
  }

  updateImage() {
    let img; 
    if (this.playerTouched) {
      img = "src/player/player_touched.gif";
    }
    else if (!this.hasShield) {

      if (LEFT) img = "src/player/player_left.gif";
      if (RIGHT) img = "src/player/player_right.gif";
      if (UP) img = "src/player/player_up.gif";
      if (DOWN) img = "src/player/player_down.gif";
      if (LEFT && UP) img = "src/player/player_left.gif";
      if (LEFT && DOWN) img = "src/player/player_left.gif";
      if (RIGHT && UP) img = "src/player/player_right.gif";
      if (RIGHT && DOWN) img = "src/player/player_right.gif";
      if (!LEFT && !RIGHT && !UP && !DOWN) img = "src/player/player.gif";
      //console.log(" No Shield");

    }
    else if(this.hasShield){
      if (LEFT) img = "src/player/player_shielded_left.gif";
      if (RIGHT) img = "src/player/player_shielded_right.gif";
      if (UP) img = "src/player/player_shielded_up.gif";
      if (DOWN) img = "src/player/player_shielded_down.gif";
      if (LEFT && UP) img = "src/player/player_shielded_left.gif";
      if (LEFT && DOWN) img = "src/player/player_shielded_left.gif";
      if (RIGHT && UP) img = "src/player/player_shielded_right.gif";
      if (RIGHT && DOWN) img = "src/player/player_shielded_right.gif";
      if (!LEFT && !RIGHT && !UP && !DOWN) img = "src/player/player_shielded.gif";
      //console.log("Shield");
    }
    this.element.find("img").attr("src", img);
    //console.log("Updated the image");
  }

  move() {
    if (LEFT && this.x > 0) {
      this.x -= PERSON_SPEED;
      //console.log("LEFT");
    }
    if (RIGHT && this.x < maxPersonPosX) {
      this.x += PERSON_SPEED;
      //console.log("RIGHT");
    }
    if (UP && this.y > 0) {
      this.y -= PERSON_SPEED;
      //console.log("UP");
    } 
    if (DOWN && this.y < maxPersonPosY) {
      this.y += PERSON_SPEED;
      //console.log("DOWN");
    }
    this.updatePosition();
    this.checkCollisions();
    requestAnimationFrame(this.move.bind(this)); 
    //console.log("MOVED");
  }


  checkCollisions() {
    $(".curAsteroid").each((index, asteroid) => {
      if (isColliding($(asteroid), this.element)) {
        if (this.hasShield) {
          $(asteroid).remove(); 
          this.hasShield = false;
          this.updatePosition();
        } else {
          if (!this.playerTouched) {
            this.playerTouched = true;
            this.updatePosition();
            playSound("src/audio/die.mp3");
            pause();
            setTimeout(() => {
              astProjectileSpeed = Difficulty;
              showGameOverPage();
              clearGameScreen();
            }, 2000);
          }
        }
      }
    });
    $(".shield").each((index, shield) => {
      if (isColliding($(shield), this.element)) {
        $(shield).remove();
        this.hasShield = true;
        this.updatePosition();
        playSound("src/audio/collect.mp3");
      }
    });
    $(".portal").each((index, portal) => {
      if (isColliding($(portal), this.element)) {
        $(portal).remove();
        playSound("src/audio/collect.mp3");
        danger += 2;
        level += 1;
        astProjectileSpeed += 0.5; 
        updateScore();
      }
    });
  }


  
}

class Portal {
  constructor() {
    this.spawnPortal();
  }

  spawnPortal() {
    let objectString = $("<div class='portal'><img src='src/port.gif'></div>"); 
    let x = getRandomNumber(0, maxPersonPosX - objectString.width());
    let y = getRandomNumber(0, maxPersonPosY - objectString.height());
    objectString.css({ top: y, left: x });
    gameWindow.append(objectString);
    setTimeout(() => {
      objectString.remove();
    }, portalGone); 
  }
}

function spawnPortal() {
  let portal = new Portal();
}




class Shield {
  constructor() {
    this.spawnShield();
  }

  spawnShield() {
    let objectString = $("<div class='shield'><img src='src/shield.gif'></div>"); 
    let x = getRandomNumber(0, maxPersonPosX - objectString.width());
    let y = getRandomNumber(0, maxPersonPosY - objectString.height());
    objectString.css({ top: y, left: x });
    gameWindow.append(objectString);
    setTimeout(() => {
      objectString.remove();
    }, shieldGone); 
  }
}

function spawnShield() {
  let shield = new Shield();
}





/* ---------------------------- GAME FUNCTIONS ----------------------------- */
// Starter Code for randomly generating and moving an asteroid on screen
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAsteroid' > <img src = 'src/asteroid.png'/></div>";
    asteroid_section.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid
    this.x_dest = 0;
    this.y_dest = 0;
    // member variables indicating when the Asteroid has reached the boarder
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      } 
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }  

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() { 
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    let x = getRandomNumber(0, 1280);
    let y = getRandomNumber(0, 720);
    let floor = 784;
    let ceiling = -64;
    let left = 1344;
    let right = -64;
    let major_axis = Math.floor(getRandomNumber(0, 2));
    let minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed; 

  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  //console.log("spawn asteroid");
  let asteroid = new Asteroid(); 
  setTimeout(spawn_helper(asteroid), 0); 
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update Asteroid position on screen
    asteroid.updatePosition();
    // determine whether Asteroid has reached its end position
    if (asteroid.hasReachedEnd()) { // i.e. outside the game boarder
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
} 

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}    




