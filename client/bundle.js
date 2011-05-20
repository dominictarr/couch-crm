(function (M){
M[0] =
  (function (){
  
  return function field (value){
  
    var self = document.createElement('span')
    self.innerHTML = value
  
    self.onclick = open
  
    function open (event){
      if(self.state !== 'closed')
        return
      self.state = 'open'
      edit(event)
    }
  
    self.state = 'closed'//not editing.
  
    function edit (event){
      var input = document.createElement('input')
      input.type = 'text'
      var oldValue = input.value = self.innerHTML
      self.innerHTML = ''
  
      self.appendChild(input)
  
      input.onblur = change
      input.onkeydown = function (event){
        console.log(event.keyIdentifier)
        if(event.keyIdentifier === 'Enter' || event.keyIdentifier === 'U+0009'){
          change(event)
          if(self.tabTo)
            self.tabTo()
          return false
        }
      }
      input.oninput = function (){
        input.size = input.value.length
      }
      function change (event){
        if(self.state === 'closed')
          return
        self.state = 'closed'
        if(self.onedit){
          try {
            self.onedit ({value: input.value, oldValue:oldValue})
          } catch (err){
            input.value = oldValue //if there is a validation error don't change message
            console.error(err.message) //display to user in good place.
            return
          }
        }
        self.innerHTML = input.value
      }
  
      input.select()
    }
  
    return self
  }
  
  })();
  
M[1] =
  (function (field){ 
  
    return function makeEditor(object){
  
      var editor = document.createElement('div')
  
      //function to create fields for a key:value pair.
  
      function kvEditor (value,key,object){
          var pair = document.createElement('div')
            , colon = document.createTextNode(': ')
            , keyEdit = field(key)
            , valueEdit = field(object[key])
  
          keyEdit.onedit = function (event){
            if(!event.value)
              throw new Error('property cannot have a blank name')
            delete object[event.oldValue]
            key = event.value
            object[key] = value
          }
          keyEdit.tabTo = function (){
            if(valueEdit.onclick)
              valueEdit.onclick()
          }
          keyEdit.classList.add('key')
          valueEdit.onedit = function (event){
            object[key] = event.value
  
    /*
    a field has two states:
  
      closed
         onclick, focus -> open
      open
         onchange, blur, keyup (Enter) -> closed
  
      only select the next item if you tabbed through it, or pressed enter.
    */
  
          }
          valueEdit.tabTo = function (){
            if(valueEdit.onclick)
              valueEdit.onclick()
            var values = $('.value')
              , next = values[values.index(valueEdit) + 1]
            console.log(next)
            if(next)
              next.onclick()
            else
              $('#addProperty')[0].focus()
          }
          valueEdit.classList.add('value')
  
          pair.appendChild(keyEdit)
          pair.appendChild(colon)
          pair.appendChild(valueEdit)
          return pair
        }
  
      //for each property of the object, create an editor
  
      for(var kName in object){
        editor.appendChild(kvEditor(object[kName],kName,object))
      }
    
      //create a [+ New Property] link.
    
      var lastKV, addKV = document.createElement('a')
      addKV.innerHTML = '<span> + new property </span>'
      addKV.href = '#'
      addKV.id = 'addProperty'
      addKV.onclick = function (){
        if(!object.key){
          object.key = 'value'
          var pair = lastKV = kvEditor(object.key,'key', object)
          editor.insertBefore(pair,addKV)
          pair.children[0].onclick()
        } else {
          $(lastKV).find('.key')[0].onclick()
          console.log("rename 'key':'" + object.key + "'")
        }
        return false;
      }
      editor.appendChild(addKV)
      return editor
    }
  })(M[0]);
  
return  (function (mkEdit){
  
    //the object we're editing
  
    var object = {'hi': 'asdfasdf', propertyName: 'propertyValue'}
  
    //editor DOM object.
  
  
    document.body.appendChild(mkEdit(object))
  //handle as many objects as necessary.
  
  })(M[1]);
  
})({});
