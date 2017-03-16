/**
 * @author Ahmet Ozan Tekin
 *               16.03.2017
 * ahmetozantekin@gmail.com
 */

var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){
    url = 'http://www.imdb.com/chart/top';
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html, {});
            var top250 = [];
            var _name, 
                _year, 
                _poster, 
                _rank;
             $('.seen-collection').filter(function(){
                var tableRow = $(this).find('.lister-list').find('tr');
                var i = 0;
                tableRow.each(function(){
                    var self = $(this);
                    i += 1;
                    var _poster = self.find('.posterColumn').find('a').find('img').attr('src');
                    var _name   = self.find('.titleColumn').find('a').text().trim();
                    var _year   = self.find('.titleColumn').find('.secondaryInfo').text().split(')')[0].split('(')[1].trim();
                    var _rank   = self.find('.ratingColumn').find('strong').text();
            
                    var data= {
                        index   :  i     , 
                        name    : _name ,
                        year   : _year  ,
                        rating   : _rank ,
                        poster : _poster   
                    };
                    top250.push(data);
                })
            })
            res.json(top250);
        }
        fs.writeFile('imdb-top250.json', JSON.stringify(top250, null, 4), function(err){
            console.log('create imdb-top250.json');
        })
    })
})
app.listen(81)
console.log(':81 sendeyiz beybi.');
exports = module.exports = app;