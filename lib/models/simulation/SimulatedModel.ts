export class Simulated {
    id: string
    month?: number
    monthValue?: number
    profitability?: number
    rescue?: number
    total?: number
    totalRescue?: number

    constructor(month?, monthValue?, profitability?, rescue?, total?, totalRescue?){
        this.id = guidGenerator()
        this.month = month
        this.monthValue = monthValue
        this.profitability = profitability
        this.rescue = rescue
        this.total = total
        this.totalRescue = totalRescue
    }
}

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}