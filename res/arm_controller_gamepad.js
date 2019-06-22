/*
  * Software Module for GamePad Controller Support 
  * in the tool environment Scratch, written in JavaScript language
  * © 2019 by @arm923i https://t.me/arm923i
*/


(function(ext) {

    ext._shutdown = function() {};
    var haveEvents = "ongamepadconnected" in window,
        controllers = {};

    function connecthandler(e) {
        addgamepad(e.gamepad) // Add the controller to the "controllers" object
    }

    function addgamepad(e) {
        controllers[e.index] = e // Add the controller to the "controllers" object
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad) // Handle Disconnects
    }

    function removegamepad(e) {
        delete controllers[e.index] // Remove controllers when disconnected
    }

    function updateStatus() {
        haveEvents || scangamepads(), requestAnimationFrame(updateStatus) // Update the controller values
    }

    function scangamepads() {
        for (var e = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [], n = 0; n < e.length; n++) e[n] && (e[n].index in controllers ? controllers[e[n].index] = e[n] : addgamepad(e[n]))
    }
    window.addEventListener("gamepadconnected", connecthandler), window.addEventListener("gamepaddisconnected", disconnecthandler), haveEvents || setInterval(scangamepads, 1); // When the controller is detected, enable the extension
    
    ext._getStatus = function() {
    	if (!controllers) return {
	      status: 1,
	      msg: 'Connect a GamePad',
	    };
	    return {
            status: 2,
            msg: 'Ready'
        };
    };
	
	var ni = 8000 / 32767; // Deadzone
	
	ext.aefe = function(s,af) { // Return the force or angle of a specified stick
        var xp, yp;
        switch (s) {
            case "Left":
                x = controllers[0].axes[0];
                y = -controllers[0].axes[1];
                break;
            case "Right":
                x = controllers[0].axes[2];
                y = -controllers[0].axes[5];
                break;
        }
		if (-ni < x && x < ni) x = 0;
		if (-ni < y && y < ni) y = 0;
		switch(af) {
			case "Angle":
				return(value = 180 * Math.atan2(x, y) / Math.PI);
			break;
			
			case "Force":
				return Math.sqrt(x*x + y*y);
			break;
		}
    };

    ext.ispressed = function(b) {
        return (controllers[0].buttons[["Y", "B", "A", "X", "LB", "RB", "LT", "RT", "SELECT", "START", "LEFT STICK", "RIGHT STICK"].indexOf(b)].pressed); // Return if the user is pressing the button given to the function
    };

    ext.stickpos = function(s, hv) {
        return (controllers[0].axes[(["LeftHorizontal", "LeftVertical", "RightHorizontal", "", "", "RightVertical"].indexOf(s + hv))]); // Return the value of the axes for the stick and the direction specified
    };

    ext.stickfacing = function(s, hvb) { // Return a plaintext direction for a control stick
        let output = "";
        if (s == "Left") {
            if (hvb == "Both" || hvb == "Vertical") {
                if (controllers[0].axes[1] < -.5) {
                    output += "Up "
                } else if (controllers[0].axes[1] > .5) {
                    output += "Down "
                }
            }
            if (hvb == "Both" || hvb == "Horizontal") {
                if (controllers[0].axes[0] < -.5) {
                    output += "Left"
                } else if (controllers[0].axes[0] > .5) {
                    output += "Right"
                }
            }

        };
        if (s == "Right") {
            if (hvb == "Both" || hvb == "Vertical") {
                if (controllers[0].axes[5] < -.5) {
                    output += "Up "
                } else if (controllers[0].axes[5] > .5) {
                    output += "Down "
                }
            }
            if (hvb == "Both" || hvb == "Horizontal") {
                if (controllers[0].axes[2] < -.5) {
                    output += "Left"
                } else if (controllers[0].axes[2] > .5) {
                    output += "Right"
                }
            }
        };
        return (output);
    };

    ext.stickis = function(s, dir) { // Return true or false depending on if the specified stick is facing a direction
        if (s == "Left") {
            if (dir == "Up") {
                return (controllers[0].axes[1] < -.5)
            }
            if (dir == "Down") {
                return (controllers[0].axes[1] > .5)
            }
            if (dir == "Left") {
                return (controllers[0].axes[0] < -.5)
            }
            if (dir == "Right") {
                return (controllers[0].axes[0] > .5)
            }
            if (dir == "Up Left") {
                return (controllers[0].axes[1] < -.5 && (controllers[0].axes[0] < -.5))
            }
            if (dir == "Up Right") {
                return (controllers[0].axes[1] < -.5 && (controllers[0].axes[0] > .5))
            }
            if (dir == "Down Left") {
                return (controllers[0].axes[1] > .5 && (controllers[0].axes[0] < -.5))
            }
            if (dir == "Down Right") {
                return (controllers[0].axes[1] > .5 && (controllers[0].axes[0] > .5))
            }
        }
        if (s == "Right") {
            if (dir == "Up") {
                return (controllers[0].axes[5] < -.5)
            }
            if (dir == "Down") {
                return (controllers[0].axes[5] > .5)
            }
            if (dir == "Left") {
                return (controllers[0].axes[2] < -.5)
            }
            if (dir == "Right") {
                return (controllers[0].axes[2] > .5)
            }
            if (dir == "Up Left") {
                return (controllers[0].axes[5] < -.5 && (controllers[0].axes[2] < -.5))
            }
            if (dir == "Up Right") {
                return (controllers[0].axes[5] < -.5 && (controllers[0].axes[2] > .5))
            }
            if (dir == "Down Left") {
                return (controllers[0].axes[5] > .5 && (controllers[0].axes[2] < -.5))
            }
            if (dir == "Down Right") {
                return (controllers[0].axes[5] > .5 && (controllers[0].axes[2] > .5))
            }
        }

    };

    var descriptor = {
        blocks: [
            ['b', '%m.buttons is pressed?', 			'ispressed', 	"A"],
            ['h', 'When %m.buttons is pressed',			'ispressed', 	"A"],
            ['r', '%m.lr stick %m.hv position', 		'stickpos', 	"Left", "Horizontal"],
            ['r', '%m.lr stick %m.hvb direction', 		'stickfacing', 	"Left", "Both"],
            ['b', '%m.lr stick is facing %m.dir?', 		'stickis', 		"Left", "Up"],
            ['h', 'When %m.lr stick is facing %m.dir', 	'stickis', 		"Left", "Up"],
            ['r', '%m.lr stick %m.aefe', 				'aefe', 		'Left', "Angle"],
        ],
        menus: {
            buttons: ["Y", "B", "A", "X", "LB", "RB", "LT", "RT", "SELECT", "START", "LEFT STICK", "RIGHT STICK"],
            lr: 	 ["Left", "Right"],
            hv: 	 ["Horizontal", "Vertical"],
            hvb: 	 ["Horizontal", "Vertical", "Both"],
            dir: 	 ["Up", "Down", "Left", "Right", "Up Left", "Up Right", "Down Left", "Down Right"],
			aefe: 	 ["Angle", "Force"]
        }
    };

    ScratchExtensions.register('Gamepad', descriptor, ext); // Register the extension so scratch can use it
})({});