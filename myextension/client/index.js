var csInterface = new CSInterface();

var button1 = document.querySelector("#button-1");
button1.addEventListener("click", processBtn1);

function processBtn1() {
    csInterface.evalScript('functionA()', function (result) {
        // alert(result);
    });
}

var button2 = document.querySelector("#button-2");
button2.addEventListener("click", processBtn2);

function processBtn2() {
    csInterface.evalScript('functionB()', function (result) {
        document.querySelector('#txtResult').value = result;
        // alert(result);
    });
}