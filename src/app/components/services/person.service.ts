import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

export interface IPerson {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Тут у нас будут mock-up данные для старта таблицы
const MOCKUP_DATA: IPerson[] = [
  { id: 0, firstName: 'Александр', lastName: 'Аврамов', email: 'a.avramov@yandex.ru', phone: '+79061856195' },
  { id: 1, firstName: 'Борис', lastName: 'Бедняков', email: 'b.bednyakov@gmail.com', phone: '88005553535' },
  { id: 2, firstName: 'Владимир', lastName: 'Вершинский', email: 'v.vershinsky@mail.ru', phone: '' },
  { id: 3, firstName: 'Геннадий', lastName: 'Горошкин', email: 'g.goroshkin@yahoo.com', phone: '+79089225202' },
  { id: 4, firstName: 'Данил', lastName: 'Добронравов', email: 'd.dodronravov@example.co', phone: '' },
  { id: 5, firstName: 'Евгений', lastName: 'Евлампиев', email: 'e.evlmpiev@mail.ru', phone: '+79232451659' },
  { id: 6, firstName: 'Жорж', lastName: 'Железный', email: 'zh.zhelezny@inbox.ru', phone: '89242039524' },
];

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  // Тут у нас имитация памяти сервера - через этот массив будет вестить работа в формате CRUD
  persons: IPerson[] = [];
  savedDataTitle = 'inTableData';

  constructor() {
    // Используем localstorage для сохранения измененённых массивов
    this._initData();
  }

  private _initData(): void {
    const savedData = this._getSavedState();

    // Возвращаем сохранённые данные, если они есть - иначе данные по-умолчанию
    this.persons = savedData ? JSON.parse(savedData) : MOCKUP_DATA;
  }

  private _getSavedState(): string | null {
    return localStorage.getItem(this.savedDataTitle) || null;
  }

  private _saveCurrentState(): void {
    // Зачищаем localstorage в случае, если массив пустой - нужно при послелдующей проверке
    if (this.persons.length === 0) {
      localStorage.removeItem(this.savedDataTitle);
      return;
    };

    const data = JSON.stringify(this.persons);
    localStorage.setItem(this.savedDataTitle, data);
  }

  addNewPerson(newPerson: IPerson): void {
    // Увы, сервера нет, поэтому id "генерируется" вручную - он нужен для удаления элементов таблицы 
    if (newPerson.id === null) {
      newPerson.id = this.persons[this.persons.length - 1]?.id ?? 0;
    }

    this.persons.push(newPerson);

    this._saveCurrentState();
  };

  editPerson(editedPerson: IPerson): void {
    // Ищем индекс клиента под замену
    const existingPersonIndex = this.persons.findIndex(person => person.id === editedPerson.id);

    // Заменяем
    this.persons[existingPersonIndex] = editedPerson;

    this._saveCurrentState();
  }

  deletePersons(selectedIds: number[]): void {
    // Правим методом фильтрации и перезаписи оригинального массива
    this.persons = this.persons.filter(person => !selectedIds.includes(person.id));

    this._saveCurrentState();
  }

  getPersons(): Observable<IPerson[]> {
    // Типа запрос на сервер
    return of(this.persons);
  }
}