export class Expense {
    constructor(
        public readonly id: number, 
        public date: string, 
        public description: string, 
        public user: string
    ) 
        {
        if(id<=0){
            throw new Error("ID must be a positive number");
        }
        if(!date || !description || !user){
            throw new Error("Date, description, and user are required fields");
        }
    }
}