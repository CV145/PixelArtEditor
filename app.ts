//The Canvas
const scale = 10;

class PictureCanvas {

    //PictureCanvas requires a picture and a pointerDown event
    constructor(picture, pointerDown) {

        //Adding new element canvas with onmousedown and ontouchstart events
        this.dom = elt("canvas",
            {
                onmousedown: event => this.mouse(event, pointerDown),
                ontouchstart: event => this.touch(event.pointerDown)
            });
        this.syncState(picture);
    }
    syncState(picture) {
        if (this.picture == picture) return;
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
    }
}

//Each pixel is drawn by scale * scale (10x10) square
function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");


    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            cx.fillStyle = picture.getPixelAt(x, y);
            cx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}


PictureCanvas.prototype.mouse = function (downEvent, onDown) {
    if (downEvent.button != 0) return;
    let pos = pointerPosition(downEvent, this.dom);
    let onMove = onDown(pos);
    if (!onMove) return;
    let move = moveEvent => {
        if (moveEvent.buttons == 0) {
            this.dom.removeEventListener("mousemove", move);
        } else {
            let newPos = pointerPosition(moveEvent, this.dom);
            if (newPos.x == pos.x && newPos.y == pos.y) return;
            pos = newPos;
            onMove(newPos);
        }
    };
    this.dom.addEventListener("mousemove", move);
};



function pointerPosition(pos, domNode) {
    let rect = domNode.getBoundingClientRect();
    return {
        x: Math.floor((pos.clientX - rect.left) / scale),
        y: Math.floor((pos.clientY - rect.top) / scale)
    };
}

//overwrite properties of previous state
function updateState(state, action) {
    return Object.assign({}, state, action);
}

//DOM building
//function takes in a html type, props, and the elements of an array called children
function elt(type, props, ...children) {
    //we create a new element based on the given type
    let dom = document.createElement(type);

    //if props, assign props to element
    if (props) Object.assign(dom, props);

    //the children are appended to the element as text
    for (let child of children) {
        if (typeof child != "string") dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;

    /*
    Allows following style of registering event handlers:

<body>
    <script>
    document.body.appendChild(elt(
        "button", 
        {
    onclick: () => console.log("click")
    }, 
    "The button"));
    </script>
</body>



    */
}

class Picture {
    constructor(width, height, pixels) {
        this.width = width;
        this.height = height;
        this.pixels = pixels;
    }

    static empty(width, height, color) {
        //Array() creates an empty array of given length, filled with given color
        let pixels = new Array(width * height).fill(color);

        //replace old pic with new fill
        return new Picture(width, height, pixels);
    }

    ///Return pixel location in pixels array
    getPixelAt(x, y) {
        return this.pixels[x + y * this, width];
    }

    //Update several pixels at once (implies pixels are an array)
    draw(pixels) {
        //copy the given pixels array using slice()
        let copy = this.pixels.slice();
        for (let { x, y, color } of pixels) {
            copy[x + y * this.width] = color;
        }
        return new Picture(this.width, this.height, copy);
    }
}

/*
Pixels are stored in 1D array (row by row from top to bottom)
*/