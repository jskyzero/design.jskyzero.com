let changeIndexPositon = function () {
  // console.log("change index dom position");
  let index = document.getElementById("index");
  let h1 = document.getElementsByTagName("h1")[0];
  // console.log(h1);
  if (!h1) {
    // console.log(undefined != index);
    if (undefined != index) index.parentElement.removeChild(index);
    // $(':header').addClass("hide-before");
  } else {
    h1.parentElement.insertBefore(index, h1.nextElementSibling);
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  changeIndexPositon();

  // highlightBlock
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
});