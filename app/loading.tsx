/*
From Uiverse.io by JaydipPrajapati1910 - https://uiverse.io/JaydipPrajapati1910/stale-pug-89
MIT License, Copyright (c) JaydipPrajapati1910 (Jaydip Prajapati)
*/

import UiverseLoader from "./components/uiverse-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050506]">
      <UiverseLoader />
    </div>
  );
}
