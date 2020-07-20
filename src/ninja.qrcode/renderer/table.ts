const render = function (qr: any): HTMLElement {
  const modCount = qr.getModuleCount();

  function getNode(n: string, v?: any): HTMLElement {
    const e: HTMLElement = document.createElement(n);
    for (const p in v) {
      if ({}.hasOwnProperty.call(v, p)) {
        e.setAttribute(p, v[p]);
      }
    }
    return e;
  }

  const root = getNode("table", { class: "qrcodetable" });
  for (let r = 0; r < modCount; r++) {
    const tr = getNode("tr");
    for (let c = 0; c < modCount; c++) {
      if (qr.isDark(r, c)) {
        tr.appendChild(getNode("td", { class: "qrcodetddark" }));
      } else {
        tr.appendChild(getNode("td", { class: "qrcodetdlight" }));
      }
    }
    root.appendChild(tr);
  }
  return root;
};

module.exports = { render, available: true };
