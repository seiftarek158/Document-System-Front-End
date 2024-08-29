import { Component, OnInit } from '@angular/core';
import { Workspace } from '../services/Workspace';
import { WorkspaceService } from '../services/workspace.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {
  workspaceData: Workspace[] = [];;

  first = 0;
  rows = 5;
  editingWorkspace: any = null;
  clonedWorkspaces: { [s: string]: Workspace } = {};
    


  constructor(private workspaceService: WorkspaceService,private router: Router, private messageService: MessageService) {}

  // ngOnInit() {
  //     this.productService.getProductsMini().then((data) => {
  //         this.products = data;
  //     });
  // }
  ngOnInit(): void {
    this.workspaceService.getWorkspaceData().subscribe(
      
      data => {
        // console.log('inside home comoponent');
        this.workspaceData = data;
        // console.log(data);
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

// onSingleClick(product: any): void {
//   this.router.navigate(['/product', product.id]); // Adjust the route as necessary
// }

// onDoubleClick(product: any): void {
//   this.editingWorkspace = product;
// }
// onSaveEdit(product: any): void {
//   // Optionally, update the product on the server
//   // this.workspaceService.updateProduct(product).subscribe(
//   //   () => console.log('Product updated successfully'),
//   //   (error) => console.error('Error updating product:', error)
//   // );
//   this.editingWorkspace = null;
// }

onRowEditInit(workspace: Workspace) {
  console.log("in on RowEdit init");
  this.clonedWorkspaces[workspace.id as string] = { ...workspace };
  console.log(this.clonedWorkspaces[workspace.id as string] );

}
onRowEditSave(workspace: Workspace) {
      delete this.clonedWorkspaces[workspace.id as string];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
  }

onRowEditCancel(workspace: Workspace, index: number) {
    this.clonedWorkspaces[index] = this.clonedWorkspaces[workspace.id as string];
    delete this.clonedWorkspaces[workspace.id  as string];
}


}



