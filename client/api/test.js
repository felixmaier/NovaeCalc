/** Initialize a new sheet api */
var sheet = SpreadSheet.getActiveSheet();

/** Create a new range */
var range = new sheet.Range('A1:S10000');

/** Direct range property change */
range.set('BackgroundColor', 'rgb(0,0,0)');
range.set('BackgroundColor', 'rgb(150,240,100)');

/** Get properties of a range */
var content = range.getValues('BackgroundColor');

/** Create a new array which holds some new background colors */
var newValues = [];

/** Fill the array with some random content */
for (var ii = 0; ii < content.length; ++ii) {
  newValues[ii] = Math.ceil(Math.random()*1000);
};

/** Change background color of the range with a length matching array holding values */
range.setValues('Content', newValues);

/** Redraw the sheet, since changes were made */
sheet.redraw();