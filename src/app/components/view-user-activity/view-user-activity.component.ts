import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Comments } from 'src/app/models/comments.model';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-view-user-activity',
  templateUrl: './view-user-activity.component.html',
  styleUrls: ['./view-user-activity.component.css'],
})
export class ViewUserActivityComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public getScreenWidth: any;
  public getScreenHeight: any;
  dataSource!: Comments[];
  matDataSource!: MatTableDataSource<Comments>;
  displayedColumns: string[] = [
    'username',
    'usersid',
    'comment',
    'time',
    'likes',
    'goto',
    'resolve',
  ];

  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    this.displayedColumns = this.getScreenWidth >= 650 ? [
      'username',
      'usersid',
      'comment',
      'time',
      'likes',
      'goto',
      'resolve',
    ] : [
      'usernamemob',
      'usersidmob',
      'commentmob',
      'likesmob',
      'gotomob',
      'resolvemob',
    ] ;
    
    this.getData(0, 10);
  }

  getData(offset: number, limit: number) {
    this.commentsService.getall(offset, limit, false).subscribe((response) => {
      this.dataSource = response.result;
      this.dataSource.length = response.total;

      this.matDataSource = new MatTableDataSource<any>(this.dataSource);
      this.matDataSource.paginator = this.paginator;
    });
  }

  getNextData(offset: number, limit: number) {
    this.commentsService.getall(offset, limit, false).subscribe((response) => {
      this.dataSource.length = offset + limit;

      for (let index = 0; index < limit; index++) {
        this.dataSource[index + offset] = response.result[index];
      }

      this.dataSource.length = response.total;

      this.matDataSource = new MatTableDataSource<any>(this.dataSource);
      this.matDataSource._updateChangeSubscription();

      this.matDataSource.paginator = this.paginator;
    });
  }

  pageChanged(event: any) {
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    this.getNextData(pageSize * pageIndex, pageSize);
  }

  markResolved(id: string, flag: boolean) {
    this.commentsService.resolve(id, flag).subscribe(() => {});
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
}
