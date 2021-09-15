export class License {
    public _id: string = "";
    public phone: string = "";
    public email: string = "";
    public uuid: string = "";
    public licensekey: string = "";
    public fromdate: string = "";
    public todate: string = "";
    public isactive: boolean = false;
    constructor(init?: Partial<License>) {
        Object.assign(this, init);
    }

    
}