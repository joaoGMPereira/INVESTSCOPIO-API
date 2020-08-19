export class Simulated {
    id: string
    month?: number
    monthValue?: number
    profitability?: number
    rescue?: number
    total?: number

    constructor(month?, monthValue?, profitability?, rescue?, total?){
        this.id = guidGenerator()
        this.month = month
        this.monthValue = monthValue
        this.profitability = profitability
        this.rescue = rescue
        this.total = total
    }
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}