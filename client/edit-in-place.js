

module.define([], function (){

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
    input.size = input.value.length

    self.appendChild(input)

    input.onblur = change
    input.onkeydown = function (event){

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

})
