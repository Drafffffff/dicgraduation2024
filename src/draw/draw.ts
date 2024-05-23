import { SVG, Svg } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { Gradient } from "@svgdotjs/svg.js";

interface Point {
  x: number;
  y: number;
}

export default class SVGDraw {
  draw: Svg;
  topPoints: Point[] = [];
  bottomPoints: Point[][] = [];
  lineAttr: { [key: string]: string | number };
  length = 20;
  lineNum = 80;
  gradient: Gradient;

  constructor(
    container: HTMLElement,
    width: number = 2100,
    height: number = 1000,
  ) {
    this.draw = SVG().addTo(container).size(width, height);

    this.gradient = this.draw.gradient("linear", function (add) {
      add.stop(0, "#333");
      add.stop(1, "#fff");
    });
    for (let i = 0; i < this.length; i++) {
      this.topPoints.push({
        x: Math.random() * 0.9 * width + 5,
        y: Math.random() * 0.8 * height + 100,
      });
    }
    this.topPoints.sort((a, b) => a.y - b.y);
    for (let i = 0; i < this.length; i++) {
      this.bottomPoints.push([]);
      for (let j = 0; j < this.lineNum; j++) {
        this.bottomPoints[i].push({
          x: Math.random() * 0.99 * width + 5,
          y: Math.random() * 0.1444 * height + height * 0.9,
          // y: 990,
        });
      }
      this.bottomPoints[i].sort((a, b) => a.y - b.y);
    }

    this.lineAttr = { fill: "none", stroke: "#33cc22", "stroke-width": 0.5 };
  }
  calcYPath = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const mid = {
      x: (p1.x + p2.x) / (2 - Math.random()),
      y: (p1.y + p2.y) / (2 - Math.random()),
    };
    // const mid = {
    //   x: (p1.x + p2.x) / 2,
    //   y: (p1.y + p2.y) / 2,
    // };
    const p3 = { x: p1.x, y: mid.y };
    const p4 = { x: p2.x, y: mid.y };
    return `M ${p1.x} ${p1.y} C ${p3.x} ${p3.y} ${p4.x} ${p4.y} ${p2.x} ${p2.y} `;
  };
  calcPPath = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  };
  update = () => {
    // requestAnimationFrame(this.update);
    this.draw.clear();
    for (let i = 0; i < this.topPoints.length; i++) {
      const group = this.draw.group();
      for (let j = 0; j < this.bottomPoints[i].length; j++) {
        group
          .path(this.calcYPath(this.topPoints[i], this.bottomPoints[i][j]))
          .attr({
            ...this.lineAttr,
            "stroke-width": this.topPoints[i].y / 1000 + 0.05,
            // stroke: this.gradient,
          });
      }
      const control = this.draw.rect(6, 6).attr({
        fill: "#fff",
        stroke: "#f06",
        x: this.topPoints[i].x - 3,
        y: this.topPoints[i].y - 3,
      });
      control.draggable();
      control.on("dragmove.namespace", (e: any) => {
        this.topPoints[i].x = e.detail.box.x;
        this.topPoints[i].y = e.detail.box.y;
        this.update();
      });
    }
  };
}
