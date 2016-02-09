/**
 * Created by Oleg Galaburda on 23.07.15.
 */
'use strict';

(function(express){
  this.use(express.static('.'));
  this.listen(8081, function(){
	console.log('Server started...');
  });
}).apply(require('express')(), [require('express')]);
