import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPersonDialogInputData, NewPersonDialogComponent } from './components/person-dialog/person-dialog.component';
import { IPerson, PersonService } from './components/services/person.service';
import { BehaviorSubject, tap } from 'rxjs';
import { DeleteConfirmDialogComponent } from './components/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['select', 'firstName', 'lastName', 'email', 'phone', 'edit'];
  dataSource = new MatTableDataSource<IPerson>([]);

  selection = new SelectionModel<IPerson>(true, []);

  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private personService: PersonService) {
    this._updateData();
    // window.alert('Я не очень владею настройкой темы Angular Material - он вообще какой-то всратенький в этом плане, как по мне - поэтому решил компенсировать дополнительными пунктами по функционалу. Такие дела.')
  }

  private _updateData(): void {
    this.loading$.next(true);

    // Имитируем запрос к серверу с ожиданием
    setTimeout(() => {
      this.personService.getPersons().pipe(tap()).subscribe((data) => {
        this.dataSource.data = data;
        this.loading$.next(false);
      })
    }, 300)
  }

  openAddPersonDialog(): void {
    const dialogInputData: IPersonDialogInputData = {
      type: 'new',
      selectedPerson: null
    };

    // Открываем окно
    const dialogRef = this.dialog.open(NewPersonDialogComponent, {
      disableClose: true, autoFocus: false, data: dialogInputData
    });

    // Фиксируем результаты; если валидация прошла как надо, получается объект типа IPerson - отправляем его в сервис
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading$.next(true);

        setTimeout(() => {
          this.personService.addNewPerson(result);
          this.selection.clear();

          this._updateData();
        }, 300)
      }
    });
  }

  openEditPersonDialog(person: IPerson, event: Event): void {
    event.stopPropagation();

    const dialogInputData: IPersonDialogInputData = {
      type: 'edit',
      selectedPerson: person
    }

    // Открываем окно
    const dialogRef = this.dialog.open(NewPersonDialogComponent, {
      disableClose: true, autoFocus: false, data: dialogInputData
    });

    // Фиксируем результаты; если валидация прошла как надо, получается объект типа IPerson - отправляем его в сервис
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading$.next(true);

        setTimeout(() => {
          this.personService.editPerson(result);
          this.selection.clear();

          this._updateData();
        }, 300)
      }
    });
  }

  deletePerson(): void {
    // Собираем id выбранных элементов
    const selectedIds = this.selection.selected.map(person => person.id) || [];

    // Если массив не пустой, открываем окно и ждём ответа
    if (selectedIds.length > 0) {
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, { disableClose: true, autoFocus: false, data: { selectCount: selectedIds.length } });

      // Если удаление подверждено - в дело вступает сервис
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loading$.next(true);

          setTimeout(() => {
            this.personService.deletePersons(selectedIds);
            this.selection.clear();

            this._updateData();
          }, 300)
        }
      })
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(): boolean | void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
}
