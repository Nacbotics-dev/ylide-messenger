export const getFormValues = () =>{
    let formData = {}
    const formElem = document.querySelector('form')
    let inputElements = formElem.querySelectorAll('input')
    inputElements.forEach((input,inputID)=>{
        formData[input.name] = input.value
    })

    return(formData)
}


export const getAdvancedFormValues = () =>{
  let formData = {}
  const formElem = document.querySelector('form')
  let inputElements = formElem.querySelectorAll('input, select')
  inputElements.forEach((input,inputID)=>{
      formData[input.name] = input.value;
  })

  return(formData)
}