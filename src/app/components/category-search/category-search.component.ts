import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainMinimizedExternal } from 'src/app/models/main-minimized.model';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'app-category-search',
  templateUrl: './category-search.component.html',
  styleUrls: ['./category-search.component.css'],
})
export class CategorySearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedView = 'table';
  public getScreenWidth: any;
  public getScreenHeight: any;
  selectedChip!: string;
  loading: boolean = true;
  categoriesloading: boolean = true;
  previewSize = 180;
  counter!: number;
  timerRef!: any;

  displayedColumns: string[] = ['title', 'preview', 'goto'];
  dataSource!: MainMinimizedExternal[];
  matDataSource!: MatTableDataSource<MainMinimizedExternal>;
  categories: any[] = [];
  categorySubscription!: Subscription;

  constructor(
    private encyclopediaService: EncyclopediaService,
    private categoryDataService: CategoryDataService,
    private datePipe: DatePipe,
    private dataservice: LoginDataService,
    private _router: Router,
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

    this.encyclopediaService.getAllCategories().subscribe(
      (data) => {
        this.categories = [
          {
            category: null,
            selectedState: false,
            chipColor: this.getRandomColor(),
          },
        ];

        data.forEach((item) => {
          this.categories.push({
            category: item.name,
            selectedState: false,
            chipColor: item.color,
          });
        });

        let selectedCategory = this.categoryDataService.getCategory();
        if (
          selectedCategory !== null &&
          selectedCategory !== '' &&
          selectedCategory !== undefined
        ) {
          this.categories.find(
            (s) => s.category === selectedCategory
          ).selectedState = true;
          this.getData(
            this.categories.find((s) => s.category === selectedCategory)
              .category,
            0,
            10
          );
          this.selectedChip = selectedCategory;
        } else {
          this.categories[0].selectedState = true;
          this.selectedChip = this.categories[0].category;
          this.getData(this.categories[0].category, 0, 10);
        }

        this.categoriesloading = false;
      },
      (error) => {
        this.categoriesloading = false;
        this.dataSource = [];
        this.matDataSource = new MatTableDataSource<any>(this.dataSource);
        this.matDataSource.paginator = this.paginator; 
        this.loading = false;
      }
    );
  }

  onChipClick(event: any) {
    this.categories.forEach((item) => {
      if (item.category === event.srcElement.outerText)
        item.selectedState = true;
      else item.selectedState = false;
    });
    this.selectedChip = event.srcElement.outerText;
    this.paginator.pageIndex = 0;
    this.getData(event.srcElement.outerText, 0, this.paginator.pageSize);
  }

  getData(category: string, offset: number, limit: number) {
    this.loading = true;
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    if (category == 'no category') category = '';

    this.encyclopediaService
      .getByCategory(offset, limit, this.previewSize, category)
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
        }
      );
  }

  getNextData(
    category: string,
    currentSize: number,
    offset: number,
    limit: number
  ) {
    this.loading = true;
    if (category == 'no category') category = '';

    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByCategory(offset, limit, this.previewSize, category)
      .subscribe(
        (response) => {
          this.dataSource.length = currentSize;
          this.dataSource.push(...response.result);

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
    let previousSize = pageSize * pageIndex;

    this.getNextData(this.selectedChip, previousSize, pageSize * pageIndex, pageSize);
  }

  getRandomColor() {
    return (
      '#' +
      (
        '00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
      ).slice(-6)
    );
  }

  ngOnDestroy(): void {
    this.categoryDataService.changeCategory('');
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  getUrl(id: string) {
    return location.origin + ' > ' + id;
  }

  getMediumDate(date: Date) {
    return this.datePipe.transform(date, 'MMM d, y');
  }

  navigateToPage(id: string) {
    this._router.navigate([id]);
  }
}
