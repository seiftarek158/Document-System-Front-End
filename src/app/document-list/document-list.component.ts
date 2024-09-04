import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Directory } from '../services/Workspace';
import { BaseData } from '../services/basedata';
import { ContentService } from '../services/content.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  workspaceData: Directory= {};
  newFile: BaseData = {};
  ContentDataArray: BaseData[] = [];
  clonedfile: { [s: string]: BaseData } = {};
  first = 0;
  rows = 5;
  showDeleteDialog: boolean = false;
  showDialog: boolean = false;
  uploadUrl: string = `http://localhost:8080/${this.workspaceData.id}/upload`;

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
constructor(
  private contentService: ContentService,
  private router: Router, 
  private messageService: MessageService) {
    const navigation = this.router.getCurrentNavigation();
    this.workspaceData = navigation?.extras.state?.['workspaceData'];
    
  }

  

  ngOnInit(): void {
    console.log(this.workspaceData);
    console.log("skskskskk") // Use the workspace data as needed

    this.contentService.getAllDocumentData(this.workspaceData).subscribe(
      data => {
        this.ContentDataArray = data;
      },
      error => {
        console.error('Error fetching workspace data', error);
      }
    );
  }
  onRowEditInit(file: BaseData) {
    this.clonedfile[file.id as string] = { ...file };
    console.log(this.clonedfile[file.id as string] );
  
  }

  onRowEditSave(file: BaseData) {
    // this.contentService.updateWorkspace(file).subscribe(
    //   updatedWorkspace => {
    //     // Update the local workspace data with the updated workspace
    //     const index = this.workspaceData.findIndex(w => w.id === updatedWorkspace.id);
    //     if (index !== -1) {
    //       this.workspaceData[index] = updatedWorkspace;
    //     }
    //     delete this.clonedWorkspaces[file.id as string];
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace is updated' });
    //   },
    //   error => {
    //     console.error('Error updating workspace', error);
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update workspace' });
    //   }
    // );
  }
  onRowEditCancel(workspace: Directory, index: number) {
    // this.clonedWorkspaces[index] = this.clonedWorkspaces[workspace.id as string];
    // delete this.clonedWorkspaces[workspace.id  as string];
}

confirmDelete(workspace: Directory) {
  // this.workspaceToDelete = workspace;
  // this.showDeleteDialog = true;
}
deleteBaseData() {
  // if (this.workspaceToDelete) {
  //   this.workspaceService.deleteWorkspace(this.workspaceToDelete.id ?? '').subscribe(
  //     () => {
  //       this.workspaceData = this.workspaceData.filter(ws => ws.id !== this.workspaceToDelete!.id);
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace deleted successfully' });
  //       this.showDeleteDialog = false;
  //       this.workspaceToDelete = null;
  //     },
  //     error => {
  //       console.error('Error deleting workspace', error);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete workspace' });
  //     }
  //   );
  // }
}
onSubmit(){
  // this.workspaceService.createWorkspace(this.newWorkspace).subscribe(
  //   createdWorkspace => {
  //     this.workspaceData.push(createdWorkspace);
  //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace created successfully' });
  //     this.newWorkspace = {}; // Reset the form
  //     this.showDialog = false; // Close the dialog
  //   },
  //   error => {
  //     console.error('Error creating workspace', error);
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create workspace' });
  //   }
  // );
}
onUpload(event: any,fileUpload:any): void {
  const file = event.files[0];
  console.log("inside document list service");
  this.contentService.uploadDocument(this.workspaceData,file).subscribe(

    response => {
      console.log('File uploaded successfully', response);
      this.loadContentData(); // Reload the content data to reflect the new file
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
      fileUpload.clear();

    },
    error => {
      console.error('Error uploading file', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
      fileUpload.clear();
    }
  );
}

loadContentData(): void {
  this.contentService.getAllDocumentData(this.workspaceData).subscribe(
    data => {
      this.ContentDataArray = data;
    },
    error => {
      console.error('Error fetching content data', error);
    }
  );
}




}