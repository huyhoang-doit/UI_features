var content = document.querySelector(".content");
var input = document.querySelector(".content input");
var btnRemoveAll = document.querySelector(".remove-all");

var tags = ["Nodejs", "React", "Java"];

function render() {
  content.innerHTML = "";
  for (var i = 0; i < tags.length; i++) {
    const tag = tags[i];
    content.innerHTML += ` <li> ${tag}
        <i class="fa-solid fa-xmark" onclick="removeTag(${i})"></i>
    </li>`;
  }
  content.appendChild(input);
  input.focus();
}

render();
function removeTag(index) {
  tags.splice(index, 1);
  render();
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    tags.push(input.value.trim());
    input.value = "";
    render();
  }
});
btnRemoveAll.addEventListener("click", function (e) {
  tags = [];
  render();
});
