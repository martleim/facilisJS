(function() {

    function Key() {
        this.Container_constructor();
        
        if (!Key.allowInstantiation) {
            throw new Error("Error: Instantiation failed: Use SingletonDemo.getInstance() instead of new.");
        }

        this.setup();
    }
    
    Key.initialized = false;
    Key.keysDown = {};

    Key.allowInstantiation=false;
    Key._instance;
    
    Key.getInstance=function(){
        if (facilis.View._instance == null) {
            Key.allowInstantiation = true;
            Key._instance = new facilis.Key();
            //this._instance.appendMe();
            Key.allowInstantiation = false;
        }
        return View._instance;
    }

    Key.KEY_DOWN		= "keyDown";
    Key.KEY_UP			= "keyUp";

    
    
    var element = facilis.extend(Key, {});
    
    element.setup = function() {
        Key.initialize();
    };
    
    
    Key.initialize=function(){
        if (!Key.initialized) {
            document.addEventListener("keydown", this.keyPressed.bind(this));
            document.addEventListener("keyup", this.keyReleased.bind(this));
            //document.addEventListener(Event.DEACTIVATE, this.clearKeys.bind(this));
            Key.initialized = true;
        }        
    }
    Key.isDown=function(keyCode) {
        if (!Key.initialized) {
            throw new Error("Key class has yet been initialized.");
        }
        return Key.keysDown[keyCode];
    }

    Key.keyPressed=function(event) {
        Key.keysDown[event.keyCode] = true;
        if(Key._instance){
            Key._instance.dispatchEvent(new facilis.Event(Key.KEY_DOWN));
        }
    }

    Key.keyReleased=function(event) {
        if (Key.keysDown[event.keyCode]) {
            Key.keysDown[event.keyCode]=false;
        }
        if (Key._instance) {
            Key.dispatchEvent(new facilis.Event(Key.KEY_UP));
        }
    }

    Key.clearKeys=function(event) {
        Key.keysDown = {};
    }

    Key.stopKeyPropagation=function(e){
        if (!(  e.keyCode==Keyboard.TAB || e.keyCode==Keyboard.SHIFT)) {
            e.stopPropagation();
        }
    }

    Key.blur=function() {
        if (_stage) {
            _stage.focus = null;
        }
    }
    
    element.setup();


    facilis.Key = facilis.promote(Key, "Container");
    
    
    facilis.Keyboard = {
        
        A :  65,
 	 	ALTERNATE :  18,
 	 	AUDIO :  0x01000017,
 	 	B :  66,
 	 	BACK :  0x01000016,
 	 	BACKQUOTE :  192,
 	 	BACKSLASH :  220,
 	 	BACKSPACE :  8,
 	 	BLUE :  0x01000003,
 	 	C :  67,
 	 	CAPS_LOCK :  20,
 	 	CHANNEL_DOWN :  0x01000005,
 	 	CHANNEL_UP :  0x01000004,
 	 	CharCodeStrings : Array,
 	 	COMMA :  188,
 	 	COMMAND :  15,
 	 	CONTROL :  17,
 	 	D :  68,
 	 	DELETE :  46,
 	 	DOWN :  40,
 	 	DVR :  0x01000019,
 	 	E :  69,
 	 	END :  35,
 	 	ENTER :  13,
 	 	EQUAL :  187,
 	 	ESCAPE :  27,
 	 	EXIT :  0x01000015,
 	 	F :  70,
 	 	F1 :  112,
 	 	F10 :  121,
 	 	F11 :  122,
 	 	F12 :  123,
 	 	F13 :  124,
 	 	F14 :  125,
 	 	F15 :  126,
 	 	F2 :  113,
 	 	F3 :  114,
 	 	F4 :  115,
 	 	F5 :  116,
 	 	F6 :  117,
 	 	F7 :  118,
 	 	F8 :  119,
 	 	F9 :  120,
 	 	FAST_FORWARD :  0x0100000A,
 	 	G :  71,
 	 	GREEN :  0x01000001,
 	 	GUIDE :  0x01000014,
 	 	H :  72,
 	 	HELP :  0x0100001D,
 	 	HOME :  36,
 	 	I :  73,
 	 	INFO :  0x01000013,
 	 	INPUT :  0x0100001B,
 	 	INSERT :  45,
 	 	J :  74,
 	 	K :  75,
 	 	KEYNAME_BEGIN :  "Begin",
 	 	KEYNAME_BREAK :  "Break",
 	 	KEYNAME_CLEARDISPLAY :  "ClrDsp",
 	 	KEYNAME_CLEARLINE :  "ClrLn",
 	 	KEYNAME_DELETE :  "Delete",
 	 	KEYNAME_DELETECHAR :  "DelChr",
 	 	KEYNAME_DELETELINE :  "DelLn",
 	 	KEYNAME_DOWNARROW :  "Down",
 	 	KEYNAME_END :  "End",
 	 	KEYNAME_EXECUTE :  "Exec",
 	 	KEYNAME_F1 :  "F1",
 	 	KEYNAME_F10 :  "F10",
 	 	KEYNAME_F11 :  "F11",
 	 	KEYNAME_F12 :  "F12",
 	 	KEYNAME_F13 :  "F13",
 	 	KEYNAME_F14 :  "F14",
 	 	KEYNAME_F15 :  "F15",
 	 	KEYNAME_F16 :  "F16",
 	 	KEYNAME_F17 :  "F17",
 	 	KEYNAME_F18 :  "F18",
 	 	KEYNAME_F19 :  "F19",
 	 	KEYNAME_F2 :  "F2",
 	 	KEYNAME_F20 :  "F20",
 	 	KEYNAME_F21 :  "F21",
 	 	KEYNAME_F22 :  "F22",
 	 	KEYNAME_F23 :  "F23",
 	 	KEYNAME_F24 :  "F24",
 	 	KEYNAME_F25 :  "F25",
 	 	KEYNAME_F26 :  "F26",
 	 	KEYNAME_F27 :  "F27",
 	 	KEYNAME_F28 :  "F28",
 	 	KEYNAME_F29 :  "F29",
 	 	KEYNAME_F3 :  "F3",
 	 	KEYNAME_F30 :  "F30",
 	 	KEYNAME_F31 :  "F31",
 	 	KEYNAME_F32 :  "F32",
 	 	KEYNAME_F33 :  "F33",
 	 	KEYNAME_F34 :  "F34",
 	 	KEYNAME_F35 :  "F35",
 	 	KEYNAME_F4 :  "F4",
 	 	KEYNAME_F5 :  "F5",
 	 	KEYNAME_F6 :  "F6",
 	 	KEYNAME_F7 :  "F7",
 	 	KEYNAME_F8 :  "F8",
 	 	KEYNAME_F9 :  "F9",
 	 	KEYNAME_FIND :  "Find",
 	 	KEYNAME_HELP :  "Help",
 	 	KEYNAME_HOME :  "Home",
 	 	KEYNAME_INSERT :  "Insert",
 	 	KEYNAME_INSERTCHAR :  "InsChr",
 	 	KEYNAME_INSERTLINE :  "InsLn",
 	 	KEYNAME_LEFTARROW :  "Left",
 	 	KEYNAME_MENU :  "Menu",
 	 	KEYNAME_MODESWITCH :  "ModeSw",
 	 	KEYNAME_NEXT :  "Next",
 	 	KEYNAME_PAGEDOWN :  "PgDn",
 	 	KEYNAME_PAGEUP :  "PgUp",
 	 	KEYNAME_PAUSE :  "Pause",
 	 	KEYNAME_PREV :  "Prev",
 	 	KEYNAME_PRINT :  "Print",
 	 	KEYNAME_PRINTSCREEN :  "PrntScrn",
 	 	KEYNAME_REDO :  "Redo",
 	 	KEYNAME_RESET :  "Reset",
 	 	KEYNAME_RIGHTARROW :  "Right",
 	 	KEYNAME_SCROLLLOCK :  "ScrlLck",
 	 	KEYNAME_SELECT :  "Select",
 	 	KEYNAME_STOP :  "Stop",
 	 	KEYNAME_SYSREQ :  "SysReq",
 	 	KEYNAME_SYSTEM :  "Sys",
 	 	KEYNAME_UNDO :  "Undo",
 	 	KEYNAME_UPARROW :  "Up",
 	 	KEYNAME_USER :  "User",
 	 	L :  76,
 	 	LAST :  0x01000011,
 	 	LEFT :  37,
 	 	LEFTBRACKET :  219,
 	 	LIVE :  0x01000010,
 	 	M :  77,
 	 	MASTER_SHELL :  0x0100001E,
 	 	MENU :  0x01000012,
 	 	MINUS :  189,
 	 	N :  78,
 	 	NEXT :  0x0100000E,
 	 	NUMBER_0 :  48,
 	 	NUMBER_1 :  49,
 	 	NUMBER_2 :  50,
 	 	NUMBER_3 :  51,
 	 	NUMBER_4 :  52,
 	 	NUMBER_5 :  53,
 	 	NUMBER_6 :  54,
 	 	NUMBER_7 :  55,
 	 	NUMBER_8 :  56,
 	 	NUMBER_9 :  57,
 	 	NUMPAD :  21,
 	 	NUMPAD_0 :  96,
 	 	NUMPAD_1 :  97,
 	 	NUMPAD_2 :  98,
 	 	NUMPAD_3 :  99,
 	 	NUMPAD_4 :  100,
 	 	NUMPAD_5 :  101,
 	 	NUMPAD_6 :  102,
 	 	NUMPAD_7 :  103,
 	 	NUMPAD_8 :  104,
 	 	NUMPAD_9 :  105,
 	 	NUMPAD_ADD :  107,
 	 	NUMPAD_DECIMAL :  110,
 	 	NUMPAD_DIVIDE :  111,
 	 	NUMPAD_ENTER :  108,
 	 	NUMPAD_MULTIPLY :  106,
 	 	NUMPAD_SUBTRACT :  109,
 	 	O :  79,
 	 	P :  80,
 	 	PAGE_DOWN :  34,
 	 	PAGE_UP :  33,
 	 	PAUSE :  0x01000008,
 	 	PERIOD :  190,
 	 	PLAY :  0x01000007,
 	 	PREVIOUS :  0x0100000F,
 	 	Q :  81,
 	 	QUOTE :  222,
 	 	R :  82,
 	 	RECORD :  0x01000006,
 	 	RED :  0x01000000,
 	 	REWIND :  0x0100000B,
 	 	RIGHT :  39,
 	 	RIGHTBRACKET :  221,
 	 	S :  83,
 	 	SEARCH :  0x0100001F,
 	 	SEMICOLON :  186,
 	 	SETUP :  0x0100001C,
 	 	SHIFT :  16,
 	 	SKIP_BACKWARD :  0x0100000D,
 	 	SKIP_FORWARD :  0x0100000C,
 	 	SLASH :  191,
 	 	SPACE :  32,
 	 	STOP :  0x01000009,
 	 	STRING_BEGIN :  "",
 	 	STRING_BREAK :  "",
 	 	STRING_CLEARDISPLAY :  "",
 	 	STRING_CLEARLINE :  "",
 	 	STRING_DELETE :  "",
 	 	STRING_DELETECHAR :  "",
 	 	STRING_DELETELINE :  "",
 	 	STRING_DOWNARROW :  "",
 	 	STRING_END :  "",
 	 	STRING_EXECUTE :  "",
 	 	STRING_F1 :  "",
 	 	STRING_F10 :  "",
 	 	STRING_F11 :  "",
 	 	STRING_F12 :  "",
 	 	STRING_F13 :  "",
 	 	STRING_F14 :  "",
 	 	STRING_F15 :  "",
 	 	STRING_F16 :  "",
 	 	STRING_F17 :  "",
 	 	STRING_F18 :  "",
 	 	STRING_F19 :  "",
 	 	STRING_F2 :  "",
 	 	STRING_F20 :  "",
 	 	STRING_F21 :  "",
 	 	STRING_F22 :  "",
 	 	STRING_F23 :  "",
 	 	STRING_F24 :  "",
 	 	STRING_F25 :  "",
 	 	STRING_F26 :  "",
 	 	STRING_F27 :  "",
 	 	STRING_F28 :  "",
 	 	STRING_F29 :  "",
 	 	STRING_F3 :  "",
 	 	STRING_F30 :  "",
 	 	STRING_F31 :  "",
 	 	STRING_F32 :  "",
 	 	STRING_F33 :  "",
 	 	STRING_F34 :  "",
 	 	STRING_F35 :  "",
 	 	STRING_F4 :  "",
 	 	STRING_F5 :  "",
 	 	STRING_F6 :  "",
 	 	STRING_F7 :  "",
 	 	STRING_F8 :  "",
 	 	STRING_F9 :  "",
 	 	STRING_FIND :  "",
 	 	STRING_HELP :  "",
 	 	STRING_HOME :  "",
 	 	STRING_INSERT :  "",
 	 	STRING_INSERTCHAR :  "",
 	 	STRING_INSERTLINE :  "",
 	 	STRING_LEFTARROW :  "",
 	 	STRING_MENU :  "",
 	 	STRING_MODESWITCH :  "",
 	 	STRING_NEXT :  "",
 	 	STRING_PAGEDOWN :  "",
 	 	STRING_PAGEUP :  "",
 	 	STRING_PAUSE :  "",
 	 	STRING_PREV :  "",
 	 	STRING_PRINT :  "",
 	 	STRING_PRINTSCREEN :  "",
 	 	STRING_REDO :  "",
 	 	STRING_RESET :  "",
 	 	STRING_RIGHTARROW :  "",
 	 	STRING_SCROLLLOCK :  "",
 	 	STRING_SELECT :  "",
 	 	STRING_STOP :  "",
 	 	STRING_SYSREQ :  "",
 	 	STRING_SYSTEM :  "",
 	 	STRING_UNDO :  "",
 	 	STRING_UPARROW :  "",
 	 	STRING_USER :  "",
 	 	SUBTITLE :  0x01000018,
 	 	T :  84,
 	 	TAB :  9,
 	 	U :  85,
 	 	UP :  38,
 	 	V :  86,
 	 	VOD :  0x0100001A,
 	 	W :  87,
 	 	X :  88,
 	 	Y :  89,
 	 	YELLOW :  0x01000002,
 	 	Z :  90
        
    
    }
    
}());