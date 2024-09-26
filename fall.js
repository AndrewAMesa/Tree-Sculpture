mode = -1 // set initially to one to force boot-up phase to run once
timer = 0 // timer used to switch between seasons
timeToSwitch = 8000 // represents how long a season lasts
setPixelsFall = array(pixelCount) // used to store which leaves are red, orange, or yellow
setPixelsStartup = array(pixelCount) // set pixel colors curing boot-up phase 
counter = 0 // used during startup phase to say which LEDs should be turned on
counterset = 0; // used during startup phase to prevent LEDs from rapidly changing colors

for(i = 0; i < pixelCount; i++){ //set what leafs are what color in fall
  check = random(3)
  if (check <= 1){
    setPixelsFall[i] = 0
  } else if (check > 1 && check <= 2){
    setPixelsFall[i] = 1
  } else {
    setPixelsFall[i] = 2
  }
}

/* Runs before LED color is renders, mostly includes timer logic */
/* delta is the time change since the last call in milliseconds */
export function beforeRender(delta) {
  
  if (mode == -1){ // runs the startup cycle
  tempTimer += delta
  }
  if(mode == -1 && tempTimer > 400){
    tempTimer -= 100
    for (i = counter; i < counter + 5; i++){
      setPixelsStartup[i] = 1 // allows that LED to shine during startup
    }
    if (counter < 295){ // creates cascading effect on startup of tree
      counter += 5
    }
  }
  
  if (mode == -1){
    timer += delta // Accumulate all the deltas into a timer
    if (timer > timeToSwitch) { // After 8s, rewind the timer and switch modes
      timer -= timeToSwitch
      mode = mode + 1// Go to the next mode
    }
  }
  
}

/* Runs when LED color is rendered */
/* index is the index of the LED */
export function render(index) {
  if ((index < 42 || index > 70 && index < 115) && mode != -1 ) { // represents the LEDS that create the trunk and branches
    hsv(.05,10,150) // brown
  } else if (mode == -1){ // startup
    if(setPixelsStartup[index] == 1){
      if (counterset ==  0){ // counterset used to keep the LED the same color during startup
        hsv(.34,1,1)
        counterset++;
      } else if (counterset ==  1) {
        hsv(.03,1,1)
        counterset++;
      }  else if (counterset ==  2){
        hsv(.01,1,1)
        counterset++;
      }  else if (counterset ==  3){
        hsv(0,0,1)
        counterset++;
      }  else if (counterset  == 4){
        hsv(.1,1,1)
        counterset = 0;
      }
    }
  } else {
      if (setPixelsFall[index] == 0){
         hsv(.03,100,100) //orange leaves
      } else if (setPixelsFall[index] == 1) {
         hsv(.01,100,100) //red leaves
      } else {
          hsv(.1,100,100) //yellow leaves
      }
  }
}
