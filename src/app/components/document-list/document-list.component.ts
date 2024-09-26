import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseData } from '../../services/basedata';
import { ContentService } from '../../services/document-service/content.service';
import { MessageService } from 'primeng/api';
import { WorkspaceService } from '../../services/directory-service/directory.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { forkJoin, Observable } from 'rxjs';
import { Directory } from '../../services/directory';
import { LoadDirectory } from 'src/app/services/loadDirectory';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  directoryId?: string;
  directoryData: Directory = {};
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
    let searchableWorkspaceData: string | undefined='';

    if(this.directoryData.workspaceId !== null){
      searchableWorkspaceData=this.directoryData.workspaceId;

    }
    else{
      searchableWorkspaceData=this.directoryData.id;
    }
    this.contentService
      .searchDocuments(searchableWorkspaceData || '', this.searchterm)
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
    private route: ActivatedRoute,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
    // this.getStateData();
  }

  getStateData() {
    this.route.queryParams.subscribe(params => {
      this.directoryId = params['workspaceId'] || '';
      this.searchable = params['searchable'] === 'true';
      console.log('Directory ID:', this.directoryId);
      console.log('Searchable:', this.searchable);
      this.loadContentData();
    });
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
    console.log('getState ');
    this.getStateData();
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
      .createWorkspace(this.newFile, this.directoryData)
      .subscribe(
        (createdWorkspace) => {
          createdWorkspace.type = 'workspace';
          createdWorkspace.parentId = this.directoryData.id;
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
    this.contentService.uploadDocument(this.directoryData, file).subscribe(
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


  loadDirectoryDataforGoBack(directoryId?:String): void {

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      const parentId = directoryId;
      console.log('Parent ID:',parentId);
      this.router.navigate(['/documentList'], { 
        queryParams: {
              workspaceId: parentId,
              searchable:this.searchable
            }
      });
      // this.getStateData();
    });

  }

  loadDirectoryData(directoryId?: string): Observable<LoadDirectory> {
    // this.contentService.getDirectoryData(directoryId || '').subscribe(
    //   (response) => {
    //     this.directoryData = response;
    //     console.log('Directory Data:', this.directoryData);
    //   },
    //   (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to fetch content data',
    //     });
    //   }
    // );
    return this.contentService.getDirectoryData(directoryId || '');
  }
  loadContentData(): void {

    this.loadDirectoryData(this.directoryId).subscribe(
      (response) => {
        if (response && response.parentDirectory) {
          this.directoryData = response.parentDirectory;
        }

          this.directoryData.nested_directories = response.nested_directories;
          this.directoryData.nested_documents = response.nested_documents;

          const nestedDirectoryData = this.directoryData.nested_directories;
          console.log('Nested Directory Data:', nestedDirectoryData);
          if (nestedDirectoryData) {
            nestedDirectoryData.forEach((directory) => {
              directory.type = 'workspace';
            });
          }
          
          const documentData = this.directoryData.nested_documents;
          if (documentData) {
            documentData.forEach((document) => {
              document.type = 'document';
            });
          }
          console.log('Document Data:', documentData);
          this.ContentDataArray = (nestedDirectoryData ?? [])!.concat(documentData ?? []);
        },
    
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch content data',
        });
      }
    );
    // const nestedWorkspaceData = this.contentService.getAllNestedWorkspaceData(
    //   this.directoryData.id || ''
    // );
        // const documentData = this.contentService.getAllDocumentData(
    //    this.directoryData.id || ''
    // );

    /*
    this.loadDirectoryData(this.directoryId);
    console.log('Directory Data name:', this.directoryData.name);
    const nestedDirectoryData = this.directoryData.nested_directories;
    console.log('Nested Directory Data:', nestedDirectoryData);

    const documentData = this.directoryData.nested_documents;
    this.ContentDataArray = (nestedDirectoryData ?? [])!.concat(documentData ?? []);
    */
   
    // forkJoin([nestedWorkspaceData || [], documentData || []]).subscribe(
    //   ([nestedWorkspaces, documents]) => {
    //     this.ContentDataArray = [
    //       ...nestedWorkspaces.map((item: BaseData) => ({ ...item, type: 'workspace' })),
    //       ...documents.map((item: BaseData) => ({ ...item, type: 'document' })),
    //     ];
    //   },
    //   (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to fetch content data',
    //     });
    //   }
    // );
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
        const parentId = workspaceData.id;
        console.log('Parent ID:',parentId);
        this.router.navigate(['/documentList'], { 
          queryParams: {
                workspaceId: parentId,
                searchable:this.searchable
              }
        });
        // this.getStateData();
      });
      // this.router.navigate(['/documentList'], {
      //   queryParams: {
      //     workspaceId: this.directoryData.id,
      //     searchable:this.searchable
      //   }
      // });

    } else {
      this.loadDocument(workspaceData);
    }
  }

  isImage(fileName: any): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(String(fileName));
  }

  loadDocument(document: BaseData): void {
    this.selectedDocument = document;
    console.log('Selected Document:', this.selectedDocument);
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

  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

 

  goBack() { 
    console.log('Inside go back');
    console.log('Parent ID:',this.directoryData.parentId);
    if(this.directoryData.parentId !== null){
      this.loadDirectoryDataforGoBack(this.directoryData.parentId);
      
    }
    else{
      console.log('Inside else');
      this.router.navigate(['/workspaceList']);
    
    }
    
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/documentList'], { state: { workspaceData } });
    //   });
    //   this.getStateData();
  }
}
