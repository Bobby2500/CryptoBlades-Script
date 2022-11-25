var stam = document.getElementById("stam")
var resetBtn = document.getElementById("reset")
var saveBtn = document.getElementById("save")
var account = document.getElementById("act")
var toggle = document.getElementById("toggle")
var chain = document.getElementById("chain")
var prevStam

chrome.storage.sync.get(["stam"], function(data){
    console.log(data.stam)
    stam.selectedIndex = (data.stam)
    prevStam = data.stam
})

chrome.storage.sync.get(["accountNo", "toggle", "chain"], function(data){
    console.log(data.accountNo)
    account.value = ((data.accountNo/4) + 1)
    console.log(data.toggle)
    if (data.toggle == 1) {
        toggle.checked = true;
    } else {
        toggle.checked = false;
    }
    if (data.chain == 1) {
        chain.checked = true;
    } else {
        chain.checked = false;
    }
})
toggle.addEventListener('change', function(){
    if (toggle.checked){
        chrome.storage.sync.set({ "toggle" : 1 })
    } else {
        chrome.storage.sync.set({ "toggle" : 0 })
    }
})
chain.addEventListener('change', function(){
    if (chain.checked){
        chrome.storage.sync.set({ "chain" : 1 })
    } else {
        chrome.storage.sync.set({ "chain" : 0 })
    }
})

function save() {
    let stamBool = false
    let actBool = false
    if( stam.value >= 1 && stam.value <= 5){
        console.log("Stam value : " + stam.value);
        stamBool = true
    } else {
        alert("Please select a valid stamina")
    }
    if (account.value > 0) {
        console.log("Account value : " + account.value)
        actBool = true
    } else {
        alert("Please enter a valid account number")
    }
    if (stamBool && actBool) {
        chrome.storage.sync.set({ "stam" : stam.value });
        chrome.storage.sync.set({ "accountNo" : ((account.value - 1) * 4) })
        chrome.action.setBadgeText({text : ("" + account.value)})

        if (prevStam != stam.value){
            chrome.runtime.sendMessage("New stam")
        }

        alert("Stamina saved as : " + parseInt(stam.value) * 40 + " Stamina (x" + stam.value + ")\nCurrent account : " + (account.value))
    }
}

resetBtn.addEventListener("click", function (){
    chrome.runtime.sendMessage("Reset")
});

saveBtn.addEventListener("click", save);
