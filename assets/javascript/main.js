var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("slides__item");
  var dots = document.getElementsByClassName("slides__dot-item");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}


var navBtn = document.querySelectorAll('.navigation__btn-item')
const shopHeader = document.querySelector('.shop-contener__heading')
for (let i = 0; i < navBtn.length; i++) {
  navBtn[i].onclick = function(e) {
    for (let i = 0; i < navBtn.length; i++) {
      navBtn[i].classList.remove('btn-active')
    }
    e.target.classList.add('btn-active')
    shopHeader.textContent = e.target.innerText
  }
}


function showAddToast() {
  console.log('bam')
  toast({
    title: "Thành công!",
    message: "Đã thêm vào giỏ hàng",
    type: "success",
    duration: 5000
  });
}

function showBuyToast() {
  toast({
    title: "Cảm ơn!",
    message: "Bạn đã mua hàng thành công",
    type: "info",
    duration: 5000
  });
}

function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fas fa-check-circle",
      info: "fas fa-check-circle",
      warning: "fas fa-exclamation-circle",
      error: "fas fa-exclamation-circle"
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;


    toast.innerHTML = `
        <div class="toast__icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <div class="toast__close">
            <i class="fas fa-times"></i>
        </div>
    `;
    main.appendChild(toast);
  }
}


const signupBtn = document.querySelector('.heading__account-signup')
const signupModal = document.getElementById('signup-modal')
const formSignupClose = document.querySelector('.form-signup-close')

signupBtn.onclick = () => {
  signupModal.classList.add('signup-modal')
}


formSignupClose.onclick = () => {
  signupModal.classList.remove('signup-modal')
}


const loginBtn = document.querySelector('.heading__account-login')
const loginModal = document.getElementById('login-modal')
const formLoginClose = document.querySelector('.form-login-close')

loginBtn.onclick = () => {
  loginModal.classList.add('login-modal')
}

formLoginClose.onclick = () => {
  loginModal.classList.remove('login-modal')
}



const switchForm = document.querySelector('.form-switch')

switchForm.onclick = () => {
  loginModal.classList.remove('login-modal')
  signupModal.classList.add('signup-modal')
}



// Validator

function Validator(options) {

  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement
      }
      element = element.parentElement
    }
  }

  var selectorRules = {};

  // hàm thực hiện Validator
  function checkValidator(inputElement, rule) {

    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
    var errorMessage;

    // lấy ra các rule
    var rules =selectorRules[rule.selector];
    // làm từng rule
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case 'checkbox':
        case 'radio':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked')
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage
      getParent(inputElement, options.formGroupSelector).classList.add('invalid')
    } else {
      errorElement.innerText = ''
      getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
    }

    return !errorMessage;
  }


  //  lấy element của form cần validate
  var formElement = document.querySelector(options.form);

  if (formElement) {

    // xử lý khi submit form
    formElement.onsubmit = (e) => {
      e.preventDefault();

      var isFormValid = true;

      options.rules.forEach( function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = checkValidator(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }

      });
      
      if (isFormValid) {
        if (typeof options.onSubmit === 'function') {

          var enableInputs = formElement.querySelectorAll('[name]')
          var formValue = Array.from(enableInputs).reduce((value, input) => {
            // value[input.name] = input.value;

            switch (input.type) {
              case 'checkbox':
              case 'radio':
                value[input.name] = formElement.querySelector(input.name + ':checked').value;                
                break;
              default:
                value[input.name] = input.value;
								
            }

            return value
          }, {});

          options.onSubmit({formValue});
        } else { // submit mạc định
          formElement.submit();
        }
      } 

    }//-----------------------------------------



    // xử lý khi nhập input
    options.rules.forEach( function (rule) {

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      
      var inputElements = formElement.querySelectorAll(rule.selector);
      
      Array.from(inputElements).forEach((inputElement) => {
        
        // khi khong nhập hoặc nhập sai
        inputElement.onblur = () => {
          checkValidator(inputElement, rule);
        }

        // khi bắt đầu nhập
        inputElement.oninput = () => {
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
          errorElement.innerText = ''
          getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
      })

      
    });

  }


}

// rule của mane
Validator.isRequired = (selector, message) => {
  return {
    selector: selector,
    test: (value) => {
      return value ? undefined : message || 'Vui lòng nhập dòng này!' 
    }
  }
}

// rule của mail
Validator.isEmail = (selector) => {
  return {
    selector: selector,
    test: (value) => {
      // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : 'Vui Lòng nhập đúng Email' 

    }
  } 
}

// password
Validator.ispassword = (selector, min) => {
  return {
    selector: selector,
    test: (value) => {
      // return value.length >= min ? undefined : `Vui Lòng nhập tối thiểu ${min} kí tự`
      return value.length >= min ? undefined : `Vui Lòng nhập tối thiểu ${min} kí tự`

    }
  } 
}


Validator.isConfirmed = (selector, getConfirmValue) => {
  return {
    selector: selector,
    test: (value) => {
      return value === getConfirmValue() ? undefined : 'Mật khẩu nhập lại không khớp'
    }
  }
}

// mobile

var mobileNavItem = document.querySelectorAll('.nav-mobile-list__item');

for (let i = 0; i < mobileNavItem.length; i++) {
  mobileNavItem[i].onclick = (e) => {
    shopHeader.textContent = e.target.innerText
  }
}
