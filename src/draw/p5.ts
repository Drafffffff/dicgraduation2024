import P5, { Font, Image, Vector } from "p5";
import stuData from "./data.json";

interface Point {
  x: number;
  y: number;
}
export const sketch = (p: P5) => {
  class Island {
    topPoints: Point[] = [];
    applyedTopPoints: Point[] = [];
    bottomPoints: Point[][] = [];
    // lineAttr: { [key: string]: string | number };
    length = 31;
    lineNum = 100;
    random: number[] = [];
    random2: number[] = [];
    scale: number = 1;
    yScale: number = 1;
    boxTime: number[] = [];
    boxList: { w: number; h: number }[] = [];
    motherP: Point[];

    constructor() {
      this.motherP = [
        { x: 0.2 * p.width, y: 0.15 * p.height },
        { x: 0.42 * p.width, y: 0.4 * p.height },
        { x: 0.77 * p.width, y: 0.6 * p.height },
        { x: 0.2 * p.width, y: 0.8 * p.height },
      ];
      // for (let i = 0; i < this.length; i++) {
      //   this.random.push(Math.random());
      //   this.random2.push(Math.random());
      //   this.topPoints.push({
      //     x: Math.random() * p.width * 0.9 + p.width * 0.05,
      //     y: Math.random() * p.height * 0.45,
      //   });
      // }

      for (let i = 0; i < this.motherP.length; i++) {
        for (let j = 0; j < 7; j++) {
          this.random.push(Math.random());
          this.random2.push(Math.random());
          const c = this.motherP[i];
          const x = p.constrain(c.x + p.random(-100, 100), 0, p.width);
          const y = p.constrain(c.y + p.random(-100, 100), 0, p.height);
          this.topPoints.push({
            x,
            y,
          });
        }
      }

      this.topPoints.sort((a, b) => a.y - b.y);
      for (let i = 0; i < this.length; i++) {
        this.bottomPoints.push([]);
        for (let j = 0; j < this.lineNum; j++) {
          this.bottomPoints[i].push({
            x: Math.random() * p.width * 0.9 + 5,
            y: Math.random() * 100 + p.height - 200,
          });
        }
        this.bottomPoints[i].sort((a, b) => a.y - b.y);
      }
    }
    calcYPath = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      i: number,
    ) => {
      const mid = {
        x: (p1.x + p2.x) / (2 - this.random[i]),

        y: (p1.y + p2.y) / (2 - this.random2[i]),
      };
      const p3 = { x: p1.x, y: mid.y };
      const p4 = { x: p2.x, y: mid.y };
      p.bezier(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, p2.x, p2.y);
      // for (let i = 0; i < 100; i++) {
      //   const x = p.bezierPoint(p1.x, p3.x, p4.x, p2.x, i / 1000);
      //   const y = p.bezierPoint(p1.y, p3.y, p4.y, p2.y, i / 1000);
      //   p.point(x, y);
      // }
    };
    applyField = (field: Vector[]) => {
      for (let i = 0; i < this.topPoints.length; i++) {
        const p = this.topPoints[i];
        const x = Math.floor(p.x / scl);
        const y = Math.floor(p.y / scl);
        const index = x + y * cols;
        const f = field[index];
        console.log(p);
        console.log(index);

        this.applyedTopPoints[i] = {
          x: p.x + f.x,
          y: p.y + f.y,
        };
      }
    };
    updata = () => {
      for (let i = 0; i < this.topPoints.length; i++) {
        p.push();
        // let x = 100 * p.noise(p.cos(0.009 * p.frameCount) + i);
        // let y = 100 * p.noise(p.sin(0.009 * p.frameCount) + 10000 + i);
        let x = 0;
        let y = 0;
        const bt = p.height - this.applyedTopPoints[i].y + y;
        const p1 = {
          // x: (this.topPoints[i].x + x) * this.scale,
          // y: (p.height - bt * this.yScale + 5 * unit) * this.scale,
          x: (this.applyedTopPoints[i].x + x) * this.scale,
          y: (p.height - bt * this.yScale + 5 * unit) * this.scale,
        };
        p.noFill();
        const c = p.map(p1.y, 0, 600, 0, 1);
        const cColor = p.lerpColor(p.color("#b4fd59"), p.color("#17da05"), c);
        p.stroke(cColor);
        for (let j = 0; j < this.bottomPoints[i].length; j++) {
          p.strokeWeight((p1.y / p.height) * 0.8 + 0.06);
          this.calcYPath(p1, this.bottomPoints[i][j], i);
        }
        p.fill("#ff4729");
        p.noStroke();
        const rw = 0.8 * unit;
        p.rect(p1.x - rw / 2, p1.y - rw / 2, rw, rw);
        p.noFill();
        p.stroke("#ff4729");
        p.strokeWeight(0.5);
        if (this.boxTime[i] >= 0) {
          const rww = this.boxList[i].w + p.random(-5, 5);
          const rwh = this.boxList[i].h + p.random(-5, 5);
          const offsetX = p.random(-rww * 0.1, rww * 0.1) / 2;
          const offsetY = p.random(-rwh * 0.1, rwh * 0.1) / 2;
          p.rect(p1.x - rww / 2 + offsetX, p1.y - rwh / 2 + offsetY, rww, rwh);
          p.fill("#103004");
          p.textFont(normal);
          p.text(stuData[i].name, p1.x + offsetX, p1.y + offsetY);
          this.boxTime[i]--;
        } else {
          if (p.random(1) > 0.995) {
            const rww = p.random(3, 6) * unit;
            const rwh = p.random(2.5, 5) * unit;
            p.rect(p1.x - rww / 2, p1.y - rww / 2, rww, rwh);
            this.boxList[i] = { w: rww, h: rwh };
            if (p.random(1) > 0.5) {
              this.boxTime[i] = Math.floor(p.random(0, 120));
            } else {
              this.boxTime[i] = Math.floor(p.random(0, 10));
            }
          }
          if (p.random(1) > 0.999) {
            const rww = p.random(30, 100) * unit;
            const rwh = p.random(30, 60) * unit;
            p.rect(p1.x - rww / 2, p1.y - rww / 2, rww, rwh);
          }
        }
        p.pop();
      }
    };
  }

  let inc = 0.1;
  let rows: number, cols: number;
  let scl: number;
  let i: Island;
  let unit: number;
  let zoff = 0;
  const flowField: Vector[] = [];
  let normal: Font;
  let btimg: Image;

  p.setup = () => {
    normal = p.loadFont("./SinkinSans-400Regular.otf");
    btimg = p.loadImage("./btimg.png");

    p.createCanvas(1024, 1280);
    p.background(255);
    scl = p.width / 20;
    rows = p.width / scl;
    cols = Math.floor(p.height / scl);

    // p.pixelDensity(2);
    i = new Island();
    unit = p.sqrt(p.height * p.width) / 100;
  };
  p.draw = () => {
    p.clear();
    p.push();
    p.translate(0, p.width * 0.03);
    // p.background(255);
    var yoff = 0;
    p.noiseDetail(7, 0.4);
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = p.noise(xoff, yoff, zoff) * p.TWO_PI;
        const v = Vector.fromAngle(angle);
        v.setMag(50);
        flowField[index] = v;
        xoff += inc;
        // p.strokeWeight(1);
        // p.stroke(0, 50);
        // p.push();
        // p.translate(x * scl, y * scl);
        // p.rotate(v.heading());
        // p.line(0, 0, scl, 0);
        // p.pop();
      }
      yoff += inc;
      zoff += 0.0001;
    }
    i.applyField(flowField);
    i.updata();
    // p.noLoop();
    // i.scale = (slider.value() as number) / 100;
    // i.yScale = (yScaleSlider.value() as number) / 100;
    p.pop();
    p.image(btimg, 0, 0, p.width, p.height);
  };
};
