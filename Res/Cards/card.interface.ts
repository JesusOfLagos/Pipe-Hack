export interface ICard {
    user: string;
    balance: number;
    type: string;
}

interface NigerianCard extends ICard {
    date: number;
}


interface KudaCard extends  NigerianCard {
    date: number;
}

export class Food implements KudaCard {
    date: number;
    user: string;
    balance: number;
    type: string;
}


