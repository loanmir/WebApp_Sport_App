const button = document.querySelector("input[type=button]");
const text = document.querySelector("input[type=text]");
const lista = document.getElementById("anagrams");
button.addEventListener("click", async function(e) {
    lista.innerHTML = "";
    e.preventDefault();
    //const chars = text.value.split("");
    // console.log(chars);
    // console.log(chars.sort().join(""));
    //const res = [];
    //generate(chars.length, chars, res);
 
    /*res.forEach(r=>{
        let li = document.createElement("li");
        li.innerText = r;
        li.style.color = "red";
        lista.appendChild(li);
    });*/
    
    const response = await fetch("/api/anagrammi", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({word: text.value})
    });
    const result = await response.json()


    result.anagrammi.forEach(r => {
        let li = document.createElement("li");
        li.innerText = r;
        li.style.color = "red";
        lista.appendChild(li);
    });
    
}, false);



// This last part was moved to app.js!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



/*function swap(chars, i, j) {
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
}*/