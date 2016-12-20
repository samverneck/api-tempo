/* HG Weather 0.1 - Copyright (c) 2016 by Hugo Demiglio (http://hgbrasil.com/weather)

Dependencies:
jQuery >= 1.7

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

var HGWeather = (function() {
  'use strict';

  var accessible_data, api_endpoint, version;

  accessible_data = ['temp', 'description', 'date', 'time', 'city', 'humidity', 'wind_speedy', 'sunrise', 'sunset'];
  api_endpoint = 'http://api.hgbrasil.com/weather';
  version = '0.1';

  function initialize() {
    $('.hg-weather').each(function() {
      var current_tag = $(this);

      if(current_tag.attr('data-key') == 'development') {
        $('body').prepend('<span><hr><strong>Atenção!</strong> Você está usando a chave de API de testes, a mesma só funciona no domínio localhost ou diretamente pelo arquivo.<br><a href="http://hgbrasil.com/status/weather/#chaves-de-api" target="_blank">Clique aqui</a> e solicite uma chave para seu site gratuitamente. Altere a chave na <strong>data-key</strong> da div com a classe <strong>hg-weather</strong>.<hr></span>');
      }

      getData(current_tag.attr('data-key'), current_tag);

      $(current_tag.find('.get-location')).bind('click', function() {
        getLocation(current_tag.attr('data-key'), current_tag);
        return false;
      });
    });
  }

  function getData(key, current_tag, geolocation) {
    geolocation = typeof geolocation !== 'undefined' ? geolocation : false;

    $.ajax({
      dataType: 'json',
      url: api_endpoint + '/?format=json-cors&key=' + key + '&user_ip=remote&sdk_version=jq' + version + (!geolocation ? '' : '&lat='+geolocation.coords.latitude+'&lon='+geolocation.coords.longitude),
      success: function(data){
        updateInformation(data.results, current_tag);
      },
      error: function(xhr, status, error){
        current_weather.find('[data-weather="message"]').show().text('HG Weather: Ocorreu um erro ao obter.');
      }
    });
  }

  function updateInformation(data, current_tag) {
    current_tag.find('[data-weather="message"]').hide();
    current_tag.attr('class', 'hg-weather').addClass(data.condition_slug);
    current_tag.find('[data-weather="image"]').show().attr('src', 'http://assets.api.hgbrasil.com/weather/images/' + data.img_id + '.png');

    current_tag.find('[data-weather]').each(function() {
      var current_data = $(this);

      if(accessible_data.indexOf(current_data.attr('data-weather')) !== -1) {
        current_data.text(data[current_data.attr('data-weather')]);
      }
    });
  }

  function getLocation(key, current_tag) {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(location) { getData(key, current_tag, location) });
    } else {
      alert('Seu navegador não suporta obter a localização.');
    }
  }

  return {
    initialize: initialize,
    getLocation: getLocation
  };
}());
