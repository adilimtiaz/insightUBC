/**
 * Created by Adil Imtiaz on 27-09-2016.
 */

export default class DataStructure {
    data: any[]=[];

    add(c: any){
       if(this.data.indexOf(c)===-1){
           this.data.push(c);
       }
    }
    public identical(dataIn: any) { // Check if dataIn has an identical copy in this dataStructure
        if(this.data.length==0){
            return false;
        }
        for(var i=0; i<this.data.length; i++) {
            if(this.isEquivalent(dataIn,this.data[i])){
                return false;
            }
         }
        return true;
    }

// Function taken from http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
    public isEquivalent(a: any, b: any) :boolean {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
}