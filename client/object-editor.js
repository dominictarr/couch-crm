module.define(['./edit-in-place'],function (field){ 
/*
TODO:
  object change event to trigger saving.
*/

  return function makeEditor(object, onChange){

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

          if(onChange && event.oldValue != event.value)
            onChange(object)
        }
        keyEdit.tabTo = function (){
          if(valueEdit.onclick)
            valueEdit.onclick()
        }
        keyEdit.classList.add('key')
/*
a field has two states:

  closed
     onclick, focus -> open
  open
     onchange, blur, keyup (Enter) -> closed

  only select the next item if you tabbed through it, or pressed enter.
*/
        valueEdit.onedit = function (event){
          object[key] = event.value
          if(onChange && event.oldValue != event.value)
            onChange(object)
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
    //this only works with flat objects, ATM.
    //probably want support for types before sticking in recursive objects.
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
})
