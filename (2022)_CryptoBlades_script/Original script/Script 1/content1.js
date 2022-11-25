var options = document.getElementsByClassName("navbar-nav view-links")
var empty = options[0].innerHTML
var temp = "<li data-v-12933098 class=\"top-nav-links\"> <button class=\"link-text\" type=\"button\" id=\"reset\"> Reset </button> </li>" + options[0].innerHTML 
var pageObserver = new MutationObserver(start)
var info = []
var stam = 0
var account = 0
var index = 0
options[0].innerHTML = "<li data-v-12933098 class=\"top-nav-links\"> <button class=\"link-text\" type=\"button\" id=\"tracker\"> Tracker </button> <button class=\"link-text\" type=\"button\" id=\"lowest\"> Lowest XP </button> <button class=\"link-text\" type=\"button\" id=\"reset\"> Reset </button> </li>" + options[0].innerHTML

chrome.storage.sync.get(["toggle"], function(data){
    if (data.toggle == 0){
        options[0].innerHTML = empty
    } else {
        chrome.storage.sync.get(["stam", "info"], getData);
    }
})

function getData (data){
    stam = data.stam
    console.log(data)
    console.log(data.info)

    if (localStorage.getItem("fightMultiplier") != stam){
        localStorage.setItem("fightMultiplier", stam)
        chrome.runtime.sendMessage("Refresh current") 
    }

    var temp1 = data.info.split("|")
    
    for (let i = 1; i < temp1.length; i++){
        info.push(temp1[i].split(","))
    }
    
    console.log(info)
    
}

chrome.runtime.sendMessage("Tab index", function(response){
    if (parseInt(response) > 3){
        index = response - 10
    } else {
        index = response
    }
})

chrome.runtime.sendMessage("AccountNo", function(response){
    if (response > 0){
        account = response
    }
})


chrome.runtime.sendMessage("Check", function(response){
    if (response === "Sequence started") {
        console.log("started")
        try {
            chrome.storage.local.get(["type"], function (data) {
                if (data.type === "tracker"){
                    if (document.getElementsByTagName("h5")[0].innerHTML === "ADVENTURE" && document.getElementsByClassName("character").length >= info[account].length + 1 && document.getElementsByClassName("isMobile label-title")[0].innerHTML === "Step 1: Select stamina usage"){
                    
                        document.getElementById("tracker").click()
                        console.log("Tracker clicked")
                        
                    }
                } else {
                    console.log(parseInt(index) + 1)
                    console.log(document.getElementsByClassName("character"))
                    if (document.getElementsByClassName("character").length >= (parseInt(index))) {
                        console.log("Character length matches")
                    }
                    if (document.getElementsByTagName("h5")[0].innerHTML === "ADVENTURE" && document.getElementsByClassName("character").length >= (parseInt(index)) && document.getElementsByClassName("isMobile label-title")[0].innerHTML === "Step 1: Select stamina usage"){
                    
                        document.getElementById("lowest").click()
                        console.log("Lowest xp clicked")

                    }
                }
            })
            console.log("Page observer called nominally")
            pageObserver.observe(document.getElementsByClassName("app")[0], {childList: true, attributes: true, subtree: true})
        } catch {
            console.log("Page observer called due to error")
            pageObserver.observe(document.getElementsByClassName("app")[0], {childList: true, attributes: true, subtree: true})
        }
    } else {
        console.log("idle")
        chrome.runtime.sendMessage("Set windowId")    
    }
})


function start(mutationsList){
    for (let i = 0; i < mutationsList.length; i++){
        if (mutationsList[i].type === 'childList' || mutationsList[i].type === 'subtree'){
            try {
                chrome.storage.local.get(["type"], function (data) {
                    if (data.type === "tracker"){
                        if (document.getElementsByTagName("h5")[0].innerHTML === "ADVENTURE" && document.getElementsByClassName("character").length >= info[account].length + 1 && document.getElementsByClassName("isMobile label-title")[0].innerHTML === "Step 1: Select stamina usage"){
                        
                            document.getElementById("tracker").click()
                            console.log("Tracker clicked")
                            i = mutationsList.length

                        }
                    } else {
                        if (document.getElementsByTagName("h5")[0].innerHTML === "ADVENTURE" && document.getElementsByClassName("character").length >= (parseInt(index)) && document.getElementsByClassName("isMobile label-title")[0].innerHTML === "Step 1: Select stamina usage"){
                        
                            document.getElementById("lowest").click()
                            console.log("Lowest xp clicked")
                            i = mutationsList.length

                        }
                    }
                })
            } catch {
                console.log("Attempting tracker click again")
            }
        }
    }
}


document.getElementById("reset").addEventListener("click", function() {
    chrome.runtime.sendMessage("Reset")
})


