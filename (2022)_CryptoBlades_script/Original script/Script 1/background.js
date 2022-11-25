chrome.storage.sync.set({ "toggle" : 1 });
chrome.storage.sync.set({ "winId" : 0 });
chrome.storage.sync.set({ "accountNo" : 0 });
chrome.action.setBadgeText({text : "0"})

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    
    if (response === "Done") {
        chrome.storage.sync.get(["chain"], function(data) {
            if (data.chain == 1){
                chrome.tabs.update({url:"https://app.cryptoblades.io/#/combat?chain=OEC"})
            } else {
                chrome.tabs.update({url:"https://app.cryptoblades.io/#/combat?chain=HECO"})
            }
        })
    } else if (response === "Create tab"){
        var tab = sender.tab
        
        chrome.storage.sync.get(["chain"], function(data) {
            if (data.chain == 1){
                chrome.tabs.create({url:"https://app.cryptoblades.io/#/combat?chain=OEC", index: tab.index + 1})
            } else {
                chrome.tabs.create({url:"https://app.cryptoblades.io/#/combat?chain=HECO", index: tab.index + 1})
            }
        })
    } else if (response === "Tab index"){
        var tab = sender.tab
        chrome.tabs.query({currentWindow:true, url:"https://app.cryptoblades.io/*"}, function(tabq){
            chrome.storage.sync.get(["charNo"], function(data) {
                if (data.charNo < 4 && tabq.length < 4) {
                    console.log("New tab trigger with index: " + tab.index)
                    sendResponse("" + tab.index)
                } else {
                    console.log("Existing tab with index: " + tab.index)
                    sendResponse("" + (tab.index + 10))
                }
            });
        })
    } else if (response === "Check"){
        chrome.storage.sync.get(["charNo", "winId"], function(data) {
            if (data.winId === 0){
                chrome.storage.sync.set({ "charNo" : 0 });
                chrome.storage.sync.set({ "accountNo" : 0 });
                chrome.action.setBadgeText({text : "0"})
                console.log("winID not set")
                sendResponse("Idle")
            } else {
                try {
                    chrome.tabs.query({windowId:data.winId, url:"https://app.cryptoblades.io/*"}, function(tab){
                        if (tab.length > 1){
                            if (data.charNo <= 4 && tab.length < 4){
                                chrome.action.setBadgeText({text : "1"})                                
                            }
                            sendResponse("Sequence started")
                        } else {                            
                            console.log("Tabs length does not match")
                            console.log(tab)
                            chrome.storage.sync.set({ "charNo" : 0 });
                            chrome.action.setBadgeText({text : "0"})
                            sendResponse("Idle")
                        }
                    })
                } catch {                    
                    console.log("Failed to query from winId")
                    chrome.storage.sync.set({ "charNo" : 0 });
                    chrome.action.setBadgeText({text : "0"})
                    sendResponse("Idle")
                }
            }
        });
    } else if (response === "Set windowId") {
        chrome.tabs.query({currentWindow:true, active:true}, function(tab){
            chrome.storage.sync.set({ "winId" : tab[0].windowId });
        })
    } else if (response === "Char done"){
        chrome.storage.sync.get(["charNo"], function(data) {
            chrome.storage.sync.set({ "charNo" : data.charNo + 1 });
        });
    } else if (response === "Account check"){
        chrome.storage.sync.get(["charNo", "winId"], function(data) {
            console.log(data.charNo)
            let temp = data.charNo
            if (!(temp % 4 === 0) && temp > 4){
                temp = temp + (4 - (temp % 4))
                chrome.storage.sync.set({ "charNo" : temp });
            }
            if (temp % 4 === 0 && !(temp === 0)){
                chrome.tabs.query({windowId:data.winId, url:"https://app.cryptoblades.io/*"}, function(tab){
    
                    console.log(tab)
                    chrome.tabs.reload(tab[0].id)
                    chrome.tabs.reload(tab[1].id)
                    chrome.tabs.reload(tab[2].id)
                    chrome.tabs.reload(tab[3].id)
                    chrome.storage.sync.set({ "accountNo" : temp });
                    chrome.action.setBadgeText({text : ("" + ((temp/4) + 1))})

                })
            }
        });
    }else if (response === "AccountNo"){
        chrome.storage.sync.get(["accountNo", "winId"], function (data){
            chrome.tabs.query({windowId:data.winId, url:"https://app.cryptoblades.io/*"}, function(tab){
                console.log(data.accountNo)
                if (tab.length == 4){
                    sendResponse("" + (data.accountNo/4))
                } else {
                    sendResponse("0")
                }
            })
        });
    } else if (response === "Reset") {
        chrome.tabs.query({currentWindow:true, url:"https://app.cryptoblades.io/*"}, function(tabs){
            
            let tempId = []

            for (let tab in tabs){

                tempId.push(tabs[tab].id)

            }

            chrome.tabs.remove(tempId)

            chrome.storage.sync.get(["chain"], function(data) {
                if (data.chain == 1){
                    chrome.tabs.create({url:"https://app.cryptoblades.io/#/combat?chain=OEC", index: 0})
                } else {
                    chrome.tabs.create({url:"https://app.cryptoblades.io/#/combat?chain=HECO", index: 0})
                }
            })
            
        
        })
    } else if (response === "Refresh current") {
        var tab = sender.tab
        chrome.tabs.reload(tab.id)
    } else if (response === "New stam"){
        chrome.tabs.query({currentWindow:true, url:"https://app.cryptoblades.io/*"}, function(tabs){
            for (let tab in tabs) {
                chrome.tabs.reload(tabs[tab].id)
            }
        })
    }
    return true
    
})


