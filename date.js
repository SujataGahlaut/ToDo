module.exports.getDate=getDate;
function getDate(){
    var today=new Date();
    // var currDay=today.getDay();//getDay() function returns a number 
    var day=today.toLocaleDateString("en-US");
    return day;

}
module.exports.getDays=getDay;

function getDay(){
    return "Working Day"
}