document.getElementById("tracker").addEventListener("click", function() {
    
    chrome.storage.local.set({ "type" : "tracker" })

    pageObserver.disconnect()
    var nameObserver = new MutationObserver(trigger1)
    var weapObserver = new MutationObserver(trigger2)
    var enemyObserver = new MutationObserver(trigger3)
    var appObserver = new MutationObserver(trigger4)
    var name = ""
    var runOnce = true
    options[0].innerHTML = temp
    chrome.runtime.sendMessage("Tab index", function(response){
        if (parseInt(response) < 3){
            chrome.storage.sync.get(["charNo"], function(data){
                if (data.charNo < 4) {
                    console.log("Tab is created with response of : " + parseInt(response))
                    chrome.runtime.sendMessage("Create tab")
                }
            })
        }
        
        tracker()
    })
    
    function tracker(){

        if (index > 0){
            try {
                document.getElementsByClassName("character")[parseInt(index) - 1 ].click()
                console.log(index)
            }catch {
                tracker()
            }
        }

        try{
            document.getElementsByClassName("mt-3 custom-select")[0].selectedIndex = stam
            //document.getElementsByClassName("ml-3 ct-btn ml-2")[0].click()
    
            nameObserver.observe(document.getElementsByClassName("row character-full-list")[0], {childList: true, attributes: true, subtree: true})
            document.getElementsByClassName("animation weapon-animation-applied-0")[0].click()
            appObserver.observe(document.getElementsByClassName("app")[0], {childList: true, attributes: true, subtree: true})
            weapObserver.observe(document.getElementsByClassName("weapon-grid")[0], {childList: true, attributes: true})
        } catch {
            tracker()
        }
        
    }
    
    
    function trigger1(mutationsList){
        
        for (let i = 0; i < mutationsList.length; i++){
            
            if (mutationsList[i].type === 'childList' || mutationsList[i].type === 'subtree') {
                
                if (!(document.getElementsByClassName("name-list")[0].innerHTML === name) && document.getElementsByClassName("character").length >= info[account].length + 1 && document.getElementsByClassName("isMobile label-title")[0].innerHTML === "Step 1: Select stamina usage" &&  name != ""){
                    chrome.runtime.sendMessage("Account check")
                    console.log("Account checked")
                }
                
            }
            
        }
        
    }
    
    function trigger2(mutationsList){
        if (mutationsList[0].type === 'childList') {
            document.getElementsByClassName("animation weapon-animation-applied-0")[0].click()
            appObserver.observe(document.getElementsByClassName("app")[0], {childList: true, attributes: true, subtree: true})
        }
    }

    function trigger3(mutationsList){
        appObserver.disconnect()
        if (runOnce){

            for (let i = 0; i < mutationsList.length; i++){
                
                if (mutationsList[i].type === 'subtree' || mutationsList[i].type === 'childList') {
                    document.getElementsByClassName("enemy-character")[info[account][index]].click()
                    let tempa = document.getElementsByClassName("enemy-character")
                    let tempb = tempa[info[account][index]].getElementsByClassName("encounter-power pt-2")[0].innerHTML
                    console.log(tempb)
                    name = document.getElementsByClassName("name-list")[0].innerHTML
                    i = mutationsList.length
                    runOnce = false
                    chrome.runtime.sendMessage("Char done")
                    console.log("Char done message successfully sent")
                    document.getElementById("reset").addEventListener("click", function() {
                        chrome.runtime.sendMessage("Reset")
                    })
                    
                    
                }
            }
            
        }
        
    }
    
    function trigger4(mutationsList){

        for (let i = 0; i < mutationsList.length; i++){

            if (mutationsList[i].type === 'subtree' || mutationsList[i].type === 'childList') {
                enemyObserver.observe(document.getElementsByClassName("combat-enemy-container")[0], {childList: true, attributes: true, subtree: true})              
                i = mutationsList.length
            }
            
        }
        
    }

})

