import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MainMinimizedExternal } from 'src/app/models/main-minimized.model';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import { DatePipe } from '@angular/common';
import { LoginDataService } from 'src/app/services/login-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedView = 'table';
  public getScreenWidth: any;
  public getScreenHeight: any;
  value = '';
  searchedValue = '';
  loading: boolean = true;
  previewSize!: number;
  displayedColumns!: string[];
  counter!: number;
  timerRef!: any;
  filteredOptions!: Observable<string>;
  myControl = new UntypedFormControl();
  autoCompleteOn: boolean = false;

  dataSource!: MainMinimizedExternal[];
  matDataSource!: MatTableDataSource<MainMinimizedExternal>;

  constructor(
    private datePipe: DatePipe,
    private encyclopediaService: EncyclopediaService,
    private dataservice: LoginDataService,
    private searchService: StatisticsService,
    private categoryDataService: CategoryDataService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  initAutoComplete() {
    if (!this.autoCompleteOn) {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val) => {
          return this.filter(val || '');
        })
      );
      this.autoCompleteOn = true;
    }
  }

  filter(val: string): Observable<string> {
    return this.searchService
      .getSearchSuggestion(val, 0, 10)
      .pipe(map((response) => response as string));
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.displayedColumns =
      this.getScreenWidth >= 650
        ? ['title', 'preview', 'goto']
        : ['titlemob', 'previewmob', 'gotomob'];
    this.previewSize = this.getScreenWidth >= 650 ? 180 : 60;

    this.dataservice.getView().subscribe((value) => {
      this.selectedView = value;
    });

    this.getData(0, 10);
  }

  onClearButtonClick() {
    this.value = '';
    this.searchedValue = '';
    this.onSearch();
  }

  onSearch() {
    this.loading = true;
    this.searchedValue = this.value;
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;

    this.getNextData(pageSize * pageIndex, pageSize);
  }

  navigateToPage(id: string) {
    this._router.navigate([id]);
  }

  getData(offset: number, limit: number) {
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByQuery(offset, limit, this.previewSize, this.searchedValue)
      .subscribe(
        (response) => {
          this.dataSource = response.result;
          this.dataSource.length = response.total;

          this.matDataSource = new MatTableDataSource<any>(this.dataSource);
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
        },
        () => {
          this.initAutoComplete();
        }
      );
  }

  getNextData(offset: number, limit: number) {
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByQuery(offset, limit, this.previewSize, this.searchedValue)
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

  public highlight(content: string) {
    if (!this.searchedValue) {
      return content;
    }
    return content.replace(new RegExp(this.searchedValue, 'gi'), (match) => {
      return '<b>' + match + '</b>';
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  getUrl(id: string) {
    return location.origin + ' > ' + id;
  }

  getMediumDate(date: Date) {
    return this.datePipe.transform(date, 'MMM d, y');
  }

  onChipClick(event: any) {
    this.categoryDataService.changeCategory(event.srcElement.outerText);
    this._router.navigate(['category']);
  }
}
