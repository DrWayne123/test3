

// Đối tượng Validator

function validator(options) {
    
    var $ = document.querySelector.bind(document);
    var $$ = document.querySelectorAll.bind(document);

    var inputEl= $$('.form-control');
    var addBtn = $('.the-btn');
    var cancelBtn = $('.page-5-2 .col:first-child a');
    var modal = $('.modal');
    

    // Xử lý show hidden infor
    function showHiddenInforRadio(e, infor) {
        if(e.target.value === 'yes') {
            infor.classList.remove('disable')
        } else {
            infor.classList.add('disable')
        }
    }
    
    function showHiddenInforCheckbox(infor, input) {
        if(input.matches(':checked')) {
            infor.classList.remove('disable');
        } else {
            infor.classList.add('disable');
        }
    }

    // Xử lý khi thẻ cha Form-group bị lồng vào nhiều thẻ div 
    function getParentElement(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement
        }
    }
    
    var selectorRules = {};
    
    // Xử lý form Validate.
    function validate(inputEl, rule) {
        
        var errElement = getParentElement(inputEl, options.formGroupSelector).querySelector(options.formMessage);
        var errMsg;

        // Xử lý lặp qua các rules khi 1 input được áp dụng nhiều rules
        var rules = selectorRules[rule.selector];

        for(var i = 0; i < rules.length; ++i) {
          switch(inputEl.type) {
              case 'radio': 
              case 'checkbox':
                  errMsg = rules[i](formEl.querySelector(`${rule.selector}:checked`))
                  break;
              default:
                  errMsg = rules[i](inputEl.value)
          }
            if(errMsg) break;
        };


        // Xử lý báo lỗi và dừng báo lỗi khi người dùng bắt đầu nhập
        if(errMsg) {
            errElement.innerHTML = errMsg;
            getParentElement(inputEl, options.formGroupSelector).classList.add('invalid');
        } else {
            errElement.innerHTML = '';
            getParentElement(inputEl, options.formGroupSelector).classList.remove('invalid');
        };

        return !errMsg;
    }
    // Xử lý các sự kiện của các rule trong form nhất định.
    var formEl = document.querySelector(options.form);
    if (formEl) {

    
        // if(moveOn2.matches(':checked')) {
        //     function abc() {
        //         return 'abc'
        //     }
        //     console.log(abc())
        // }

        formEl.onsubmit = function(e) {
            // Xử lý chặn sự kiện kết nối với trang web khác của form.
            e.preventDefault();

          

            if(typeof options.showHeadError === 'function') {
                options.showHeadError()
            }

            var isFormValid = true;
            // Xử lý lặp qua từng rule để validate
            options.rules.forEach(function(rule) {
                var inputEl = formEl.querySelector(rule.selector);
                var isValid = validate(inputEl, rule);

                if(!isValid) {
                    isFormValid = false;
                }

            });
 

            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {
                    options.onSubmit();
                };
                

                var editBtn = $('.details-box__bar.get-infor .col:last-child li:first-child');
                editBtn.onclick = function() {
                    modal.classList.remove('disable');
                    if(typeof options.changeSave === 'function') {
                        options.changeSave();
                    }
                };
            } 
        };

            //  Xử lý tick chọn
        Array.from(inputEl).forEach(function(input) {
            input.onclick = function(e) {
                switch(input.type) {
                    case 'radio':
                        if(e.target.name === options.hidden1) {
                            const infor = $(options.hidden11);
                            showHiddenInforRadio(e, infor);
                        } 
        
                        if(e.target.name === options.hidden2) {
                            const infor = $(options.hidden21);
                            showHiddenInforRadio(e, infor);
                        }
        
                        if(e.target.name === options.hidden3) {
                            const infor = $(options.hidden31);
                            showHiddenInforRadio(e, infor);
                        }
        
                        if(e.target.name === options.hidden4) {
                            const infor = $(options.hidden41);
                            showHiddenInforRadio(e, infor);
                        }
                        break;

                    case 'checkbox': 
                        if(e.target.value === options.hiddenCheckbox1) {
                            const infor = $(options.hiddenCheckbox11);
                            showHiddenInforCheckbox(infor, input)
                        }
                        if(e.target.value === options.hiddenCheckbox2) {
                            const infor = $(options.hiddenCheckbox21);
                            showHiddenInforCheckbox(infor, input)
                        }
                        break;
                }
            }
        })

        addBtn.onclick = function() {
            modal.classList.remove('disable');
        }

        cancelBtn.onclick = function() {
            modal.classList.add('disable');
        }
   
        
        options.rules.forEach(function(rule) {
            
            // Xử lý đưa các thêm các rules vào cũng 1 mảng để duyệt
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
              } else {
                  selectorRules[rule.selector] = [rule.test]
              };
              
          var inputEls = formEl.querySelectorAll(rule.selector);
              
          Array.from(inputEls).forEach(function(inputEl) {
              inputEl.onblur = function() {
                  validate(inputEl, rule)
              };
  
              // Xử lý khi nhập 
              inputEl.oninput = function() {
                var errElement = getParentElement(inputEl, options.formGroupSelector).querySelector(options.formMessage);
                errElement.innerHTML = '';
                getParentElement(inputEl, options.formGroupSelector).classList.remove('invalid');
                    
              };
          });
         // Xử lý khi blur
        })
    }
};


// Logic của các Rules:
validator.isRequire = function (selector, message) {
    return {
        selector,
        test: function(value) {
            return value ? undefined : message || 'This field is required';
        }
    }
};


validator.isEmail = function (selector, message) {
    return {
        selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này nhập Email'
        }
    }
};


validator.isPassword = function (selector, min, message) {
    return {
        selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Trường này phải nhập tối thiểu ${min} ký tự`;
        }
    }
};

validator.isPasswordConfirmed = function (selector, getConfirmPassword, message) {
  return {
    selector,
    test: function(value) {
        return value === getConfirmPassword() ? undefined : message || 'Giá trị nhập không giống nhau';
        }
    }
};




























































