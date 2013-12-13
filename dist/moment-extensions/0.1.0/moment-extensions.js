moment.fn.isWorkday = function(){
    var day = this.day();
    return (day > 0 && day < 6);
};

moment.fn.addWorkdays = function(d){
    var i;

    for(i = 0; i < d; i++){
        this.add('days', 1);
        if(!this.isWorkday()){
            i--;
        }
    }

    return this;
};

moment.fn.subtractWorkdays = function(d){
    var i;

    for(i = 0; i < d; i++){
        this.subtract('days', 1);
        if(!this.isWorkday()){
            i--;
        }
    }

    return this;
};