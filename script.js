

// global
const defaultColor = {
   red:221,
   green:222,
   blue:238
}
const defaultPresetColors = [
  '#55fdca',
  '#45fd04',
  '#75fdaf',
  '#4dccbb',
  '#7ccccf',
  '#75fdcf',
  '#ccb27f',
  '#bbdacf',
  '#29cbaf',
  '#ffcdcf',
  '#65cdc0',
  '#7ccd0f',
  '#124acd',
  '#ffc234',
  '#25cccf',
 
  ];
let customColors = new Array(15);

// onload
window.onload = () =>{
  main()
  updateColorCodeToDom(defaultColor)
  const customColorsString = localStorage.getItem('custom-colors');
  if (customColorsString) {
    customColors = JSON.parse(customColorsString);
    displayColorBoxes(document. getElementById('custom-colors'),customColors)
  }
  setInterval(updateClock, 1000)
  updateClock()
  
};

function main() {
  const saveToCustomBtn = document.getElementById('save-to-custom');
  const presetColorsParent = document.getElementById('preset-colors');
  
 displayColorBoxes(presetColorsParent,defaultPresetColors);
 
 
 
 
 
 
  const generateRandomColorBtn = document.getElementById('generate-random-color');
  const colorHexInp = document.getElementById('input-hex');

  // Random Button Click
  generateRandomColorBtn. addEventListener('click', handleGenerateRandomColorBtn);

  // HEX Input Live Update
  colorHexInp.addEventListener('keyup', handleColorHexInp);
  
  const colorSliderRed = document. getElementById('color-slider-red');
  const colorSliderGreen = document. getElementById('color-slider-green');
  const colorSliderBlue = document. getElementById('color-slider-blue');
  
  const colorModeRadios = document. getElementsByName('color-mode');
  const copyToClipboardBtn = document. getElementById('copy-to-clipboard');
  const customColorsParent = document.getElementById('custom-colors');
  
  const bgFileInput = document.getElementById('bg-file-input');
  const bgFileInputBtn = document.getElementById('bg-file-input-btn');
  
  const bgPreview = document. getElementById('bg-preview')
  //references end
  colorSliderRed.addEventListener('input', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
  colorSliderGreen.addEventListener('input', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
  colorSliderBlue.addEventListener('input', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));
  
  copyToClipboardBtn.addEventListener('click',handleCopyToClipboardBtn )
  
  
  saveToCustomBtn.addEventListener("click",handleSaveToCustomBtn(customColorsParent,colorHexInp))
  
  
  presetColorsParent.addEventListener('click',handlePresetColorsParent)
  document.getElementById('custom-colors').addEventListener('click'
   ,handleCustomColorsParent
  )
  bgFileInputBtn.addEventListener("click",function () {
    bgFileInput.click()
  } );
 bgFileInput.addEventListener('change',function (event) {
   const file = event.target.files[0];
   
   const imgUrl = URL.createObjectURL(file)
   bgPreview.style.background = `URL(${imgUrl})`
   
   //console.log(imgUrl)
 })
  
}



//-------------event handlers--------------

function handleCopyToClipboardBtn() {
    const mode =  getCheckedValueFromRadios(document.getElementsByName('color-mode'));
    if (mode === null) {
     throw new Error('Invalid Radio Input')
    }
    
    if (mode==='hex') {
      let hexColor = document.getElementById('input-hex').value
      hexColor = hexColor.replace('#','')
    if (isValidHex(hexColor)) {
      
    navigator.clipboard.writeText(`#${hexColor}`)
    generateToastMessage(`#${hexColor} copied `)
    }
    else {
      generateToastMessage('Invalid Hex ')
    }
    
    
     }
     else {
       const rgbColor = document.getElementById('input-rgb').value
if (rgbColor) {
  
  navigator.clipboard.writeText(rgbColor)
  generateToastMessage(`${rgbColor} copied `)
}
else {
  alert('Invalid RGB Color')
}
     }
     
  }


function handleGenerateRandomColorBtn() {
  const color = generateColorDecimal();
    updateColorCodeToDom(color);
}
    


function handleColorHexInp(e) {
  let hexColor = e.target.value.trim();
    hexColor = hexColor.replace('#','')
  
  if (hexColor) {
   this.value = hexColor.toUpperCase();
    
    if (isValidHex(hexColor)) {
      const color = hexToDecimalColors(hexColor);
      updateColorCodeToDom(color);
    }
    
}
}

function handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue) {
  
  return function () {
    const color = {
    red: parseInt(colorSliderRed.value),
    green: parseInt(colorSliderGreen.value),
    blue: parseInt(colorSliderBlue.value)
  };
  updateColorCodeToDom(color);
  }
}
function handlePresetColorsParent(event) {
    const child = event. target;
    if (child.className==='color-box') {
      navigator.clipboard.writeText(child. getAttribute('data-color'))
     generateToastMessage(child.getAttribute('data-color'))
    }
    
    
  }