document.getElementById("lowest").addEventListener("click", function() {
    
    chrome.storage.local.set({ "type" : "lowest" })
    pageObserver.disconnect()
    
    var nameObserver = new MutationObserver(trigger1)
    var weapObserver = new MutationObserver(trigger2)
    var enemyObserver = new MutationObserver(trigger3)
    var appObserver = new MutationObserver(trigger4)
    var name = ""
    var runOnce = true

    options[0].innerHTML = temp
    chrome.runtime.sendMessage("Tab index", function(response){
        if (parseInt(response) < 3){
            chrome.storage.sync.get(["charNo"], function(data){
                if (data.charNo < 4) {
                    console.log("Tab is created with response of : " + parseInt(response))
                    chrome.runtime.sendMessage("Create tab")
                }
            })
        }
        
        tracker()
    })
    

    function tracker(){
        
        if (index > 0){
            try {
                document.getElementsByClassName("character")[parseInt(index) - 1].click()
                console.log(index)
            }catch {
                tracker()
            }
        }
        
        try{
            
            //stamSelect = document.getElementsByClassName("mt-3 custom-select")[0]
            //stamSelect.click()
            //stamSelect.getElementsByTagName("option")[stam].click()
            
            //document.getElementsByClassName("mt-3 custom-select")[0].selectedIndex = stam
            //document.getElementsByClassName("ml-3 ct-btn ml-2")[0].click()
            
            nameObserver.observe(document.getElementsByClassName("row character-full-list")[0], {childList: true, attributes: true, subtree: true})
            document.getElementsByClassName("animation weapon-animation-applied-0")[0].click()
            //document.getElementsByClassName("mt-3 custom-select")[0].selectedIndex = stam
            appObserver.observe(document.getElementsByClassName("app")[0], {childList: true, attributes: true, subtree: true})
            weapObserver.observe(document.getElementsByClassName("weapon-grid")[0], {childList: true, attributes: true})
        } catch {
            tracker()
        }
        
    }
    
    
    function trigger1(mutationsList){

        for (let i = 0; i < mutationsList.length; i++){
            
            if (mutationsList[i].type === 'childList' || mutationsList[i].type === 'subtree') {
                
                if (!(document.getElementsByClassName("name-list")[0].innerHTML === name) && document.getElementsByClassName("character").length >= (parseInt(index)) && document.getElementsByClassName("isMobile label-title")[0].innerHTML === "Step 1: Select stamina usage" && name != ""){
                    chrome.runtime.sendMessage("Account check")
                    console.log("Account checked")
                }
                
            }
            
        }
        
    }
    
    function trigger2(mutationsList){
        if (mutationsList[0].type === 'childList') {
            document.getElementsByClassName("animation weapon-animation-applied-0")[0].click()
            appObserver.observe(document.getElementsByClassName("app")[0], {childList: true, attributes: true, subtree: true})
        }
    }

    function trigger3(mutationsList){
        appObserver.disconnect()
        if (runOnce){

            for (let i = 0; i < mutationsList.length; i++){
                
                if (mutationsList[i].type === 'subtree' || mutationsList[i].type === 'childList') {

                    let xp = document.getElementsByClassName("xp-gain")
                    let xpArray = []

                    for (let i = 0; i < xp.length; i++){
                        console.log(xp[i].innerHTML.split(" ")[1].substring(1))
                        xpArray.push(xp[i].innerHTML.split(" ")[1].substring(1))
                        console.log(xpArray)
                    }

                    let chance = document.getElementsByClassName("chance-winning")
                    let ChanceStr = [" VERY LIKELY VICTORY ", " LIKELY VICTORY ", " POSSIBLE VICTORY ", " UNLIKELY VICTORY "]
                    let xpIndex = []

                    for (let i = 0; i < 4; i++){
                        for (let j = 0; j < chance.length; j++){
                            if (chance[j].innerHTML === ChanceStr[i]){
                                xpIndex.push(j)
                            }
                        }
                        if (xpIndex.length > 0){
                            i = 4
                        }
                    }

                    console.log(xpIndex)

                    

                    for (let i = 0; i < xpArray.length; i++){
                        for (let j = 0; j < xpIndex.length; j++){
                            if (!(i == xpIndex[j])){
                                xpArray[i] = 99999
                                j = xpIndex.length
                            } else {
                                j = xpIndex.length
                                xpIndex.shift()
                            }
                        }
                    }

                    console.log(xpArray)

                    console.log(Math.min(...xpArray))
                    console.log(xpArray.indexOf("" + Math.min(...xpArray)))

                    document.getElementsByClassName("enemy-character")[xpArray.indexOf("" + Math.min(...xpArray))].click()
                    let tempa = document.getElementsByClassName("enemy-character")
                    let tempb = tempa[xpArray.indexOf("" + Math.min(...xpArray))].getElementsByClassName("encounter-power pt-2")[0].innerHTML
                    console.log(tempb)
                    name = document.getElementsByClassName("name-list")[0].innerHTML
                    i = mutationsList.length
                    runOnce = false
                    chrome.runtime.sendMessage("Char done")
                    console.log("Char done message successfully sent")
                    document.getElementById("reset").addEventListener("click", function() {
                        chrome.runtime.sendMessage("Reset")
                    })                    

                }
            }
            
        }
        
    }
    
    function trigger4(mutationsList){

        for (let i = 0; i < mutationsList.length; i++){

            if (mutationsList[i].type === 'subtree' || mutationsList[i].type === 'childList') {
                enemyObserver.observe(document.getElementsByClassName("combat-enemy-container")[0], {childList: true, attributes: true, subtree: true})              
                i = mutationsList.length
            }

        }

    }

})