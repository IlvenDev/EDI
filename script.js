function createTable(data){
    let table = document.getElementById("tab");

    for (let i = 0; i<data.length; i++){
        let row = document.createElement("tr");

        for(x in data[i]) {
            let value = document.createElement("td");
            let textValue = document.createTextNode(data[i][x]);
            value.appendChild(textValue);
            row.appendChild(value);
        }
        table.appendChild(row);
    }
}

function heading(data){
    let header = document.getElementById("header");

    for(name in data[0]) { //name = nazwa kolumny 
        let node = document.createElement("th");
        let textnode = document.createTextNode(name);
        node.appendChild(textnode);
        header.appendChild(node);
    }
}

function onlyUnique(value, index, self){   //funkcja zwracajaca nowe tabele w ktorej sa tylko wartosci unikalne z tabeli zrodlowej
    return self.indexOf(value) === index;
}


function graphElement(data, element){ //funkcja zwraca tablice 2d z wartoscia kolumny i iloscia jej wystepowan
    var results = [];    //element - kolumna z ktorej bedziemy pobierac dane
    var elements = [];

    for (let i = 0; i<data.length; i++){
        elements.push(data[i][element]);
    }
    var unique = elements.filter(onlyUnique); //unikalne wartosci w kolumnie
    var count = [];

    for (let i = 0; i<unique.length; i++){ //zliczanie wartosci
        var counter = 0;
        for (let j = 0; j<elements.length; j++){
            if(unique[i]==elements[j]){
                counter++;
            }
        }
        count.push(counter);
    }

    for(let i= 0; i<unique.length; i++){ //umieszczenie wartosci z kolumny i ilosc jej powtorzen w tabeli by umiescic je w glownej tabeli dwuwymiarowej
        temp = [unique[i], count[i]];
        results.push(temp);
    }
    results.sort(function (a, b) { //sortowanie wynikow
        return b[1] - a[1];
      });
    return(results);
}



var sportOptions = { //opcje wykresu
    title:"Most popular sports in data", 
    width: '90%',
    height: 600,
    backgroundColor: '#F0F0F0',
    titleTextStyle: {color: '#242424'},
    legendTextStyle: {color: '#242424'},
    hAxis: {color: '#242424'},
    pieHole: 0.4, //tworzy wykres typu donut
    legend:'left' // tworzy legende po lewej stronie
};

var countryOptions = {
    title:"Most common countries in data",
    width: '90%',
    height:600,
    backgroundColor: '#F0F0F0',
    titleTextStyle: {color: '#242424'},
    hAxis: {
        textStyle:{color: '#242424'}
    },
    vAxis: {color: '#242424', textStyle:{color: '#242424'} ,minValue: 0, maxValue: 100}, //min i max wartosc wykresu
    colors: ['#242424'],
    legend: {position: 'none'}, //brak legendy
    explorer: { //przyblizanie wykresu
        maxZoomOut:1,
        keepInBounds: true
    }   
};

google.charts.load('current', {'packages':['corechart']}); //wczytuje framework charts
var myData = 0;
var request = new XMLHttpRequest(); 
request.open("GET", "https://my.api.mockaroo.com/schema1.json?key=c331c250", true); 
request.onload = function() {    //funkcja uruchamiana po wykonaniu requestu get
    myData = JSON.parse(request.responseText);   //wczytanie danych z JSON do zmiennej
    let loading = document.getElementById("loading");
    loading.parentNode.removeChild(loading);  //usuniecie placeholdera
    heading(myData); //utworzenie kolumn
    createTable(myData); //utworzenie tabeli z danych
    PieChart("sport", graphElement(myData, "type of sport"), 'sport', sportOptions);        
    ColumnChart("country", graphElement(myData, "country"), 'country', countryOptions);   
};
request.send();

function PieChart(element, input, column, option) { //element = kolumna z ktorej pobieramy dane do wykresu, input = dane do wykresu, 
    var data = new google.visualization.DataTable();    //column = nazwa kolumny na wykresie, option - opcje wykresu
    data.addColumn('string', column);
    data.addColumn('number', 'Amount');
    data.addRows(input);
    var chart = new google.visualization.PieChart(document.getElementById(element));
    chart.draw(data, option);
}

function ColumnChart(element, input, column, option) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', column);
    data.addColumn('number', 'Amount');
    data.addRows(input);
    var chart = new google.visualization.ColumnChart(document.getElementById(element));
    chart.draw(data, option);
}
