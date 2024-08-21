import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPerson } from '../services/person.service';

export interface IPersonDialogInputData {
  type: 'new' | 'edit';
  selectedPerson: IPerson | null;
}

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class NewPersonDialogComponent {
  @Input() loading$!: BehaviorSubject<boolean>;
  personForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: IPersonDialogInputData,
    private dialogRef: MatDialogRef<NewPersonDialogComponent>
  ) {
    this._createForm();
  }

  private _createForm(): void {
    const selectedPerson = this.inputData.selectedPerson;
    console.log(selectedPerson);

    this.personForm = new FormGroup({
      id: new FormControl(selectedPerson?.id ?? null),
      firstName: new FormControl(selectedPerson?.firstName ?? null, [Validators.required, Validators.min(2)]),
      lastName: new FormControl(selectedPerson?.lastName ?? null, [Validators.required, Validators.min(2)]),
      email: new FormControl(selectedPerson?.email ?? null, [Validators.required, Validators.pattern(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/)]),
      phone: new FormControl(selectedPerson?.phone ?? null, Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/)),
    })

    if (selectedPerson) {
      this.personForm.markAsTouched();
    }
  }

  savePerson(): void {
    this.dialogRef.close(this.personForm.value);
  }

  hasError(controlName: string, error: string): boolean {
    return this.personForm.controls[controlName].hasError(error);
  }
}
