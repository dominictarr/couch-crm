/*
TODO:
  save
    push to DB, after edits.

  autosave

  search
    search field, with suggestions... 
    suggestion list, -- with keyboard control.
    enter text, it searches, then displays the response.
    move the cursor down onto it, and press enter: open that document.

  create new document.

  list databases,
  list documents.

  flash messages (at top of screen, and labels on each item)  

  types
    allow forcing number, times, string, list, textarea, or a whole object!

*/


require('amd')

module.define(['./object-editor'], function (mkEdit){

  //the object we're editing

  $.get('/json' + document.location.pathname, function (doc){
    document.body.appendChild(mkEdit(JSON.parse(doc), function (){console.log("change at:" + new Date)}))
  })
//handle as many objects as necessary.

})
