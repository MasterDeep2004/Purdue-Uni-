import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable, startWith } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { EncyclopediaService } from 'src/app/services/encyclopedia.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent implements OnInit {
  categories: Category[] = [];
  filteredOptions!: Observable<string[]> | undefined;
  formGroup!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditCategoryComponent>,
    private encyclopediaService: EncyclopediaService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public selectedCategories: any[]
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      category: new UntypedFormControl(),
    });

    this.encyclopediaService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });

    this.filteredOptions = this.formGroup.controls[
      'category'
    ]?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  onCategoryOptionSelected(value: string) {
    if (value !== '' && value !== null && value !== undefined) {
      if (
        this.selectedCategories.find(
          (s: any) => s.name.toLowerCase() == value.toLowerCase()
        ) == undefined
      ) {
        this.selectedCategories.push({
          name: value,
          color:
            this.categories.find((s) => s.name == value)?.color == undefined
              ? this.getRandomColor()
              : (this.categories.find((s) => s.name == value)?.color as string),
        });
      } else
        this._snackBar.open('Category already added!', 'Dismiss', {
          duration: 3000,
        });

      this.formGroup.controls['category'].setValue('');
    }
  }
  addCategory() {
    let value = this.formGroup.controls['category'].value.trim();
    if (
      value !== '' &&
      value !== null &&
      value !== undefined &&
      /\S/.test(value)
    ) {
      if (
        this.selectedCategories.find(
          (s: any) => s.name.toLowerCase() == value.toLowerCase()
        ) == undefined
      ) {
        this.selectedCategories.push({
          name: value,
          color: this.getRandomColor(),
        });
      } else
        this._snackBar.open('Category already added!', 'Dismiss', {
          duration: 3000,
        });

      this.formGroup.controls['category'].setValue('');
    }
  }
  remove(value: any) {
    this.selectedCategories.forEach((element, index) => {
      if (element.name === value.name) this.selectedCategories.splice(index, 1);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    let trunCategories: string[] = this.categories.map((s) => s.name);

    this.selectedCategories.forEach((element) => {
      trunCategories.forEach((cat, index) => {
        if (cat === element.name) trunCategories.splice(index, 1);
      });
    });

    return trunCategories.filter((option) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }

  getRandomColor() {
    return (
      '#' +
      (
        '00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)
      ).slice(-6)
    );
  }

  onCategoryColorSelection(event: any, index: number) {
    this.selectedCategories[index].color = event.srcElement.value;
  }

  GetColor(option: string) {
    if (this.categories.find((s) => s.name == option) == undefined)
      return this.getRandomColor();
    else return this.categories.find((s) => s.name == option)?.color;
  }
}
