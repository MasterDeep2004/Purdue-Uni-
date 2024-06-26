import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { ItemComponent } from './components/item/item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { EncyclopediaService } from './services/encyclopedia.service';
import { HomeComponent } from './components/home/home.component';
import { AlphabetSearchComponent } from './components/alphabet-search/alphabet-search.component';
import { CategorySearchComponent } from './components/category-search/category-search.component';
import { CreateEntryComponent } from './components/create-entry/create-entry.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxEditorModule } from 'ngx-editor';
import { WinAuthInterceptor } from './utils/WinAuthInterceptor';
import {
    SafeHtmlPipe,
    SafeUrlPipe,
    SafeResourceUrlPipe,
} from './utils/SafeHtmlPipe';
import { InfoComponent } from './components/info/info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditTitleComponent } from './components/item/edit-title/edit-title.component';
import { EditCategoryComponent } from './components/item/edit-category/edit-category.component';
import { CategoryDataService } from './services/category-data.service';
import { DeletePromptDialogComponent } from './components/item/delete-prompt-dialog/delete-prompt-dialog.component';
import { LoginDataService } from './services/login-data.service';
import { FileUploadService } from './services/file-upload.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { EditFilesComponent } from './components/item/edit-files/edit-files.component';
import { PreviewFileComponent } from './components/item/preview-file/preview-file.component';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { PopularSearchComponent } from './components/popular-search/popular-search.component';
import { RecommendedSearchComponent } from './components/recommended-search/recommended-search.component';
import { StatisticsService } from './services/statistics.service';
import { CommentsService } from './services/comments.service';
import { LoginLandingComponent } from './components/login-landing/login-landing.component';
import { ViewUserActivityComponent } from './components/view-user-activity/view-user-activity.component';
import { EmailService } from './services/email.service';
import { PageInfoComponent } from './components/item/page-info/page-info.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleInitOptions } from '@abacritt/angularx-social-login';
import {
    GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { AdminsService } from './services/admins.service';
import { AdminManagementComponent } from './components/admin-management/admin-management.component';
import { AddAdminPromptComponent } from './components/admin-management/add-admin-prompt/add-admin-prompt.component';

@NgModule({
    declarations: [
        AppComponent,
        SearchComponent,
        ItemComponent,
        HomeComponent,
        AlphabetSearchComponent,
        CategorySearchComponent,
        CreateEntryComponent,
        SafeHtmlPipe,
        SafeUrlPipe,
        SafeResourceUrlPipe,
        InfoComponent,
        EditTitleComponent,
        EditCategoryComponent,
        DeletePromptDialogComponent,
        EditFilesComponent,
        PreviewFileComponent,
        PopularSearchComponent,
        RecommendedSearchComponent,
        LoginLandingComponent,
        ViewUserActivityComponent,
        PageInfoComponent,
        AdminManagementComponent,
        AddAdminPromptComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ScrollingModule,
        FormsModule,
        ReactiveFormsModule,
        AngularEditorModule,
        MaterialFileInputModule,
        TagCloudModule,
        NgScrollbarModule,
        NgxEditorModule.forRoot({
            locals: {
                // menu
                bold: 'Bold',
                italic: 'Italic',
                code: 'Code',
                underline: 'Underline',
                strike: 'Strike',
                blockquote: 'Blockquote',
                bullet_list: 'Bullet List',
                ordered_list: 'Ordered List',
                heading: 'Heading',
                h1: 'Header 1',
                h2: 'Header 2',
                h3: 'Header 3',
                h4: 'Header 4',
                h5: 'Header 5',
                h6: 'Header 6',
                align_left: 'Left Align',
                align_center: 'Center Align',
                align_right: 'Right Align',
                align_justify: 'Justify',
                text_color: 'Text Color',
                background_color: 'Background Color',
                insertLink: 'Insert Link',
                removeLink: 'Remove Link',
                insertImage: 'Insert Image',
                // pupups, forms, others...
                url: 'URL',
                text: 'Text',
                openInNewTab: 'Open in new tab',
                insert: 'Insert',
                altText: 'Alt Text',
                title: 'Title',
                remove: 'Remove',
            },
        }),
        NgxSkeletonLoaderModule,
        CKEditorModule,
        SocialLoginModule,
        MatSelectModule,
        MatCheckboxModule,
        MatBadgeModule,
        MatMenuModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatListModule,
        MatFormFieldModule,
        MatDialogModule,
        MatTooltipModule,
        MatSliderModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatAutocompleteModule,
        MatDividerModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatButtonToggleModule,
    ],
    providers: [
        EncyclopediaService,
        CategoryDataService,
        LoginDataService,
        FileUploadService,
        StatisticsService,
        CommentsService,
        EmailService,
        AdminsService,
        DatePipe,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: true,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('597200053908-noei380212u88sd6dqc8j6gkdmuk36e2.apps.googleusercontent.com', { oneTapEnabled: true } as GoogleInitOptions),
                    },
                ],
                onError: (err) => {
                    console.error(err);
                }
            } as SocialAuthServiceConfig,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
