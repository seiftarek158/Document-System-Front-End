import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  workspace: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.workspace = navigation?.extras.state?.['workspaceData'];
  }

  ngOnInit(): void {
    console.log(this.workspace); // Use the workspace data as needed
  }
}