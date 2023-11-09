mode = -1 // set initially to one to force boot-up phase to run once
timer = 0 // timer used to switch between seasons
timeToSwitch = 8000 // represents how long a season lasts
setPixelsSpring = array(pixelCount) // used to store which LEDs will represent orange blossoms
setPixelsFall = array(pixelCount) // used to store which leaves are red, orange, or yellow
setPixelsDark = array(pixelCount) // prevents that LED from turning on in the winter or fall phase
setPixelsDead = array(pixelCount) // used to show when LEDs in the summer cycle should be fall colors instead (used for transition between summer and fall season)
setPixelsSnow = array(pixelCount) // used to store which LEDs represent snow
setPixelsStartup = array(pixelCount) // set pixel colors curing boot-up phase 
counter = 0 // used during startup phase to say which LEDs should be turned on
counterset = 0; // used during startup phase to prevent LEDs from rapidly changing colors

for(i = 0; i < pixelCount; i++){ // set what leafs are fruit
  check = random(5)
  if (check <= 1.2){
    setPixelsSpring[i] = 0
    if (i != 0 && i != pixelCount-1){ // So no blossoms are right next to eachother
      setPixelsSpring[i - 1] = 1
      setPixelsSpring[i + 1] = 1
    }
  } else {
    setPixelsSpring[i] = 1
  }
}

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
  if (mode == 0){ // runs the summer cycle logic
    tempTimer += delta
  }
  if(mode == 0 && tempTimer > 2500){
    tempTimer -= 2500
    for (i = 0; i < 70; i++){
      setPixelsDead[random(299)] = 1
    }
  }
  
  if (mode == 1){ // runs the fall cycle logic to remove all leaves once it reaches the end of the fall season
    tempTimer += delta
    if(timer > 7000){
      for (i = 0; i < pixelCount; i++){ // removes all fall leaves
      setPixelsDark[i] = 1 
    }
    }
  }
  if(mode == 1 && tempTimer > 2000){ // runs the fall cycle logic to remove random leaves over time
    tempTimer -= 2000
    for (i = 0; i < 60; i++){
      setPixelsDark[random(299)] = 1
    }
  }
  
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
  
  if (mode == 2){ // runs the winter cycle logic to add all snow on leaves once it reaches the end of the winter season
    tempTimer += delta
    if(timer > 5000){
      for (i = 0; i < pixelCount; i++){
      setPixelsDark[i] = 0
    }
    }
  }
  if(mode == 2 && tempTimer > 800){ // runs the winter cycle logic to add snow on random leaves over time
    tempTimer -= 800
    for (i = 0; i < 60; i++){
      setPixelsDark[random(299)] = 0
    }
  }
  
  if (mode == 3){ // runs the spring cycle logic to add all blossoms on leaves once it reaches the end of the spring season
    tempTimer += delta
    if(timer > 5000){
      for (i = 0; i < pixelCount; i++){ 
      setPixelsSnow[i] = 0
    }
    }
  }
  if(mode == 3 && tempTimer > 500){ // runs the spring cycle logic to add blossoms on random leaves over time
    tempTimer -= 500
    for (i = 0; i < 60; i++){
      setPixelsSnow[random(299)] = 0
    }
  }
  
  
  timer += delta // Accumulate all the deltas into a timer
  if (timer > timeToSwitch) { // After 8s, rewind the timer and switch modes
    timer -= timeToSwitch
    mode = mode + 1// Go to the next mode
    for(i = 0; i < pixelCount; i++){ // reset some arrays
      setPixelsDead[i] = 0
      setPixelsSnow[i] = 1
    }
  }
  
  if (mode == 4){ //Revert back to mode 0 (summer)
    mode = 0
  }
}

/* Runs when LED color is rendered */
/* index is the index of the LED */
export function render(index) {
  if ((index < 42 || index > 70 && index < 115) && mode != -1 ) { // represents the LEDS that create the trunk and branches
    hsv(.05,10,150) // brown
  } else if (setPixelsDark[index] == 1){ // stops LEDs from turning on that we want to be off (used during fall and winter cycle)
    //does not turn on
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
    if (mode == 0 && setPixelsDead[index] == 0){ // summer
      hsv(.34,1,1) // green leaves
    } else if (mode == 1 || setPixelsDead[index] == 1){ // fall, also will run in summer cycle if that LED is set to be dead (fall color)
      if (setPixelsFall[index] == 0){
         hsv(.03,100,100) //orange leaves
      } else if (setPixelsFall[index] == 1) {
         hsv(.01,100,100) //red leaves
      } else {
          hsv(.1,100,100) //yellow leaves
      }
    } else if (mode == 2  || setPixelsSnow[index] == 1){ // winter, also will run in spring cycle if that LED is still set to snow
      hsv(0,0,100) // white leaves
    } else if (mode == 3) { //spring
      if (setPixelsSpring[index] == 0){ // states if that leaf should be a blossom
        hsv(.03,100,100) // blossom
      } else {
        hsv(.34,1,1) // green leaves
      }
    }
  } 
}
