export namespace app {
	
	export class UserInfoStatus {
	    missingNameEmail: boolean;
	    rpcUnavailable: boolean;
	
	    static createFrom(source: any = {}) {
	        return new UserInfoStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.missingNameEmail = source["missingNameEmail"];
	        this.rpcUnavailable = source["rpcUnavailable"];
	    }
	}

}

export namespace base {
	
	export class Address {
	    address: number[];
	
	    static createFrom(source: any = {}) {
	        return new Address(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = source["address"];
	    }
	}

}

export namespace crud {
	
	export enum Operation {
	    CREATE = "create",
	    UPDATE = "update",
	    DELETE = "delete",
	    UNDELETE = "undelete",
	    REMOVE = "remove",
	    AUTONAME = "autoname",
	}

}

export namespace keys {
	
	export class Accelerator {
	    Key: string;
	    Modifiers: string[];
	
	    static createFrom(source: any = {}) {
	        return new Accelerator(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Key = source["Key"];
	        this.Modifiers = source["Modifiers"];
	    }
	}

}

export namespace menu {
	
	export class Menu {
	    Items: MenuItem[];
	
	    static createFrom(source: any = {}) {
	        return new Menu(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Items = this.convertValues(source["Items"], MenuItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MenuItem {
	    Label: string;
	    Role: number;
	    Accelerator?: keys.Accelerator;
	    Type: string;
	    Disabled: boolean;
	    Hidden: boolean;
	    Checked: boolean;
	    SubMenu?: Menu;
	
	    static createFrom(source: any = {}) {
	        return new MenuItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Label = source["Label"];
	        this.Role = source["Role"];
	        this.Accelerator = this.convertValues(source["Accelerator"], keys.Accelerator);
	        this.Type = source["Type"];
	        this.Disabled = source["Disabled"];
	        this.Hidden = source["Hidden"];
	        this.Checked = source["Checked"];
	        this.SubMenu = this.convertValues(source["SubMenu"], Menu);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CallbackData {
	    MenuItem?: MenuItem;
	
	    static createFrom(source: any = {}) {
	        return new CallbackData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.MenuItem = this.convertValues(source["MenuItem"], MenuItem);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace msgs {
	
	export enum EventType {
	    STATUS = "statusbar:status",
	    ERROR = "statusbar:error",
	    MANAGER = "manager:change",
	    DATA_LOADED = "data:loaded",
	    TAB_CYCLE = "hotkey:tab-cycle",
	    IMAGES_CHANGED = "images:changed",
	}

}

export namespace names {
	
	export class NamesPage {
	    facet: types.DataFacet;
	    names: types.Name[];
	    totalItems: number;
	    expectedTotal: number;
	    isFetching: boolean;
	    state: types.LoadState;
	
	    static createFrom(source: any = {}) {
	        return new NamesPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.facet = source["facet"];
	        this.names = this.convertValues(source["names"], types.Name);
	        this.totalItems = source["totalItems"];
	        this.expectedTotal = source["expectedTotal"];
	        this.isFetching = source["isFetching"];
	        this.state = source["state"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace preferences {
	
	export class Bounds {
	    x: number;
	    y: number;
	    width: number;
	    height: number;
	
	    static createFrom(source: any = {}) {
	        return new Bounds(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.width = source["width"];
	        this.height = source["height"];
	    }
	}
	export class AppPreferences {
	    bounds?: Bounds;
	    helpCollapsed?: boolean;
	    lastAddress?: string;
	    lastChain?: string;
	    lastLanguage?: string;
	    lastProject?: string;
	    lastTab: Record<string, string>;
	    lastTheme?: string;
	    lastView?: string;
	    lastViewNoWizard?: string;
	    menuCollapsed?: boolean;
	    name?: string;
	    recentProjects: string[];
	    silencedDialogs: Record<string, boolean>;
	    version: string;
	
	    static createFrom(source: any = {}) {
	        return new AppPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.bounds = this.convertValues(source["bounds"], Bounds);
	        this.helpCollapsed = source["helpCollapsed"];
	        this.lastAddress = source["lastAddress"];
	        this.lastChain = source["lastChain"];
	        this.lastLanguage = source["lastLanguage"];
	        this.lastProject = source["lastProject"];
	        this.lastTab = source["lastTab"];
	        this.lastTheme = source["lastTheme"];
	        this.lastView = source["lastView"];
	        this.lastViewNoWizard = source["lastViewNoWizard"];
	        this.menuCollapsed = source["menuCollapsed"];
	        this.name = source["name"];
	        this.recentProjects = source["recentProjects"];
	        this.silencedDialogs = source["silencedDialogs"];
	        this.version = source["version"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class Chain {
	    chain: string;
	    chainId: number;
	    remoteExplorer: string;
	    rpcProviders: string[];
	    symbol: string;
	
	    static createFrom(source: any = {}) {
	        return new Chain(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chain = source["chain"];
	        this.chainId = source["chainId"];
	        this.remoteExplorer = source["remoteExplorer"];
	        this.rpcProviders = source["rpcProviders"];
	        this.symbol = source["symbol"];
	    }
	}
	export class Id {
	    appName: string;
	    orgName: string;
	    github: string;
	    domain: string;
	    twitter: string;
	
	    static createFrom(source: any = {}) {
	        return new Id(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.appName = source["appName"];
	        this.orgName = source["orgName"];
	        this.github = source["github"];
	        this.domain = source["domain"];
	        this.twitter = source["twitter"];
	    }
	}
	export class OrgPreferences {
	    version?: string;
	    telemetry?: boolean;
	    theme?: string;
	    language?: string;
	    developerName?: string;
	    logLevel?: string;
	    experimental?: boolean;
	    supportUrl?: string;
	
	    static createFrom(source: any = {}) {
	        return new OrgPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.telemetry = source["telemetry"];
	        this.theme = source["theme"];
	        this.language = source["language"];
	        this.developerName = source["developerName"];
	        this.logLevel = source["logLevel"];
	        this.experimental = source["experimental"];
	        this.supportUrl = source["supportUrl"];
	    }
	}
	export class UserPreferences {
	    version?: string;
	    name?: string;
	    email?: string;
	    chains?: Chain[];
	
	    static createFrom(source: any = {}) {
	        return new UserPreferences(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.email = source["email"];
	        this.chains = this.convertValues(source["chains"], Chain);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace project {
	
	export class Project {
	    version: string;
	    name: string;
	    last_opened: string;
	    preferences: Record<string, string>;
	    dirty: boolean;
	    data: Record<string, any>;
	    address: base.Address;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.name = source["name"];
	        this.last_opened = source["last_opened"];
	        this.preferences = source["preferences"];
	        this.dirty = source["dirty"];
	        this.data = source["data"];
	        this.address = this.convertValues(source["address"], base.Address);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace sdk {
	
	export class SortSpec {
	    fields: string[];
	    orders: boolean[];
	
	    static createFrom(source: any = {}) {
	        return new SortSpec(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fields = source["fields"];
	        this.orders = source["orders"];
	    }
	}

}

export namespace types {
	
	export enum DataFacet {
	    ALL = "all",
	    CUSTOM = "custom",
	    PREFUND = "prefund",
	    REGULAR = "regular",
	    BADDRESS = "baddress",
	}
	export enum LoadState {
	    STALE = "stale",
	    FETCHING = "fetching",
	    PARTIAL = "partial",
	    LOADED = "loaded",
	    PENDING = "pending",
	    ERROR = "error",
	}
	export class MetaData {
	    client: number;
	    finalized: number;
	    staging: number;
	    ripe: number;
	    unripe: number;
	    chainId?: number;
	    networkId?: number;
	    chain?: string;
	
	    static createFrom(source: any = {}) {
	        return new MetaData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.client = source["client"];
	        this.finalized = source["finalized"];
	        this.staging = source["staging"];
	        this.ripe = source["ripe"];
	        this.unripe = source["unripe"];
	        this.chainId = source["chainId"];
	        this.networkId = source["networkId"];
	        this.chain = source["chain"];
	    }
	}
	export class Name {
	    address: base.Address;
	    decimals: number;
	    deleted?: boolean;
	    isContract?: boolean;
	    isCustom?: boolean;
	    isErc20?: boolean;
	    isErc721?: boolean;
	    isPrefund?: boolean;
	    name: string;
	    source: string;
	    symbol: string;
	    tags: string;
	    // Go type: base
	    prefund?: any;
	    parts?: number;
	
	    static createFrom(source: any = {}) {
	        return new Name(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.address = this.convertValues(source["address"], base.Address);
	        this.decimals = source["decimals"];
	        this.deleted = source["deleted"];
	        this.isContract = source["isContract"];
	        this.isCustom = source["isCustom"];
	        this.isErc20 = source["isErc20"];
	        this.isErc721 = source["isErc721"];
	        this.isPrefund = source["isPrefund"];
	        this.name = source["name"];
	        this.source = source["source"];
	        this.symbol = source["symbol"];
	        this.tags = source["tags"];
	        this.prefund = this.convertValues(source["prefund"], null);
	        this.parts = source["parts"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Payload {
	    collection: string;
	    dataFacet: DataFacet;
	    chain?: string;
	    address?: string;
	
	    static createFrom(source: any = {}) {
	        return new Payload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collection = source["collection"];
	        this.dataFacet = source["dataFacet"];
	        this.chain = source["chain"];
	        this.address = source["address"];
	    }
	}
	export class Summary {
	    totalCount: number;
	    facetCounts: Record<string, number>;
	    customData?: Record<string, any>;
	    lastUpdated: number;
	
	    static createFrom(source: any = {}) {
	        return new Summary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.totalCount = source["totalCount"];
	        this.facetCounts = source["facetCounts"];
	        this.customData = source["customData"];
	        this.lastUpdated = source["lastUpdated"];
	    }
	}

}

export namespace utils {
	
	export class Explorer {
	    name: string;
	    url: string;
	    standard: string;
	
	    static createFrom(source: any = {}) {
	        return new Explorer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.url = source["url"];
	        this.standard = source["standard"];
	    }
	}
	export class NativeCurrency {
	    name: string;
	    symbol: string;
	    decimals: number;
	
	    static createFrom(source: any = {}) {
	        return new NativeCurrency(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.symbol = source["symbol"];
	        this.decimals = source["decimals"];
	    }
	}
	export class ChainListItem {
	    name: string;
	    chain: string;
	    icon: string;
	    rpc: string[];
	    faucets: string[];
	    nativeCurrency: NativeCurrency;
	    infoURL: string;
	    shortName: string;
	    chainId: number;
	    networkId: number;
	    explorers: Explorer[];
	
	    static createFrom(source: any = {}) {
	        return new ChainListItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.chain = source["chain"];
	        this.icon = source["icon"];
	        this.rpc = source["rpc"];
	        this.faucets = source["faucets"];
	        this.nativeCurrency = this.convertValues(source["nativeCurrency"], NativeCurrency);
	        this.infoURL = source["infoURL"];
	        this.shortName = source["shortName"];
	        this.chainId = source["chainId"];
	        this.networkId = source["networkId"];
	        this.explorers = this.convertValues(source["explorers"], Explorer);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChainList {
	    chains: ChainListItem[];
	    ChainsMap: Record<number, ChainListItem>;
	
	    static createFrom(source: any = {}) {
	        return new ChainList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chains = this.convertValues(source["chains"], ChainListItem);
	        this.ChainsMap = this.convertValues(source["ChainsMap"], ChainListItem, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

