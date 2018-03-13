import * as buttonFunctions from './modules/buttonFunctions';

//bind functions to menu

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = buttonFunctions.switchLayer;
}
//bind buttons to functions
document.getElementById("addWMS").addEventListener("click", buttonFunctions.addWMS);
document.getElementById("addWMTS").addEventListener("click", buttonFunctions.addWMTS);
document.getElementById("findMyHse").addEventListener("click", buttonFunctions.findMyHouse);
document.getElementById("addThirdPartyLr").addEventListener("click", 
buttonFunctions.addThirdPartyLayer);





