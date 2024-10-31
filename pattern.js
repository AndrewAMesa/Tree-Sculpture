mode = -1 // states which season we are in, set initially to negative one to force the startup phase to run once
timer = 0 // timer used to switch between seasons
transitionTimer = 0 // timer used to enable LEDs to transition between seasons
timeToSwitch = 8000 // represents how long a season lasts in milliseconds (8 seconds)
setPixelsSpring = array(pixelCount) // stores which LEDs will represent orange blossoms
setPixelsFall = array(pixelCount) // stores which leaves are red, orange, or yellow
setPixelsTransition = array(pixelCount) // stores which LEDs are still in the transition phase between seasons
setPixelsStartup = array(pixelCount) // set pixel colors during boot-up phase 
currentLED = 0 // used during startup phase to say which LED was last turned on

// Initial Set Up Code //
for (i = 0; i < pixelCount; i++) { // set what leafs are blossoms
    check = random(5)
    if (check <= 1.2) {
        setPixelsSpring[i] = 0
        if (i != 0 && i != pixelCount - 1) { // So no blossoms are right next to eachother
            setPixelsSpring[i - 1] = 1
            setPixelsSpring[i + 1] = 1
        }
    } else {
        setPixelsSpring[i] = 1
    }
}
for (i = 0; i < pixelCount; i++) { //set what leafs are what color in fall
    check = random(3)
    if (check <= 1) {
        setPixelsFall[i] = 0
    } else if (check <= 2) {
        setPixelsFall[i] = 1
    } else {
        setPixelsFall[i] = 2
    }
}
// ------------------ //

/* assists with logic code of the startup phase (what LEDs should currently be on) */
/* delta is the time change since the last call in milliseconds */
export function checkStartup(delta) {
    transitionTimer += delta
    if (transitionTimer > 500) {
        transitionTimer -= 100
        for (i = 0; i < 5; i++) {
            setPixelsStartup[currentLED + i] = i + 1 // allows that LED to shine during startup
        }
        if (currentLED < 295) { // creates cascading effect on startup of tree
            currentLED += 5 // points to LED that was last turned on
        }
    }
}

/* assists with logic code of the summer season (what LEDs are in transition between seasons) */
/* delta is the time change since the last call in milliseconds */
export function checkSummer(delta) {
    transitionTimer += delta
    if (timer > 7000) { // removes all fall leaves after 7s
        for (i = 0; i < pixelCount; i++) {
            setPixelsTransition[i] = 1
        }
    } else if (transitionTimer > 2500) { //creates dead leaves every 2.5s
        transitionTimer -= 2500
        for (i = 0; i < 70; i++) {
            setPixelsTransition[random(299)] = 1
        }
    }
}

/* assists with logic code of the fall season (what LEDs are in transition between seasons) */
/* delta is the time change since the last call in milliseconds */
export function checkFall(delta) {
    transitionTimer += delta
    if (timer > 7000) { // removes all fall leaves after 7s
        for (i = 0; i < pixelCount; i++) {
            setPixelsTransition[i] = 0
        }
    } else if (transitionTimer > 2000) { // removes random leaves every 2s
        transitionTimer -= 2000
        for (i = 0; i < 60; i++) {
            setPixelsTransition[random(299)] = 0
        }

    }
}

/* assists with logic code of the winter season (what LEDs are in transition between seasons) */
/* delta is the time change since the last call in milliseconds */
export function checkWinter(delta) {
    transitionTimer += delta
    if (timer > 5000) { // set all lights to snow after 5s
        for (i = 0; i < pixelCount; i++) {
            setPixelsTransition[i] = 1
        }
    } else if (transitionTimer > 1000) { // adds snow on random leaves every 1s
        transitionTimer -= 1000
        for (i = 0; i < 60; i++) {
            setPixelsTransition[random(299)] = 1
        }
    }
}

