var baseUrl = 'https://api-central-hom.unicesumar.edu.br/';
var tokenAccess = 'Basic TVVORE9fQVpVTDplbXRlcnJhZGVzYWNpcXVlbXRlbTFvbGhvZXJlaUB1bmljZXN1bWFyLmVkdS5icg==';

var div = document.createElement('div');
div.id = "div-dev";
div.innerHTML = "<div style='position:absolute;top:0px;width:250px;height:40px;z-index:99999;background-color:red;text-align:center;color:#FFF;font-size:25px'>BACK-END DE TESTE</div>";
document.querySelector("body").append(div);

setTimeout(function () {
    document.querySelector("#div-dev").remove();
}, 5000);