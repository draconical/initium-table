import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IDeleteCofirmDialogInputData {
  selectCount: number;
} 

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: IDeleteCofirmDialogInputData,
    private dialogRef: MatDialogRef<DeleteConfirmDialogComponent>
  ) {
  }

  confirmDelete(): void {
    this.dialogRef.close(true);
  }
}