/* assists with logic code of the spring season (what LEDs are in transition between seasons) */
/* delta is the time change since the last call in milliseconds */
export function checkSpring(delta) {
    transitionTimer += delta
    if (timer > 5000) { // set all lights to spring after 5s
        for (i = 0; i < pixelCount; i++) {
            setPixelsTransition[i] = 0
        }
    } else if (transitionTimer > 1000) { //add blossoms on random leaves every 1s
        transitionTimer -= 1000
        for (i = 0; i < 60; i++) {
            setPixelsTransition[random(299)] = 0
        }
    }
}

/* Runs before LED color is rendered, mostly includes timer logic */
/* delta is the time change since the last call in milliseconds */
export function beforeRender(delta) {
    if (mode == -1) { // runs the startup cycle
        checkStartup(delta)
    } else if (mode == 0) { // runs the summer cycle logic
        checkSummer(delta)
    } else if (mode == 1) { // runs the fall cycle logic
        checkFall(delta)
    } else if (mode == 2) { // runs the winter cycle logic
        checkWinter(delta)
    } else if (mode == 3) { // runs the spring cycle logic
        checkSpring(delta)
    }

    timer += delta // Accumulate all the deltas into a timer
    if (timer > timeToSwitch) { // After 8s, rewind the timer and switch modes
        timer -= timeToSwitch
        transitionTimer = 0
        mode = mode + 1// Go to the next mode
    }

    if (mode == 4) { //Revert back to mode 0 (summer) 
        mode = 0
    }
}

/* Runs when LED color is rendered */
/* index is the index of the LED */
export function render(index) {
    if (mode == -1) { // startup cycle
        if (setPixelsStartup[index] != 0) {
            if (setPixelsStartup[index] == 1) {
                hsv(.34, 1, 1)
            } else if (setPixelsStartup[index] == 2) {
                hsv(.03, 1, 1)
            } else if (setPixelsStartup[index] == 3) {
                hsv(.01, 1, 1)
            } else if (setPixelsStartup[index] == 4) {
                hsv(0, 0, 1)
            } else if (setPixelsStartup[index] == 5) {
                hsv(.1, 1, 1)
            }
        }
    } else if (index < 42 || (index > 70 && index < 115)) { // represents the LEDS that create the trunk and branches
        hsv(.05, 10, 150) // brown
    } else { // sets the LEDs to their respective colors based on the seasons
        if (mode == 0) { // summer
            if (setPixelsTransition[index] == 1) { // summer transition leaves (are fall leaves)
                if (setPixelsFall[index] == 0) {
                    hsv(.03, 100, 100) //orange leaves
                } else if (setPixelsFall[index] == 1) {
                    hsv(.01, 100, 100) //red leaves
                } else {
                    hsv(.1, 100, 100) //yellow leaves
                }
            } else {
                hsv(.34, 1, 1) // green leaves
            }
        } else if (mode == 1) { // fall
            if (setPixelsTransition[index] == 0) { // fall transition leaves (turned off)
                // do nothing (LED off)
            } else {
                if (setPixelsFall[index] == 0) {
                    hsv(.03, 100, 100) //orange leaves
                } else if (setPixelsFall[index] == 1) {
                    hsv(.01, 100, 100) //red leaves
                } else {
                    hsv(.1, 100, 100) //yellow leaves
                }
            }
        } else if (mode == 2) { // winter
            if (setPixelsTransition[index] == 0) { // winter transition leaves (turned off)
                // do nothing (LED off)
            } else {
                hsv(0, 0, 100) // snow
            }
        } else if (mode == 3) { // spring
            if (setPixelsTransition[index] == 1) { // spring transition leaves (have snow)
                hsv(0, 0, 100) // snow
            } else {
                if (setPixelsSpring[index] == 0) { // states if that leaf should be a blossom
                    hsv(.03, 100, 100) // blossom
                } else {
                    hsv(.34, 1, 1) // green leaves
                }
            }
        }
    }
}
