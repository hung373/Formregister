// hàm'validator'
function Validator(options) {
    var selectorRules = {};
    //hàm thực hiện validate
    function validate(inputElement,rule) {
        //value: inputElement.value
                    //test function: rule.test
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    var errorMessage ;
                    // lấy ra các rule của selector
                    var rules = selectorRules[rule.selector]
                    //lặp qua từng rule và kiểm tra
                    //nếu mà có lỗi thì dừng kiểm tra
                    for (var i = 0; i <rules.length;i++) {
                        errorMessage = rules[i](inputElement.value);
                        if(errorMessage) break;
                    }
                   
                    if (errorMessage) {
                        errorElement.innerText = errorMessage;
                        inputElement.parentElement.classList.add('invalid');
                    }else{
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    }
                    return !errorMessage;

            }
    //lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        //khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            // lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid =  validate(inputElement,rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });
            var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
            console.log('enableInputs')
            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    options.onSubmit ({
                        name: 'Hung Nemo'
                    });
                }
            }
            

        }
        //xử lý lặp qua mỗi rule và xử lý ( lắng nghe sự kiện blur,input,..)


        options.rules.forEach(function (rule){
            //Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push[rule.test];
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                //xử lý trường hợp blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement,rule);
                }
                // xử lý mỗi khi người dùng nhập
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}
// Định nghĩa rules
//nguyên tắc của các rules;
//1. khi có lỗi => có lỗi
//2. khi hợp lê => không trả ra cái gì cả (undefined)
Validator.isRequired = function(selector,massage) {
    return{
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined: massage || 'Vui lòng nhập trường này'
        }
    }
}
Validator.isEmail = function(selector,massage) {
    return{
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ?undefined: massage || ' Trường này phải là email !!!'
        }
    }
}
Validator.minLength = function(selector,min,massage) {
    return{
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined: massage || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue,massage) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined: massage || 'Giá trị nhập vào không chính xác';
        }
    }
}