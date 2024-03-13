
// Constructor function
function Validator (options) {

    // <1> Get parentElement of input element
    function getParent(element,selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    // <2> Object stores all rules
    var selectorRules = {}

    // <3> The function performs validation - Hàm thực hiện validate < xác nhận >
    function Validate(inputElement, rule) {
        let parentElement = getParent(inputElement,options.formGroupSelector);
        let errorElement = parentElement.querySelector(options.errorSelector);
        let value = inputElement.value
        let errorMessage;
        // Get the selector rules - Lấy ra các rules của selector
        let rules = selectorRules[rule.selector];

        // Loop through rules & check - Lặp qua các rule & kiểm tra
        for(var i = 0; i < rules.length; i++) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](value);
                    break;
            }
            if(errorMessage) break;
        }
        
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            parentElement.classList.remove('invalid');
        }

        // Validate return boolean
        return !errorMessage
    };

    // <4> Get the element of the form that needs validation
    //     Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement) {
        // Events submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            // Through each validation rule - Lặp qua từng rule validate hết luôn
            var isFormValid = true;
            var allRules = options.rules;
            allRules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = Validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if(isFormValid) {
                // Submit by javascript
                if(typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]');

                    let formValues = Array.from(enableInputs).reduce(function(values,input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});

                    options.onSubmit(formValues);

                // Submit by default
                } else {
                    formElement.submit();
                }
            }else {

            }
        }
        // Loop through each rule - Lặp qua mỗi rule
        var allRules = options.rules
        allRules.forEach(function (rule) {

            // Save rules into selectorRules - Lưu các rule vào selectorRules
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test];
            }

            let inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                if(inputElement) {
                    let parentElement = getParent(inputElement,options.formGroupSelector);
                    let errorElement = parentElement.querySelector(options.errorSelector);
                    // Handle blur "out" input element
                    inputElement.onblur = function () {
                        Validate(inputElement, rule);
                    }
                    // Handle whenever user enters
                    inputElement.oninput = function() {
                        errorElement.innerText = '';
                        parentElement.classList.remove('invalid');
                    }
                }
            })

            
        });
    }
}


// Defind rules
// Nguyên tắc:
// 1.Khi có lỗi => trả ra message lỗi
// 2.Khi không có lỗi => return undefined
Validator.isRequired = function (selector, message) {
    return {
        selector : selector,
        test: function(value) {
            return value ? undefined : message || 'Please enter this field'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector : selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'This field must be email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector : selector,
        test: function(value) {
            return value.length >= min  ? undefined : message || `Please enter a minimum of ${min} characters`
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue , message) {
    return {
        selector : selector,
        test: function(value) {
            return value === getConfirmValue()  ? undefined : message || 'The value entered is incorrect';
        }
    };
}