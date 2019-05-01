var onLoad = function(e){
  var h = document.querySelector('.hour');
  var m = document.querySelector('.minute');
  var s = document.querySelector('.second');
  var t = new Date();
  hv = t.getHours();
  mv = t.getMinutes();
  sv = t.getSeconds();

  h.dataset.initialValue = hv;
  m.dataset.initialValue = mv;
  s.dataset.initialValue = sv;
  h.dataset.offset = 60 * mv + sv + 0.1 * hv;
  m.dataset.offset = sv + 0.1 * mv;
  s.dataset.offset = 0.1 * sv;

  var flips = document.querySelectorAll('.flip');
  for(var flip of flips){
    var n = 10;
    var every = 1;
    var initialValue = 0;
    var offset = 0;

    if(flip.dataset.flapNum){
      n = Number(flip.dataset.flapNum);
    }
    if(flip.dataset.flipEvery){
      every = Number(flip.dataset.flipEvery);
    }
    if(flip.dataset.initialValue){
      initialValue = Number(flip.dataset.initialValue);
    }
    if(flip.dataset.offset){
      offset = Number(flip.dataset.offset);
    }
    initFlip(flip, n, every, initialValue, offset);
  }
}
var digits = function(num){
  return (''+num).length
}
var flipDuration = 0.3;
var initFlip = function(flip, n, every, initialValue, offset){
  if(!initialValue){
    initialValue = 0;
  }else if((initialValue < 0) || (n < initialValue)){
    initialValue = 0;
  }
  if(!offset){
    offset = 0;
  }

  var dummyDiv = document.createElement('div');
  var dummyText = document.createTextNode(''.padStart(digits(n-1), '0'));
  dummyDiv.classList.add('dummy');
  dummyDiv.appendChild(dummyText)
  flip.appendChild(dummyDiv);

  for(var i = 0; i < n; i++){
    var dur = n * every - flipDuration;
    var dly = (2 * dur - (i-initialValue) * every - 0.1 * initialValue - flipDuration + offset) % dur;
    var animationDuration = '' + dur + 's';
    var animationDelay = '-' + dly + 's';

    var divTop = document.createElement('div');
    divTop.classList.add('top');
    divTop.style.animationDuration = animationDuration;
    divTop.style.animationDelay = animationDelay;

    var innerDiv = document.createElement('div');
    var divTopText = document.createTextNode((''+((n+i-1)%n)).padStart(digits(n-1), '0'))
    innerDiv.appendChild(divTopText)
    divTop.appendChild(innerDiv);

    var divBottom = document.createElement('div');
    divBottom.classList.add('bottom');
    divBottom.style.animationDuration = animationDuration;
    divBottom.style.animationDelay = animationDelay;

    var innerDiv = document.createElement('div');
    var divBottomText = document.createTextNode((''+i).padStart(digits(n-1), '0'))
    innerDiv.appendChild(divBottomText)
    divBottom.appendChild(innerDiv)

    var outerDiv = document.createElement('div');
    outerDiv.classList.add('n');
    outerDiv.classList.add('n-' + i);
    outerDiv.appendChild(divTop);
    outerDiv.appendChild(divBottom);
    flip.appendChild(outerDiv);


    //var lastFlip = new Date();
    divTop.addEventListener('webkitAnimationEnd', (function(dur, dly){
      return function(e){
        if(this.classList.contains('do')){
          //var t = new Date();
          //console.log(t, t - lastFlip);
          //lastFlip = t;

          if(this.dataset.nextTime){
            this.style.animationDuration = '' + dur + 's';
            this.style.animationDelay = '-' + (dur - this.dataset.nextTime) + 's'
            this.dataset.nextTime = '';
          }else{
            this.style.animationDuration = '' + dur + 's';
          }
          this.classList.remove('do')

          // next is not first
          this.classList.remove('do-first')
          this.parentNode.classList.remove('do-first')
        }else{
          this.style.animationDuration = '' + flipDuration + 's';
          this.style.animationDelay = '0s'
          this.classList.add('do')
        }
      }
    })(dur, dly), false);

    divBottom.addEventListener('webkitAnimationEnd', (function(dur, dly){
      return function(e){
        if(this.classList.contains('do')){
          if(this.dataset.nextTime){
            this.style.animationDuration = '' + dur + 's';
            this.style.animationDelay = '-' + (dur - this.dataset.nextTime) + 's'
            this.dataset.nextTime = '';
          }else{
            this.style.animationDuration = '' + dur + 's';
          }
          this.classList.remove('do')

          // next is not first
          this.classList.remove('do-first')
          this.parentNode.classList.remove('do-first')
        }else{
          this.style.animationDuration = '' + flipDuration + 's';
          this.style.animationDelay = '0s'
          this.classList.add('do')
        }
      }
    })(dur, dly), false);

    if(i < initialValue){
      setTimeout((function(divTop, divBottom, nextTime){
        return function(e){
          doFlip(divTop, nextTime);
          doFlip(divBottom, nextTime)
        }
      })(divTop, divBottom, every*(n+i-initialValue) - 0.1 * (i-initialValue) - offset), 100*i);
    }
  }
}
var doFlip = function(elm, nextTime){
  elm.classList.add('do');
  elm.classList.add('do-first');
  elm.parentNode.classList.add('do-first');
  elm.style.animationDuration = '' + flipDuration + 's';
  elm.style.animationDelay = '0s'
  elm.dataset.nextTime = nextTime;
}

window.addEventListener('load', onLoad);
