export class Expense {
    constructor(
        public readonly id: number, 
        public readonly date: string, 
        public readonly description: string, 
        public readonly user: string,
        public readonly amount: number,
    ) 
        {
        if(id<=0){
            throw new Error("ID must be a positive number");
        }
        if(!date || !description || !user){
            throw new Error("Date, description, and user are required fields");
        }
        if(amount < 0){
            throw new Error("Amount must be a non-negative number");
        }
    }
}