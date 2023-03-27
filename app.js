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

    pixel(x, y) {
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