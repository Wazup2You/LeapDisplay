// export default class Clock {
//     constructor(time) {
//         this.time = time;
//     }
    
    /**
     * The start function
     */
    // init() {
        function currentTime() {
            let date = new Date(); 
            let hh = date.getHours();
            let mm = date.getMinutes();
            let ss = date.getSeconds();
            let session = "AM";
          
            if(hh == 0){
                hh =24;
            }
          
             hh = (hh < 10) ? "0" + hh : hh;
             mm = (mm < 10) ? "0" + mm : mm;
             ss = (ss < 10) ? "0" + ss : ss;
              
             let time = hh + ":" + mm;
            
            const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById("date-container").innerText = date.toLocaleDateString('nl-NL', options);
            document.getElementById("clock-container").innerText = time; 
            let t = setTimeout(function(){ currentTime() }, 1000);
          }
        //   currentTime();

        export { currentTime };
//     }
// }