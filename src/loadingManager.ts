import * as THREE from "three";

export const startLoadingManager = () => {
  const loadingManger = new THREE.LoadingManager();
  document.body.classList.add("loading");
  const loadingContainer = document.getElementById("loading-container");
  const percentageContainer = document.getElementById("percentage");

  type LoadFunctionType = (url: string, loaded: number, total: number) => void;

  const load: LoadFunctionType = (_, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    const percentage = parseFloat(progress.toFixed(2)) * 100;
    console.log(itemsTotal);

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

    if (progress === 1 || itemsTotal === 0) {
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

  loadingManger.onStart = load;
  loadingManger.onProgress = load;

  return loadingManger;
};
