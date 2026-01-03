const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.json())

// Default route for the home page
/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'anagramma.html'));
});*/

app.post("/api/anagrammi", (req, res) => {
    const chars = req.body.word.split("");
    const result = [];
    generate(chars.length, chars, result);
    res.json({anagrammi: result})
})


function swap(chars, i, j) {
    var tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
}

// Heap's algorithm https://en.wikipedia.org/wiki/Heap's_algorithm
function generate(k, chars, res){
    if(k === 1){
        res.push(chars.join(""));
        return;
    }

    generate(k-1, chars, res);

    for(let i=0; i<k-1; i++){
        if(k%2===0){
            swap(chars, i, k-1);
        } else {
            swap(chars, 0, k-1);
        }
        generate(k-1, chars, res);
    }
}


// Start the server
app.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});



/*const http = require('http');
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Default route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'anagramma.html'));
});

// Start the server
app.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});*/


/*http.createServer(async (req, res) => {
  let path = '';
  if (req.url == "/anagramma.js"){
    path = req.url;
  } else if( req.url == "/"){
    path = '/anagramma.html';
    console.log("path", path);
  }

  try{
    let data = await fs.readFile(`.${path}`);
    res.write(data)
  } catch{
    res.writeHead(404);
  }
  
  res.end();
}).listen(8080);*/