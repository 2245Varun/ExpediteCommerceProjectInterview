import { LightningElement, track, wire } from 'lwc';
import getScheduleStatus from '@salesforce/apex/InvoicePdfHandler.getScheduleStatus';
import scheduleJob from '@salesforce/apex/InvoicePdfHandler.scheduleJob';
import stopJob from '@salesforce/apex/InvoicePdfHandler.stopJob';
export default class InvoiceProcessComponent extends LightningElement {
    @track lastRunTime = 'N/A';
    @track NextRunTime = 'N/A';
    @track jobStatus = 'Inactive';
    checkstatus = false;

    @wire(getScheduleStatus)
    apexStatus({error,data}){
        if(data)
        {
           console.log('data=> '+JSON.stringify(data));
           if(data.length>0)
           {
            console.log('17')
            this.lastRunTime = data[0].PreviousFireTime==null?'N/A':data[0].PreviousFireTime;
            this.NextRunTime = data[0].NextFireTime==null?'N/A':data[0].NextFireTime;
            this.jobStatus = data[0].State;
            this.checkstatus = true
           }
           else{
            this.checkstatus = false
            this.lastRunTime = 'No Schedule Job Found';
           }
        }
        else if(error){
            console.log('error=> '+error);
        }
        
    }

    startJob() {
        scheduleJob({})
        .then(res=>{
            console.log('res=> '+res)
            if(res.length>0)
           {
            this.NextRunTime = res[0].NextFireTime;
            this.jobStatus = res[0].State;
           }
           else{
           }
        })
    }

    stopJob() {
        stopJob({})
        .then(res=>{
            this.lastRunTime = 'No Schedule Job Found';
            this.NextRunTime = 'N/A';
            this.jobStatus = 'N/A';
        })
       
    }
}
