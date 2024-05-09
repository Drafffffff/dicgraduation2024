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
    length = 41;
    lineNum = 80;
    random: number[] = [];
    random2: number[] = [];
    scale: number = 1;
    yScale: number = 1;
    boxTime: number[] = [];
    boxList: { w: number; h: number }[] = [];
    isGrowEndList: boolean[] = [];
    growCompleteList: number[] = [];

    constructor() {
      for (let i = 0; i < this.length; i++) {
        this.random.push(Math.random());
        this.random2.push(Math.random());
        this.isGrowEndList.push(false);
        this.growCompleteList.push(0);
        this.topPoints.push({
          x: Math.random() * p.width * 0.9 + p.width * 0.05,
          y: Math.random() * p.height * 0.55,
        });
      }

      this.topPoints.sort((a, b) => a.y - b.y);
      for (let i = 0; i < this.length; i++) {
        this.bottomPoints.push([]);
        for (let j = 0; j < this.lineNum; j++) {
          this.bottomPoints[i].push({
            x: Math.random() * p.width * 0.9 + p.width * 0.05,
            y: p.height,
          });
        }
        this.bottomPoints[i].sort((a, b) => a.y - b.y);
      }
    }
    easeOutSine = (x: number) => {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    };

    reInit = (i: number) => {
      this.random[i] = Math.random();
      this.random2[i] = Math.random();
      this.isGrowEndList[i] = false;
      this.growCompleteList[i] = 0;
      this.topPoints[i] = {
        x: Math.random() * p.width * 0.9 + p.width * 0.05,
        y: Math.random() * p.height * 0.65,
      };
    };
    calcYPath = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      i: number,
      j: number,
    ) => {
      const mid = {
        x: (p1.x + p2.x) / (2 - this.random[i]),
        y: (p1.y + p2.y) / (2 - this.random2[i]),
      };
      const p3 = { x: p1.x, y: mid.y };
      const p4 = { x: p2.x, y: mid.y };

      if (this.isGrowEndList[i]) {
        p.bezier(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, p2.x, p2.y);
        return;
      } else {
        let offsetCount =
          p.frameCount - this.random[i] * 200 + p.noise(i, j) * 50;
        if (offsetCount < 0) {
          offsetCount = 0;
        }
        const maxValue = 170 * p.map(this.random2[i], 0, 1, 0.7, 1.3);

        let linePose = p.map(
          (offsetCount % 170) * p.map(this.random2[i], 0, 1, 0.7, 1.3),
          0,
          maxValue,
          1,
          0,
        );
        linePose = this.easeOutSine(linePose);
        if (linePose < 0) {
          this.growCompleteList[i]++;
          if (this.growCompleteList[i] > this.bottomPoints[i].length) {
            this.isGrowEndList[i] = true;
            this.reInit(i);
          }
        }
        const lineStartX = p.bezierPoint(p1.x, p3.x, p4.x, p2.x, linePose);
        const lineStartY = p.bezierPoint(p1.y, p3.y, p4.y, p2.y, linePose);
        const mid = {
          x: (lineStartX + p2.x) / (2 - this.random[i]),
          y: (lineStartY + p2.y) / (2 - this.random2[i]),
        };
        p.bezier(
          lineStartX,
          lineStartY,
          lineStartX,
          mid.y,
          p2.x,
          mid.y,
          p2.x,
          p2.y,
        );
        // p.bezier(lineStartX, lineStartY, p3.x, p3.y, p4.x, p4.y, p2.x, p2.y);
      }

      // for (let i = 0; i < 100; i++) {
      //   const x = p.bezierPoint(p1.x, p3.x, p4.x, p2.x, i / 1000);
      //   const y = p.bezierPoint(p1.y, p3.y, p4.y, p2.y, i / 1000);
      //   p.point(x, y);
      // }
    };
    applyField = (field: Vector[]) => {
      for (let i = 0; i < this.topPoints.length; i++) {
        const point = this.topPoints[i];
        const x = Math.floor(point.x / scl);
        const y = Math.floor(point.y / scl);
        const index = p.constrain(x + y * cols, 0, 499);
        const f = field[index];

        this.applyedTopPoints[i] = {
          x: point.x + f.x,
          y: point.y + f.y,
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
        const timeoffset = this.random[i] * 10;
        if (p.frameCount % 10 === timeoffset) {
          x = p.random(-10, 10);
          y = p.random(-10, 10);
        }

        const p1 = {
          // x: (this.topPoints[i].x + x) * this.scale,
          // y: (p.height - bt * this.yScale + 5 * unit) * this.scale,
          x: (this.applyedTopPoints[i].x + x) * this.scale,
          y: (p.height - bt * this.yScale + 5 * unit) * this.scale,
        };
        p.noFill();
        const c = p.map(p1.y, 0, p.height * 0.7, 0, 1);
        const cColor = p.lerpColor(p.color("#00cDdB"), p.color("#17ca05"), c);
        p.stroke(cColor);
        for (let j = 0; j < this.bottomPoints[i].length; j++) {
          p.strokeWeight((p1.y / p.height) * 0.8 + 0.06);
          this.calcYPath(p1, this.bottomPoints[i][j], i, j);
        }

        p.fill("#fff");
        p.stroke("#ff4f4f");
        p.strokeWeight(0.8);

        if (this.isGrowEndList[i]) {
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
            p.rect(
              p1.x - rww / 2 + offsetX,
              p1.y - rwh / 2 + offsetY,
              rww,
              rwh,
            );
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
    p.frameRate(30);

    p.createCanvas(1024, 1280);
    p.background(255);
    scl = p.width / 20;
    rows = p.width / scl;
    cols = Math.floor(p.height / scl);

    p.pixelDensity(1);
    i = new Island();
    unit = p.sqrt(p.height * p.width) / 100;
  };
  p.draw = () => {
    p.clear();
    p.push();
    // p.translate(0, -p.width * 0.1);
    // p.background(255);
    var yoff = 0;
    p.noiseDetail(7, 0.4);
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        let index = x + y * cols;
        let angle = p.noise(xoff, yoff, zoff) * p.TWO_PI;
        const v = Vector.fromAngle(angle);
        v.setMag(100);
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
