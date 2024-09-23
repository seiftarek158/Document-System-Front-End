import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseData } from '../services/basedata';
import { ContentService } from '../services/content.service';
import { MessageService } from 'primeng/api';
import { WorkspaceService } from '../services/workspace.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  workspaceData: BaseData = {};
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
  filteredContentData: BaseData[] = [];
  editingRowId: string | null = null;
  searchterm: string = '';
  searchable: boolean = false;

  fileTypes = [
    { label: 'PDF', value: '.pdf' },
    { label: 'Text', value: '.txt' },
    { label: 'JPEG', value: '.jpg' },
    { label: 'PNG', value: '.png' }
  ];

  selectedFileType: string = '';


  filterContentData(): void {
    this.contentService
      .searchDocuments(this.workspaceData.id || '', this.searchterm)
      .subscribe(
        (result: BaseData[]) => {
          this.ContentDataArray = result;
          if (this.ContentDataArray.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'No documents found',
            });
          }
        }
      );
  }

  clearSearch(): void {
    this.searchterm = '';
    this.loadContentData();
  }

  constructor(
    private contentService: ContentService,
    private workspaceService: WorkspaceService,
    private router: Router,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
    this.getStateData();
  }

  getStateData() {
    const navigation = this.router.getCurrentNavigation();
    this.workspaceData = navigation?.extras.state?.['workspaceData'];
    this.searchable = navigation?.extras.state?.['searchable'] || false;
    this.loadContentData();
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
    return this.ContentDataArray
      ? this.first >= this.ContentDataArray.length - this.rows
      : true;
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
  onRowEditInit(content: BaseData) {
    this.editingRowId = content.id || null;
    this.clonedBaseData[content.id as string] = { ...content };
    // console.log(this.clonedBaseData[file.id as string] );
  }

  onRowEditSave(file: BaseData) {
    if (file.type === 'document') {
      this.contentService.updateDocument(file).subscribe(
        (updatedWorkspace) => {
          // Update the local workspace data with the updated workspace
          const index = this.ContentDataArray.findIndex(
            (w) => w.id === this.clonedBaseData['id']
          );
          if (index !== -1) {
            this.ContentDataArray[index] = updatedWorkspace;
          }
          delete this.clonedBaseData[file.id as string];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document is updated',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update Document',
          });
        }
      );
    } else {
      this.workspaceService.updateWorkspace(file).subscribe(
        (updatedWorkspace) => {
          // Update the local workspace data with the updated workspace
          const index = this.ContentDataArray.findIndex(
            (w) => w.id === updatedWorkspace.id
          );
          if (index !== -1) {
            this.ContentDataArray[index] = updatedWorkspace;
          }
          delete this.clonedBaseData[file.id as string];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Workspace is updated',
          });
        },
        (error) => {
          console.error('Error updating workspace', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update workspace',
          });
        }
      );
    }

    console.log('Base data:', file.type);
  }

  onRowEditCancel(workspace: BaseData, index: number) {
    this.clonedBaseData[index] = this.clonedBaseData[workspace.id as string];
    delete this.clonedBaseData[workspace.id as string];
  }

  confirmDelete(basedata: BaseData) {
    this.BaseDataToDelete = basedata;
    this.showDeleteDialog = true;
  }
  deleteBaseData() {
    if (this.BaseDataToDelete) {
      if (this.BaseDataToDelete.type === 'document') {
        this.contentService
          .deleteDocument(this.BaseDataToDelete.id ?? '')
          .subscribe(
            () => {
              this.ContentDataArray = this.ContentDataArray.filter(
                (ws) => ws.id !== this.BaseDataToDelete!.id
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Workspace deleted successfully',
              });
              this.showDeleteDialog = false;
              this.BaseDataToDelete = null;
            },
            (error) => {
              // console.error('Error deleting document', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete workspace',
              });
            }
          );
      } else {
        this.workspaceService
          .deleteWorkspace(this.BaseDataToDelete.id ?? '')
          .subscribe(
            () => {
              this.ContentDataArray = this.ContentDataArray.filter(
                (ws) => ws.id !== this.BaseDataToDelete!.id
              );
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Workspace deleted successfully',
              });
              this.showDeleteDialog = false;
              this.BaseDataToDelete = null;
            },
            (error: HttpErrorResponse) => {
              // console.error('Error deleting document', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to delete workspace ${error}`,
              });
            }
          );
      }
    }
  }
  onSubmit() {
    this.workspaceService
      .createWorkspace(this.newFile, this.workspaceData)
      .subscribe(
        (createdWorkspace) => {
          createdWorkspace.type = 'workspace';
          createdWorkspace.parentId = this.workspaceData.id;
          this.ContentDataArray.push(createdWorkspace);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Workspace created successfully',
          });
          this.newFile = {}; // Reset the form
          this.showDialog = false; // Close the dialog
        },
        (error) => {
          console.error('Error creating workspace', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create workspace',
          });
        }
      );
  }
  onUpload(event: any, fileUpload: any): void {
    const file = event.files[0];
    // console.log("inside document list service");
    this.contentService.uploadDocument(this.workspaceData, file).subscribe(
      (response) => {
        // console.log('File uploaded successfully', response);
        this.loadContentData(); // Reload the content data to reflect the new file
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully',
        });
        fileUpload.clear();
      },
      (error) => {
        // console.error('Error uploading file', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload file',
        });
        fileUpload.clear();
      }
    );
  }

  loadContentData(): void {
    const nestedWorkspaceData = this.contentService.getAllNestedWorkspaceData(
      this.workspaceData.id || ''
    );
    const documentData = this.contentService.getAllDocumentData(
       this.workspaceData.id || ''
    );

    forkJoin([nestedWorkspaceData, documentData]).subscribe(
      ([nestedWorkspaces, documents]) => {
        this.ContentDataArray = [
          ...nestedWorkspaces.map((item) => ({ ...item, type: 'workspace' })),
          ...documents.map((item) => ({ ...item, type: 'document' })),
        ];
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch content data',
        });
      }
    );
  }

  downloadDocument(documentid: string, documentName: string): void {
    this.contentService.downloadDocument(documentid).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, documentName);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download document',
        });
      }
    );
  }

  OpenOrnavigateTo(workspaceData: BaseData): void {
    console.log('ContentData:', workspaceData);
    if (workspaceData.type === 'workspace') {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/documentList'], { state: { workspaceData } });
      });
      this.getStateData();
    } else {
      this.loadDocument(workspaceData);
    }
  }

  isImage(fileName: any): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(String(fileName));
  }

  loadDocument(document: BaseData): void {
    this.selectedDocument = document;
    this.contentService.downloadDocument(String(document.id)).subscribe(
      (response) => {
        console.log('Downloaded document:', response);
        const fileURL = URL.createObjectURL(response);
        console.log('File URL:', fileURL);
        this.selectedDocumentUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.previewDocumentDialog = true;
        console.log('Documentssssss:', this.selectedDocument);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download document' + error,
        });
      }
    );
  }

  onDialogHide(): void {
    this.selectedDocumentUrl = null;
    this.previewDocumentDialog = false;
    console.log('Dialog closed');
  }

  goBack() { 
    if(this.workspaceData.parentId !== null){
      this.contentService.getDirectoryData(this.workspaceData.parentId || '').subscribe(
        (response) => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/documentList'], { state: { workspaceData: response } });
          });
          this.getStateData();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch content data',
          });
        }
      );
    }
    else{

      this.router.navigate(['/workspaceList']);
    }
    
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/documentList'], { state: { workspaceData } });
    //   });
    //   this.getStateData();
  }
}
