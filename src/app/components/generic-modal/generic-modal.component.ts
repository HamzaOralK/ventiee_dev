import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ModalData {
  htmlTemplate: string;
  title: string;
  description: string;
  type: ModalType
}

export enum ModalType {
  Information,
  Confirmation
}

@Component({
  selector: 'generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {

  htmlTemplate: string;
  title: string;
  description: string;
  type: ModalType

  constructor(
    public dialogRef: MatDialogRef<GenericModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    if (this.data.title) this.title = this.data.title;
    if (this.data.htmlTemplate) this.htmlTemplate = this.data.htmlTemplate;
    if (this.data.description) this.description = this.data.description;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
