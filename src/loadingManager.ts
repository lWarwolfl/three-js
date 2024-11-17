import * as THREE from "three";

export const startLoadingManager = () => {
  const loadingManger = new THREE.LoadingManager();
  document.body.classList.add("loading");
  const loadingContainer = document.getElementById("loading-container");
  const percentageContainer = document.getElementById("percentage");

  loadingManger.onProgress = (_, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    const percentage = parseFloat(progress.toFixed(2)) * 100;

    if (percentageContainer)
      percentageContainer.innerHTML = `${
        percentage / 1 >= 1
          ? percentage / 10 >= 1
            ? percentage / 100 >= 1
              ? percentage
              : "0" + percentage
            : "00" + percentage
          : "000" + percentage
      }%`;

    if (progress === 1) {
      document.body.classList.remove("loading");

      if (loadingContainer) {
        setTimeout(() => {
          loadingContainer.style.opacity = "0";
        }, 500);

        setTimeout(() => {
          loadingContainer.style.display = "none";
        }, 1000);
      }
    }
  };

  return loadingManger;
};
