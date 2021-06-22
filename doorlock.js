#!/usr/bin/env node

var unlockedState = 1000;
var lockedState = 2200;

var motorPin = 14;
var ledPin = 17

var blynkToken = 'blynk_token_here';

// *** Start code *** //

var locked = true

//Setup servo
var Gpio = require('pigpio').Gpio,

  //Setting up the servo
  motor = new Gpio(motorPin, {mode: Gpio.OUTPUT}),

  //Setting up the LED
  led = new Gpio(ledPin, {mode: Gpio.OUTPUT});

  //Setup blynk
var Blynk = require('blynk-library');
var blynk = new Blynk.Blynk(blynkToken);
var v0 = new blynk.VirtualPin(0);

//Locking the door to start with
console.log("locking door")
lockDoor()


v0.on('write', function(param) {
	console.log('V0:', param);
  	if (param[0] === '0') { //unlocked
  		unlockDoor()
  	} else if (param[0] === '1') { //locked
  		lockDoor()
  	} else {
  		blynk.notify("Door lock button was pressed with unknown parameter");
  	}
});

blynk.on('connect', function() { console.log("Blynk ready."); });
blynk.on('disconnect', function() { console.log("DISCONNECT"); });

//function to lock door
function lockDoor() {
	//move the servo
	motor.servoWrite(lockedState);
	//turn on the led
	led.digitalWrite(1);
	locked = true

	//notify via push notifications
  	blynk.notify("Door has been locked!");
  	
  	//After 1.5 seconds, the door lock servo turns off to avoid stall current
  	setTimeout(function(){motor.servoWrite(0)}, 1500)
}

//unlock the door 
function unlockDoor() {
	motor.servoWrite(unlockedState);
	led.digitalWrite(0);
	locked = false

	//notify
  	blynk.notify("Door has been unlocked!"); 

  	//After 1.5 seconds, the door lock servo turns off to avoid stall current
  	setTimeout(function(){motor.servoWrite(0)}, 1500)
}
