var userName = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");
var confirmPass = document.getElementById("confirm-password");
var form = document.querySelector("form");

// Funtions
// 1. Show
function showError(input, message) {
  let parent = input.parentElement;
  let small = input.parentElement.querySelector("small");

  parent.classList.add("error");
  small.innerText = message;
}

function showSuccess(input) {
  let parent = input.parentElement;
  let small = input.parentElement.querySelector("small");

  parent.classList.remove("error");
  small.innerText = "";
}

// 2. Check
function checkEmptyError(listInput) {
  let isEmptyError = false;
  listInput.forEach((input) => {
    input.value = input.value.trim();
    if (input.value == "") {
      isEmptyError = true;
      showError(input, "This value cannot be blank");
    } else {
      showSuccess(input);
    }
  });
  return isEmptyError;
}

function checkEmailError(input) {
  input.value = input.value.trim();
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let isEmailError = !regexEmail.test(input.value);

  if (regexEmail.test(input.value)) {
    showSuccess(input);
  } else {
    showError(input, "Invalid email");
  }
  return isEmailError;
}

function checkLengthError(input, min, max) {
  input.value = input.value.trim();
  if (input.value.length < min) {
    showError(input, `Must be at least ${min} characters`);
    return true;
  } else if (input.length > max) {
    showError(input, `The number of characters cannot exceed ${max}`);
    return true;
  }

  showSuccess(input);
  return false;
}
function checkMatchPassword(passwordInput, confirmPasswordInput) {
  if (passwordInput.value !== confirmPasswordInput.value) {
    showError(confirmPasswordInput, "Password does not match");
    return true;
  }
  return false;
}

// 3. Submit form
form.addEventListener("submit", function (event) {
  event.preventDefault();
  let isEmptyError = checkEmptyError([userName, email, password, confirmPass]);
  let isEmailError = checkEmailError(email);
  let isUserNameLengthError = checkLengthError(userName, 6, 100);
  let isPassLengthError = checkLengthError(password, 6, 100);
  let isConfirmLengthError = checkLengthError(confirmPass, 6, 100);
  let isMatchPasswordError = checkMatchPassword(password, confirmPass);

  if (
    isEmptyError ||
    isEmailError ||
    isUserNameLengthError ||
    isPassLengthError ||
    isConfirmLengthError ||
    isMatchPasswordError
  ) {
    // do nothing
  } else {
    // logic ...
  }
});
