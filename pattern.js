mode = -1
timer = 0
timeToSwitch = 8000
setPixelsSpring = array(pixelCount)
setPixelsFall = array(pixelCount)
setPixelsDark = array(pixelCount)
setPixelsDead = array(pixelCount)
setPixelsSnow = array(pixelCount)
setPixelsStartup = array(pixelCount)
counter = 0
counterset = 0;

for(i = 0; i < pixelCount; i++){ //set what leafs are fruit
  check = random(5)
  if (check <= 1.2){
    setPixelsSpring[i] = 0
    if (i != 0 && i != pixelCount-1){ //So no fruits are right next to eachother
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

export function beforeRender(delta) {
  if (mode == 0){
    tempTimer += delta
  }
  if(mode == 0 && tempTimer > 2500){
    tempTimer -= 2500
    for (i = 0; i < 70; i++){
      setPixelsDead[random(299)] = 1
    }
  }
  
  if (mode == 1){
    tempTimer += delta
    if(timer > 7000){
      for (i = 0; i < pixelCount; i++){
      setPixelsDark[i] = 1
    }
    }
  }
  if(mode == 1 && tempTimer > 2000){
    tempTimer -= 2000
    for (i = 0; i < 60; i++){
      setPixelsDark[random(299)] = 1
    }
  }
  
  if (mode == -1){
  tempTimer += delta
  }
  if(mode == -1 && tempTimer > 400){
    tempTimer -= 100
    for (i = counter; i < counter + 5; i++){
      setPixelsStartup[i] = 1
    }
    if (counter < 295){
      counter += 5
    }
  }
  
  if (mode == 2){
    tempTimer += delta
    if(timer > 5000){
      for (i = 0; i < pixelCount; i++){
      setPixelsDark[i] = 0
    }
    }
  }
  if(mode == 2 && tempTimer > 800){
    tempTimer -= 800
    for (i = 0; i < 60; i++){
      setPixelsDark[random(299)] = 0
    }
  }
  
  if (mode == 3){
    tempTimer += delta
    if(timer > 5000){
      for (i = 0; i < pixelCount; i++){
      setPixelsSnow[i] = 0
    }
    }
  }
  if(mode == 3 && tempTimer > 500){
    tempTimer -= 500
    for (i = 0; i < 60; i++){
      setPixelsSnow[random(299)] = 0
    }
  }
  
  
  timer += delta // Accumulate all the deltas into a timer
  if (timer > timeToSwitch) { // After 5s, rewind the timer and switch modes
    timer -= timeToSwitch
    mode = mode + 1// Go to the next mode, and keep
    for(i = 0; i < pixelCount; i++){ //set what leafs to not be dark
      setPixelsDead[i] = 0
      setPixelsSnow[i] = 1
    }
  }
  
  if (mode == 4){ //Revert back to mode 0
    mode = 0
  }
}

export function render(index) {
  if ((index < 42 || index > 70 && index < 115) && mode != -1 ) {
    hsv(.05,10,150)
  } else if (setPixelsDark[index] == 1){
    //does not turn on
  } else if (mode == -1){
    if(setPixelsStartup[index] == 1){
      if (counterset ==  0){
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
    if (mode == 0 && setPixelsDead[index] == 0){ //summer
      hsv(.34,1,1)
    } else if (mode == 1 || setPixelsDead[index] == 1){ //fall
      if (setPixelsFall[index] == 0){
         hsv(.03,100,100) //orange leaves
      } else if (setPixelsFall[index] == 1) {
         hsv(.01,100,100) //red leaves
      } else {
          hsv(.1,100,100) //yellow leaves
      }
    } else if (mode == 2  || setPixelsSnow[index] == 1){ //winter
      hsv(0,0,100)
    } else if (mode == 3) { //spring
      if (setPixelsSpring[index] == 0){
        hsv(.03,100,100) //fruit
      } else {
        hsv(.34,1,1)
      }
    }
  } 
}
