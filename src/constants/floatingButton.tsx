export const statusImage: TStatusImage = {
  // muted:
  // "https://img.icons8.com/?size=100&id=x0OoJUjQjfaC&format=png&color=000000",
  speaker: "https://img.icons8.com/?size=100&id=56021&format=png&color=000000",
  stop: "https://img.icons8.com/?size=100&id=15181&format=png&color=000000",
};

export function FloatingButton(id: string, dataset: string, src?: string): any {
  const btn = document.createElement("img");
  btn.src = src || statusImage.speaker; // default icon will be muted
  btn.style.cursor = "pointer";
  btn.style.background = "white";
  btn.style.boxShadow = "rgb(193 205 201 / 79%) 1px 1px 20px 2px";
  btn.style.border = "1px solid #f5fff9ba";
  btn.style.padding = "2px";
  btn.style.width = "40px";
  btn.style.height = "40px";
  btn.style.marginTop = "-3px";
  btn.style.borderRadius = "100%";
  btn.setAttribute("id", id);
  btn.setAttribute("data-index-of-button", dataset);
  btn.style.zIndex = "999999999";
  return btn;
}

export function FloatingButtonForDetecting(
  id: string,
  src?: string,
  size: number = 40
): HTMLImageElement {
  const btn = document.createElement("img");
  btn.src = src || statusImage.speaker; // default icon will be speeker
  btn.style.cursor = "pointer";
  btn.style.position = "fixed";
  btn.style.bottom = "10px";
  btn.style.right = "10px";
  btn.style.background = "white";
  btn.style.boxShadow = "rgb(193 205 201 / 79%) 1px 1px 20px 2px";
  btn.style.border = "1px solid #f5fff9ba";
  btn.style.padding = "2px";
  btn.style.width = `${size}px`;
  btn.style.height = `${size}px`;
  // btn.style.marginTop = "-3px";
  btn.style.borderRadius = "100%";
  btn.style.zIndex = "999999999";
  btn.setAttribute("id", id);
  return btn;
}
