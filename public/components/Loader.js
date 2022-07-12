export default function Loader(res) {
  const loaderBox = document.querySelector(".loader");
  const loader = document.querySelector(".loader progress");
  const loadingText = document.querySelector(".loader label");
  const backdrop = document.querySelector(".backdrop");
  const headerOverlay = document.querySelector(".headerOverlay");
  var t,
    inc = 0,
    count = 0;

  t = setInterval(() => {
    if (count >= res.length) {
      clearInterval(t);
      loaderBox.classList.add("hidden");
      backdrop.classList.add("hidden");
      headerOverlay.classList.remove("hidden");
      document.querySelector('header').classList.remove('hidden');
    } else {
      count = Math.round((res.length * inc) / 100);
      loader.value = inc;
      loadingText.innerHTML = inc + "%";
      inc++;
    }
  }, 10);
}