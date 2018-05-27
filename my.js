const firestore = firebase.firestore();
  const settings = {/* your settings... */ timestampsInSnapshots: true};
  firestore.settings(settings);

function myclick() {
var pelem = document.getElementById("myid")
pelem.innerHTML = "Hello Alex";
pelem.style = "background: white;";
}

function pay() {
    let data = Object()
    data.customerId = document.getElementById("customer-id").value
    data.amount = document.getElementById("amount").value
    data.currency = document.getElementById("currency").value
    if(data.customerId=="" || data.amount=="") {
        alert("customer id and amount cannot be empty!")
        return;
    }
    data.date = new Date()
    console.log(data)
    let db = firebase.firestore()
    let docId = Number(new Date()).toString();
    //alert(docId)
    let doc = db.collection("payments").doc(docId)
    doc.set(data).then(function(doc) {
        //alert("payment updated successfully!")
        document.getElementById("customer-id").value = ""
        document.getElementById("amount").value = ""
        document.getElementById("currency").selectedIndex = 0;
        listTodayPayments()
    }).catch(function(error) {
        alert("payment error: "+error.message);
    })
}

function listTodayPayments() {
    //alert("today")
    let listElem = document.getElementById("payment-list")
    listElem.style = "display: block;"
    let db = firebase.firestore()
    let paymentColl = db.collection("payments")
    let todayBegin = new Date()
    todayBegin.setHours(0, 0, 0, 0)     // last midnight
    let todayEnd = new Date()
    todayEnd.setHours(24, 0, 0, 0)    // next midnight
    let query = paymentColl.where("date", ">", todayBegin).where("date", "<", todayEnd)
    query.get().then(function(snapshots) {
        // get all payments met the conditions and store then in an array paymentArray
        var paymentArray = snapshots.docs.map(function (docSnapshot) {
            return docSnapshot;
        });

        let listParent = document.getElementById("payment-list")
        listParent.innerHTML = `
            <div style="font-weight: bold;" class="list-container">
                <label class="list-customer-id">Customer Id</label>
                <label class="list-payment">Payemnt</label>
                <label class="list-date">Date</label>
            </div>
        `
        // loop through each payment object (json data) from
        // paymentArray 
        paymentArray.forEach( paymentDoc => {
            let paymentData = paymentDoc.data()
            console.log(paymentDoc.id+"=> "+JSON.stringify(paymentData))
            let date = new Date(paymentData.date.seconds*1000);
            let dateStr = date.toLocaleDateString()
            let timeStr = date.toLocaleTimeString()
            
            let payHtml = `
                <div class="list-container">
                    <label class="list-customer-id">${paymentData.customerId}</label>
                    <label class="list-payment">${paymentData.currency.toUpperCase()} $${paymentData.amount}</label>
                    <label class="list-date">${dateStr} ${timeStr}</label>
                </div>
            `
            listParent.insertAdjacentHTML("beforeend", payHtml)
        })
        
    })
}