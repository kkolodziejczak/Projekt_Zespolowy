var request = require('request');
window.test = function (){
  request('https://edziekanat.zut.edu.pl/WU/PodzGodzin.aspx', function (error, response, body) {
    console.log('done');
    window.response = body;
  });
};

