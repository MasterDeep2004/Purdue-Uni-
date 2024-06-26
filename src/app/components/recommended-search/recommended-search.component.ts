import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MainMinimizedExternal } from 'src/app/models/main-minimized.model';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';
import {
  CloudData,
  CloudOptions,
  ZoomOnHoverOptions,
} from 'angular-tag-cloud-module';
import { StatisticsService } from 'src/app/services/statistics.service';
import { DatePipe } from '@angular/common';
import { LoginDataService } from 'src/app/services/login-data.service';
import { CategoryDataService } from 'src/app/services/category-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recommended-search',
  templateUrl: './recommended-search.component.html',
  styleUrls: ['./recommended-search.component.css'],
})
export class RecommendedSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tagCloud') tagCloud!: any;

  public getScreenWidth: any;
  public getScreenHeight: any;
  options: CloudOptions = {
    width: 0.9,
    overflow: false,
    background: 'white',
    font: "acumin-pro, sans-serif;",
  };
  data: CloudData[] = [];
  zoomOnHoverOptions: ZoomOnHoverOptions = {
    scale: 1.1, // Elements will become 130 % of current zize on hover
    transitionTime: 0.5, // it will take 1.2 seconds until the zoom level defined in scale property has been reached
    delay: 0, // Zoom will take affect after 0.8 seconds
  };

  value: any = '';
  loading: boolean = true;
  previewSize = 180;
  statslimit = 200;
  displayedColumns: string[] = ['title', 'preview', 'goto'];
  dataSource!: MainMinimizedExternal[];
  matDataSource!: MatTableDataSource<MainMinimizedExternal>;
  selectedView = 'table';
  counter!: number;
  timerRef!: any;
  
  constructor(
    private encyclopediaService: EncyclopediaService,
    private statsService: StatisticsService,
    private datePipe: DatePipe,
    private dataservice: LoginDataService,
    private categoryDataService: CategoryDataService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.displayedColumns =
      this.getScreenWidth >= 675
        ? ['title', 'preview', 'goto']
        : ['titlemob', 'previewmob', 'gotomob'];
    this.previewSize = this.getScreenWidth >= 675 ? 180 : 90;
    this.statslimit = this.getScreenWidth >= 675 ? 100 : 40;
    this.options.height = this.getScreenWidth >= 675 ? 400 : 500;

    this.dataservice.getView().subscribe((value) => {
      this.selectedView = value;
    });

    this.statsService
      .getCommonlyOccuringWordsStats(this.statslimit)
      .subscribe((result: any) => {
        let dict = Object.keys(result).map((key: string) => ({
          name: key,
          value: result[key],
        }));

        // sort
        dict.sort((a, b) => a.value - b.value);

        let lowestVal = dict[0].value;

        dict.forEach((element) => {
          this.data.push({
            text: element.name,
            weight: Math.log(element.value / lowestVal),
            color: this.generateDarkColorHsl(),
          });
        });

        this.tagCloud.reDraw();

        this.value = dict[dict.length - 1].name;
        this.getData(0, 10);
      });
  }

  searchClicked(clicked: CloudData) {
    this.value = this.data.find((s) => s.text == clicked.text)?.text;

    this.loading = true;

    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;

    this.getNextData(pageSize * pageIndex, pageSize);
  }

  getData(offset: number, limit: number) {
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByQuery(offset, limit, this.previewSize, this.value)
      .subscribe((response) => {
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
      });
  }

  getNextData(offset: number, limit: number) {
    const startTime = Date.now() - (this.counter || 0);
    this.timerRef = setInterval(() => {
      this.counter = Date.now() - startTime;
    });

    this.encyclopediaService
      .getByQuery(offset, limit, this.previewSize, this.value)
      .subscribe((response) => {
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
      });
  }

  pageChanged(event: any) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    this.getNextData(pageSize * pageIndex, pageSize);
  }

  public highlight(content: string) {
    if (!this.value) {
      return content;
    }
    return content.replace(new RegExp(this.value, 'gi'), (match) => {
      return '<b>' + match + '</b>';
    });
  }

  getRandomColor() {
    return (
      '#' +
      (
        '00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
      ).slice(-6)
    );
  }

  generateDarkColorHsl() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * (100 + 1)) + "%";
    const lightness = Math.floor(Math.random() * (100/2 + 1)) + "%";
    return "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  navigateToPage(id: string) {
    this._router.navigate([id]);
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
