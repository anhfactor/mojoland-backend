
export interface User {
    id?: number;
    address?: string;
    nonce?:string;
    email?: string;     // optional
    joined?: string;    // first sign message
    updated_at?:string; // check previous login 
    deleted_at?:string; // ban account
    role?: string;      // role user | mod | admin
}