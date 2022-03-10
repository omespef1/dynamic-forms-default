export class Connection {
    public Id: number;
    public ProviderType: number;
    public Name: string;
    public ProviderName: string;
    public HostName: string;
    public DataBaseName: string;
    public UserName: string;
    public Password: string;
    public Port: string;
    public Sid: string;
    public ServiceName: string;
    public Protocol: string;

    constructor() {
        this.ProviderType = 1;
        this.ProviderName = 'System.Data.SqlClient';
    }
}
