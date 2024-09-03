
import { Component, OnInit } from '@angular/core';
import { Workspace } from '../services/Workspace';
import { WorkspaceService } from '../services/workspace.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html',
  styleUrls: ['./workspace-list.component.css']
})
export class WorkspaceListComponent implements OnInit{
  workspaceData: Workspace[] = [];
  newWorkspace: Workspace = {};
  first = 0;
  rows = 5;
  editingWorkspace: any = null;
  clonedWorkspaces: { [s: string]: Workspace } = {};
  showDialog: boolean = false;
  showDeleteDialog: boolean = false;
  workspaceToDelete: Workspace | null = null;

  
    constructor(
      private workspaceService: WorkspaceService,
      private router: Router, 
      private messageService: MessageService) {}



    ngOnInit(): void {
    this.workspaceService.getWorkspaceData().subscribe(
      data => {
        this.workspaceData = data;
      },
      error => {
        console.error('Error fetching workspace data', error);
      }
    );
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

pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
}

isLastPage(): boolean {
    return this.workspaceData ? this.first >= this.workspaceData.length - this.rows : true;
}

isFirstPage(): boolean {
    return this.workspaceData ? this.first === 0 : true;
}

onRowEditInit(workspace: Workspace) {
  this.clonedWorkspaces[workspace.id as string] = { ...workspace };
  console.log(this.clonedWorkspaces[workspace.id as string] );

}

onRowEditSave(workspace: Workspace) {
  this.workspaceService.updateWorkspace(workspace).subscribe(
    updatedWorkspace => {
      // Update the local workspace data with the updated workspace
      const index = this.workspaceData.findIndex(w => w.id === updatedWorkspace.id);
      if (index !== -1) {
        this.workspaceData[index] = updatedWorkspace;
      }
      delete this.clonedWorkspaces[workspace.id as string];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace is updated' });
    },
    error => {
      console.error('Error updating workspace', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update workspace' });
    }
  );
}

onRowEditCancel(workspace: Workspace, index: number) {
    this.clonedWorkspaces[index] = this.clonedWorkspaces[workspace.id as string];
    delete this.clonedWorkspaces[workspace.id  as string];
}

onSubmit(){
  this.workspaceService.createWorkspace(this.newWorkspace).subscribe(
    createdWorkspace => {
      this.workspaceData.push(createdWorkspace);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace created successfully' });
      this.newWorkspace = {}; // Reset the form
      this.showDialog = false; // Close the dialog
    },
    error => {
      console.error('Error creating workspace', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create workspace' });
    }
  );
}
confirmDelete(workspace: Workspace) {
  this.workspaceToDelete = workspace;
  this.showDeleteDialog = true;
}
deleteWorkspace() {
  if (this.workspaceToDelete) {
    this.workspaceService.deleteWorkspace(this.workspaceToDelete.id ?? '').subscribe(
      () => {
        this.workspaceData = this.workspaceData.filter(ws => ws.id !== this.workspaceToDelete!.id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace deleted successfully' });
        this.showDeleteDialog = false;
        this.workspaceToDelete = null;
      },
      error => {
        console.error('Error deleting workspace', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete workspace' });
      }
    );
  }
}

navigateToDocuments(workspaceData: Workspace) {
  this.router.navigate(['/documentList'],{state: {workspaceData}}); // Navigate to the home page
}




}














