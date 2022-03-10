import { Connection } from '.';
import { MainModel } from './main-model';

export class MainForm {
    public Id: number;
    public TableName: string;
    public ProgramCode: string;
    public Title: string;
    public SubMenu?: string;
    public SubTitle: string;
    public Icon: string;
    public ShowInMenu: string;
    public UseMasterDetail: boolean;
    public MetadataPrimaryKey: string;
    public MetadataForm: string;
    public MetadataGrid: string;
    public MetadataMasterDetail: string;
    public MetadataDataSource: string;
    public MetadataControlEvent: string;
    public MetadataFormEvent: string;
    public CreationUser: string;
    public CreationDate: Date;
    public Status: string;
    public ConnectionId: number;
    public Connection: Connection;
    public Visible: boolean;
    public Url: string;
    public Tabs: string;
	public Transaccion: string;
    public TreeListCategory?: string;
    public FuncEspec?: string;
    public Params: string;
    public Filters: string;
    public Temptable: string;
    public MultiReport: string;
    public VarsTransaction : string;
    public ExceptDetail : string;
    public ApplicationMenu: MainModel;
    public MicroApplicationId: string;
    public BaseDocConfig : string;
    public ExecProcess: string;
    public AssignConsUbica: string;
    public SpecialDetConfig : string;

    constructor() {
        this.Status = 'A';
        this.ShowInMenu = 'S';
        this.Icon = 'fas fa-list';
        this.SubMenu = 'Formularios Dinámicos';
        this.UseMasterDetail = false;
        this.Transaccion = 'N';
        this.FuncEspec = '';      
        this.MicroApplicationId='';
        this.VarsTransaction = '';
        
    }
}
