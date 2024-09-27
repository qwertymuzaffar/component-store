import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TagListSelectComponent } from './tag-list-select/tag-list-select.component';
import { FormErrorsComponent } from "../../shared/ui/form-errors";
import { TypedFormGroup } from "../../shared/utils";
import { UpsertArticleBodyRequest } from "../../shared/services";
import { Article, ErrorResponse } from "../../shared/models";

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [ReactiveFormsModule, TagListSelectComponent, FormErrorsComponent],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFormComponent {
  readonly articleForm: TypedFormGroup<UpsertArticleBodyRequest> = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
    }),
    body: new FormControl('', {
      nonNullable: true,
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    tagList: new FormControl<string[]>([], {
      nonNullable: true,
    }),
  });
  @Input({ required: true }) errorResponse!: Signal<ErrorResponse | null>;
  @Input() set article(value: Article) {
    if (value.title) {
      this.articleForm.setValue({
        tagList: value.tagList,
        body: value.body,
        description: value.description,
        title: value.title,
      });
    }
  }
  @Output() submit = new EventEmitter<TypedFormGroup<UpsertArticleBodyRequest>>();
}
