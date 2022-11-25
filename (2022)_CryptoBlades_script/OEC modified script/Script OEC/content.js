console.log("Script start");
chainSet()
chrome.storage.sync.get("stam", getInfo);

function chainSet() {
    selectSet(document.getElementById("select-network"), "heco")
    console.log("Chain Changed");
}


function getInfo(data){
    let stam = data.stam
    let btnInject = document.getElementsByClassName("col-auto");
    let temp = btnInject[0].innerHTML
    btnInject[0].innerHTML = "<button class=\"btn btn-sm btn-info\" style=\"margin-right: 3px !important;\" type=\"button\" id=\"loaded\">Finished loading</button>" + temp
    document.getElementById("loaded").addEventListener("click", function() {
        let info = ""
        var popUpObserver = new MutationObserver(callback1);
        var resultObserver = new MutationObserver(callback2);
        var config = {childList: true, attributes: true}
        var sim = document.getElementsByClassName("btn btn-warning btn-sm mb-1");
        console.log(sim)
        let char = document.getElementById("combat-character");
        let weap = document.getElementById("combat-weapon");
        console.log(char)
        console.log(weap)
        let stamina = document.getElementById("combat-stamina");
        let result = document.getElementById("combat-result");
        var runOnce = true;
        var i = -1
        var j = 0;
        var noChar = 1;
        
        loop()
        
        function loop() {
            i++
            if (i < sim.length){
                loop1()
            } else {
                chrome.storage.sync.set({ "info" : info });
                alert("All accounts have been collected.")
                chrome.runtime.sendMessage("Done")
            }
                j = 0  
            }
            
        function loop1() {
                runOnce = true;
                console.log("Current account is " + i)
                sim[i].click()
                popUpObserver.observe(document.getElementById("modal-combat"), config)
        }
        
        function callback1(mutationsList) {         
            if (runOnce) {
                if (mutationsList[0].type === 'attributes') {
                    noChar = char.length-1
                    char.selectedIndex = j+1
                    weap.selectedIndex = 1
                    selectSet(stamina, stam)
                    document.getElementById("btn-simulate").click()
                    
                    resultObserver.observe(result, config)
                }                            
            }
        }
        
        function callback2(mutationsList) {
            if (runOnce) {
                if (mutationsList[0].type === "childList"){
                    let temp = result.getElementsByTagName("span")
        
                    setTimeout(() => {
                        temp = result.getElementsByTagName("span")
                    }, 2000);
        
                    let rank = [4]
                    
                    console.log(temp);
                    
                    for(let x = 0; x < 4; x++) {
                        rank[x] = parseFloat(temp[x].innerHTML.substring(0,temp[x].innerHTML.length-1));
                    }
                    
                    console.log(rank);
                    console.log(Math.max(...rank));
                    console.log(j);
        
                    if (j == 0) {
                        info = info + "|" + rank.indexOf(Math.max(...rank))
                    } else {
                        info = info + "," + rank.indexOf(Math.max(...rank))
                    }
                    
                    console.log(info)
                    document.getElementsByClassName("modal-dialog modal-dialog-centered modal-lg")[0].getElementsByClassName("btn-close")[0].click()
        
                    j++
                    runOnce = false;

                    if (j < noChar){
                        loop1()
                    } else {
                        loop()
                    }
                }        
            }
        }
    })

}

function selectSet(elt, val) {

    if (!(elt.options[document.getElementById("select-network").selectedIndex].value == val)){
        for (let i = 0; i < elt.length; i++) {
            if (elt.options[i].value == val){
                elt.selectedIndex = i;
            }
        }
    }

}
