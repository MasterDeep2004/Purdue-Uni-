import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-popular-search',
  templateUrl: './popular-search.component.html',
  styleUrls: ['./popular-search.component.css'],
})
export class PopularSearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tagCloud') tagCloud!: any;

  public getScreenWidth: any;
  public getScreenHeight: any;
  options: CloudOptions = {
    height: 150,
    overflow: false,
    background: 'black',
    font: "small-caps bold 10px/30px 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
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
  displayedColumns: string[] = ['title', 'preview', 'goto'];
  dataSource!: MainMinimizedExternal[];
  matDataSource!: MatTableDataSource<MainMinimizedExternal>;
  statslimit = 50;

  constructor(
    private encyclopediaService: EncyclopediaService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.displayedColumns = this.getScreenWidth >= 675 ? ['title', 'preview', 'goto'] : ['titlemob', 'previewmob', 'gotomob'] ;
    this.previewSize = this.getScreenWidth >= 675 ? 180 : 90;
    this.statslimit = this.getScreenWidth >= 675 ? 50 : 20;
    this.options.width = this.getScreenWidth*0.94 - 32;
    this.options.height = this.getScreenWidth >= 675 ? 150 : 250;

    this.statsService
      .getCommonlySearchedWordsStats(this.statslimit)
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
            weight: Math.log2(element.value / lowestVal),
            color: this.getRandomColor(),
          });
        });

        this.tagCloud.reDraw();

        this.value = dict[dict.length-1].name;
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
    this.encyclopediaService
      .getByQuery(offset, limit, this.previewSize, this.value)
      .subscribe((response) => {
        this.dataSource = response.result;
        this.dataSource.length = response.total;

        this.matDataSource = new MatTableDataSource<any>(this.dataSource);
        this.matDataSource.paginator = this.paginator;
        this.loading = false;
      });
  }

  getNextData(offset: number, limit: number) {
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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
}
