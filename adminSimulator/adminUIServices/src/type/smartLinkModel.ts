export interface smartLinkModel{
    [x: string]: any;
    id:string;
    name:string;
    status:string;
    version:string;
    last_status_updated:string;
    connections: {
        dicom:[dicomModel?]
    };
    last_updated:string;
}

export interface dicomModel{
    nodeName:string;
    aeTitle:string;
    hostName:string;
    ipAddress:string;
    nodeTyps:string;
    port:string;
    status:string;
}