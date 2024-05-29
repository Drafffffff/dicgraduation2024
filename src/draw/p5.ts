import P5, { Font, Image, Vector } from "p5";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import stuData from "./data.json";
const isRec = true;

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
    length = 30;
    lineNum = 90;
    random: number[] = [];
    random2: number[] = [];
    scale: number = 1;
    yScale: number = 1;
    boxTime: number[] = [];
    boxList: { w: number; h: number }[] = [];
    isGrowEndList: boolean[] = [];
    growCompleteList: number[] = [];
    growLineCompleteList: boolean[][] = [];

    constructor() {
      this.init();
    }
    init = () => {
      this.random = [];
      this.random2 = [];
      this.topPoints = [];
      this.bottomPoints = [];
      this.isGrowEndList = [];
      this.growCompleteList = [];
      this.growLineCompleteList = [];
      this.boxTime = [];
      this.boxList = [];
      this.applyedTopPoints = [];

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
        this.growLineCompleteList.push([]);
        for (let j = 0; j < this.lineNum; j++) {
          this.growLineCompleteList[i].push(false);
          this.bottomPoints[i].push({
            x: Math.random() * p.width * 0.9 + p.width * 0.05,
            y: p.height,
          });
        }
        this.bottomPoints[i].sort((a, b) => a.y - b.y);
      }
    };
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
      fram: number,
    ) => {
      const mid = {
        x: (p1.x + p2.x) / (2 - 0),
        y: (p1.y + p2.y) / (2 - 0),
      };
      const p3 = { x: p1.x, y: mid.y };
      const p4 = { x: p2.x, y: mid.y };

      if (this.growLineCompleteList[i][j]) {
        p.bezier(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, p2.x, p2.y);
        return;
      } else {
        let offsetCount = fram - this.random[i] * 200 + p.noise(i, j) * 50;
        if (offsetCount < 0) {
          offsetCount = 0;
        }
        const cc = 170;
        const maxValue = cc * p.map(this.random2[i], 0, 1, 0.7, 1.3);

        let linePose = p.map(
          (offsetCount % cc) * p.map(this.random2[i], 0, 1, 0.7, 1.3),
          0,
          maxValue,
          1,
          0,
        );

        linePose = this.easeOutSine(linePose);
        if (linePose < 0.001) {
          if (!this.growLineCompleteList[i][j]) {
            this.growCompleteList[i] += 1;
            this.growLineCompleteList[i][j] = true;
          }
          if (this.growCompleteList[i] == this.bottomPoints[i].length) {
            this.isGrowEndList[i] = true;
            // this.reInit(i);
          }
        }
        const lineEndX = p.bezierPoint(p1.x, p3.x, p4.x, p2.x, 1 - linePose);
        const lineEndY = p.bezierPoint(p1.y, p3.y, p4.y, p2.y, 1 - linePose);
        const mid = {
          x: (p1.x + lineEndX) / (2 - 0),
          y: (p1.y + lineEndY) / (2 - 0),
        };
        p.bezier(p1.x, p1.y, p1.x, mid.y, lineEndX, mid.y, lineEndX, lineEndY);
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
    delayTime = 100;
    updata = (fram: number) => {
      for (let i = 0; i < this.topPoints.length; i++) {
        p.push();
        // let x = 100 * p.noise(p.cos(0.009 * p.frameCount) + i);
        // let y = 100 * p.noise(p.sin(0.009 * p.frameCount) + 10000 + i);
        let x = 0;
        let y = 0;
        const bt = p.height - this.applyedTopPoints[i].y + y;
        const timeoffset = this.random[i];

        if (fram % 10 === timeoffset) {
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
        p.fill("#fff");
        p.stroke("#ff4f4f");
        p.strokeWeight(0.8);
        const rw = 0.8 * unit;
        p.rect(p1.x - rw / 2, p1.y - rw / 2, rw, rw);
        if (fram < this.delayTime) continue;
        const c = p.map(p1.y, 0, p.height * 0.7, 0, 1);
        const cColor = p.lerpColor(p.color("#00cDdB"), p.color("#17ca05"), c);
        p.noFill();
        p.stroke(cColor);

        for (let j = 0; j < this.bottomPoints[i].length; j++) {
          p.strokeWeight((p1.y / p.height) * 0.8 + 0.1);
          this.calcYPath(
            p1,
            this.bottomPoints[i][j],
            i,
            j,
            fram - this.delayTime,
          );
        }

        p.noFill();
        p.fill("#fff");
        p.stroke("#ff4f4f");
        p.strokeWeight(0.8);
        p.rect(p1.x - rw / 2, p1.y - rw / 2, rw, rw);
        // if (this.isGrowEndList[i]) {
        // if (this.boxTime[i] >= 0) {
        //   const rww = this.boxList[i].w + p.random(-5, 5);
        //   const rwh = this.boxList[i].h + p.random(-5, 5);
        //   const offsetX = p.random(-rww * 0.1, rww * 0.1) / 2;
        //   const offsetY = p.random(-rwh * 0.1, rwh * 0.1) / 2;
        //   p.rect(
        //     p1.x - rww / 2 + offsetX,
        //     p1.y - rwh / 2 + offsetY,
        //     rww,
        //     rwh,
        //   );
        //   p.fill("#103004");
        //   p.textFont(normal);
        //   p.textSize(15);
        //
        //   p.text(stuData[i].name, p1.x + offsetX, p1.y + offsetY);
        //   this.boxTime[i]--;
        // } else {
        //   if (p.random(1) > 0.995) {
        //     const rww = p.random(3, 6) * unit;
        //     const rwh = p.random(2.5, 5) * unit;
        //     p.rect(p1.x - rww / 2, p1.y - rww / 2, rww, rwh);
        //     this.boxList[i] = { w: rww, h: rwh };
        //     if (p.random(1) > 0.5) {
        //       this.boxTime[i] = Math.floor(p.random(0, 120));
        //     } else {
        //       this.boxTime[i] = Math.floor(p.random(0, 10));
        //     }
        //   }
        //   if (p.random(1) > 0.999) {
        //     const rww = p.random(30, 100) * unit;
        //     const rwh = p.random(30, 60) * unit;
        //     p.rect(p1.x - rww / 2, p1.y - rww / 2, rww, rwh);
        //   }
        // }
        // }
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
  const time = 600;
  const outTime = 45;
  const imageList: string[] = [];
  const batchSize = 300;

  p.setup = () => {
    normal = p.loadFont("./SinkinSans-400Regular.otf");
    btimg = p.loadImage("./btimg2.png");
    p.frameRate(30);

    p.createCanvas(1200, 1600);
    p.background(255);
    scl = p.width / 20;
    rows = p.width / scl;
    cols = Math.floor(p.height / scl);

    p.pixelDensity(2);
    i = new Island();
    unit = p.sqrt(p.height * p.width) / 100;
  };
  p.draw = () => {
    const fram = p.frameCount % time;
    p.background(255);
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
    i.updata(fram);
    // p.noLoop();
    // i.scale = (slider.value() as number) / 100;
    // i.yScale = (yScaleSlider.value() as number) / 100;
    p.pop();

    if (fram > time - outTime && fram < time) {
      const trans = p.map(fram, time - outTime, time, 0, 255);
      const c = p.color(255, trans);
      p.background(c);
    }
    if (fram == time - 1) {
      for (let j = 0; j < i.length; j++) {
        i.init();
      }
    }
    // p.image(btimg, 0, 0, p.width, p.height);
    //导出
    if (!isRec) return;
    if (p.frameCount <= time) {
      //ts-ignore
      imageList.push((p.get() as any).canvas.toDataURL());
      console.log(
        `current frame: ${p.frameCount} \n percent: ${(p.frameCount / time) * 100}`,
      );
    }
    if (p.frameCount === time) {
      let zip = new JSZip();
      const processFramesInBatches = async () => {
        for (let i = 0; i < imageList.length; i += batchSize) {
          zip = new JSZip();
          const batch = imageList.slice(i, i + batchSize);
          await processBatch(batch, i);
          const zipBlob = await zip.generateAsync({ type: "blob" }, (e) => {
            console.log(`正在处理：${e.currentFile} 进度：${e.percent}`);
          });
          saveAs(zipBlob, "FLframes.zip");
        }
      };

      const processBatch = async (batch: string[], offset: number) => {
        for (let i = 0; i < batch.length; i++) {
          const imgData = batch[i].split(",")[1];
          console.log("正在处理第", offset + i + 1, "帧图片");
          zip.file(`${String(offset + i + 1).padStart(4, "0")}.png`, imgData, {
            base64: true,
          });
        }
      };

      processFramesInBatches();
      // for (let i = 0; i < imageList.length; i++) {
      //   const imgData = imageList[i].split(",")[1];
      //   console.log("正在处理第", i + 1, "帧图片");
      //
      //   zip.file(`${String(i + 1).padStart(4, "0")}.png`, imgData, {
      //     base64: true,
      //   });
      // }
      // console.log("download");
      //
      // // 创建 zip 并下载
      // zip
      // .generateAsync({ type: "blob" }, (e) => {
      //   console.log(`正在处理：${e.currentFile} 进度：${e.percent}`);
      // })
      //   .then((content) => {
      //     console.log("start download");
      //     saveAs(content, "frames.zip");
      //     console.log("finished");
      //   });
    }
  };
};