function handleSaveToCustomBtn(customColorsParent, inputHex) {
  
  return function () {
    const color = inputHex.value
    if (customColors.includes(`#${color}`)){
      generateToastMessage('All Ready Saved')
      return ;
    }
    if (customColors.length >14) {
      customColors = customColors. slice(0,14);
    }
  if (isValidHex(color) ){
    customColors.unshift(`#${color}`)
  displayColorBoxes(customColorsParent, customColors)
  }
  else {
    generateToastMessage('Invalid Hex ')
  }
  localStorage.setItem('custom-colors', JSON.stringify(customColors))
  }
  
}

function handleCustomColorsParent() {
     const child = event. target;
    if (child.className==='color-box') {
      navigator.clipboard.writeText(child. getAttribute('data-color'))
     generateToastMessage(child.getAttribute('data-color'))
    }
    }


/**
 * create a div elementeith class name color Box
 * @param {string} color
 * @returns{object}
*/

function generateColorBox(color) {
  const div = document.createElement("div")
  div.className ="color-box"
  div.style.backgroundColor = color;
   div.setAttribute("data-color", color);
 
  return div;
}
/**
 *this function will create and append new color to it is parent
 * @param {object} parent
 * @returns{Array} colors
*/
function displayColorBoxes(parent, colors) {
  parent.innerHTML= ''
  colors.forEach((color) => {
    if (!color)return;
    if (color){
      const colorBox = generateColorBox(color);
    parent.appendChild(colorBox);
    }
  });
}



// ---------- Utils ----------

function updateClock() {
   const now = new Date()
   let hour = now.getHours();
   let date = now.toDateString();
   
   console.log(date)
   let minute = now.getMinutes();
   
   let second = now.getSeconds();
   
   const ampm = hour>=12? 'PM' : 'AM';
   
   hour = hour % 12 ||12;
   minute = minute.toString().padStart(2,'0');
   second = second.toString().padStart(2,'0');
   document.getElementById('hour').innerText = hour;
   document.getElementById('minute').innerText = minute;
   document.getElementById('second').innerText = second;
   document.getElementById('ampm').innerText = ampm;
 
   document.getElementById('date').innerText = date;
   
    
}

function generateColorDecimal() {
  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return { red, green, blue };
}

function generateHexColor({ red, green, blue }) {
  return (
    red.toString(16).padStart(2, "0"). toUpperCase() +
    green.toString(16).padStart(2, "0").toUpperCase() +
    blue.toString(16).padStart(2, "0").toUpperCase()
  );
}

function generateRGBColor({ red, green, blue }) {
  return `rgb(${red},${green},${blue})`;
}

function hexToDecimalColors(colorHex) {
  const red = parseInt(colorHex.slice(0, 2), 16);
  const green = parseInt(colorHex.slice(2, 4), 16);
  const blue = parseInt(colorHex.slice(4, 6), 16);

  return { red, green, blue };
}

function isValidHex(color) {
  if (color.length !== 6) return false;
  return /^[0-9A-Fa-f]{6}$/i.test(color);
}


/**
 * @param{Array} nodes
 * @returns{string / null}
*/
function getCheckedValueFromRadios(nodes) {
  let checkedValue = null;
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      checkedValue = nodes[i].value
      break;
    }
  }
  return checkedValue;
}


// ---------- DOM Update ----------

function updateColorCodeToDom(color) {
  const hexColor = generateHexColor(color);
  const rgbColor = generateRGBColor(color);
  
  //clock update color
  document.getElementById('clock').style.color = `#${hexColor}`;
  //clock update color
  
  
  document.getElementById("color-display").style.backgroundColor = `#${hexColor}`;

  document.getElementById("color-slider-red").value = color.red;
  document.getElementById("color-slider-red-lebel").innerText = color.red;

  document.getElementById("color-slider-green").value = color.green;
  document.getElementById("color-slider-green-lebel").innerText = color.green;

  document.getElementById("color-slider-blue").value = color.blue;
  document.getElementById("color-slider-blue-lebel").innerText = color.blue;

  document.getElementById("input-hex").value = hexColor;
  document.getElementById("input-rgb").value = rgbColor;

}



// ---------- Toast ----------

/**
 * @param{string} msg
*/
/*
function generateToastMessage(msg) {
  toastContainer = document.createElement("div");
  toastContainer.innerText = msg;
  toastContainer.className = "toast-message toast-message-slide-in";

  toastContainer.addEventListener("click", function () {
    toastContainer.classList.remove("toast-message-slide-in");
    toastContainer.classList.add("toast-message-slide-out");

    toastContainer.addEventListener("animationend", function () {
      toastContainer.remove();
      
    });
    toastContainer.addEventListener('click ', function () {
      const  toastContainer= null
    if (toastContainer===`${isValidHex()}`) {
       toastContainer. innerText= null
    } else {
      console.log(toastContainer)
    }
    console.log(toastContainer)
    }
    )
  });
  document.body.appendChild(toastContainer);
}
*/
function generateToastMessage(msg, duration = 3000) {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.className = "toast-message toast-message-slide-in";

  document.body.appendChild(toast);

  // auto hide
  const hideToast = () => {
    toast.classList.remove("toast-message-slide-in");
    toast.classList.add("toast-message-slide-out");

    toast.addEventListener("animationend", () => {
      toast.remove();
    }, { once: true });
  };

  // click to hide
  toast.addEventListener("click", hideToast);

  // auto hide after time
  setTimeout(hideToast, duration);
}



