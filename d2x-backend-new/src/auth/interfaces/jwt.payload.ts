
export class JwtPayload {
    userId: number;
    fname: string;
    lname: string;
    phoneNumber: string;
    email: string;
    username: string;
    address : string;
    role : number;

    public static fromModel(user) {
        const payload = {
            userId: user.sub,
            fname: user.fname,
            lname: user.lname,  
            phoneNumber: user.phoneNumber,
            email: user.email,
            username: user.username,
            address : user.address,
            role : user.role,
        }

        return payload as JwtPayload;
    }
}