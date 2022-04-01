const progressElem = document.querySelector("#progress");
const progress = new CircularProgress(progressElem);
const valueInput = document.querySelector("#value-input");
const isAnimatedInput = document.querySelector("#animate-checkbox");
const isHiddenInput = document.querySelector("#hide-checkbox");
valueInput.addEventListener("input", (e) => {
  progress.value = Number.parseInt(e.target.value);
});
isAnimatedInput.addEventListener("change", (e) => {
  progress.isAnimated = e.target.checked;
});
isHiddenInput.addEventListener("change", (e) => {
  progress.isHidden = e.target.checked;
});
