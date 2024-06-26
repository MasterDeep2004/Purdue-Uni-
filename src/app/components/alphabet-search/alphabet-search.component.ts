import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MainMinimizedExternal } from 'src/app/models/main-minimized.model';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'app-alphabet-search',
  templateUrl: './alphabet-search.component.html',
  styleUrls: ['./alphabet-search.component.css'],
})
export class AlphabetSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedView = 'table';
  public getScreenWidth: any;
  public getScreenHeight: any;
  checked: boolean = true;
  allAlphabets: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '#',
  ];
  selectedAlphabetIndex: number = 0;
  selectedAlphabet: string = 'A';
  loading: boolean = true;
  previewSize!: number;
  displayedColumns!: string[];
  dataSource!: MainMinimizedExternal[];
  matDataSource!: MatTableDataSource<MainMinimizedExternal>;
  counter!: number;
  timerRef!: any;

  constructor(
    private encyclopediaService: EncyclopediaService,
    private dataservice: LoginDataService,
    private _router: Router,
    private datePipe: DatePipe,
    private categoryDataService: CategoryDataService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.displayedColumns =
      this.getScreenWidth >= 650
        ? ['title', 'preview', 'goto']
        : ['titlemob', 'previewmob', 'gotomob'];
    this.previewSize = this.getScreenWidth >= 650 ? 180 : 90;

    this.dataservice.getView().subscribe((value) => {
      this.selectedView = value;
    });

    this.getData(0, 10);
  }

  navigateToPage(id: string) {
    this._router.navigate([id]);
  }

  toggleView() {
    this.selectedAlphabet = 'A';
    this.getData(0, 10);
    this.checked = !this.checked;
  }

  getData(offset: number, limit: number) {
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByAlphabet(offset, limit, this.previewSize, this.selectedAlphabet)
      .subscribe(
        (response) => {
          this.dataSource = response.result;
          this.dataSource.length = response.total;

          this.matDataSource = new MatTableDataSource<any>(this.dataSource);
          this.paginator.pageIndex = offset;
          this.paginator.pageSize = limit;
          this.matDataSource.paginator = this.paginator;
          this.loading = false;
          clearInterval(this.timerRef);
        },
        (error) => {
          this._snackBar.open('An error has occured!', 'Dismiss', {
            duration: 3000,
          });
          this.dataSource = [];
          this.matDataSource = new MatTableDataSource<any>(this.dataSource);
          this.matDataSource.paginator = this.paginator;
          this.loading = false;
          clearInterval(this.timerRef);
        }
      );
  }

  getNextData(offset: number, limit: number) {
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByAlphabet(offset, limit, this.previewSize, this.selectedAlphabet)
      .subscribe(
        (response) => {
          this.dataSource.length = offset + limit;

          for (let index = 0; index < limit; index++) {
            this.dataSource[index + offset] = response.result[index];
          }

          this.dataSource.length = response.total;

          this.matDataSource = new MatTableDataSource<any>(this.dataSource);
          this.matDataSource._updateChangeSubscription();

          this.matDataSource.paginator = this.paginator;
          this.loading = false;
          clearInterval(this.timerRef);
        },
        (error) => {
          this._snackBar.open('An error has occured!', 'Dismiss', {
            duration: 3000,
          });
          this.dataSource = [];
          this.matDataSource = new MatTableDataSource<any>(this.dataSource);
          this.matDataSource.paginator = this.paginator;
          this.loading = false;
          clearInterval(this.timerRef);
        }
      );
  }

  pageChanged(event: any) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    this.getNextData(pageSize * pageIndex, pageSize);
  }

  formatLabel(value: number) {
    let letters: string[] = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
      '#',
    ];
    return letters[value];
  }

  onAlphabetSelection(event: any) {
    this.loading = true;
    this.selectedAlphabetIndex = this.allAlphabets.indexOf(event.currentTarget.innerText);
    this.selectedAlphabet = event.currentTarget.innerText;
    this.getData(0, 10);
  }

  onInputChange(event: MatSliderChange) {
    this.loading = true;
    this.selectedAlphabetIndex = event.value as number;
    this.selectedAlphabet = this.allAlphabets[event.value as number];
    this.getData(0, 10);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  getMediumDate(date: Date) {
    return this.datePipe.transform(date, 'MMM d, y');
  }

  onChipClick(event: any) {
    this.categoryDataService.changeCategory(event.srcElement.outerText);
    this._router.navigate(['category']);
  }

  getUrl(id: string) {
    return location.origin + ' > ' + id;
  }

  getAlphabetIndex(){

  }
}
