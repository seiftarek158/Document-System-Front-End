import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseData } from '../services/basedata';
import { ContentService } from '../services/content.service';
import { MessageService } from 'primeng/api';
import { WorkspaceService } from '../services/workspace.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  workspaceData: BaseData= {};
  newFile: BaseData = {};
  ContentDataArray: BaseData[] = [];
  clonedBaseData: { [s: string]: BaseData } = {};
  first = 0;
  rows = 5;
  showDeleteDialog: boolean = false;
  showDialog: boolean = false;
  BaseDataToDelete: BaseData | null = null;
  visible: boolean = true;
  previewDocumentDialog: boolean = false;
  selectedDocumentUrl: SafeResourceUrl | null = null;
  selectedDocument: BaseData | null = null;


  constructor(
    private contentService: ContentService,
    private workspaceService: WorkspaceService,
    private router: Router, 
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
      const navigation = this.router.getCurrentNavigation();
      this.workspaceData = navigation?.extras.state?.['workspaceData'];
      
    }


  next() {
    this.first = this.first + this.rows;
  }
  prev() {
    this.first = this.first - this.rows;
}
reset() {
  this.first = 0;
  }
isLastPage(): boolean {
  return this.ContentDataArray ? this.first >= this.ContentDataArray.length - this.rows : true;
  }

isFirstPage(): boolean {
  return this.ContentDataArray ? this.first === 0 : true;
}
  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
}


  

  ngOnInit(): void {
    this.loadContentData();
  }
  onRowEditInit(file: BaseData) {
    this.clonedBaseData[file.id as string] = { ...file };
    // console.log(this.clonedBaseData[file.id as string] );
  
  }

  onRowEditSave(file: BaseData) {
    if(file.type === 'document'){
    this.contentService.updateDocument(file).subscribe(
      updatedWorkspace => {
        // Update the local workspace data with the updated workspace
        const index = this.ContentDataArray.findIndex(w => w.id === updatedWorkspace.id);
        if (index !== -1) {
          this.ContentDataArray[index] = updatedWorkspace;
        }
        delete this.clonedBaseData[file.id as string];
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Document is updated' });
      },
      error => {
        // console.error('Error updating Document', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update Document' });
      }
    );
  }
  else{
    // TODO update workspace
  }
  }



  onRowEditCancel(workspace: BaseData, index: number) {
    this.clonedBaseData[index] = this.clonedBaseData[workspace.id as string];
    delete this.clonedBaseData[workspace.id  as string];
  }

confirmDelete(basedata: BaseData) {
  this.BaseDataToDelete=basedata;
  this.showDeleteDialog = true;
}
deleteBaseData() {
  if (this.BaseDataToDelete) {
    if(this.BaseDataToDelete.type === 'document'){
      this.contentService.deleteDocument(this.BaseDataToDelete.id ?? '').subscribe(
        () => {
          this.ContentDataArray = this.ContentDataArray.filter(ws => ws.id !== this.BaseDataToDelete!.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace deleted successfully' });
          this.showDeleteDialog = false;
          this.BaseDataToDelete = null;
        },
        error => {
          // console.error('Error deleting document', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete workspace' });
        }
      );
    }
    else{
      this.workspaceService.deleteWorkspace(this.BaseDataToDelete.id ?? '').subscribe(
        () => {
          this.ContentDataArray = this.ContentDataArray.filter(ws => ws.id !== this.BaseDataToDelete!.id);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace deleted successfully' });
          this.showDeleteDialog = false;
          this.BaseDataToDelete = null;
        },
        (error: HttpErrorResponse) => {
          // console.error('Error deleting document', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to delete workspace ${error}` });
        }
      );
    }
  }

}
onSubmit(){
// TODO: Implement onSubmit

this.workspaceService.createWorkspace(this.newFile).subscribe(
  createdWorkspace => {
    createdWorkspace.type = 'workspace';
    createdWorkspace.parentId = this.workspaceData.id;
    this.ContentDataArray.push(createdWorkspace);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace created successfully' });
    this.newFile = {}; // Reset the form
    this.showDialog = false; // Close the dialog
  },
  error => {
    console.error('Error creating workspace', error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create workspace' });
  }
);


}
onUpload(event: any,fileUpload:any): void {
  const file = event.files[0];
  // console.log("inside document list service");
  this.contentService.uploadDocument(this.workspaceData,file).subscribe(

    response => {
      // console.log('File uploaded successfully', response);
      this.loadContentData(); // Reload the content data to reflect the new file
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
      fileUpload.clear();

    },
    error => {
      // console.error('Error uploading file', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
      fileUpload.clear();
    }
  );
}

loadContentData(): void {
  this.contentService.getAllDocumentData(this.workspaceData).subscribe(
    data => {
      this.ContentDataArray = data.map(item => ({...item,type:'document'}));
    },
    error => {
      // console.error('Error fetching document data', error);
    }
  );
}

downloadDocument(documentid:string,documentName:string): void { 
  this.contentService.downloadDocument(documentid).subscribe(
    response => {
      const blob = new Blob([response], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, documentName);
    },
    error => {
      // console.error('Error downloading document', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to download document' });
    }
  );
}

OpenOrnavigateTo(document: BaseData): void {
  console.log('Document:', document);
  // console.log('Document Type:', document.type);
  if(document.type === 'workspace'){
    
    this.router.navigate(['/documentView'], { state: { documentData: document } });
  }
  else{

    this.loadDocument(document);
   
  }
  
}

isImage(fileName: any): boolean {

  // console.log('File Name: Seif ', fileName);

  return /\.(jpg|jpeg|png|gif)$/i.test(String(fileName));
}

loadDocument(document:BaseData): void {
  // Assuming documentData.id is set and valid
 
  this.selectedDocument=document;
  this.contentService.downloadDocument(String(document.id)).subscribe(
    (response) => {
      console.log('Downloaded document:', response);
      const fileURL = URL.createObjectURL(response);
      console.log('File URL:', fileURL);
      this.selectedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      this.previewDocumentDialog=true;
      console.log('Documentssssss:', this.selectedDocument);
    },
    (error) => {
      // console.error('Error downloading document', error);
    }
  );

}

onDialogHide(): void {
  this.selectedDocumentUrl = null;
  this.previewDocumentDialog = false;
  console.log('Dialog closed');
}






}