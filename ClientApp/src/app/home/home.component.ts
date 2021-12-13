import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { fabric } from 'fabric';
import Annotation from '../interfaces/annotation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public page: Page;
  protected _canvas?: fabric.Canvas;
  image?: fabric.Image;

  constructor(@Inject('BASE_URL') baseUrl: string, sanitizer: DomSanitizer) {
    const url = sanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'page');
    this.page = new Page(url);
    this.renderPageOnCanvas((this.page.src as any).changingThisBreaksApplicationSecurity as string);
  }

  ngOnInit() {}

  renderPageOnCanvas(url: string) {
    fabric.Image.fromURL(url, (oImg) => {
      oImg.scaleX = 0.5;
      oImg.scaleY = 0.5;
      this.image = oImg;
      this._canvas = new fabric.Canvas('fabricSurface', {
        selection: false,
        preserveObjectStacking: true,
        width: this.image.width * 0.5,
        height: this.image.height * 0.5,
        isDrawingMode: true
      });
      this._canvas.setBackgroundImage(
        this.image,
        this._canvas.renderAll.bind(this._canvas)
      );
      this.addRectangle();
      this.addArrow();
      this.addPolygon();
      this.addPolyline();
      this.addEllipse();
      this.addText();
      this.addStamp();
      this._canvas.renderAll();
    })
  }

  addStamp() {
    const encodedImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASMAAACtCAMAAADMM+kDAAAAk1BMVEX/////AAD/9vb//Pz/7+//8vL/6Oj/9fX/1NT/5OT/+fn/2dn/39//6+v/0ND/5ub/OTn/T0//v7//xsb/mJj/e3v/Ly//Skr/ubn/rq7/ysr/WVn/jY3/iIj/u7v/goL/QUH/Gxv/p6f/Jib/bW3/s7P/Dg7/Kyv/dHT/Hh7/m5v/X1//a2v/W1v/Y2P/k5P/o6MlsYDcAAAPLklEQVR4nO1daWOqOhAVQVTE3bpdraIVly76/3/dJWQSzBAENZSoPV9eXy9imM7MSc5MQqmUAPdjOXeT/vEPBK5B0Hkvehw6Y2QADuWih6IrXCPC7i/kpHgzzrHsFT0eDeEYGKe/kEM4xWxkGG9/ISfAD63iLUQrjf5CLkKP2uRYcg6ilfyVU/TYdAEQv0V+7i1FMy3qRY9OCwDxf8D/Nnailbr9QkenB4D4a/wX1YFopf3ELHB4OqBMDdERfjnuiGaa2wWNTg8A8W/Qr2sfopW+p4WMTg9Q4jfi/2AdRSttXzbkgPgH0n/coJCbvWbIAddXEv659iVa6af1q6PTAkD8u+QrrJlopSHOXE8PIP7GxYs2QxRyzV8anRYA4l+mXTf9Ea309UIhBwu0DBqtPRet1BnnPzo9YCQRvwTmZCtYyR9YOY9OCwDxH7JeP/0Unemjlv6ZRwcQ/xWiYxuF3PLZSymNVOKXwFmtBSt5h6cOOVBBrlZl+/9EZ9pdnjo8Mqr0CUc3fNR9FV0XiP+2x6uexJBbn5KWMw+Na4hfhl5XdKYnLKW80yc73XELVyxeGt1nCznQPe4rfVQOe8FK29UzhRwQ/9vdN3pHIbd4npD7uJH4JcCllH9PUkqpQAZRczdr4AlWGk6eoWFgcA/xS2COR4KV/Cdoi4MnUXnLGgq5zwcvpYzvJ34Jmkcx5DoPHXJKiF8CZyM2DHizh20YqKkifglaT1JKgcfI6W9sz3wx5DYP2KNjwTwmty9wJmL1cn98uOolVKlznepNUch9PFjIQT7N+Vtiuu74gRoGgPhXSm8qY/nqSgy59eBhQg7Krkr/qtWOvOGtj6qXu8copQDxL5TelJShOlJhJKbrvj9AyEEyVev2tLnCkwojlZPYMLA96N4wkBPxs44uacOb2ROrl/6b3qUUeBjVC86onrScSEMuputqHHJ0iHvFd20wDwlDTkqZFgq54UnX6uWGDlAt8Udbl3YW+Smh9Ov0xOqlriGXB/GXSk22QmuF2VveXknQQCGno64LxD9XfFvW9j4yQxtdmgRZB7FHp7PSLeSAXxTPdx322Bs6C7j81M5YLKXIZwyFAYj/S/FtoZHJ2FfD7N1NjeSYrqtRyEFX/1axfzO/mAU/277xVuqnLjmaR7FhoCOdMRQBPpVT6t81dtdw/tyeTS0/w36l8kYMub0mpZRzVvmnbBrJAoft7yq1MiZjvCvlR4dSiisMSZF/c+IPAswN7+hQTWS/SOUGeyaG3HJSVTGku1DLwb8Z8XeJA+3DDklWkJyU6mn5uzoRq5drDUopuDp/d6mQE/+uWekQs5R4N+qoXB2mO6uJSykatMhjSllu7vLvd34jb0vpv2TRL/gww3S+n6fWRepzsUdntCm8eokp5S7/ZqFCcxCh/1KdZqhD4GRk7bPMUDuqrMTq5fbYvn1IihCjlFv9mxO/3SZPGWZpoIYg7IgIuc+2b8JEu1J8DXRde4b8e3yTfzNb78IfKf2D3foVss4/hV5UbrRajbQvcOeeMKTubUNSCUwp2+P1IWefEf+SrWZb9Fc9En50v9sg1BuGizQxxEKllGHxpZQYpVy9BeSM+M0ha/aG9VtgPp+yZsSlX2lpxukjXVeDkGvH/Pua6rzDKJLkHHsGSY2fENChFpmcP3P6Rkp3ITYMdHuFNwxUVmLIDQ/Z/RvqmcZaSBysXPQPViPAostNWLqdpN/WOokh1ym+lHI7pTDrisoj5PEdGK4Cs8w6WCvL3N7pfQtD8jTQdW/zb3HFz0Fl6yVfhlC/WgTT1z38EMz3U5+58SYO6Z8GIXcSZ3GdU5p/1/nqD4n8XfzLVdc3Rk2mX5E5peUb36nP3DwM0ZAK13UxpXiXd13VoytJaI6/WJeuSxO50CZn2SbXA7wmFJuWqc9cfhdLKTroujjkLvl3xFakzZvwPX3iGsxNzwoLlRBVyPCdIE+ZNJN56SwX13ULr15aB0QpiVJZmQdnj04bqY7dZ59kebz11h1SeFFkNj320XI7TRiwB2LILYsvpeBS4T6RUlhw9qst4jvhZSv+OeB4VFGD62D33Hbz1fGGn2k0Wh3rp+viUmGyf9PgHHK/IUdvfHLvCsC72X7m4KDE3crwM4vs9A0HcV238JBrZvZvFpyhAkJsu4EZQTjHnrK/fKNUgTxFUlDPELHNoBq3j2L1clR8KaWMdl3tEymlHM73WqVyLfjvtsYyEpk6mCxljXl4DcnMEqL5q9kAhwpWMVa7neIaFax7zYvXdTGlJPt34+1Ap9drmy/XiI3YWqXLiT8MSTb3bPCWseP4c+376ZuXNdR17SMKuQv+HSprXoVNq/ckONnfvR9puiQEwfb/ggAS5xoX2ikY6qiUMtoUHnKYUtaJlOJsyJzHKvWow5BZEGtLIssSCK+Q+MEwvaj/bckePEP0VLDuNdNP1030b7P188bnRyOTshzBJDLXGfEHVqwOmfs04bnJvftpzI4X4TocfdKeIUpJ9G+T62nEYeC59xU+TSJ9mMwwB56vPIuLBUFU2lnSjItKKd1x4dXLyiarrssiIfASGx5jEWm6RIsDw/g2z1dnFzQgo3dTK1oWKqUMi9+VEtd1k0MuvLLJS+ctznXnxP8W8ZsbxZ/D/Wyd6ksmWoTr0CJfn4uUkuzf9Zn3w+tsQR6vQqySs5bOiB/i6zOYY0H8ka2ZLHW16uMed436ciDTatyFJwzp33vhpRRrgvx7kEQpVpBiTJgSnWzIRj55zIj4mbrS5/EXThjgAi/89AKeeZHUY9o84VKKdrruRf9eiZeGkhJzrndO/GQVEyWmUlv8zA+9Fb32W9bW7fRFXVeHfl13IVLKBf8G8mfXk7GDYYKUznTukxB/LHV5vdqWGbMUtQXJ/yIa6roxSkkspbR239+7KcyZzon/xHvFCfFDeAWJiWemFZuw09ov87mkITWx7lX8AV+YUvyLui5kYbIaY8RvCcRvRBeA5fZ8yhRubamsueWSEGuR10LX9TL7N81hRHUDw4jED+FFEpMZs1xoo0lkuQto7MSQ++wXHnKYUpJLKeWQ2OYlm5UnoxX/jxB/rFeAWO7IL2Dyd3rzfUzX1aCUknkLiHv8/LGYPkISD0vCfSExnWWmMqT0YymS6jKseLHupUMpBVPKJf/mNcsep7wgvkwJ8U+55cJtZJHPZUHtQxySDrouopRk/3bYqq/BiX8lJCZOXybPXJ4tWC4bYrpu8Qd8Ob3M/k3XcsfzJBytSPiaZRIlJvJr5nP0FqY7ma0aKdm4ihbhnha6LvLv5FLKbB24DMzWF9GKhDjJGfEzjWVc4tUCWo2Cv8f1uu5Pq/CQy14qtBp88e8KKxIWX/NoykQK3+BzaxIv1aisdUwdUkzX1aCUckWpECzT4MRPZodx4idSHSuuEOKv0G/wj8TNMpwoXEGnDe01eHFDTNdNpBQ3FFp65+HFMhOZMjEHaAnEb8Ls/lAyg/jrZIodDU+Rz14qtCbLZZXROnGSs8zEiJ+0W8Azkl134F2+TbfiZZTUXKx73de1rwKYUtaJdQvT4vvFyNyT0ZfJp0wkYzPLtaJY3EErU+aXVGDda128rhujlI9kSpl4zAIS4ifzJOgYID27zPY10sRrwK6CjMCnyOug68ZKhUn+TRtEo/gitX9G/BOB+FkZs8saBq6xUVz30qBFvpLZv53pv26ZE/9nFF7EjUDL3Faj5oFgZkSVx2sPJsQt8ttj4SveGKUk+3c1ii/P5c3LQb5xwDCzqPtrW2YL4usZysSnyOug68ZKhYn+DcS/N7ZMnv4uRYapn+0G/tenRvRvWl403jxhSBrqutuELSAsvqI2S5/MQCPitw2M5Y1DauKjTzR4VwqqW0jfkmCDMUYmDwaytfuM+NlrT7+4GJP5zSgxmBqeIh8vFSL/5o3Mk1KDmmAf7n6HzESIn9muwfu271rJY133u3hdF28BGYpbQHg+Dojf7frGdh66vwWm3fAzLqi8HYox9x53Ycda5Atf8V6mFBjwOkxWdZdmdta7uq1GFW4mibQUrLvMd3FFYGjwqitMKcJ2CHpWy/nuAGaWUAWBGeZQcUQgXbf4bq+0LSC1D+EvyWbbPhk5pOzb83QS2oOzFUGGjWO/gBilCLqufb6uq8GMKDxSn9rIy6PhwRnz6Yk2r3LEuu6FFnk6BSVWpAVeeqylNVE9oanBiIqXAzhwi7z8/E2CSrDE2pIMTqeQNM3vlJ8op/YlEIrgIErxk9/xPg1XeeHCjdayyWpN8TlXOR0JeTda15UKVywdhQKcYvWHjiDvs6BvgR07TeuCiBpKIwPTtL4M1cft5nUkpBqUx+KK179QKnTDLU4hK34rHgZkR8V3VYfsW0DqLIWpPruxlc9tVaKOjj5ZJr2YxOx/Dvcd9Wt00Bx0mGQnozrBLyZJnKjkUPZp0i/N7yUQqhDbAvJ7pcKZpsQvAT7aZ/RbLyahX7f+nS+7F9XYi0l+ox8d1GE9lrNZENN18y8VbjUnfgliR59cddrQ9XgA4pegshJXvPtc6xb5nAX9C/i9UuHDEL8EuF+3m9OLSaDlovimpJtgncROpvUhj7rFQxG/DPmXCh+O+CWIvf1W8Qun149H/BJYB1Fk2qosFUKv5XWNTFoClwrVbQGBGWvh20tVAB998q3mLQnQi/Kp5GbFozkQRabhSkGn3uKhiV8CE+m6xt1bQEzIcEqGpwtiW0Du03yg11Kb4qwi2Ef09tvJHSve/VMQvwTmRhSZjJu3gPSfhvglaOEtILeFHKybi2+GzAft2Aunr1/xwu7KjBtQHxHORBSZjNm1E8GnI34ZpkjXva6U4tAPDfManS6o4xdOX0HjT0r8EjgrccVrZN4C4j0r8cuAdd1spRQ46jR9U+6TAL9wepmhh7j73MQvQfkkrnj9NF0XNhaofu2j5sC67uVT5KE7vvjNkL8M/MLpUfLm9lchfgmqB3H67R8SRCZ4e6gGex+KQA+JTPJSiv9KxC8BLqV046WUVyN+CSoD0UreCYlMkN4L34tVLMZIZBJa5N2XJH4JakjXPXvH+6sSvwTWUbSSt6IiU5n+b6fg4emCDRKZ5mdb4V6U+CXAuu73FFpFXpf4JbBmhgzqd1Q+NjbruI1enPglwEf7RG+J/0OEpqjr/hG/HHAe1R/xX8SU6bqK2+GeC/To5b9lSAreJ8m17/+BH/ZXqYVMVwAAAABJRU5ErkJggg==";
    fabric.Image.fromURL(encodedImage, (image) => {
      // image.scale(0.5)
      image.top = 200;
      image.left = 200;
      // image.cropX = 200;
      // image.cropY = 200;
      image.backgroundColor = 'red',
      image.angle = 90;
      this._canvas.add(image)
    })

  }

  addText() {
    const text = new fabric.Text('Hello World!',{
      left: 150, 
      top: 200,
      fontSize: 15,
      fontWeight: 'normal',
      fontFamily: 'Arial',
      fontStyle: 'italic',
      // overline: true,
      // underline: true,
      // linethrough: true,
      fill: 'red', // text color
      opacity: 0.5,
      backgroundColor: 'black',
      // angle: 180
    });
    this._canvas.add(text)
  }

  addEllipse() {
    const {start, end} = {start: {x: 100, y: 100}, end: {x: 200, y: 300}}
    const ellipse = new fabric.Ellipse({
      rx: Math.abs(end.x - start.x),
      ry: Math.abs(end.y - start.y),
      top: start.y,
      left: start.x,
      // angle: 90,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1
    })
    this._canvas.add(ellipse);
  }

  addPolyline() { //which is freehand
    const points = [ 
      {x: 0, y: 0},
      {x: 200, y: 250},
      {x: 300, y: 300},
      {x: 350, y: 100},
    ];
    const polyline = new fabric.Polyline(points,{
      fill: 'transparent',
      stroke: 'red', //border
      strokeWidth: 5,
      left: 0,
      top: 0
    })
    this._canvas.add(polyline)
  }

  addPolygon() {
    const points = [ 
      {x: 0, y: 0},
      {x: 200, y: 250},
      {x: 300, y: 300},
      {x: 350, y: 100},
    ];
    const polygon = new fabric.Polygon(points,{
      fill: 'red', //background
      stroke: 'black', //border
      strokeWidth: 1,
    })
    this._canvas.add(polygon)
  }

  addRectangle() {
    const rect = new fabric.Rect({
      top: 0,
      left: 0,
      width: 200,
      height: 200,
      opacity: 0.5,
      fill: "#000000"
    })
    this._canvas.add(rect);
  }

  addArrow() {
    let {fromy, fromx, toy, tox} = {
      fromy: 0,
      fromx: 0,
      toy: 200,
      tox: 200
    }
    const angle = Math.atan2(toy - fromy, tox - fromx);
    const headlen = 10;  // arrow head size
    const circleRadius = 8;
  
    // bring the line end back some to account for arrow head.
    tox = tox - (headlen) * Math.cos(angle);
    toy = toy - (headlen) * Math.sin(angle);
    fromx = fromx + circleRadius * 1.75;
    fromy = fromy + circleRadius * 1.75;
  
    // calculate the points.
    const points = [
      {
        x: fromx,  // start point
        y: fromy
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
        y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      },{
        x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2), 
        y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
      },{
        x: tox + (headlen) * Math.cos(angle),  // tip
        y: toy + (headlen) * Math.sin(angle)
      }, {
        x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      },{
        x: fromx,
        y: fromy
      }
    ];
  
    const pline = new fabric.Polyline(points, {
      fill: 'white',
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
    });
    const circle = new fabric.Circle({
      radius: circleRadius,
      top: 1,
      left: 1,
      fill: 'white',
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
    })
    const arrowLineGroup = new fabric.Group([pline, circle])
    this._canvas.add(arrowLineGroup);
  }
}

class Page {
  src: SafeUrl;

  constructor(src: SafeUrl) {
    this.src = src;
  }
}
