// 팀 AI와 함께
// 머신러닝을 활용한 사물 인식 및 필터 적용

let detector;
let img;
let objects = [];
let input, button,button1, greeting;
let downloadButton;
let detectButton;
let imgReloadButton;
let selFilter;
let filterMode=0;

function preload(){
  img = loadImage('b.jpg');
}

function imgReload(){
  resizeCanvas(img.width,img.height);
  detector.detect(img, gotResult);
}

function setup() {
  createCanvas(img.width, img.height);
  detector = ml5.objectDetector('cocossd', modelReady);
  input = createInput();
  input.position(img.width+1,225);

  button = createButton('Input');
  button.position(img.width+1,250);
  button.mousePressed(greet);
  greeting = createElement('h4', 'Watermark');
  greeting.style('color', '#20A4CD');
  greeting.position(img.width+1,175);

  textAlign(CENTER);
  textSize(50);
  
  button1 = createButton('Download Img');
  button1.position(img.width+1,50);
  button1.mousePressed(saving);
  
  downloadButton = createButton('Download Object');
  downloadButton.position(img.width+1,75);
  
  detectButton = createButton('Detect');
  detectButton.position(img.width+1,25);
  
  imgReloadButton = createButton('Reset');
  imgReloadButton.position(img.width+1,100);
  
  selFilter = createSelect();
  selFilter.position(img.width+1,0);
  selFilter.option("Default"); // 기본
  selFilter.option("Threshold"); // 색반전
  selFilter.option("Gray"); // 흑백
  selFilter.option("Invert"); // 색반전2
  selFilter.option("Posterize"); // 강조
  selFilter.option("Blur"); // 흐릿
  selFilter.option("Erode"); // 침식
  
}

function modelReady() {
  console.log('모델 준비 완료!');
  detector.detect(img, gotResult);
}



function gotResult(err, results){
  if(err){
    console.log(err);
    return;
  }
  objects = results;
  
  image(img,0,0);

  detectButton.mousePressed(DetectObject);
  downloadButton.mousePressed(downloadObject);
  imgReloadButton.mousePressed(imgReload);
  selFilter.changed(mySelectEvent);
 
}


//객체 이미지 리사이즈
function resizedObject(object){
  let sx = object.x;
  let sy = object.y;
  let sWidth = object.width;
  let sHeight = object.height;
  
  let ObjectImage;
  ObjectImage=image(img, 0, 0, sWidth, sHeight, sx, sy, [sWidth], [sHeight])
  filteringObject();
  
  return ObjectImage;
}

  //검출된 객체 이미지 파일로 저장
function downloadObject(){
    for (let j=0; j<objects.length; j++){
    background(255);
    createCanvas(objects[j].width,objects[j].height);
    saveCanvas(resizedObject(objects[j]),'png');
    console.log("Object [" +[j] +"]Downloaded");  
  }
}

function DetectObject(){   
  
  for(let i=0; i<objects.length; i++){
    noFill();
    stroke(255, 255, 0);
    strokeWeight(1);
    rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    text("Object Detected", objects[i].x+5, objects[i].y+12);
   }  
  print(objects.length + " Object Detected.");
}


function mySelectEvent() {
  let mode = selFilter.value();
  if(mode == "Threshold"){
    
    filter(THRESHOLD);
    filterMode = 1;
  }
  else if(mode == "Gray"){
   
    filter(GRAY);
    filterMode = 2;
  }
  else if(mode == "Invert"){
    
     filter(INVERT);
    filterMode = 3;
  }
  else if(mode == "Posterize"){
    
      filter(POSTERIZE,3);
    filterMode = 4;
  }
  else if(mode == "Blur"){
    
      filter(BLUR,3);
    filterMode = 5;
  }
  else if(mode == "Erode"){
   
    filter(ERODE);
    filterMode = 6;
  }
  else {
    filterMode = 0;
  }
}

function filteringObject(){
  if(filterMode==1){
      filter(THRESHOLD);
  }
  else if(filterMode == 2){
     filter(GRAY);
  }
  else if(filterMode == 3){
     filter(OPAQUE);
  }
  else if(filterMode == 4){
     filter(INVERT);
  }
  else if(filterMode == 5){
    filter(POSTERIZE,3);
  }
   else if(filterMode == 6){
    filter(DILATE);
  }
   else if(filterMode == 7){
    filter(BLUR,3);
  }
   else if(filterMode == 8){
   filter(ERODE);
  }

}
function greet() {
  const name = input.value();
  input.value('');

  for (let i = 0; i < 10; i++) {
    push();
    fill(random(255), 255, 255,64);
    translate(random(width), random(height));
    rotate(random(2 * PI));
    text(name, 0, 0);
    pop();
  }
}

function saving(){
  saveCanvas('FilterImg', 'png');
}

