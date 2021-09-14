export class License {
    public _id: string = "";
    public phone: string = "";
    public email: string = "";
    public uuid: string = "";
    public licensekey: string = "";
    public fromdate: Date | undefined;
    public todate: Date | undefined;
    public isactive: string = "";
    public createdate: Date | undefined;
    constructor(init?: Partial<License>) {
        Object.assign(this, init);
    }
}